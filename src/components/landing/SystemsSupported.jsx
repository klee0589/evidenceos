import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const SYSTEMS = [
  { name: "GitHub", label: "Mock Access Control" },
  { name: "Okta", label: "User Directory" },
  { name: "AWS IAM", label: "Identity & Permissions" },
  { name: "Google Workspace", label: "Admin Data" },
];

export default function SystemsSupported() {
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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Supported Systems</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Test Across Your Stack</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {SYSTEMS.map((sys, i) => (
            <motion.div
              key={sys.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border/60 bg-card p-5 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="text-lg font-semibold mb-2">{sys.name}</div>
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground border-border/40">
                {sys.label}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 p-6 rounded-xl border border-primary/20 bg-primary/5 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Support for <span className="font-semibold text-foreground">Azure AD, Salesforce, Jira, ServiceNow</span> coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
}