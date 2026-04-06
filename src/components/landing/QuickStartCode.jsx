import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CURL_EXAMPLE = `curl -X GET "https://evidenceos-api.onrender.com/api/demo/access-review?system=github" \\
  -H "X-API-Key: your-api-key-here"`;

const RESPONSE_EXAMPLE = `{
  "status": "Warning",
  "summary": "2 of 12 users flagged for review",
  "timestamp": "2026-04-06T08:00:00Z",
  "users": [
    {
      "login": "dev-1",
      "role": "owner",
      "mfa_enabled": false,
      "warning": "MFA not enabled"
    },
    {
      "login": "dev-2",
      "role": "member",
      "mfa_enabled": true
    }
  ]
}`;

export default function QuickStartCode() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CURL_EXAMPLE);
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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Quick Start</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">One API Call, Instant Data</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Request */}
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-[hsl(222,50%,5%)] shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-[hsl(222,44%,7%)]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-mono">cURL</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 text-xs font-mono text-foreground/80 overflow-auto whitespace-pre-wrap break-words max-h-48">
              {CURL_EXAMPLE}
            </pre>
          </div>

          {/* Response */}
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-[hsl(222,50%,5%)] shadow-lg">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40 bg-[hsl(222,44%,7%)]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-mono">Response (JSON)</span>
              </div>
            </div>
            <pre className="p-5 text-xs font-mono text-foreground/70 overflow-auto whitespace-pre-wrap break-words max-h-48">
              <code dangerouslySetInnerHTML={{
                __html: RESPONSE_EXAMPLE
                  .replace(/"([^"]+)":/g, '<span class="text-sky-400">"$1"</span>:')
                  .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
                  .replace(/: (true|false)/g, ': <span class="text-amber-400">$1</span>')
                  .replace(/: (\d+)/g, ': <span class="text-violet-400">$1</span>')
              }} />
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}