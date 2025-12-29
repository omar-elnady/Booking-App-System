import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: {
      type: String,
      required: [true, "Username is required"],
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [20, "Username must be at most 20 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      unique: [true, "Email must be unique"],
      required: [true, "Email is required"],
      lowercase: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userImage: {
      secure_url: {
        type: String,
        default: "",
      },
      public_id: { type: String, default: null },
    },
    phone: String,
    address: String,
    role: {
      type: String,
      default: "user",
      enum: ["user", "organizer", "admin", "super-admin"],
      lowercase: true,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "blocked"],
    },
    forgetCode: {
      type: Number,
      default: null,
    },
    forgetCodeExpires: {
      type: Date,
    },
    changePasswordTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || model("user", userSchema);
export default userModel;
