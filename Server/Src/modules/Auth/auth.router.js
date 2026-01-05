import { Router } from "express";
import * as authController from "./controller/registration.js";
import * as googleAuthController from "./controller/googleAuth.js";
import { validation } from "../../middlewares/validation.js";
import {
  signUpSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyCodeSchema,
} from "../../utils/validators.js";
import { auth, roles } from "../../middlewares/auth.js";

const router = Router();

router.post("/register", validation(signUpSchema), authController.register);
router.post("/login", validation(loginSchema), authController.login);
router.post("/google", googleAuthController.googleLogin);

router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/NewConfirmEmail/:token", authController.requestNewConfirmEmail);

router.patch(
  "/forgetCode",
  validation(forgetPasswordSchema),
  authController.getForgetPasswordCode
);

router.patch(
  "/verifyCode",
  validation(verifyCodeSchema),
  authController.verifyForgetPasswordCode
);

router.patch(
  "/resetPassword",
  validation(resetPasswordSchema),
  authController.changeForgetPassword
);

router.patch(
  "/changePassword",
  auth([roles.User, roles.Admin, roles.SuperAdmin, roles.Organizer]),
  validation(changePasswordSchema),
  authController.changePassword
);

export default router;
