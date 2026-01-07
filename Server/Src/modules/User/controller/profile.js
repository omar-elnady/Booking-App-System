import userModel from "../../../DB/modules/User.model.js";
import eventModel from "../../../DB/modules/Event.model.js";
import bookingModel from "../../../DB/modules/Booking.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import sendEmail from "../../../utils/email.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import { customAlphabet } from "nanoid";

// Get User Profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await userModel.findById(id).select("-password -__v");
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ user });
});

// Update User Profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, userName, email } = req.body;
  const { id } = req.user;

  const user = await userModel.findById(id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Update Basic Info
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (userName) user.userName = userName;

  // Handle Image Upload
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `BookingSystem/Users/${user._id}` }
    );
    user.userImage = { secure_url, public_id };
  }

  // Handle Email Change
  let emailMessage = "";
  if (email && email.toLowerCase() !== user.email) {
    // Check if new email already exists
    const emailExists = await userModel.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return next(new Error("Email already exists", { cause: 409 }));
    }

    // Generate Verification Code for New Email
    const nanoId = customAlphabet("123456789", 6);
    const code = nanoId();

    user.tempEmail = email.toLowerCase();
    user.tempEmailCode = code;

    // Send Verification Email
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Change Request</h2>
        <p>You requested to change your email to: <b>${email}</b></p>
        <p>Please use the following code to verify this change:</p>
        <h1 style="color: #4F46E5;">${code}</h1>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({ to: email, subject: "Verify New Email", html });
    emailMessage =
      "Verification code sent to new email. Please verify to complete the update.";
  }

  await user.save();

  return res.status(200).json({
    message: "Profile updated successfully. " + emailMessage,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      userImage: user.userImage,
      tempEmail: user.tempEmail,
    },
  });
});

// Verify New Email Code
export const verifyNewEmail = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const { id } = req.user;

  const user = await userModel.findById(id);
  if (!user || !user.tempEmail || !user.tempEmailCode) {
    return next(
      new Error("No pending email change request found", { cause: 400 })
    );
  }

  if (user.tempEmailCode !== code) {
    return next(new Error("Invalid verification code", { cause: 400 }));
  }

  // Commit the change
  user.email = user.tempEmail;
  user.tempEmail = null;
  user.tempEmailCode = null;
  await user.save();

  return res.status(200).json({
    message: "Email updated successfully",
  });
});

export const toggleTwoFactor = asyncHandler(async (req, res, next) => {
  console.log("toggleTwoFactor called");
  console.log("Request body:", req.body);
  console.log("User ID:", req.user?.id);

  const { enable, method } = req.body;
  const { id } = req.user;

  console.log("Finding user with ID:", id);
  const user = await userModel.findById(id);

  if (!user) {
    console.log("User not found");
    return next(new Error("User not found", { cause: 404 }));
  }

  if (method) {
    console.log("Setting twoFactorMethod to:", method);
    user.twoFactorMethod = method;
  }

  user.twoFactorEnabled = enable;
  await user.save();

  console.log("User saved successfully");
  console.log("New twoFactorEnabled:", user.twoFactorEnabled);

  return res.status(200).json({
    message: `Two-Factor Authentication ${
      enable ? "enabled" : "disabled"
    } successfully`,
    twoFactorEnabled: user.twoFactorEnabled,
  });
});

// Delete Account
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // 1. Find all events created by this user
  const userEvents = await eventModel.find({ createdBy: id });

  if (userEvents.length > 0) {
    const eventIds = userEvents.map((event) => event._id);

    // 2. Check if any of these events have active bookings
    const activeBookings = await bookingModel.findOne({
      event: { $in: eventIds },
      status: "booked",
    });

    if (activeBookings) {
      return next(
        new Error(
          "Cannot delete account. You have events with active bookings. Please cancel or refund them first.",
          { cause: 400 }
        )
      );
    }

    // 3. Delete events if no active bookings
    // (Optional: Also delete images from Cloudinary)
    for (const event of userEvents) {
      if (event.image?.public_id) {
        await cloudinary.uploader.destroy(event.image.public_id);
      }
    }
    await eventModel.deleteMany({ createdBy: id });
  }

  // 4. Delete user's own bookings
  await bookingModel.deleteMany({ user: id });

  // 5. Delete user profile image from Cloudinary
  const user = await userModel.findById(id);
  if (user?.userImage?.public_id) {
    await cloudinary.uploader.destroy(user.userImage.public_id);
  }

  // 6. Delete User
  await userModel.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Account and all associated events deleted successfully",
  });
});

// Request to become an Organizer
export const requestOrganizer = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await userModel.findById(id);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user.role === "organizer") {
    return next(new Error("You are already an organizer", { cause: 400 }));
  }

  if (user.organizerRequestStatus === "pending") {
    return next(new Error("Request already pending", { cause: 400 }));
  }

  if (user.organizerRequestStatus === "rejected") {
    // Optional: Allow re-request after some time or immediate?
    // For now allow immediate re-request
  }

  user.organizerRequestStatus = "pending";
  await user.save();

  return res.status(200).json({
    message: "Request submitted successfully",
  });
});

// Get Organizer Requests (Admin)
export const getOrganizerRequests = asyncHandler(async (req, res, next) => {
  const requests = await userModel
    .find({ organizerRequestStatus: "pending" })
    .select(
      "firstName lastName userName email userImage organizerRequestStatus createdAt"
    );

  return res.status(200).json({ requests });
});

// Handle (Approve/Reject) Request (Admin)
export const handleOrganizerRequest = asyncHandler(async (req, res, next) => {
  const { userId, status } = req.body; // status: "approved" | "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return next(new Error("Invalid status", { cause: 400 }));
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (status === "approved") {
    user.role = "organizer";
    user.organizerRequestStatus = "approved";
  } else {
    user.organizerRequestStatus = "rejected";
  }

  await user.save();

  // Send email notification (Optional but good UX)
  // await sendEmail(...)

  return res.status(200).json({
    message: `Request ${status} successfully`,
  });
});

// Update Phone Number (after OTP verification)
export const updatePhone = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;
  const { id } = req.user;

  if (!phone) {
    return next(new Error("Phone number is required", { cause: 400 }));
  }

  const user = await userModel.findById(id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Check if phone already exists for another user
  const existingUser = await userModel.findOne({ phone, _id: { $ne: id } });
  if (existingUser) {
    return next(new Error("Phone number already in use", { cause: 409 }));
  }

  user.phone = phone;
  await user.save();

  return res.status(200).json({
    message: "Phone number updated successfully",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userName: user.userName,
      role: user.role,
      userImage: user.userImage,
    },
  });
});
