import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { success_url, cancel_url } = await req.json();

  const priceId = Deno.env.get('STRIPE_PRICE_ID');
  if (!priceId) return Response.json({ error: 'STRIPE_PRICE_ID not configured' }, { status: 500 });

  // Reuse existing customer if we have one
  const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
  let customerId = users[0]?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.full_name });
    customerId = customer.id;
    await base44.asServiceRole.entities.User.update(users[0].id, { stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: success_url || `${req.headers.get('origin')}/pricing?checkout=success`,
    cancel_url: cancel_url || `${req.headers.get('origin')}/pricing`,
  });

  return Response.json({ url: session.url });
});