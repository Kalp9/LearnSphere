import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import sampleCourses from "../data/sampleCourses.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([Course.deleteMany(), Order.deleteMany()]);

    let admin = await User.findOne({ email: "admin@learnsphere.com" });

    if (!admin) {
      admin = await User.create({
        name: "LearnSphere Admin",
        email: "admin@learnsphere.com",
        password: "Admin@12345",
        role: "admin"
      });
    } else {
      admin.role = "admin";
      await admin.save();
    }

    const courses = sampleCourses.map((course) => ({
      ...course,
      createdBy: admin._id
    }));

    await Course.insertMany(courses);

    console.log("Seed complete");
    console.log("Admin email: admin@learnsphere.com");
    console.log("Admin password: Admin@12345");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
