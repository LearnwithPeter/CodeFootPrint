import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import {
  registerValidationRules,
  loginValidationRules,
} from "../validators/authValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, registerValidationRules, validateRequest, register);
router.post("/login", authLimiter, loginValidationRules, validateRequest, login);
router.get("/me", authMiddleware, getMe);

export default router;
