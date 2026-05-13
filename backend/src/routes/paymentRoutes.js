import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getPaymentKey,
  markPaymentFailed,
  verifyPayment
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/key", protect, getPaymentKey);
router.post(
  "/create-order",
  protect,
  [body("courseId").isMongoId().withMessage("Valid course id is required")],
  validateRequest,
  createOrder
);
router.post(
  "/verify",
  protect,
  [
    body("courseId").isMongoId().withMessage("Valid course id is required"),
    body("razorpay_order_id").notEmpty().withMessage("Razorpay order id is required"),
    body("razorpay_payment_id").notEmpty().withMessage("Razorpay payment id is required"),
    body("razorpay_signature").notEmpty().withMessage("Razorpay signature is required")
  ],
  validateRequest,
  verifyPayment
);
router.post(
  "/failed",
  protect,
  [body("razorpayOrderId").notEmpty().withMessage("Razorpay order id is required")],
  validateRequest,
  markPaymentFailed
);

export default router;
