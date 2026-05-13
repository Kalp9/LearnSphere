import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"]
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"]
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

courseSchema.index({ title: "text", description: "text", category: "text", instructor: "text" });

const Course = mongoose.model("Course", courseSchema);

export default Course;
