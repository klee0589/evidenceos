import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { success_url, cancel_url } = await req.json();

    const priceId = Deno.env.get('STRIPE_PRICE_ID');
    if (!priceId) return Response.json({ error: 'STRIPE_PRICE_ID not configured' }, { status: 500 });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || `${req.headers.get('origin')}/pricing?checkout=success`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});