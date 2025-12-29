import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const createCategory = joi
  .object({
    name: joi
      .object({
        en: joi.string().required(),
        ar: joi.string().required(),
      })
      .required(),
  })
  .required();

export const getCategoryById = joi
  .object({
    _id: generalFields.id,
  })
  .required();

export const getEventsByCategory = joi
  .object({
    name: joi.string().min(1).required(),
  })
  .required();

export const updateCategory = joi
  .object({
    _id: generalFields.id,
    name: joi
      .object({
        en: joi.string().required(),
        ar: joi.string().required(),
      })
      .required(),
  })
  .required();

export const deleteCategory = joi
  .object({
    _id: generalFields.id,
  })
  .required();
