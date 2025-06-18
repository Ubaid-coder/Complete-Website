// /models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,
  isVerified: {
    type: Boolean,
    default: false
  },

  resetToken: String,

  resetTokenExpire: Date,

  verificationCode: {
    type: String,
    required: false
  }


}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
