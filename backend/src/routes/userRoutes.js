import express from "express";
import { body } from "express-validator";
import {
  deleteUser,
  getAllUsers,
  getEnrolledCourses,
  getUserOrders,
  updateProfile,
  updateUserRole
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/enrolled", protect, getEnrolledCourses);
router.get("/orders", protect, getUserOrders);
router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  updateProfile
);

router.get("/", protect, admin, getAllUsers);
router.put(
  "/:id/role",
  protect,
  admin,
  [body("role").isIn(["user", "admin"]).withMessage("Role must be user or admin")],
  validateRequest,
  updateUserRole
);
router.delete("/:id", protect, admin, deleteUser);

export default router;
