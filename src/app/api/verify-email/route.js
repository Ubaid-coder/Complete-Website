import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import VerificationToken from "../../models/VerificationToken";
import User from "../../models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "❌ Token is required." }, { status: 400 });
    }

    const tokenDoc = await VerificationToken.findOne({ token });

    if (!tokenDoc) {
      return NextResponse.json({ message: "❌ Invalid or expired token." }, { status: 400 });
    }

    const { name, email, password, expiresAt } = tokenDoc;

    if (new Date() > expiresAt) {
      await VerificationToken.deleteOne({ _id: tokenDoc._id });
      return NextResponse.json({ message: "❌ Token has expired." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await VerificationToken.deleteOne({ _id: tokenDoc._id });
      return NextResponse.json({ message: "❌ User already exists." }, { status: 400 });
    }

    // Create user
    await User.create(
      {
        name,
        email,
        password,
        isVerified: true,
      }
    );

    // Delete token
    await VerificationToken.deleteOne({ _id: tokenDoc._id });

    return NextResponse.json({ message: "✅ Email verified. Account created successfully!" });
  } catch (error) {
    console.error("Error in verify-email:", error);
    return NextResponse.json({ message: "❌ Server error during verification." }, { status: 500 });
  }
}
