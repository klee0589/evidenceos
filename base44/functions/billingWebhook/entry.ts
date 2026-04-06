import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Base44 POSTs here on plan change: { email, plan, event }
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const payload = await req.json();
  const { email, plan, event } = payload;

  if (!email || !plan) {
    return Response.json({ error: 'Missing email or plan' }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);
  const users = await base44.asServiceRole.entities.User.filter({ email });

  if (users.length === 0) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  await base44.asServiceRole.entities.User.update(users[0].id, { plan });

  console.log(`Plan updated for ${email}: ${plan} (event: ${event})`);
  return Response.json({ received: true });
});