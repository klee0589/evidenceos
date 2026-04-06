import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

const FREE_FEATURES = [
  { text: "100 API calls / day", included: true },
  { text: "Demo endpoints only", included: true },
  { text: "JSON export", included: true },
  { text: "Community support", included: true },
  { text: "Live Google Workspace integration", included: false },
  { text: "Live GitHub integration", included: false },
  { text: "Live AWS IAM integration", included: false },
  { text: "Live Okta integration", included: false },
];

const PRO_FEATURES = [
  { text: "10,000 API calls / day", included: true },
  { text: "Live Google Workspace integration", included: true },
  { text: "Live GitHub integration", included: true },
  { text: "Live AWS IAM integration", included: true },
  { text: "Live Okta integration", included: true },
  { text: "Timestamped audit-ready reports", included: true },
  { text: "Priority support", included: true },
];

function trackLocal(eventName) {
  try {
    const raw = localStorage.getItem("eos_analytics") || "{}";
    const data = JSON.parse(raw);
    data[eventName] = (data[eventName] || 0) + 1;
    localStorage.setItem("eos_analytics", JSON.stringify(data));
  } catch {}
  base44.analytics.track({ eventName, properties: {} });
}

export default function PricingSection({ user, scrollToWaitlist }) {
  const [upgrading, setUpgrading] = useState(false);
  const plan = user?.plan || null;

  const handleUpgrade = async () => {
    trackLocal("pricing_upgrade_click");
    setUpgrading(true);
    const res = await base44.functions.invoke("createCheckoutSession", {
      success_url: `${window.location.origin}/pricing?checkout=success`,
      cancel_url: `${window.location.origin}/#pricing`,
    });
    window.location.href = res.data.url;
  };

  const handleFreeSignup = () => {
    trackLocal("pricing_free_signup_click");
    scrollToWaitlist();
  };

  return (
    <section id="pricing" className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Start free with demo endpoints. Upgrade to Pro for live integrations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={`rounded-2xl border p-8 flex flex-col ${plan === "free" ? "border-primary/40 bg-primary/5" : "border-[#1e1e2e] bg-[#16161f]"}`}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-lg font-semibold">Free</span>
              {plan === "free" && <Badge className="ml-auto bg-primary/10 text-primary border-primary/30 text-xs">Current plan</Badge>}
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground ml-2 text-sm">/ month</span>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className={`flex items-center gap-2.5 text-sm ${f.included ? "text-muted-foreground" : "text-muted-foreground/40 line-through"}`}>
                  {f.included
                    ? <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    : <X className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                  }
                  {f.text}
                </li>
              ))}
            </ul>
            {plan === "free" ? (
              <Button variant="outline" disabled className="w-full rounded-xl font-semibold">Current plan</Button>
            ) : plan === "pro" ? (
              <Button variant="outline" disabled className="w-full rounded-xl font-semibold opacity-40">Free</Button>
            ) : (
              <Button variant="outline" onClick={handleFreeSignup} className="w-full rounded-xl font-semibold">
                Get Free API Key
              </Button>
            )}
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="rounded-2xl border border-violet-600/60 bg-[#16161f] p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_-8px_rgba(124,58,237,0.35)]"
          >
            <div className="absolute top-4 right-4">
              <Badge className="bg-violet-600 text-white border-0 text-xs font-semibold">Most popular</Badge>
            </div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-lg font-semibold">Pro</span>
              {plan === "pro" && <Badge className="ml-auto bg-violet-500/10 text-violet-400 border-violet-500/30 text-xs">You're on Pro ✓</Badge>}
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$29</span>
              <span className="text-muted-foreground ml-2 text-sm">/ month</span>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  {f.text}
                </li>
              ))}
            </ul>
            {plan === "pro" ? (
              <Button disabled className="w-full rounded-xl font-semibold bg-violet-600 hover:bg-violet-600">You're on Pro ✓</Button>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full rounded-xl font-semibold bg-violet-600 hover:bg-violet-700 text-white"
              >
                {upgrading ? "Redirecting…" : "Upgrade to Pro — $29/mo"}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}