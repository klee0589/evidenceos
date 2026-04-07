import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const apiKey = Deno.env.get("EVIDENCEOS_API_KEY");
  const res = await fetch("https://evidenceos-api.onrender.com/api/v1/usage", {
    headers: { "X-API-Key": apiKey },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { return Response.json({ error: "Non-JSON response", status: res.status, body: text.slice(0, 300) }, { status: 502 }); }
  if (!res.ok) return Response.json({ error: json }, { status: res.status });
  return Response.json(json.data ?? json);
});