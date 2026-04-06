import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Zap, Code2 } from "lucide-react";

const USE_CASES = [
  {
    icon: CheckCircle2,
    title: "Test Access Review Workflows",
    description: "Simulate users, roles, and MFA gaps without touching production systems. Iterate on compliance logic instantly.",
  },
  {
    icon: Zap,
    title: "Build & Demo Compliance Features",
    description: "Show audit-ready data to stakeholders and build identity governance features without real integrations.",
  },
  {
    icon: Code2,
    title: "Mock Identity Providers",
    description: "Replace Okta, AWS, or GitHub with instant test data for development, testing, and CI/CD pipelines.",
  },
];

export default function TestingUseCases() {
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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Use Cases</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for Developers & Security Teams</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {USE_CASES.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full p-6 border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}