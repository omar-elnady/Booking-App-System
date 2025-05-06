import { Router } from "express";
import * as authController from "./controller/registration.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/confirmEmail/:token", authController.confirmEmail);

export default router;
