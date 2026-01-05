import { Schema, model, Types } from "mongoose";

const localizedString = {
  ar: { type: String, trim: true },
  en: { type: String, trim: true },
};

const eventSchema = new Schema(
  {
    name: {
      ...localizedString,
    },

    description: {
      ...localizedString,
    },

    venue: {
      ...localizedString,
    },

    category: {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },

    eventCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      default: 100,
      min: 1,
    },

    availableTickets: {
      type: Number,
      min: 0,
    },

    image: {
      secure_url: { type: String, default: "" },
      public_id: { type: String, default: null },
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Draft", "Cancelled", "Sold Out"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.pre("save", async function () {
  if (this.isNew) {
    this.availableTickets = this.capacity;
  }
});

export default model("event", eventSchema);
