// /app/api/verify-session/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { session_id } = await req.json();

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json({ stripeSession });
  } catch (error) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }
}
