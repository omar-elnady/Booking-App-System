import { Router } from "express";
import * as eventController from "./controller/event.js";
import { validation } from "../../middlewares/validation.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../../utils/validators.js";
import { auth, roles } from "../../middlewares/auth.js";
import { fileUplode, fileVaildation } from "../../utils/multer.cloudinary.js";

const router = Router();

router.post(
  "/addEvent",
  auth([roles.Admin]),
  fileUplode(fileVaildation.image).single("image"),
  validation(createEventSchema),
  eventController.createSingleLanguageEvent
);

router.post(
  "/create",
  auth([roles.Admin]),
  fileUplode(fileVaildation.image).single("image"),
  validation(createEventSchema),
  eventController.createMultiLanguageEvent
);

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getSpicificEvent);

router.patch(
  "/update/:id",
  auth([roles.Admin]),
  fileUplode(fileVaildation.image).single("image"),
  validation(updateEventSchema),
  eventController.updateEvent
);

router.delete("/delete/:id", auth([roles.Admin]), eventController.deleteEvent);

export default router;
