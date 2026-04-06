import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, FileDown, Lock, ShieldAlert, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";

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
    caption: "EvidenceOS flags over-permissioned users in real-time. See which accounts have excess roles or haven't logged in within 90 days — before your auditor does.",
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
    caption: "Verify every GitHub user has MFA enabled and follows the principle of least privilege. Zero violations means a clean SOC 2 CC6 checkpoint.",
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
    icon: ShieldAlert,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
    headline: "Azure AD Access Review",
    caption: "Detect Global Administrator accounts without MFA, guest users with active assignments, and stale identities across your Microsoft tenant.",
    system: "azure-ad",
    statusBadge: { label: "Fail", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
    json: [
      { text: "{", cls: "text-foreground/70" },
      { text: '  "status": "Fail",', cls: "text-red-400" },
      { text: '  "summary": "4 critical violations detected",', cls: "text-red-400" },
      { text: '  "timestamp": "2026-04-06T08:02:00Z",', cls: "text-sky-400" },
      { text: '  "users": [', cls: "text-foreground/70" },
      { text: '    { "upn": "admin@tenant.onmicrosoft.com", "role": "Global Administrator", "mfa_registered": false },', cls: "text-muted-foreground" },
      { text: '    { "upn": "guest@partner.com", "role": "User", "guest": true, "flag": "stale_guest" }', cls: "text-muted-foreground" },
      { text: "  ]", cls: "text-foreground/70" },
      { text: "}", cls: "text-foreground/70" },
    ],
  },
  {
    tag: "Scenario 04",
    icon: Users,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10 border-sky-500/20",
    headline: "Salesforce User Review",
    caption: "Surface Salesforce System Administrators with no recent login, inactive standard users still holding active licenses, and profile mismatches against your HRIS.",
    system: "salesforce",
    statusBadge: { label: "Warning", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    json: [
      { text: "{", cls: "text-foreground/70" },
      { text: '  "status": "Warning",', cls: "text-amber-400" },
      { text: '  "summary": "2 inactive users with active licenses",', cls: "text-emerald-400" },
      { text: '  "timestamp": "2026-04-06T08:03:00Z",', cls: "text-sky-400" },
      { text: '  "users": [', cls: "text-foreground/70" },
      { text: '    { "username": "j.doe@company.salesforce.com", "profile": "System Administrator", "last_login_days_ago": 110, "flag": "inactive_90d" },', cls: "text-muted-foreground" },
      { text: '    { "username": "a.smith@company.salesforce.com", "profile": "Standard User", "last_login_days_ago": 7 }', cls: "text-muted-foreground" },
      { text: "  ]", cls: "text-foreground/70" },
      { text: "}", cls: "text-foreground/70" },
    ],
  },
  {
    tag: "Scenario 05",
    icon: FileDown,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    headline: "Download & Reporting",
    caption: "One click exports a named, timestamped JSON file ready to hand to auditors, import into your GRC platform, or archive in your evidence repository.",
    system: null,
    statusBadge: { label: "Exported", cls: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
    json: [
      { text: "// evidenceos-azure-ad-access-review.json", cls: "text-muted-foreground" },
      { text: "{", cls: "text-foreground/70" },
      { text: '  "generated_at": "2026-04-06T08:05:00Z",', cls: "text-sky-400" },
      { text: '  "system": "azure-ad",', cls: "text-sky-400" },
      { text: '  "status": "Fail",', cls: "text-red-400" },
      { text: '  "summary": "4 critical violations detected",', cls: "text-emerald-400" },
      { text: '  "total_users": 15,', cls: "text-violet-400" },
      { text: '  "flagged": 4', cls: "text-red-400" },
      { text: "}", cls: "text-foreground/70" },
    ],
  },
];

const FREE_RESTRICTED = [];

export default function UseCases({ plan }) {
  const isFree = !plan || plan === "free";

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    base44.analytics.track({ eventName: "usecase_tab_switch", properties: { from: "banner" } });
  };

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {isFree && (
          <div className="mb-8 flex items-center justify-between gap-4 px-5 py-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <p className="text-sm text-amber-300">Viewing demo data · Upgrade to Pro for live results</p>
            <button
              onClick={scrollToPricing}
              className="flex-shrink-0 text-xs font-semibold text-amber-400 border border-amber-500/40 rounded-lg px-3 py-1.5 hover:bg-amber-500/10 transition-colors"
            >
              Try Pro →
            </button>
          </div>
        )}

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-xs px-3 py-1 ${c.statusBadge.cls}`}>
                      {c.statusBadge.label}
                    </Badge>
                    {isFree && FREE_RESTRICTED.includes(i) && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border border-muted-foreground/20 bg-secondary/50 text-muted-foreground">
                        <Lock className="w-3 h-3" /> Demo only
                      </span>
                    )}
                  </div>
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