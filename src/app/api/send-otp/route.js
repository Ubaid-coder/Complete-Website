import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "../../lib/connectDB";
import User from "../../models/User";
import OTP from '../../models/OTP'
import { Resend } from "resend";

// For route.js in App Router
export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { email, userName } = await req.json();
    if (!email || !userName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp: otpCode })

    // Send email
    if (user) {

      await resend.emails.send({
        from: 'Ubaid Courses<onboarding@resend.dev>',
        to: email,
        subject: "🔐 Your Password Reset OTP",
        html: `<p>Hi ${userName},</p>
           <p>Your OTP for password reset is:</p>
           <h2>${otpCode}</h2>
           <p>This code is valid for 10 minutes.</p>`,
      });
    } else {
      await resend.emails.send({
        from: 'Ubaid Courses<onboarding@resend.dev>',
        to: email,
        subject: `Welcome to our courses website MR:${userName}`,
        html: `<p>Hi ${userName},</p>
           <p>Your OTP for account creation is:</p>
           <h2>${otpCode}</h2>
           <p>This code is valid for 10 minutes.</p>`,
      });
    }



    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
