import express from "express";
import { body } from "express-validator";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse
} from "../controllers/courseController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const courseValidation = [
  body("title").trim().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be zero or greater"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("instructor").trim().notEmpty().withMessage("Instructor is required"),
  body("videoUrl").trim().isURL().withMessage("Valid video URL is required")
];

router.get("/", getCourses);
router.get("/:id", protect, getCourseById);
router.post("/", protect, admin, upload.single("thumbnail"), courseValidation, validateRequest, createCourse);
router.put("/:id", protect, admin, upload.single("thumbnail"), validateRequest, updateCourse);
router.delete("/:id", protect, admin, deleteCourse);

export default router;
