import { Router } from "express";
import * as bookingController from "./controller/booking.js";
import { auth, roles } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { bookingSchema, cancelBookingSchema } from "../../utils/validators.js";

const router = Router();

router.post(
  "/addBooking",
  auth([roles.Admin, roles.User]),
  validation(bookingSchema),
  bookingController.createBooking
);

router.post("/webhook", bookingController.webhook);

router.patch(
  "/cancelTicket",
  auth([roles.Admin, roles.User]),
  validation(cancelBookingSchema),
  bookingController.cancelTicket
);

export default router;
