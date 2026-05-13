import Course from "../models/Course.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildThumbnailUrl = (req, course) => {
  if (!course.thumbnail?.startsWith("/uploads")) {
    return course.thumbnail;
  }
  return `${req.protocol}://${req.get("host")}${course.thumbnail}`;
};

const normalizeCourse = (req, course) => {
  const obj = course.toObject ? course.toObject() : course;
  return {
    ...obj,
    thumbnailUrl: buildThumbnailUrl(req, obj)
  };
};

export const getCourses = asyncHandler(async (req, res) => {
  const { search = "", category = "", minPrice, maxPrice } = req.query;
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const courses = await Course.find(query).sort({ createdAt: -1 });
  const categories = await Course.distinct("category");

  res.json({
    success: true,
    courses: courses.map((course) => normalizeCourse(req, course)),
    categories
  });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const isEnrolled = req.user?.enrolledCourses?.some((id) => String(id) === String(course._id)) || false;

  res.json({
    success: true,
    course: normalizeCourse(req, course),
    isEnrolled
  });
});

export const createCourse = asyncHandler(async (req, res) => {
  const thumbnail = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail;
  const course = await Course.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    thumbnail,
    instructor: req.body.instructor,
    videoUrl: req.body.videoUrl,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    course: normalizeCourse(req, course)
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const fields = ["title", "description", "price", "category", "instructor", "videoUrl"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });

  if (req.file) {
    course.thumbnail = `/uploads/${req.file.filename}`;
  } else if (req.body.thumbnail) {
    course.thumbnail = req.body.thumbnail;
  }

  await course.save();

  res.json({
    success: true,
    course: normalizeCourse(req, course)
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  await course.deleteOne();

  res.json({
    success: true,
    message: "Course deleted"
  });
});
