import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, FileJson } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Code2,
    title: "Call Sandbox API",
    desc: "Hit any endpoint with your API key. Instant mock response.",
  },
  {
    num: "02",
    icon: Database,
    title: "Get Realistic Data",
    desc: "Deterministic identity & compliance data, fully customizable.",
  },
  {
    num: "03",
    icon: FileJson,
    title: "Generate Reports & Events",
    desc: "Build compliance reports, trigger webhooks, test workflows.",
  },
];

export default function HowItWorks() {
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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Three Steps to Sandbox Access Reviews</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-4 md:gap-0"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex-1"
                >
                  <div className="p-5 rounded-2xl border border-border/60 bg-card text-center h-full">
                    <div className="w-10 h-10 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs font-bold text-primary mb-2">{step.num}</p>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-8 flex-shrink-0 absolute right-0 top-1/3 translate-x-4">
                    <ArrowRight className="w-4 h-4 text-border" />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}