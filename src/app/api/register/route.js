import connectDB from '../../lib/connectDB'
import User from '../../models/User';
import VerificationToken from '../../models/VerificationToken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');

    await VerificationToken.create({
      userId: newUser._id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    const verifyURL = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email ✉️',
      html: `
        <h2>Hello ${name},</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json({ message: 'Signup successful! Please check your email to verify your account.' }, { status: 200 });
  } catch (err) {
    console.error('Signup Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
