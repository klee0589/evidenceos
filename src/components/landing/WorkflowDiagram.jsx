import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Download, ArrowRight, SlidersHorizontal, FileCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STEPS = [
  {
    icon: Cloud,
    step: "01",
    title: "Select System",
    description: "Choose from 8 SaaS systems: Google Workspace, GitHub, AWS, Okta, Azure AD, Salesforce, Jira, or ServiceNow. No connectors to set up.",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
    detail: "GET /api/demo/access-review?system=azure-ad",
  },
  {
    icon: SlidersHorizontal,
    step: "02",
    title: "Customize Mock",
    description: "Adjust user count, set status (Pass / Warning / Fail), and add custom notes per user — all session-local with no data stored.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    detail: "{ userCount: 12, status: \"Warning\", note: \"...\" }",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Fetch & Review",
    description: "EvidenceOS returns a structured JSON payload with status, flagged users, and an ISO timestamp — ready for your auditor in milliseconds.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    detail: '{ "status": "Warning", "flagged": 3, "total_users": 12 }',
    badge: "Live data: Pro",
  },
  {
    icon: FileCheck,
    step: "04",
    title: "Validate Evidence",
    description: "Review the structured JSON inline. Each record includes user identity, role, flags, and a timestamp matching your audit window.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    detail: '{ "email": "user@co.com", "flag": "excess_perms" }',
  },
  {
    icon: Download,
    step: "05",
    title: "Download & Share",
    description: "Export a named, timestamped JSON report. Hand it to auditors, import into your GRC tool, or commit to your evidence repository.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    detail: "evidenceos-azure-ad-access-review.json · 6.1 KB",
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Five steps to audit-ready evidence</h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-start gap-4 md:gap-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex flex-col md:flex-row items-center flex-1 w-full md:w-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex-1 w-full md:max-w-none"
              >
                <div
                  className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 text-center md:text-left h-full"
                  onMouseEnter={() => base44.analytics.track({ eventName: "workflow_step_hover", properties: { step: s.step } })}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 mx-auto md:mx-0 ${s.bg}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className={`text-xs font-bold mb-1 ${s.color}`}>{s.step}</div>
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start flex-wrap">
                    <h3 className="text-sm font-semibold">{s.title}</h3>
                    {s.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400">{s.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.description}</p>
                  <code className={`text-[10px] font-mono px-2 py-1 rounded-md bg-secondary/60 block break-all ${s.color}`}>{s.detail}</code>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center w-8 flex-shrink-0 my-2 md:my-0 md:mt-16">
                  <ArrowRight className="w-4 h-4 text-border rotate-90 md:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}