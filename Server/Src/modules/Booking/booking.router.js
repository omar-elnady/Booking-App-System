import { Router } from "express";
import * as bookingController from "./controller/booking.js";
import { validation } from "../../middlewares/validation.js";
import * as validators from "./booking.validation.js";

const router = Router();

router.post("/", validation(validators.createBooking), bookingController.createBooking);

router.get(
  "/confirm",
  validation(validators.confirmBooking),
  bookingController.confirmBooking
);

router.get(
  "/",

  bookingController.getUserBookings
);

router.post(
  "/webhook",

  bookingController.stripeWebhook
);

router.post("/cancel", validation(validators.cancelTicket), bookingController.cancelTicket);

export default router;
