import { motion } from "framer-motion";
import { Shield, Lock, Zap, AlertCircle, BarChart3, Key } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Versioned API",
    desc: "v1, v2, v3 — backward compatible upgrades with deprecation warnings.",
  },
  {
    icon: Lock,
    title: "Webhook Signatures",
    desc: "HMAC-SHA256 signatures on every webhook event for security.",
  },
  {
    icon: Zap,
    title: "Rate Limiting",
    desc: "Transparent limits by plan. 429 status with Retry-After headers.",
  },
  {
    icon: AlertCircle,
    title: "Structured Errors",
    desc: "Consistent error codes, messages, and debugging info on every failure.",
  },
  {
    icon: BarChart3,
    title: "Usage Tracking",
    desc: "Real-time API usage dashboard with cost projections.",
  },
  {
    icon: Key,
    title: "Key Rotation",
    desc: "Rotate API keys with grace period. No downtime required.",
  },
];

export default function ProductionFeatures() {
  return (
    <section className="py-20 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Enterprise Ready</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Production-Ready Features</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
            Built for scale, security, and reliability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}