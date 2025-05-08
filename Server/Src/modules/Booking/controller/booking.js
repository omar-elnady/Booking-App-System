import { asyncHandler } from "../../../utils/errorHandling.js";
import bookingModel from "../../../DB/modules/Booking.model.js";

import eventModel from "../../../DB/modules/event.model.js";
import { paginate } from "../../../utils/paginate.js";
import stripe from "stripe";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user._id;
  const language = req.language || "en";

  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(new Error(req.t("errors.eventNotFound"), { cause: 404 }));
  }

  if (event.availableTickets < 1) {
    return next(new Error(req.t("errors.noTicketsAvailable"), { cause: 400 }));
  }

  const existingBooking = await bookingModel.findOne({ userId, eventId });
  if (existingBooking) {
    return next(new Error(req.t("errors.alreadyBooked"), { cause: 400 }));
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: event.name[language],
            description: event.description[language],
            images: [event.image.secure_url],
          },
          unit_amount: event.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/congratulations?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/event/${eventId}`,
    metadata: {
      userId: userId.toString(),
      eventId: eventId.toString(),
    },
    locale: language === "ar" ? "ar" : "en",
  });

  const booking = await bookingModel.create({
    userId,
    eventId,
    paymentStatus: "pending",
    stripeSessionId: session.id,
  });

  return res.status(201).json({
    message: req.t("bookingCreatedSuccessfully"),
    booking,
    checkoutUrl: session.url,
  });
});

export const confirmBooking = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.query;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "completed") {
    return next(new Error(req.t("errors.paymentFailed"), { cause: 400 }));
  }

  const booking = await bookingModel.findOne({ stripeSessionId: sessionId });
  if (!booking) {
    return next(new Error(req.t("errors.bookingNotFound"), { cause: 404 }));
  }

  if (booking.paymentStatus !== "pending") {
    return next(
      new Error(req.t("errors.bookingAlreadyProcessed"), { cause: 400 })
    );
  }

  return res.json({
    message: req.t("bookingConfirmedSuccessfully", {
      defaultValue: "Booking confirmed successfully",
    }),
    booking,
  });
});

export const getUserBookings = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const userId = req.user._id;

  const bookings = await bookingModel
    .find({ userId, paymentStatus: "completed" })
    .populate({
      path: "eventId",
      select:
        "name description category venue image date price availableTickets eventCode",
    })
    .skip(skip)
    .limit(limit);
  const totalBookings = await bookingModel.countDocuments({
    userId,
    paymentStatus: "completed",
  });
  const totalPages = Math.ceil(totalBookings / limit);

  const language = req.language || "en";
  const translatedBookings = bookings.map((booking) => ({
    ...booking.toObject(),
    eventId: {
      ...booking.eventId.toObject(),
      name:
        booking.eventId.name?.[language] || booking.eventId.name?.en || "Event",
      description:
        booking.eventId.description?.[language] ||
        booking.eventId.description?.en ||
        "No description",
      category:
        booking.eventId.category?.[language] ||
        booking.eventId.category?.en ||
        "No category",
      venue:
        booking.eventId.venue?.[language] ||
        booking.eventId.venue?.en ||
        "No venue",
    },
  }));

  return res.json({
    message: req.t("bookingsRetrievedSuccessfully"),
    bookings: translatedBookings,
    totalPages,
    totalBookings,
  });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const booking = await bookingModel.findOne({ stripeSessionId: session.id });

    if (booking && booking.paymentStatus === "pending") {
      booking.paymentStatus = "completed";
      booking.bookingDate = Date.now();
      booking.status = "booked";
      await booking.save();

      await booking.save();

      await eventModel.findByIdAndUpdate(booking.eventId, {
        $inc: { availableTickets: -1 },
      });
    }
  }

  res.json({ received: true });
});

export const cancelTicket = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(
      new Error(req.t("errors.eventNotFound"), {
        cause: 404,
      })
    );
  }

  const existingBooking = await bookingModel.findOne({ userId, eventId });
  if (!existingBooking) {
    return next(
      new Error(req.t("errors.notBookedEvent"), {
        cause: 400,
      })
    );
  }

  const session = await stripe.checkout.sessions.retrieve(
    existingBooking.stripeSessionId
  );
  if (session.payment_status === "paid") {
    await stripe.refunds.create({
      payment_intent: session.payment_intent,
    });
  }

  await eventModel.findByIdAndUpdate(eventId, {
    $inc: { availableTickets: 1 },
  });

  await bookingModel.findByIdAndDelete(existingBooking._id);

  return res.status(200).json({
    message: req.t("ticketCanceledSuccessfully"),
  });
});
