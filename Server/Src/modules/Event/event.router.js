import { Router } from "express";
import * as eventController from "./controller/event.js";
import { validation } from "../../middlewares/validation.js";
import * as validators from "./event.validation.js";
import { fileUplode, fileVaildation } from "../../utils/multer.cloudinary.js";
import { auth, roles } from "../../middlewares/auth.js";

const router = Router();

router.post(
  "/singleLanguageEvent",
  validation(validators.createSingleEvent),
  auth([roles.Admin]),
  fileUplode(fileVaildation.image).any(),
  eventController.createSingleLanguageEvent
);
router.post(
  "/multiLanguageEvent",
  validation(validators.createMultiLanguageEvent),
  fileUplode(fileVaildation.image).any(),
  auth([roles.Admin]),
  eventController.createMultiLanguageEvent
);
router.get("/", auth([roles.User, roles.Admin]), eventController.getAllEvents);
router.get(
  "/:id",
  auth([roles.User, roles.Admin]),
  eventController.getSpicificEvent
);
router.patch(
  "/:id",
  validation(validators.updateEvent),
  auth([roles.Admin]),
  fileUplode(fileVaildation.image).any(),
  eventController.updateEvent
);
router.delete("/:id", auth([roles.Admin]), eventController.deleteEvent);

export default router;
