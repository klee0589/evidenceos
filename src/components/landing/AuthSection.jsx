import { motion } from "framer-motion";
import { Code2, Lock } from "lucide-react";

const AUTH_METHODS = [
  {
    icon: Lock,
    method: "API Key",
    header: "X-API-Key",
    example: 'curl -H "X-API-Key: your-api-key" https://evidenceos-api.onrender.com/api/demo/access-review',
    description: "For server-to-server requests and development.",
  },
  {
    icon: Code2,
    method: "Bearer Token",
    header: "Authorization",
    example: 'curl -H "Authorization: Bearer your-token" https://evidenceos-api.onrender.com/api/demo/access-review',
    description: "For web and mobile client authentication.",
  },
];

export default function AuthSection() {
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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Authentication</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Secure API Access</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {AUTH_METHODS.map((auth, i) => {
            const Icon = auth.icon;
            return (
              <motion.div
                key={auth.method}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{auth.method}</h3>
                    <p className="text-xs text-muted-foreground">{auth.header}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-[hsl(222,50%,5%)] p-4 overflow-hidden">
                  <pre className="text-xs font-mono text-foreground/70 whitespace-pre-wrap break-words">
                    {auth.example}
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground">{auth.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}