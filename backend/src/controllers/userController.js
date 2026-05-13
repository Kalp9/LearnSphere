import User from "../models/User.js";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.avatar = req.body.avatar ?? user.avatar;

  if (req.body.email && req.body.email !== user.email) {
    user.email = req.body.email;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  const updatedUser = await User.findById(user._id).populate("enrolledCourses");

  res.json({
    success: true,
    user: updatedUser
  });
});

export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("enrolledCourses");
  res.json({
    success: true,
    courses: user.enrolledCourses
  });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("course")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpire").sort({ createdAt: -1 });
  res.json({
    success: true,
    users
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = req.body.role;
  await user.save();

  res.json({
    success: true,
    user
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot delete your own admin account");
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: "User deleted"
  });
});
