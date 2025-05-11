import { Router } from "express";
import * as bookingController from "./controller/booking.js";
import { validation } from "../../middlewares/validation.js";
import * as validators from "./booking.validation.js";
import { auth, roles } from "../../middlewares/auth.js";
const router = Router();

router.post(
  "/",
  validation(validators.createBooking),
  bookingController.createBooking
);

router.get(
  "/confirm",
  auth([roles.User]),
  validation(validators.confirmBooking),
  bookingController.confirmBooking
);

router.get(
  "/",
  auth([roles.User, roles.Admin]),
  bookingController.getUserBookings
);

router.post("/webhook", auth([roles.User]), bookingController.stripeWebhook);

router.post(
  "/cancel",
  auth([roles.User, roles.Admin]),
  validation(validators.cancelTicket),
  bookingController.cancelTicket
);

export default router;
