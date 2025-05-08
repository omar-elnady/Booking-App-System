import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema({
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
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked",
  },
  paymentStatus: {
    type: String,
    enum: ["completed", "unpaid", "pending"],
    default: "unpaid",
  },
  stripeSessionId: {
    type: String,
  },
});

const bookingModel = model("booking", bookingSchema);
export default bookingModel;
