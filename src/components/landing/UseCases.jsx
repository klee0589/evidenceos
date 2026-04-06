import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, FileDown } from "lucide-react";

function JSONMock({ lines }) {
  return (
    <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words p-5 overflow-auto max-h-56">
      {lines.map((line, i) => (
        <span key={i} className={line.cls}>{line.text}{"\n"}</span>
      ))}
    </pre>
  );
}

const CASES = [
  {
    tag: "Scenario 01",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    headline: "Google Workspace Audit",
    caption: "Identify over-permissioned users instantly and take action.",
    system: "google-workspace",
    statusBadge: { label: "Warning", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    json: [
      { text: "{", cls: "text-foreground/70" },
      { text: '  "status": "Warning",', cls: "text-amber-400" },
      { text: '  "summary": "3 over-permissioned users detected",', cls: "text-emerald-400" },
      { text: '  "timestamp": "2026-04-06T08:00:00Z",', cls: "text-sky-400" },
      { text: '  "users": [', cls: "text-foreground/70" },
      { text: '    { "email": "a***@company.com", "role": "Owner", "flag": "excess_perms" },', cls: "text-muted-foreground" },
      { text: '    { "email": "b***@company.com", "role": "Admin", "flag": "inactive_90d" }', cls: "text-muted-foreground" },
      { text: "  ]", cls: "text-foreground/70" },
      { text: "}", cls: "text-foreground/70" },
    ],
  },
  {
    tag: "Scenario 02",
    icon: CheckCircle2,
    iconColor: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
    headline: "GitHub Repo Audit",
    caption: "Ensure all repositories follow your security policy.",
    system: "github",
    statusBadge: { label: "Pass", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    json: [
      { text: "{", cls: "text-foreground/70" },
      { text: '  "status": "Pass",', cls: "text-emerald-400" },
      { text: '  "summary": "12 users reviewed, 0 violations",', cls: "text-emerald-400" },
      { text: '  "timestamp": "2026-04-06T08:01:00Z",', cls: "text-sky-400" },
      { text: '  "users": [', cls: "text-foreground/70" },
      { text: '    { "login": "dev-1", "role": "member", "mfa": true },', cls: "text-muted-foreground" },
      { text: '    { "login": "dev-2", "role": "member", "mfa": true }', cls: "text-muted-foreground" },
      { text: "  ]", cls: "text-foreground/70" },
      { text: "}", cls: "text-foreground/70" },
    ],
  },
  {
    tag: "Scenario 03",
    icon: FileDown,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    headline: "Download & Reporting",
    caption: "Download reports and integrate with your internal workflow.",
    system: null,
    statusBadge: { label: "Exported", cls: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
    json: [
      { text: "// evidenceos-aws-access-review.json", cls: "text-muted-foreground" },
      { text: "{", cls: "text-foreground/70" },
      { text: '  "generated_at": "2026-04-06T08:02:00Z",', cls: "text-sky-400" },
      { text: '  "system": "aws",', cls: "text-sky-400" },
      { text: '  "status": "Warning",', cls: "text-amber-400" },
      { text: '  "summary": "IAM users with broad permissions flagged",', cls: "text-emerald-400" },
      { text: '  "total_users": 9,', cls: "text-violet-400" },
      { text: '  "flagged": 2', cls: "text-amber-400" },
      { text: "}", cls: "text-foreground/70" },
    ],
  },
];

export default function UseCases() {
  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Real-World Scenarios</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">See it work across your stack</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            One API, every system. Real responses you can act on.
          </p>
        </motion.div>

        <div className="space-y-16">
          {CASES.map((c, i) => {
            const Icon = c.icon;
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={c.tag}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${c.iconBg}`}>
                      <Icon className={`w-5 h-5 ${c.iconColor}`} />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${c.iconColor}`}>{c.tag}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{c.headline}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{c.caption}</p>
                  <Badge className={`text-xs px-3 py-1 ${c.statusBadge.cls}`}>
                    {c.statusBadge.label}
                  </Badge>
                </div>

                {/* Terminal mockup side */}
                <div className="flex-1 w-full">
                  <div className="rounded-2xl overflow-hidden border border-border/60 bg-[hsl(222,50%,5%)] shadow-2xl shadow-black/30">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40 bg-[hsl(222,44%,7%)]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      </div>
                      <span className="ml-3 text-xs font-mono text-muted-foreground">
                        {c.system ? `GET /api/demo/access-review${c.system !== "google-workspace" ? `?system=${c.system}` : ""}` : "evidenceos-aws-access-review.json"}
                      </span>
                    </div>
                    <JSONMock lines={c.json} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}