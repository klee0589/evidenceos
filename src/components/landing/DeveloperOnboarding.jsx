import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Play, Zap } from "lucide-react";
import { toast } from "sonner";

const SYSTEMS = ["google-workspace", "github", "aws", "okta"];
const API_BASE = "https://evidenceos-api.onrender.com/api/demo";

export default function DeveloperOnboarding() {
  const [selectedSystem, setSelectedSystem] = useState("okta");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [gettingKey, setGettingKey] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const tryAPI = async () => {
    setLoading(true);
    setResponse(null);
    setResponseTime(null);
    const start = performance.now();
    try {
      const url = selectedSystem === "google-workspace"
        ? `${API_BASE}/access-review`
        : `${API_BASE}/access-review?system=${selectedSystem}`;
      const res = await fetch(url, { mode: "cors" });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setResponse(data);
      setResponseTime(elapsed);
    } catch (e) {
      toast.error("Failed to fetch response");
    } finally {
      setLoading(false);
    }
  };

  const getAPIKey = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }
    setGettingKey(true);
    try {
      // Generate key locally for demo
      const key = "eos_" + Array.from(crypto.getRandomValues(new Uint8Array(20)))
        .map(b => b.toString(16).padStart(2, "0")).join("");
      setApiKey(key);
      toast.success("API key generated!");
    } catch (e) {
      toast.error("Failed to generate key");
    } finally {
      setGettingKey(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("Key copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCommand = `curl -X GET "https://evidenceos-api.onrender.com/api/demo/access-review?system=${selectedSystem}" \\
  -H "X-API-Key: ${apiKey}"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    toast.success("Command copied");
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Developer Onboarding</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Try It. Get a Key. Make Your First Call.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
            No setup required. No real integrations needed. Everything inline.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* TRY IT LIVE */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Try It Live</h3>
            </div>

            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Select System</label>
                <select
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border/60 bg-secondary/40 text-sm text-foreground outline-none focus:border-primary/40"
                >
                  {SYSTEMS.map((sys) => (
                    <option key={sys} value={sys}>
                      {sys.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={tryAPI} disabled={loading} className="gap-2">
                <Play className="w-4 h-4" />
                {loading ? "Running..." : "Run Request"}
              </Button>
            </div>

            {response && (
              <div className="mt-4 p-4 rounded-lg bg-secondary/40 border border-border/40 font-mono text-xs leading-relaxed overflow-x-auto max-h-48 overflow-y-auto">
                <pre className="text-foreground/70">
                  {JSON.stringify(response, null, 2).substring(0, 500)}
                  {JSON.stringify(response, null, 2).length > 500 && "..."}
                </pre>
                {responseTime && (
                  <p className="text-muted-foreground mt-2 text-[10px]">Response: {responseTime}ms</p>
                )}
              </div>
            )}
          </div>

          {/* GET API KEY */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold">Get Your API Key</h3>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-border/60 bg-secondary/40 text-sm text-foreground outline-none focus:border-primary/40 placeholder:text-muted-foreground/50"
                />
              </div>
              <Button onClick={getAPIKey} disabled={gettingKey || !email} variant="secondary">
                {gettingKey ? "Generating..." : "Get API Key"}
              </Button>
            </div>

            {apiKey && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Your API Key</p>
                    <code className="text-sm font-mono text-foreground break-all">{apiKey}</code>
                  </div>
                  <Button
                    onClick={handleCopyKey}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* NEXT STEP */}
          {apiKey && (
            <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
              <h3 className="text-lg font-semibold">Make Your First Call</h3>
              <div className="p-4 rounded-lg bg-[hsl(222,50%,5%)] border border-border/40 font-mono text-xs leading-relaxed overflow-x-auto">
                <pre className="text-foreground/80 whitespace-pre-wrap break-words">
                  <span className="text-foreground">{curlCommand}</span>
                </pre>
              </div>
              <Button
                onClick={handleCopyCurl}
                variant="outline"
                size="sm"
                className="w-full justify-center gap-2"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Command
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Paste into your terminal or import into Postman
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}