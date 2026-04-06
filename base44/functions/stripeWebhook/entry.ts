import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    return Response.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (email) {
      const users = await base44.asServiceRole.entities.User.filter({ email });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan: 'pro',
        });
      }
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    const customerId = sub.customer;
    const status = sub.status;
    const plan = status === 'active' ? 'pro' : 'free';

    const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
    if (users.length > 0) {
      await base44.asServiceRole.entities.User.update(users[0].id, {
        plan,
        stripe_subscription_status: status,
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const customerId = sub.customer;

    const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
    if (users.length > 0) {
      await base44.asServiceRole.entities.User.update(users[0].id, {
        plan: 'free',
        stripe_subscription_status: 'canceled',
        stripe_subscription_id: null,
      });
    }
  }

  return Response.json({ received: true });
});