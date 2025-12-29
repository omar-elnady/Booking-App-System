import joi from "joi";
import { Types } from "mongoose";

const objectIdValidation = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};

export const signUpSchema = {
  body: joi
    .object({
      userName: joi.string().min(2).max(20).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
    })
    .required(),
};

export const loginSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .required(),
};

export const forgetPasswordSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
    })
    .required(),
};

export const resetPasswordSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      forgetCode: joi.string().length(6).required(),
      password: joi.string().min(6).required(),
    })
    .required(),
};

export const verifyCodeSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      forgetCode: joi.string().length(6).required(),
    })
    .required(),
};

export const createCategorySchema = {
  body: joi
    .object({
      name: joi
        .object({
          en: joi.string().min(2).required(),
          ar: joi.string().min(2).required(),
        })
        .required(),
    })
    .required(),
};

export const updateCategorySchema = {
  params: joi
    .object({
      _id: joi.string().custom(objectIdValidation).required(),
    })
    .required(),
  body: joi
    .object({
      name: joi
        .object({
          en: joi.string().min(2).required(),
          ar: joi.string().min(2).required(),
        })
        .required(),
    })
    .required(),
};

export const deleteCategorySchema = {
  params: joi
    .object({
      _id: joi.string().custom(objectIdValidation).required(),
    })
    .required(),
};

export const createEventSchema = {
  body: joi
    .object({
      name: joi.string().required(), // Will be parsed as JSON string in form-data for multi-lang, or handled separately
      description: joi.string().required(),
      venue: joi.string().required(),
      price: joi.number().min(0).required(),
      date: joi.date().greater("now").required(),
      capacity: joi.number().min(1).required(),
      category: joi.string().custom(objectIdValidation).required(),
      eventCode: joi.string().optional(),
      availableTickets: joi.number().min(0).optional(),
    })
    .unknown(true), // Allow file fields
};

// For multi-language updates, we assume the client sends specific keys like 'name.en', 'name.ar'
// OR sends a JSON object for 'name'. The schema below supports dot notation keys via unknown(true) strictly speaking,
// but to be precise we should define structure.
// However, since we are using dot notation update in controller, the body might come as flat fields or nested.
// A flexible approach for update:
export const updateEventSchema = {
  params: joi
    .object({
      id: joi.string().custom(objectIdValidation).required(),
    })
    .required(),
  body: joi
    .object({
      name: joi.string().optional(),
      description: joi.string().optional(),
      venue: joi.string().optional(),
      price: joi.number().min(0).optional(),
      date: joi.date().greater("now").optional(),
      availableTickets: joi.number().min(0).optional(),
      category: joi.string().custom(objectIdValidation).optional(),
    })
    .unknown(true),
};

export const bookingSchema = {
  body: joi
    .object({
      eventId: joi.string().custom(objectIdValidation).required(),
    })
    .required(),
};

export const cancelBookingSchema = {
  body: joi
    .object({
      eventId: joi.string().custom(objectIdValidation).required(),
    })
    .required(),
};

export const changePasswordSchema = {
  body: joi
    .object({
      oldPassword: joi.string().required(),
      newPassword: joi.string().min(6).required(),
      confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
    .required(),
};
