import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Deterministic responses — same input, same output, always",
  "Pagination & filtering — full query control",
  "Webhooks support — trigger real workflows",
  "API key + Bearer auth — two auth methods",
  "Structured error responses — clear debugging",
  "Rate limiting — know your limits upfront",
];

export default function BuiltForDevelopers() {
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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Developer Experience</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for Developers</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
            Production-grade API design, predictable behavior, and full control.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="space-y-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-3 items-start p-3 rounded-lg border border-border/40 bg-secondary/20 hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}