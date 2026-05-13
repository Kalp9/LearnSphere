import crypto from "crypto";
import Course from "../models/Course.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getRazorpayInstance } from "../config/razorpay.js";

export const getPaymentKey = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.body.courseId);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (req.user.enrolledCourses.some((id) => String(id) === String(course._id))) {
    res.status(400);
    throw new Error("You already own this course");
  }

  const razorpay = getRazorpayInstance();
  const amount = Math.round(course.price * 100);

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `course_${course._id}_${Date.now()}`,
    notes: {
      courseId: String(course._id),
      userId: String(req.user._id)
    }
  });

  const savedOrder = await Order.create({
    user: req.user._id,
    course: course._id,
    razorpayOrderId: order.id,
    amount,
    currency: "INR",
    status: "created"
  });

  res.status(201).json({
    success: true,
    order,
    dbOrderId: savedOrder._id,
    course
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
    user: req.user._id,
    course: courseId
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (expectedSignature !== razorpay_signature) {
    order.status = "failed";
    await order.save();
    res.status(400);
    throw new Error("Payment verification failed");
  }

  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.status = "paid";
  await order.save();

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { enrolledCourses: courseId }
  });

  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { students: req.user._id }
  });

  res.json({
    success: true,
    message: "Payment verified and course enrolled",
    order
  });
});

export const markPaymentFailed = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: req.body.razorpayOrderId, user: req.user._id },
    { status: "failed" },
    { new: true }
  );

  res.json({
    success: true,
    order
  });
});
