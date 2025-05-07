import { Router } from "express";
import * as eventController from "./controller/event.js";
import { validation } from "../../middlewares/validation.js";
import * as validators from "./event.validation.js";

const router = Router();

router.post(
  "/singleLanguageEvent",
  validation(validators.createSingleEvent),
  eventController.createSingleLanguageEvent
);
router.post(
  "/multiLanguageEvent",
  validation(validators.createMultiLanguageEvent),
  eventController.createMultiLanguageEvent
);
router.get("/", eventController.getEvents);

export default router;
