import connectDB from '../../lib/connectDB'
import User from '../../models/User';
import OTP from '../../models/OTP'
import VerificationToken from '../../models/VerificationToken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const { userName, email, password, verificationCode } = await req.json();
  console.log('Recieved',userName,email,password,verificationCode)
  try {
    const existingUser = await User.findOne({ email });
    const checkOTP = await OTP.findOne({ email });


    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    if (verificationCode !== checkOTP?.otp) {
      return NextResponse.json({ message: 'Wrong Verification Code' }, { status: 500 })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: userName,
      email,
      password: hashedPassword,

    });

    console.log(newUser)
    // Step 5: Delete used OTP
    await OTP.deleteMany({email: checkOTP.email})


    return NextResponse.json({ message: 'Signup successful' }, { status: 200 });
  } catch (err) {
    console.error('Signup Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
