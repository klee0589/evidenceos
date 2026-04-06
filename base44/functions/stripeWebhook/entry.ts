import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email || session.customer_email;

    if (customerEmail) {
      const users = await base44.asServiceRole.entities.User.filter({ email: customerEmail });
      if (users[0]) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          plan: 'pro',
          stripe_customer_id: customerId,
        });
        console.log(`Plan set to pro for ${customerEmail}`);
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const customerId = sub.customer;

    // Look up user by stripe_customer_id
    const customers = await stripe.customers.retrieve(customerId);
    const email = customers.email;
    if (email) {
      const users = await base44.asServiceRole.entities.User.filter({ email });
      if (users[0]) {
        await base44.asServiceRole.entities.User.update(users[0].id, { plan: 'free' });
        console.log(`Plan reverted to free for ${email}`);
      }
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const email = invoice.customer_email;
    if (email) {
      console.warn(`Payment failed for ${email}`);
      // Optionally send a notification — plan stays active until subscription ends
    }
  }

  return Response.json({ received: true });
});