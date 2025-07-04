import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const token = joi
  .object({
    token: joi.string().required().messages({
      "any.required": "joiValidation.tokenRequired",
      "string.base": "joiValidation.tokenInvalid",
    }),
  })
  .required();

export const signup = joi
  .object({
    firstName : joi.string() ,
    lastName : joi.string() ,
    userName: joi
      .string()
      .min(2)
      .max(20)
      .required()
      .messages({
        "any.required": "joiValidation.userNameRequired",
        "string.min": "joiValidation.userNameInvalid",
        "string.max": "joiValidation.userNameInvalid",
        "string.base": "joiValidation.userNameInvalid",
      }),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword,
  })
  .required();

export const login = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();

export const sendCode = joi
  .object({
    email: generalFields.email,
  })
  .required();

export const forgetPassword = joi
  .object({
    forgetCode: joi
      .string()
      .pattern(new RegExp(/^[0-9]{6}$/))
      .required()
      .messages({
        "any.required": "joiValidation.forgetCodeRequired",
        "string.pattern.base": "joiValidation.forgetCodeInvalid",
        "string.base": "joiValidation.forgetCodeInvalid",
      }),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword,
  })
  .required();