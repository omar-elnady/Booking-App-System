import joi from "joi";
import { Types } from "mongoose";

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("joiValidation.idInvalid");
};

export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.email": "joiValidation.emailInvalid",
      "any.required": "joiValidation.emailRequired",
    }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required()
    .messages({
      "string.pattern.base": "joiValidation.passwordInvalid",
      "any.required": "joiValidation.passwordRequired",
    }),
  cPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({
      "any.only": "joiValidation.confirmPasswordInvalid",
      "any.required": "joiValidation.confirmPasswordRequired",
    }),
  id: joi.string().custom(validateObjectId).required().messages({
    "any.required": "joiValidation.idRequired",
    "string.base": "joiValidation.idInvalid",
  }),
  optionalId: joi.string().custom(validateObjectId).messages({
    "string.base": "joiValidation.idInvalid",
  }),
  file: joi
    .object({
      size: joi.number().positive().required(),
      path: joi.string().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      mimetype: joi.string().required(),
      encoding: joi.string().required(),
      originalname: joi.string().required(),
      fieldname: joi.string().required(),
    })
    .required()
    .messages({
      "any.required": "joiValidation.fileRequired",
      "object.base": "joiValidation.fileInvalid",
    }),
  headers: joi.string().required().messages({
    "any.required": "joiValidation.headersRequired",
    "string.base": "joiValidation.headersInvalid",
  }),
};

export const validation = (schema, considerHeaders = false) => {
  return (req, res, next) => {
    let inputsData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    if (req.headers.authorization && considerHeaders) {
      inputsData = { authorization: req.headers.authorization };
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      const errors = validationResult.error.details.map((error) => {
        const translationKey = error.message.startsWith("joiValidation.")
          ? error.message
          : `joiValidation.${error.message}`;
        const translatedMessage = req.t(translationKey, {
          defaultValue: error.message,
        });
        return {
          field: error.context.label || error.path.join("."),
          message: translatedMessage,
        };
      });
      return res.status(400).json({
        message: `${req.t("joiValidation.validationError")}: ${errors[0].message}`,
        validationErrors: errors,
      });
    }
    return next();
  };
};