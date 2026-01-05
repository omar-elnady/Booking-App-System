import { Router } from "express";
import * as userController from "./controller/profile.js";
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

export default router;
