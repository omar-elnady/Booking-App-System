import { Router } from "express";
import * as authController from "./controller/registration.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middlewares/validation.js";

const router = Router();

router.post(
  "/register",
  validation(validators.signup),
  authController.register
);
router.post("/login", validation(validators.login), authController.login);
router.get(
  "/confirmEmail/:token",
  validation(validators.token),
  authController.confirmEmail
);
router.get(
  "/NewConfirmEmail/:token",
  validation(validators.token),
  authController.requestNewConfirmEmail
);

router.patch(
  "/sendCode",
  validation(validators.sendCode),
  authController.getForgetPasswordCode
);
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  authController.changeForgetPassword
);

export default router;
