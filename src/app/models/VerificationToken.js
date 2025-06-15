// /models/VerificationToken.js
import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  token: String,
  name: String,
  email: String,
  password: String,
  expiresAt: Date,
});

export default mongoose.models.VerificationToken || mongoose.model("VerificationToken", verificationTokenSchema);
