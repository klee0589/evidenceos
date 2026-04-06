import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
  const customerId = users[0]?.stripe_customer_id;

  if (!customerId) {
    return Response.json({ error: 'No Stripe customer found. Please subscribe first.' }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${req.headers.get('origin')}/pricing`,
  });

  return Response.json({ url: session.url });
});