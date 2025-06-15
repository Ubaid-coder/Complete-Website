import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import connectDB from "../../lib/connectDB";
import VerificationToken from "../../models/VerificationToken";
import User from '../../models/User';
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    console.log("🟡 Reached POST /send-verification");

    await connectDB();
    console.log("✅ Connected to MongoDB");

    const { name, email, password } = await req.json();
    console.log("📨 Incoming data:", name, email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("🚫 User already exists");
      return NextResponse.json(
        { message: "❌ User already exists. Use a different email." },
        { status: 400 }
      );
    }

    const existingToken = await VerificationToken.findOne({ email });
    if (existingToken) {
      console.log("🔁 Old token found. Deleting...");
      await VerificationToken.deleteOne({ _id: existingToken._id });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    console.log("🔐 Hashed password & generated token");

    await VerificationToken.create({
      token,
      name,
      email,
      password: hashedPassword,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    console.log("🔗 Verification URL:", verificationUrl);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log("📤 Sending email...");
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to DevHub Ubaid! Please verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${name},</p>
        <button><a href="${verificationUrl}">Verify</a></button>
        <p>This link will expire in 5 minutes.</p>
      `,
    });

    console.log("✅ Email sent");
    return NextResponse.json({ message: "✅ Verification email sent!" });

  } catch (error) {
    console.error("❌ Server error in /send-verification:", error);
    return NextResponse.json({ message: "❌ Server error. Try again later." }, { status: 500 });
  }
}

