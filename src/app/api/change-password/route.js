
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from '../../lib/connectDB'
import User from "../../models/User";

export async function POST(req) {

    const { userName, email, newPassword } = await req.json();
    console.log("Received data:", { userName, email, newPassword });

    await dbConnect();


    const user = await User.findOne({ email: email, name: userName });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const password = await bcrypt.compare(newPassword, user.password);

    if (password) {
        return NextResponse.json({ error: "You cannot use your old password as your new password" }, { status: 400 });
    }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" });
 
}
