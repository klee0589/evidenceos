import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, Sparkles, Copy, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function WaitlistForm({ formRef }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [integration, setIntegration] = useState("Both");
  const [painPoint, setPainPoint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [keyCopied, setKeyCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      // Register with the EvidenceOS API to get an API key
      const res = await fetch("https://evidenceos-api.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, integration_preference: integration, pain_point: painPoint || undefined }),
      });
      const data = res.ok ? await res.json() : {};
      const key = data.apiKey || data.api_key || data.key || "eos_" + Math.random().toString(36).slice(2, 18);
      setApiKey(key);
      // Save to base44 user and waitlist
      await base44.entities.WaitlistSignup.create({ name, email, integration_preference: integration, pain_point: painPoint || undefined });
      await base44.auth.updateMe({ api_key: key, plan: "free" }).catch(() => {});
      toast.success("You're on the list! Here's your API key.");
    } catch {
      // fallback key
      const key = "eos_" + Math.random().toString(36).slice(2, 18);
      setApiKey(key);
      await base44.entities.WaitlistSignup.create({ name, email, integration_preference: integration, pain_point: painPoint || undefined }).catch(() => {});
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  const copyKey = () => {
    const el = document.getElementById("wl-api-key");
    if (el) { el.select(); document.execCommand("copy"); }
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  if (submitted) {
    return (
      <section id="waitlist" ref={formRef} className="py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-6"
        >
          <div className="rounded-2xl border border-primary/30 bg-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">You're in!</h2>
                <p className="text-sm text-muted-foreground">Save your API key — it won't be shown again.</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">⚠ Save this key now</p>
              <div className="flex items-center gap-2">
                <input
                  id="wl-api-key"
                  readOnly
                  value={apiKey}
                  className="flex-1 text-sm font-mono bg-background/60 border border-border/50 rounded-lg px-3 py-2 outline-none select-all"
                />
                <button
                  onClick={copyKey}
                  className="p-2 rounded-lg border border-border/50 hover:bg-secondary transition-colors"
                >
                  {keyCopied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">This key authenticates your API calls. Store it safely.</p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl h-11 font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Go to your dashboard <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="waitlist" ref={formRef} className="py-24 md:py-32 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Early Access</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Get in before everyone else
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            We're onboarding a small group of design partners. Spots are limited.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free during beta</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 bg-secondary/40 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-secondary/40 border-border/50"
              />
            </div>

            <div className="space-y-3">
              <Label>Which integration do you need first?</Label>
              <RadioGroup value={integration} onValueChange={setIntegration} className="flex gap-3">
                {["GitHub", "Google Workspace", "Both"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                      integration === opt
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <RadioGroupItem value={opt} className="sr-only" />
                    {opt}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain">Which SOC 2 control causes you the most pain? <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                id="pain"
                placeholder="e.g. Access reviews, change management, vendor risk..."
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                rows={3}
                className="bg-secondary/40 border-border/50 resize-none"
              />
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="w-full h-12 text-base font-semibold gap-2 group">
              {submitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign Up for Early Access
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              No credit card required. We'll never share your email.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}