import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { validation } from "../../middlewares/validation.js";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "../../utils/validators.js";
import { auth, roles } from "../../middlewares/auth.js";

const router = Router();

router.post(
  "/create",
  auth([roles.Admin]),
  validation(createCategorySchema),
  categoryController.createCategory
);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.patch(
  "/update/:_id",
  auth([roles.Admin]),
  validation(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/delete/:_id",
  auth([roles.Admin]),
  validation(deleteCategorySchema),
  categoryController.deleteCategory
);

router.get("/events/:name", categoryController.getEventsByCategory);

export default router;
