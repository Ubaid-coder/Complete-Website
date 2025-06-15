// /api/verify-purchase/route.js
import { NextResponse } from "next/server";
import connectDB from '../../lib/connectDB'
import UserCourse from '../../models/UserCourses'

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const course = searchParams.get("course");

    const existing = await UserCourse.findOne({ userEmail: email });

    if (existing?.courseTitle.includes(course)) {
      return NextResponse.json({ purchased: true });
    }

    return NextResponse.json({ purchased: false });
  } catch (err) {
    console.error("Error in verify-purchase:", err);
    return NextResponse.json({ purchased: false });
  }
}
