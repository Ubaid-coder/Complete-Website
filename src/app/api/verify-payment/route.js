import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
 
    if (!sessionId) {
        return NextResponse.json({ success: false, error: 'Missing session ID' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const {customer_details} = session;
        const {name, email, phone} = customer_details;
        console.log('Customer Details:', { name, email, phone });
        
        if (session.payment_status === 'paid') {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Not paid' });
        }
    } catch (error) {
        console.error('Stripe verify error:', error.message);
        return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 500 });
    }
}
