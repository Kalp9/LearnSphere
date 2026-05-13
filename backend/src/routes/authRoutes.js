import express from "express";
import { body } from "express-validator";
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPassword
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  login
);

router.post("/logout", logout);
router.get("/me", protect, me);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required").normalizeEmail()],
  validateRequest,
  forgotPassword
);

router.put(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
  validateRequest,
  resetPassword
);

export default router;
