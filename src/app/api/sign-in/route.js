import User from '../../models/User';
import connectDB from '../../lib/connectDB';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    console.log('Sign-in attempt:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Incorrect password');
      return new Response(JSON.stringify({ error: 'Incorrect email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!user.isVerified) {
      console.log('Email not verified');
      return new Response(JSON.stringify({ error: 'Please verify your email first.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return minimal user info on success
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
    console.log('Sign-in successful:', userData);

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Sign-in error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
