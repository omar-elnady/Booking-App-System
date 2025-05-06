import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
    },
    price: {
      type: Number,
      required: [true, "Event price is required"],
    },
    image: {
      type: {
        secure_url: String,
        public_id: String,
      },
      required: [true, "Event image is required"],
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
