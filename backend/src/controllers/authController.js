import crypto from "crypto";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken, sendTokenCookie } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  enrolledCourses: user.enrolledCourses
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json({
    success: true,
    token,
    user: userResponse(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.json({
    success: true,
    token,
    user: userResponse(user)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("learnsphere_token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("enrolledCourses");
  res.json({
    success: true,
    user: userResponse(user)
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email");
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your LearnSphere password",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2>Password reset request</h2>
        <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
        <p><a href="${resetUrl}" style="background:#22d3ee;color:#020617;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Reset password</a></p>
        <p>If the button does not work, open this link: ${resetUrl}</p>
      </div>
    `
  });

  res.json({
    success: true,
    message: "Password reset email sent"
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.json({
    success: true,
    token,
    user: userResponse(user)
  });
});
