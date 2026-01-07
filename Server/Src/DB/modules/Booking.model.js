import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    event: {
      type: Types.ObjectId,
      ref: "event",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "booked", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["completed", "unpaid", "pending", "refunded"],
      default: "unpaid",
    },
    stripeSessionId: {
      type: String,
    },
    qrCode: {
      type: String,
      unique: true,
    },
    scanned: {
      type: Boolean,
      default: false,
    },
    scannedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const bookingModel = model("booking", bookingSchema);
export default bookingModel;
