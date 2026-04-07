import { Shield, Book, Terminal, Key, Zap, ChevronRight, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

function CodeBlock({ code, language = "bash" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-xl border border-border/50 bg-muted overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-secondary/40">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="text-sm font-mono text-foreground/80 p-4 overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="space-y-4 pt-2 pb-8 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4 pl-0.5">{children}</div>
    </section>
  );
}

const NAV = [
  { id: "quickstart", label: "Quick Start" },
  { id: "auth", label: "Authentication" },
  { id: "endpoints", label: "Endpoints" },
  { id: "systems", label: "Supported Systems" },
  { id: "errors", label: "Error Codes" },
];

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Evidence<span className="text-primary">OS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs">API v1</Badge>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Contents</p>
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <ChevronRight className="w-3 h-3" />
                {n.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-10 max-w-3xl">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Documentation</p>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">EvidenceOS API Reference</h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Everything you need to integrate EvidenceOS into your workflows — simulated identity systems, compliance reports, and more.
            </p>
          </div>

          <Section id="quickstart" title="Quick Start" icon={Zap}>
            <p className="text-sm text-muted-foreground">Make your first API call in under a minute. No setup required for demo endpoints.</p>
            <CodeBlock language="bash" code={`curl https://evidenceos-api.onrender.com/api/demo/access-review?system=github`} />
            <p className="text-sm text-muted-foreground">Authenticated calls use your API key from the dashboard:</p>
            <CodeBlock language="bash" code={`curl https://evidenceos-api.onrender.com/api/v1/usage \\
  -H "X-API-Key: YOUR_API_KEY"`} />
          </Section>

          <Section id="auth" title="Authentication" icon={Key}>
            <p className="text-sm text-muted-foreground">
              All authenticated endpoints support two auth methods — use whichever fits your stack.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest">API Key Header</p>
                <CodeBlock language="bash" code={`X-API-Key: eos_your_key_here`} />
                <p className="text-xs text-muted-foreground">Recommended for server-to-server calls.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Bearer Token</p>
                <CodeBlock language="bash" code={`Authorization: Bearer eos_your_key_here`} />
                <p className="text-xs text-muted-foreground">Standard OAuth-compatible format.</p>
              </div>
            </div>
            <CodeBlock language="bash" code={`# Using X-API-Key\ncurl https://evidenceos-api.onrender.com/api/v1/usage \\\n  -H "X-API-Key: YOUR_API_KEY"\n\n# Using Bearer Token\ncurl https://evidenceos-api.onrender.com/api/v1/usage \\\n  -H "Authorization: Bearer YOUR_API_KEY"`} />
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
              <strong>Keep your key secret.</strong> Never expose it in frontend code or public repositories.
            </div>
          </Section>

          <Section id="endpoints" title="Endpoints" icon={Terminal}>
            <div className="space-y-6">
              {/* Demo */}
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-secondary/30">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">GET</Badge>
                  <code className="text-sm font-mono">/api/demo/access-review</code>
                  <Badge variant="outline" className="ml-auto text-xs border-border/50 text-muted-foreground">No auth</Badge>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Returns a simulated access review. Optionally pass <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">?system=</code> to target a specific platform.</p>
                  <CodeBlock language="bash" code={`curl "https://evidenceos-api.onrender.com/api/demo/access-review?system=aws"`} />
                </div>
              </div>

              {/* Usage */}
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-secondary/30">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">GET</Badge>
                  <code className="text-sm font-mono">/api/v1/usage</code>
                  <Badge variant="outline" className="ml-auto text-xs border-border/50 text-muted-foreground">Auth required</Badge>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Returns your API usage metrics for the current period — daily calls, limits, breakdowns by system and endpoint.</p>
                  <CodeBlock language="bash" code={`curl https://evidenceos-api.onrender.com/api/v1/usage \\
  -H "X-API-Key: YOUR_API_KEY"`} />
                </div>
              </div>

              {/* Register */}
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-secondary/30">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-mono">POST</Badge>
                  <code className="text-sm font-mono">/api/auth/register</code>
                  <Badge variant="outline" className="ml-auto text-xs border-border/50 text-muted-foreground">No auth</Badge>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Register a new user and receive an API key.</p>
                  <CodeBlock language="bash" code={`curl -X POST https://evidenceos-api.onrender.com/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Doe", "email": "jane@company.com"}'`} />
                </div>
              </div>
            </div>
          </Section>

          <Section id="systems" title="Supported Systems" icon={Book}>
            <p className="text-sm text-muted-foreground">Pass the <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">system</code> query parameter to target a specific integration.</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Google Workspace", param: "(default)", live: true },
                { name: "GitHub", param: "github", live: true },
                { name: "AWS IAM", param: "aws", live: true },
                { name: "Okta", param: "okta", live: true },
                { name: "Azure AD", param: "azure-ad", live: false },
                { name: "Salesforce", param: "salesforce", live: false },
                { name: "Jira", param: "jira", live: false },
                { name: "ServiceNow", param: "servicenow", live: false },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/20 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <code className="text-xs text-muted-foreground">{s.param}</code>
                  </div>
                  <Badge variant="outline" className={`text-xs ${s.live ? "border-primary/30 text-primary bg-primary/5" : "border-border/40 text-muted-foreground"}`}>
                    {s.live ? "Live" : "Soon"}
                  </Badge>
                </div>
              ))}
            </div>
          </Section>

          <Section id="errors" title="Error Codes" icon={Terminal}>
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/30">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Code</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["401", "Missing or invalid API key"],
                    ["403", "Plan limit exceeded"],
                    ["404", "Endpoint not found"],
                    ["429", "Rate limit hit — slow down"],
                    ["500", "Server error — try again shortly"],
                  ].map(([code, desc]) => (
                    <tr key={code} className="border-b border-border/20 last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs text-primary">{code}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}