import Stripe from "stripe";
import eventModel from "../../../DB/modules/Event.model.js";
import bookingModel from "../../../DB/modules/Booking.model.js";
import userModel from "../../../DB/modules/User.model.js";
import transactionModel from "../../../DB/modules/Transaction.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { Types } from "mongoose";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;

  // Check if user already has a booking for this event
  const existingBooking = await bookingModel.findOne({
    user: req.user._id,
    event: eventId,
    status: { $in: ["booked", "pending"] },
  });

  if (existingBooking) {
    if (existingBooking.status === "booked") {
      return next(new Error(req.t("errors.alreadyBooked"), { cause: 400 }));
    }
    // If pending, clean it up so we don't double-count ticket decrements
    await bookingModel.findByIdAndDelete(existingBooking._id);
    await eventModel.findByIdAndUpdate(eventId, {
      $inc: { availableTickets: 1 },
    });
    // Also delete the associated pending transaction
    await transactionModel.deleteMany({
      booking: existingBooking._id,
      status: "pending",
    });
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
  const booking = await bookingModel.create({
    user: req.user._id,
    event: eventId,
    category: event.category,
    paymentStatus: "pending",
    stripeSessionId: session.id,
  });

  // Create transaction record
  await transactionModel.create({
    user: req.user._id,
    booking: booking._id,
    event: eventId,
    type: "payment",
    amount: event.price,
    currency: "EGP",
    status: "pending",
    stripeSessionId: session.id,
    description: `Payment for ${event.name.en || event.name.ar || "Event"}`,
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

      // Update transaction record
      await transactionModel.findOneAndUpdate(
        { stripeSessionId: session.id, type: "payment" },
        {
          status: "completed",
          stripePaymentIntentId: session.payment_intent,
          stripeChargeId: session.payment_intent, // Will be updated if we retrieve full details
          processedAt: new Date(),
        }
      );
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

      // Update transaction record
      await transactionModel.findOneAndUpdate(
        { stripeSessionId: session.id, type: "payment" },
        {
          status: "failed",
          failureReason:
            event.type === "checkout.session.expired"
              ? "Session expired"
              : "Payment failed",
          processedAt: new Date(),
        }
      );
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
  let refund = null;

  // Get the session to find payment intent
  if (booking.stripeSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        booking.stripeSessionId
      );
      if (session.payment_intent) {
        refund = await stripe.refunds.create({
          payment_intent: session.payment_intent,
        });

        booking.paymentStatus = "refunded";

        // Create refund transaction record
        const event = await eventModel.findById(eventId);
        await transactionModel.create({
          user: userId,
          booking: booking._id,
          event: eventId,
          type: "refund",
          amount: event.price,
          currency: "EGP",
          status: "completed",
          stripeSessionId: booking.stripeSessionId,
          stripePaymentIntentId: session.payment_intent,
          stripeRefundId: refund.id,
          description: `Refund for ${
            event.name.en || event.name.ar || "Event"
          }`,
          refundReason: "User requested cancellation",
          processedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Refund error:", error);

      // Log failed refund attempt
      await transactionModel.create({
        user: userId,
        booking: booking._id,
        event: eventId,
        type: "refund",
        amount: 0,
        currency: "EGP",
        status: "failed",
        stripeSessionId: booking.stripeSessionId,
        description: "Refund attempt failed (Manual intervention required)",
        failureReason: error.message,
        processedAt: new Date(),
      });

      // We proceed with cancellation anyway to keep UI in sync,
      // but the admin would need to handle the refund manually if it failed.
    }
  }

  // Mark booking as cancelled
  booking.status = "cancelled";
  await booking.save();

  // Restore ticket
  await eventModel.findByIdAndUpdate(eventId, {
    $inc: { availableTickets: 1 },
  });

  // Check if user has any OTHER active bookings for this same event
  const otherActiveBookings = await bookingModel.findOne({
    user: userId,
    event: eventId,
    status: "booked",
    _id: { $ne: booking._id },
  });

  // Only remove from bookedEvents list if there are no other active bookings
  if (!otherActiveBookings) {
    await userModel.findByIdAndUpdate(userId, {
      $pull: { bookedEvents: new Types.ObjectId(eventId) },
    });
  }

  return res
    .status(200)
    .json({ message: req.t("messages.ticketCancelledSuccessfully") });
});

export const verifySession = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return next(new Error("Session ID is required", { cause: 400 }));
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    return next(new Error("Invalid Session ID", { cause: 400 }));
  }

  if (session.payment_status === "paid") {
    const booking = await bookingModel.findOne({ stripeSessionId: sessionId });

    if (!booking) {
      return next(new Error("Booking not found", { cause: 404 }));
    }

    if (booking.paymentStatus === "pending") {
      booking.paymentStatus = "completed";
      booking.status = "booked";
      booking.bookingDate = new Date();
      await booking.save();

      await userModel.findByIdAndUpdate(booking.user, {
        $addToSet: { bookedEvents: booking.event },
      });

      // Update transaction record
      await transactionModel.findOneAndUpdate(
        { stripeSessionId: sessionId, type: "payment" },
        {
          status: "completed",
          stripePaymentIntentId: session.payment_intent,
          processedAt: new Date(),
        }
      );

      return res.status(200).json({
        message: "Payment verified and booking confirmed",
        status: "completed",
        booking,
      });
    } else {
      return res.status(200).json({
        message: "Booking already confirmed",
        status: "completed",
        booking,
      });
    }
  }

  return res.status(200).json({
    message: "Payment not completed yet",
    status: session.payment_status,
  });
});
