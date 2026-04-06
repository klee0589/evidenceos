import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Download, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STEPS = [
  {
    icon: Cloud,
    step: "01",
    title: "Select System",
    description: "Use the system toggle to choose Google Workspace, GitHub, AWS, or Okta. Each selection fires a live API call — no config files, no connectors to set up.",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
    detail: "GET /api/demo/access-review?system=github",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Fetch & Review",
    description: "EvidenceOS queries live SaaS data and returns a structured JSON payload in milliseconds — with a status summary, flagged users, and an ISO timestamp ready for your auditor.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    detail: '{ "status": "Warning", "users": 14, "flagged": 3 }',
  },
  {
    icon: Download,
    step: "03",
    title: "Download & Share",
    description: "Hit Download to export an audit-ready JSON report named evidenceos-{system}-access-review.json. Share with auditors, feed into your GRC tool, or archive — all tracked anonymously.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    detail: "evidenceos-aws-access-review.json · 4.2 KB",
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
                <div
                  className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 text-center md:text-left"
                  onMouseEnter={() => base44.analytics.track({ eventName: "workflow_step_hover", properties: { step: s.step } })}
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 mx-auto md:mx-0 ${s.bg}`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <div className={`text-xs font-bold mb-1 ${s.color}`}>{s.step}</div>
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    {i === 1 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400">Live data: Pro</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.description}</p>
                  <code className={`text-[11px] font-mono px-2 py-1 rounded-md bg-secondary/60 ${s.color}`}>{s.detail}</code>
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