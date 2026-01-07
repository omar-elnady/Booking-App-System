import { Router } from "express";
import * as userController from "./controller/profile.js";
import * as ticketsController from "./controller/tickets.js";
import { auth, roles } from "../../middlewares/auth.js";
import { fileUplode, fileVaildation } from "../../utils/multer.cloudinary.js";

const router = Router();

// Get Profile
router.get(
  "/me",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  userController.getProfile
);

// Update Profile (Auth required for all roles)
router.put(
  "/profile",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  fileUplode(fileVaildation.image).single("image"),
  userController.updateProfile
);

router.post(
  "/verify-email-change",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  userController.verifyNewEmail
);

router.patch(
  "/2fa",
  (req, res, next) => {
    console.log("=== 2FA Route Hit ===");
    console.log("Request body:", req.body);
    console.log("Headers:", req.headers.authorization);
    next();
  },
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  userController.toggleTwoFactor
);

// OTP Phone Verification
import * as otpController from "./controller/otp.js";

router.post(
  "/send-phone-otp",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  otpController.sendPhoneOTP
);

router.post(
  "/verify-phone-otp",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  otpController.verifyPhoneOTP
);

router.patch(
  "/update-phone",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  userController.updatePhone
);

router.delete(
  "/",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  userController.deleteAccount
);

// Organizer Requests
router.post(
  "/request-organizer",
  auth([roles.User]),
  userController.requestOrganizer
);

router.get(
  "/organizer-requests",
  auth([roles.Admin, roles.SuperAdmin]),
  userController.getOrganizerRequests
);

router.patch(
  "/handle-organizer-request",
  auth([roles.Admin, roles.SuperAdmin]),
  userController.handleOrganizerRequest
);

// Tickets & Bookings
router.get(
  "/bookings",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.getUserBookings
);

router.get(
  "/next-event",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.getNextEvent
);

router.get(
  "/bookings/:bookingId/qr",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.generateQRCode
);

router.get(
  "/bookings/:bookingId",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.getBookingDetails
);

// Wishlist
router.post(
  "/wishlist/:eventId",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.toggleWishlist
);

router.get(
  "/wishlist",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.getWishlist
);

// Following
router.post(
  "/follow/:organizerId",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.toggleFollow
);

router.get(
  "/following",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  ticketsController.getFollowing
);

// Transactions
import * as transactionsController from "./controller/transactions.js";

router.get(
  "/transactions",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  transactionsController.getUserTransactions
);

router.get(
  "/transactions/stats",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  transactionsController.getTransactionStats
);

router.get(
  "/transactions/:transactionId",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  transactionsController.getTransactionById
);

export default router;
