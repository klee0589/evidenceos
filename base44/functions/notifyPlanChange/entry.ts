import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const { event, data, old_data } = payload;

  // Only act on plan field changes
  if (!data?.plan || data.plan === old_data?.plan) {
    return Response.json({ skipped: true });
  }

  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  await fetch('https://evidenceos-api.onrender.com/api/billing/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': secret,
    },
    body: JSON.stringify({
      event: {
        type: 'update',
        entity_name: 'User',
        entity_id: event?.entity_id,
      },
      data: { email: data.email, plan: data.plan },
      old_data: { email: old_data?.email, plan: old_data?.plan },
    }),
  });

  return Response.json({ notified: true });
});