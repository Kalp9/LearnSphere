import Course from "../models/Course.js";
import User from "../models/User.js";
import sampleCourses from "../data/sampleCourses.js";

const ensureSeedData = async () => {
  if (process.env.NODE_ENV === "production" || process.env.AUTO_SEED === "false") {
    return;
  }

  const courseCount = await Course.countDocuments();
  if (courseCount > 0) {
    return;
  }

  let admin = await User.findOne({ email: "admin@learnsphere.com" });

  if (!admin) {
    admin = await User.create({
      name: "LearnSphere Admin",
      email: "admin@learnsphere.com",
      password: "Admin@12345",
      role: "admin"
    });
  }

  await Course.insertMany(sampleCourses.map((course) => ({ ...course, createdBy: admin._id })));

  console.log("Sample courses seeded");
  console.log("Admin email: admin@learnsphere.com");
  console.log("Admin password: Admin@12345");
};

export default ensureSeedData;
