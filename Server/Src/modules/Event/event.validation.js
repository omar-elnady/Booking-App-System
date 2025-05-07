import joi from "joi";

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
    category: joi.string().required().messages({
      "string.base": "eventCategoryInvalid",
      "any.required": "eventCategoryRequired",
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
      "number.min": "minAvailableTicketsRequired",
    }),
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
    category: joi
      .object({
        en: joi.string().required().messages({
          "string.base": "eventCategoryEnInvalid",
          "any.required": "eventCategoryEnRequired",
        }),
        ar: joi.string().required().messages({
          "string.base": "eventCategoryArInvalid",
          "any.required": "eventCategoryArRequired",
        }),
      })
      .required()
      .messages({
        "object.base": "eventCategoryInvalidType",
        "any.required": "eventCategoryRequired",
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
  })
  .required();
  