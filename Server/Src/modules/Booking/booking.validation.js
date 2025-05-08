import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const createBooking = joi
  .object({
    eventId: generalFields.id,
  })
  .required();

export const confirmBooking = joi
  .object({
    sessionId: joi.string().required().messages({
      "any.required": "sessionIdRequired",
      "string.base": "invalidSessionId",
    }),
  })
  .required();

export const cancelTicket = joi
  .object({
    eventId: generalFields.id.messages({
      "any.required": "eventIdRequired",
      "string.base": "invalidEventId",
    }),
  })
  .required();
