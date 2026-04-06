import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EXAMPLE = {
  request_id: "req_1234abcd5678efgh",
  data: {
    status: "Warning",
    summary: "3 of 12 users flagged for review",
    users: [
      { email: "user@company.com", role: "Admin", flag: "excess_perms" },
      { email: "inactive@company.com", role: "User", flag: "inactive_90d" },
    ],
  },
  meta: {
    timestamp: "2026-04-06T14:32:00Z",
    version: "v1",
    page: 1,
    total: 12,
  },
};

export default function ResponseFormatExample() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(EXAMPLE, null, 2));
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">API Response</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Standard Response Format</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
            Every endpoint returns the same clean structure: request_id, data, meta.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border/60 bg-[hsl(222,50%,5%)] overflow-hidden shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-[hsl(222,44%,7%)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs font-mono text-muted-foreground flex-1 text-center">response.json</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary/50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* JSON */}
            <div className="p-5 overflow-auto max-h-96 font-mono text-sm leading-relaxed">
              <pre className="text-foreground/80">
                {`{`}
                <br />
                <span className="text-sky-400">  "request_id"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-emerald-400"> "req_1234abcd5678efgh"</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">  "data"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-foreground/70"> {`{`}</span>
                <br />
                <span className="text-sky-400">    "status"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-amber-400"> "Warning"</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">    "summary"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-emerald-400"> "3 of 12 users flagged"</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">    "users"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-foreground/70"> [</span>
                <span className="text-foreground/50"> ... ]</span>
                <br />
                <span className="text-foreground/70">  {`}`}</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">  "meta"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-foreground/70"> {`{`}</span>
                <br />
                <span className="text-sky-400">    "timestamp"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-emerald-400"> "2026-04-06T14:32:00Z"</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">    "version"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-emerald-400"> "v1"</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">    "page"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-violet-400"> 1</span>
                <span className="text-foreground/50">,</span>
                <br />
                <span className="text-sky-400">    "total"</span>
                <span className="text-foreground/50">:</span>
                <span className="text-violet-400"> 12</span>
                <br />
                <span className="text-foreground/70">  {`}`}</span>
                <br />
                {`}`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}