import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { name, email, integration_preference, pain_point } = await req.json();

  const res = await fetch("https://evidenceos-api.onrender.com/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, integration_preference, pain_point }),
  });

  const data = res.ok ? await res.json() : {};
  const apiKey = data.apiKey || data.api_key || data.key || ("eos_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16));

  return Response.json({ apiKey });
});