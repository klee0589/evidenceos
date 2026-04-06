import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, ShieldCheck, Download, CheckCircle2, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const SYSTEMS = [
  { id: "google_workspace", label: "Google Workspace", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  { id: "github", label: "GitHub", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { id: "aws", label: "AWS IAM", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", pro: true },
  { id: "okta", label: "Okta", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", pro: true },
];

const BASE_URL = "https://evidenceos-api.onrender.com";

export default function QuickStart({ plan, apiKey }) {
  const [step, setStep] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectSystem = (sys) => {
    if (sys.pro && plan !== "pro") return;
    setSelectedSystem(sys);
    base44.analytics.track({ eventName: "quickstart_system_selected", properties: { system: sys.id } });
    setStep(1);
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/demo/access-review?system=${selectedSystem.id}`, {
        headers: { "x-api-key": apiKey },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setStep(2);
      base44.analytics.track({ eventName: "quickstart_api_called", properties: { system: selectedSystem.id } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evidenceos-${selectedSystem?.id}-access-review.json`;
    a.click();
    base44.analytics.track({ eventName: "quickstart_report_downloaded", properties: { system: selectedSystem?.id } });
  };

  const STEPS = [
    { icon: Cloud, label: "Select a system", done: step > 0 },
    { icon: ShieldCheck, label: "Fetch access review", done: step > 1 },
    { icon: Download, label: "Download report", done: false },
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Quick Start</p>
        <h2 className="text-2xl font-bold">Get your first access review in 3 steps</h2>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              i === step ? "bg-primary/10 border-primary/30 text-primary" :
              s.done ? "bg-secondary border-border/40 text-muted-foreground line-through" :
              "bg-secondary/50 border-border/30 text-muted-foreground/60"
            }`}>
              {s.done ? <CheckCircle2 className="w-3 h-3 text-primary" /> : <span>{i + 1}</span>}
              {s.label}
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Select system */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="text-sm text-muted-foreground mb-4">Choose a SaaS system to run an access review against:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  onClick={() => selectSystem(sys)}
                  disabled={sys.pro && plan !== "pro"}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    sys.pro && plan !== "pro"
                      ? "border-border/30 bg-secondary/20 opacity-50 cursor-not-allowed"
                      : `${sys.bg} hover:scale-[1.02] cursor-pointer`
                  }`}
                >
                  {sys.pro && plan !== "pro" && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className={`text-sm font-semibold ${sys.color}`}>{sys.label}</span>
                  {sys.pro && (
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Pro only</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Fetch */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl border border-border/60 bg-card">
            <p className="text-sm text-muted-foreground mb-1">Ready to query</p>
            <p className="text-base font-semibold mb-4">
              Fetching access review for <span className={selectedSystem?.color}>{selectedSystem?.label}</span>
            </p>
            <code className="block text-xs font-mono bg-secondary/60 px-3 py-2 rounded-lg text-muted-foreground mb-5">
              GET {BASE_URL}/api/demo/access-review?system={selectedSystem?.id}
            </code>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={fetchReport} disabled={loading} className="font-medium">
                {loading ? "Fetching..." : "Run API Call"}
              </Button>
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Results */}
        {step === 2 && result && (
          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="font-semibold text-primary">Access review complete!</p>
            </div>
            <pre className="text-xs font-mono bg-background/60 border border-border/40 rounded-xl p-4 overflow-auto max-h-60 text-foreground mb-5">
              {JSON.stringify(result, null, 2)}
            </pre>
            <div className="flex gap-3">
              <Button onClick={downloadReport} className="font-medium gap-2">
                <Download className="w-4 h-4" /> Download Report
              </Button>
              <Button variant="outline" onClick={() => { setStep(0); setResult(null); setSelectedSystem(null); }}>
                Start over
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}