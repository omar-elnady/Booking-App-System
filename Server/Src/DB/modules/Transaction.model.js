import { Schema, model, Types } from "mongoose";

const transactionSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    booking: {
      type: Types.ObjectId,
      ref: "booking",
      required: true,
      index: true,
    },
    event: {
      type: Types.ObjectId,
      ref: "event",
      required: true,
    },
    type: {
      type: String,
      enum: ["payment", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "egp",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    // Stripe IDs
    stripeSessionId: {
      type: String,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      index: true,
    },
    stripeRefundId: {
      type: String,
      index: true,
    },
    stripeChargeId: {
      type: String,
    },
    // Payment details
    paymentMethod: {
      type: String, // card, wallet, etc.
    },
    last4: {
      type: String, // Last 4 digits of card
    },
    cardBrand: {
      type: String, // visa, mastercard, etc.
    },
    // Metadata
    description: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    refundReason: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ booking: 1, type: 1 });
transactionSchema.index({ status: 1, type: 1 });
transactionSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });

const transactionModel = model("transaction", transactionSchema);
export default transactionModel;
