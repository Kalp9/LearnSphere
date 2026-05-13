import Course from "../models/Course.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalCourses, paidOrders] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Order.find({ status: "paid" })
  ]);

  const totalSales = paidOrders.reduce((sum, order) => sum + order.amount, 0) / 100;

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalCourses,
      totalSales,
      totalOrders: paidOrders.length
    }
  });
});
