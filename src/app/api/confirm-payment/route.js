
import { NextResponse } from "next/server";
import connectDB from '../../lib/connectDB'
import UserCourse from '../../models/UserCourses'
import { getServerSession } from "next-auth";
import { authOptions } from '../../lib/authOptions.js'

export async function POST(req) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user = session?.user;


    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { stripeSession } = await req.json();

    console.log(stripeSession.metadata.courseTitle);
    if (!stripeSession || !stripeSession.customer_details?.email || !stripeSession.metadata?.courseTitle) {
        return NextResponse.json({ success: false, message: "Invalid session data" }, { status: 400 });
    }

    // Store or update course enrollment
    const existing = await UserCourse.findOne({ userEmail: user.email });
    if (existing) {
        if (!Array.isArray(existing.courseTitle)) {
            existing.courseTitle = []; // 👈 safety fallback
        }

        if (!existing.courseTitle.includes(stripeSession?.metadata?.courseTitle)) {
            existing.courseTitle.push(stripeSession?.metadata?.courseTitle);
            await existing.save();
        }
    }
    else {
        await UserCourse.create({
            userName: session.user.name,
            userEmail: session.user.email,
            courseTitle: [stripeSession.metadata?.courseTitle],
            paymentEmail: stripeSession.customer_details.email,
            paymentPhone: stripeSession?.metadata?.phone || "",
            stripeSessionId: stripeSession.id
        });

    }

    return NextResponse.json({ success: true });
}
