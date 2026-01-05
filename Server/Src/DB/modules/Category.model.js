import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      en: { type: String, required: true, unique: true },
      ar: { type: String, required: true, unique: true },
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Rejected"],
      default: "Active",
    },
    creatorId: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
const categoryModel = model("category", categorySchema);
export default categoryModel;
