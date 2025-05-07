import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    name: {
      en: String,
      ar: String,
    },

    description: {
      en: String,
      ar: String,
    },
    category: {
      en: String,
      ar: String,
    },
    venue: {
      en: String,
      ar: String,
    },
    eventCode: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      secure_url: {
        type: String,
        default: "",
      },
      public_id: { type: String, default: null },
    },
    availableTickets: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const eventModel = model("event", eventSchema);
export default eventModel;
