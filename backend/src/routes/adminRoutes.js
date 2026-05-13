import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getAdminStats);

export default router;
