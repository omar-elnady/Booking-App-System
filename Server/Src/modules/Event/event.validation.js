import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const createSingleEvent = joi
  .object({
    name: joi.string().required().messages({
      "string.base": "eventNameInvalid",
      "any.required": "eventNameRequired",
    }),
    description: joi.string().required().messages({
      "string.base": "eventDescriptionInvalid",
      "any.required": "eventDescriptionRequired",
    }),
    category: joi
      .string()
      .custom((value, helper) => {
        return value && value.length ? value : helper.message("eventCategoryInvalid");
      })
      .required()
      .messages({
        "any.required": "eventCategoryRequired",
        "string.base": "eventCategoryInvalid",
      }),
    venue: joi.string().required().messages({
      "string.base": "eventVenueInvalid",
      "any.required": "eventVenueRequired",
    }),
    eventCode: joi.string().messages({
      "string.base": "eventCodeInvalid",
    }),
    date: joi.date().required().messages({
      "date.base": "eventDateInvalid",
      "any.required": "eventDateRequired",
    }),
    price: joi.number().required().min(0).messages({
      "number.base": "minPriceInvalid",
      "any.required": "minPriceRequired",
      "number.min": "minPriceInvalid",
    }),
    availableTickets: joi.number().min(1).messages({
      "number.base": "minAvailableTicketsInvalid",
      "number.min": "minAvailableTickets",
    }),
    image: generalFields.file,
  })
  .required();

export const createMultiLanguageEvent = joi
  .object({
    name: joi
      .object({
        en: joi.string().required().messages({
          "string.base": "eventNameEnInvalid",
          "any.required": "eventNameEnRequired",
        }),
        ar: joi.string().required().messages({
          "string.base": "eventNameArInvalid",
          "any.required": "eventNameArRequired",
        }),
      })
      .required()
      .messages({
        "object.base": "eventNameInvalidType",
        "any.required": "eventNameRequired",
      }),
    description: joi
      .object({
        en: joi.string().required().messages({
          "string.base": "eventDescriptionEnInvalid",
          "any.required": "eventDescriptionEnRequired",
        }),
        ar: joi.string().required().messages({
          "string.base": "eventDescriptionArInvalid",
          "any.required": "eventDescriptionArRequired",
        }),
      })
      .required()
      .messages({
        "object.base": "eventDescriptionInvalidType",
        "any.required": "eventDescriptionRequired",
      }),
    categoryId: generalFields.id.messages({
      "any.required": "eventIdRequired",
      "string.base": "invalidEventId",
    }),
    venue: joi
      .object({
        en: joi.string().required().messages({
          "string.base": "eventVenueEnInvalid",
          "any.required": "eventVenueEnRequired",
        }),
        ar: joi.string().required().messages({
          "string.base": "eventVenueArInvalid",
          "any.required": "eventVenueArRequired",
        }),
      })
      .required()
      .messages({
        "object.base": "eventVenueInvalidType",
        "any.required": "eventVenueRequired",
      }),
    date: joi.date().required().messages({
      "date.base": "eventDateInvalid",
      "any.required": "eventDateRequired",
    }),
    price: joi.number().required().min(0).messages({
      "number.base": "minPriceInvalid",
      "any.required": "minPriceRequired",
      "number.min": "minPriceInvalid",
    }),
    availableTickets: joi.number().min(1).messages({
      "number.base": "minAvailableTicketsInvalid",
      "number.min": "minAvailableTickets",
    }),
    image: generalFields.file,
  })
  .required();

export const updateEvent = joi
  .object({
    id: generalFields.id.messages({
      "any.required": "eventIdRequired",
      "string.base": "invalidEventId",
    }),
    name: joi.string(),
    description: joi.string(),
    category: generalFields.optionalId,
    venue: joi.string(),
    date: joi.date(),
    price: joi.number().min(0).messages({
      "number.base": "minPriceInvalid",
      "number.min": "minPriceInvalid",
    }),
    availableTickets: joi.number().min(0).messages({
      "number.base": "minAvailableTicketsInvalid",
      "number.min": "minAvailableTicketsInvalid",
    }),
  })
  .required();
