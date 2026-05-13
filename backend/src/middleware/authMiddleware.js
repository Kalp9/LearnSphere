import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getJwtSecret } from "../utils/generateToken.js";

export const protect = asyncHandler(async (req, res, next) => {
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies.learnsphere_token || headerToken;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. Please login.");
  }

  const decoded = jwt.verify(token, getJwtSecret());
  const user = await User.findById(decoded.id).select("-password -resetPasswordToken -resetPasswordExpire");

  if (!user) {
    res.status(401);
    throw new Error("User no longer exists");
  }

  req.user = user;
  next();
});

export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
    return;
  }

  res.status(403);
  next(new Error("Admin access required"));
};
