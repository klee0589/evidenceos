import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const BASE_URL = "https://evidenceos-api.onrender.com/api/demo";

const SYSTEMS = [
  { label: "Google Workspace", key: "google-workspace" },
  { label: "GitHub", key: "github" },
  { label: "AWS", key: "aws" },
  { label: "Okta", key: "okta" },
];

function SyntaxHighlight({ json }) {
  const text = JSON.stringify(json, null, 2);
  const highlighted = text
    .replace(/"([^"]+)":/g, '<span class="text-sky-400">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
    .replace(/: (true|false)/g, ': <span class="text-amber-400">$1</span>')
    .replace(/: (\d+)/g, ': <span class="text-violet-400">$1</span>');

  return (
    <pre
      className="text-sm leading-relaxed font-mono whitespace-pre-wrap break-words"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

export default function APIDemo() {
  const [activeSystem, setActiveSystem] = useState(SYSTEMS[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchData = async (system) => {
    setLoading(true);
    setError(null);
    setData(null);
    const url =
      system.key === "google-workspace"
        ? `${BASE_URL}/access-review`
        : `${BASE_URL}/access-review?system=${system.key}`;
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(activeSystem).catch((e) => {
      setError(e.message);
      setLoading(false);
    });
  }, [activeSystem]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Live API Preview</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            See what the API returns
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            One call to{" "}
            <code className="text-primary bg-primary/10 px-2 py-0.5 rounded-md text-sm font-mono">
              /api/demo/access-review
            </code>{" "}
            returns structured, audit-ready JSON.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          {/* Terminal chrome */}
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-[hsl(222,50%,5%)] shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-[hsl(222,44%,7%)]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="ml-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="font-mono">response.json</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!data}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* System toggle */}
            <div className="px-5 py-3 border-b border-border/30 flex items-center gap-2 flex-wrap">
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.key}
                  onClick={() => setActiveSystem(sys)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSystem.key === sys.key
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                  }`}
                >
                  {sys.label}
                </button>
              ))}
            </div>

            {/* Request line */}
            <div className="px-5 py-2.5 border-b border-border/20 flex items-center gap-2 text-xs font-mono overflow-hidden">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold px-1.5 flex-shrink-0">
                GET
              </Badge>
              <span className="text-muted-foreground truncate">
                /api/demo/access-review
                {activeSystem.key !== "google-workspace" && (
                  <span>
                    ?system=<span className="text-foreground">{activeSystem.key}</span>
                  </span>
                )}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto flex-shrink-0" />
              {loading && (
                <Badge className="bg-secondary/60 text-muted-foreground border-border/30 text-[10px] px-1.5 flex-shrink-0">
                  Loading
                </Badge>
              )}
              {!loading && !error && data && (
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 flex-shrink-0">
                  200 OK
                </Badge>
              )}
              {error && !loading && (
                <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px] px-1.5 flex-shrink-0">
                  Error
                </Badge>
              )}
            </div>

            {/* JSON body */}
            <div className="p-5 overflow-auto max-h-[420px] min-h-[200px] flex items-start">
              {loading && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm m-auto">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Fetching live data...
                </div>
              )}
              {error && !loading && (
                <div className="text-red-400 text-sm font-mono m-auto">// Error: {error}</div>
              )}
              {!loading && !error && data && <SyntaxHighlight json={data} />}
            </div>
          </div>

          {/* Status pills */}
          {data && !loading && !error && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    data.status === "Pass" ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                Status: {data.status}
              </div>
              {data.users && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {data.users.length} users reviewed
                </div>
              )}
              {data.summary && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {data.summary}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}