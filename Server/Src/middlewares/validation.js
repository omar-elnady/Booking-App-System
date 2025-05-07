import joi from "joi";
import { Types } from "mongoose";

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};

export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
  cPassword: joi.string().required().messages({
    "any.required": "Confirm password is required",
  }),
  id: joi.string().custom(validateObjectId).required(),
  optionalId: joi.string().custom(validateObjectId),

  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),

  headers: joi.string().required(),
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
        const translationKey = `joiValidation.${error.message}`;
        const translatedMessage = req.t(translationKey, {
          defaultValue: error.message
        });
        return {
          field: error.context.label || error.path.join("."),
          message: translatedMessage,
        };
      });
      return res.status(400).json({
        message: ` ${req.t("joiValidation.validationError")} : ${
          errors[0].message
        }`,
        validationErrors: errors,
      });
    }
    return next();
  };
};
