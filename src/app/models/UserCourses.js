// /models/UserCourses.js
import mongoose from "mongoose";

const userCoursesSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: [String],
      required: true,
    },
    paymentEmail: {
      type: String,
      required: true,
    },
    paymentPhoneNumber: {
      type: String,
      required: false,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.UserCourses ||
  mongoose.model("UserCourses", userCoursesSchema);
