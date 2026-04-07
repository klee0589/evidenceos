import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const apiKey = Deno.env.get("EVIDENCEOS_API_KEY");
  const res = await fetch("https://evidenceos-api.onrender.com/api/v1/usage", {
    headers: { "X-API-Key": apiKey },
  });
  const json = await res.json();
  if (!res.ok) return Response.json({ error: json }, { status: res.status });
  return Response.json(json.data ?? json);
});