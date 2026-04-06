import { Clock, ShieldCheck, RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Clock,
    title: "Real-time system checks",
    description: "Query live user-access data from Google Workspace, GitHub, AWS, and Okta in milliseconds — no stale exports, no manual pulls.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready export, instantly",
    description: "Every response is timestamped, structured, and named for your auditor. Drop the JSON into your GRC tool or email it directly — no reformatting.",
  },
  {
    icon: RefreshCw,
    title: "Multi-system coverage",
    description: "One unified API across Google Workspace, GitHub, AWS IAM, and Okta. Consistent JSON schema across every system you own.",
  },
  {
    icon: Zap,
    title: "Secure & privacy-first",
    description: "Anonymous analytics only — no PII stored. All requests are authenticated and audit-logged, so you always know what ran and when.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why EvidenceOS</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Compliance shouldn't be a fire drill
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Replace manual evidence gathering with a programmable, audit-ready pipeline.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}