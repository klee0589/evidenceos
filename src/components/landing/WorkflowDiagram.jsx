import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Download, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Cloud,
    step: "01",
    title: "Select System",
    description: "Choose from Google Workspace, GitHub, AWS, or Okta via a single API parameter.",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Fetch & Review Users",
    description: "EvidenceOS queries live data and returns structured, timestamped access records.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Download,
    step: "03",
    title: "Download / Take Action",
    description: "Export audit-ready JSON reports or feed them directly into your GRC workflow.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
];

export default function WorkflowDiagram() {
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Three steps to audit-ready evidence</h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex flex-col md:flex-row items-center flex-1 w-full md:w-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex-1 w-full md:max-w-none"
              >
                <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-border transition-colors text-center md:text-left">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 mx-auto md:mx-0 ${s.bg}`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <div className={`text-xs font-bold mb-1 ${s.color}`}>{s.step}</div>
                  <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center w-10 flex-shrink-0 my-2 md:my-0">
                  <ArrowRight className="w-5 h-5 text-border rotate-90 md:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}