import Stripe from "stripe";
import eventModel from "../../../DB/modules/Event.model.js";
import bookingModel from "../../../DB/modules/Booking.model.js";
import userModel from "../../../DB/modules/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;

  // Check if user already has a booking for this event
  const existingBooking = await bookingModel.findOne({
    user: req.user._id,
    event: eventId,
    status: "booked",
  });

  if (existingBooking) {
    return next(new Error(req.t("errors.alreadyBooked"), { cause: 400 }));
  }

  // Use atomic decrement to ensure no race conditions
  const event = await eventModel.findOneAndUpdate(
    { _id: eventId, availableTickets: { $gt: 0 } },
    { $inc: { availableTickets: -1 } },
    { new: true }
  );

  if (!event) {
    return next(new Error(req.t("errors.soldOut"), { cause: 400 }));
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    metadata: {
      eventId: eventId.toString(),
      userId: req.user._id.toString(),
      categoryId: event.category.toString(),
    },
    success_url: `${process.env.FE_URL}/ticket-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FE_URL}/ticket-cancelled`,
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: event.name.en || event.name.ar || "Event",
            description: event.description.en || event.description.ar || "",
          },
          unit_amount: event.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // Create pending booking
  await bookingModel.create({
    user: req.user._id,
    event: eventId,
    category: event.category,
    paymentStatus: "pending",
    stripeSessionId: session.id,
  });

  return res.status(201).json({
    message: req.t("messages.bookingCreatedSuccessfully"),
    url: session.url,
  });
});

export const webhook = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Payment Success Session:", session);

    // Update booking status to completed
    const booking = await bookingModel.findOne({ stripeSessionId: session.id });
    if (booking) {
      booking.paymentStatus = "completed";
      booking.status = "booked";
      booking.bookingDate = new Date();
      await booking.save();
      await userModel.findByIdAndUpdate(booking.user, {
        $addToSet: { bookedEvents: booking.event },
      });
    }
  }

  // Handle failed/expired sessions to restore tickets
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object;

    // Find and cancel the pending booking
    const booking = await bookingModel.findOne({ stripeSessionId: session.id });
    if (booking && booking.paymentStatus === "pending") {
      await bookingModel.findByIdAndDelete(booking._id);
      // Restore the ticket
      await eventModel.findByIdAndUpdate(booking.event, {
        $inc: { availableTickets: 1 },
      });
    }
  }

  res.status(200).send();
});

export const cancelTicket = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  const booking = await bookingModel.findOne({
    user: userId,
    event: eventId,
    status: "booked",
    paymentStatus: "completed",
  });

  if (!booking) {
    return next(new Error(req.t("errors.ticketNotFound"), { cause: 404 }));
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Get the session to find payment intent
  if (booking.stripeSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        booking.stripeSessionId
      );
      if (session.payment_intent) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent,
        });
      }
    } catch (error) {
      console.error("Refund error:", error);
      return next(new Error(req.t("errors.refundFailed"), { cause: 500 }));
    }
  }

  // Mark booking as cancelled
  booking.status = "cancelled";
  await booking.save();

  // Restore ticket
  await eventModel.findByIdAndUpdate(eventId, {
    $inc: { availableTickets: 1 },
  });

  return res
    .status(200)
    .json({ message: req.t("messages.ticketCancelledSuccessfully") });
});
