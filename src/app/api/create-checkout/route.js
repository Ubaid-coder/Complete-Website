
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { error } from 'console';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req) {
  const body = await req.json();
  console.log('Body: ', body);

  try {
    const {title, price, url, email} = body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: body.title,
            },

            unit_amount: Math.round(Number(body.price) * 100),
          },
          quantity: 1,
        },
      ],
      metadata:{
        courseTitle: body.url
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log(err);
    return new NextResponse('Stripe error', { status: 500 },{error: err.message});
  }
}
