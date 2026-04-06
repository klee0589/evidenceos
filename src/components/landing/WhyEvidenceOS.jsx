import { motion } from "framer-motion";
import { ShieldCheck, Clock, FileText, Zap } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Security posture at a glance",
    body: "Instantly see who has access to what across your SaaS stack. Catch over-permissioned accounts, inactive users, and MFA gaps before they become incidents.",
  },
  {
    icon: Clock,
    title: "Compliance in minutes, not days",
    body: "SOC 2, ISO 27001, and HIPAA all require periodic access reviews. EvidenceOS turns a multi-day spreadsheet exercise into a single API call.",
  },
  {
    icon: FileText,
    title: "Audit-ready evidence on demand",
    body: "Every response is timestamped, structured, and named for your auditor. Drop the JSON into your GRC tool or email it directly — no reformatting needed.",
  },
  {
    icon: Zap,
    title: "Zero setup, real data",
    body: "No agents. No complex integrations. Toggle between systems in the live demo below and see real structured responses from our deployed API instantly.",
  },
];

export default function WhyEvidenceOS() {
  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: story copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Why EvidenceOS</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Access reviews shouldn't be a&nbsp;
              <span className="text-primary">quarterly fire drill.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              Every quarter, security and compliance teams scramble to prove they know who has access to what.
              They export CSVs, chase down system owners, and manually stitch together evidence packs.
              It takes days. It's error-prone. And auditors still ask follow-up questions.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              EvidenceOS replaces that workflow with a single API call. Select your system, fetch live user-access data,
              and download a structured JSON report — timestamped and named exactly how auditors expect it.
              Run it on a schedule, trigger it from CI/CD, or use the live demo below to see it right now.
            </p>
          </motion.div>

          {/* Right: point grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/25 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <p.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}