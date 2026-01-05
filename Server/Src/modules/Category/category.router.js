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
  auth([roles.Admin, roles.SuperAdmin, roles.Organizer]),
  validation(createCategorySchema),
  categoryController.createCategory
);

router.get(
  "/pending",
  auth([roles.Admin, roles.SuperAdmin]),
  categoryController.getPendingCategories
);

router.patch(
  "/handle-request",
  auth([roles.Admin, roles.SuperAdmin]),
  categoryController.handleCategoryRequest
);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.patch(
  "/update/:_id",
  auth([roles.Admin, roles.SuperAdmin]),
  validation(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/delete/:_id",
  auth([roles.Admin, roles.SuperAdmin]),
  validation(deleteCategorySchema),
  categoryController.deleteCategory
);

router.get("/events/:name", categoryController.getEventsByCategory);

export default router;
