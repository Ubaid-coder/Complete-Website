
import { NextResponse } from "next/server";
import dbConnect from '../../lib/connectDB'
import User from "../../models/User";
import bcrypt from 'bcryptjs'
import OTP from "../../models/OTP";

export async function POST(req) {

    const { userName, email, verificationCode, newPassword } = await req.json();
    console.log("Received data:", { userName, email, verificationCode, newPassword });

    await dbConnect();

    // Step 1: Check OTP validity
    const otpEntry = await OTP.findOne({ email, otp: verificationCode });
    if (!otpEntry) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 404 });
    }

    // Step 2: Check user exists
    const user = await User.findOne({ email, name: userName });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 3: Prevent old password reuse
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        return NextResponse.json({ error: "You cannot use the old password" }, { status: 400 });
    }

    // Step 4: Hash & update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Step 5: Delete used OTP
    await OTP.deleteMany({ email:user.email });

    return NextResponse.json({ message: "Password updated successfully" });

}
