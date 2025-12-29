import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { auth, roles } from "../../middlewares/auth.js";
import { fileUplode, fileVaildation } from "../../utils/multer.cloudinary.js";

const router = Router();

// 1. Global System Configuration (Accessible to all authenticated users for UI adaptation)
router.get(
  "/permissions",
  auth(["super-admin", "admin", "organizer", "user"]),
  adminController.getPermissions
);

// 2. Dashboard Stats & Charts (Accessible to Admin, SuperAdmin AND Organizer)
// Organizers need this for their dashboard charts
router.get(
  "/stats",
  auth([roles.SuperAdmin, roles.Admin, roles.Organizer]),
  adminController.getDashboardStats
);
router.get(
  "/charts",
  auth([roles.SuperAdmin, roles.Admin, roles.Organizer]),
  adminController.getChartData
);

// 3. User Management (Strictly Admin/SuperAdmin)
// 3. User Management (Strictly Admin/SuperAdmin)
const userAuth = auth([roles.SuperAdmin, roles.Admin, roles.Organizer]);
const allowedRoles = [roles.SuperAdmin, roles.Admin, roles.Organizer]; // Helper for consistency if needed? No, just use userAuth.
router.get("/users", userAuth, adminController.getAllUsers);
router.patch("/users/:userId/role", userAuth, adminController.updateUserRole);
router.patch(
  "/users/:userId/status",
  userAuth,
  adminController.toggleUserStatus
);

// 4. Events & Bookings (Admin, SuperAdmin & Organizer)
const eventAuth = auth([roles.SuperAdmin, roles.Admin, roles.Organizer]);

router.get("/events", eventAuth, adminController.getAllEvents);
router.post(
  "/events",
  eventAuth,
  fileUplode(fileVaildation.image).single("image"),
  adminController.createEvent
);
router.put(
  "/events/:eventId",
  eventAuth,
  fileUplode(fileVaildation.image).single("image"),
  adminController.updateEvent
);
router.patch(
  "/events/:eventId/status",
  eventAuth,
  adminController.updateEventStatus
);
router.delete("/events/:eventId", eventAuth, adminController.deleteEvent);

router.get("/bookings", eventAuth, adminController.getAllBookings);

// 3. Strict Super Admin Operations
// Updating permissions is strictly for SuperAdmin
router.patch(
  "/permissions",
  auth([roles.SuperAdmin]),
  adminController.updatePermissions
);

export default router;
