import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Shield, Zap, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const FREE_FEATURES = [
  "100 API calls / day",
  "Demo endpoints only",
  "JSON export",
  "Community support",
];

const PRO_FEATURES = [
  "10,000 API calls / day",
  "Live Google Workspace integration",
  "Live GitHub integration",
  "Live AWS IAM integration",
  "Live Okta integration",
  "Timestamped audit-ready reports",
  "Priority support",
];

export default function Pricing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me();
      setUser(me);

      // Handle checkout success redirect
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "success" && me) {
        // Update plan to pro after successful checkout
        const users = await base44.entities.User.filter({ email: me.email });
        if (users[0] && users[0].plan !== "pro") {
          await base44.auth.updateMe({ plan: "pro" });
          setUser({ ...me, plan: "pro" });
          setSuccessMsg("🎉 Welcome to Pro! Your plan has been upgraded.");
        }
        window.history.replaceState({}, "", "/pricing");
      }

      setLoading(false);
    };
    init();
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    const res = await base44.functions.invoke("createCheckoutSession", {
      success_url: `${window.location.origin}/pricing?checkout=success`,
      cancel_url: `${window.location.origin}/pricing`,
    });
    window.location.href = res.data.url;
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    const res = await base44.functions.invoke("createPortalSession", {});
    window.location.href = res.data.url;
  };

  const plan = user?.plan || "free";

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free with demo endpoints. Upgrade to Pro for live integrations and higher limits.
          </p>
          {successMsg && (
            <div className="mt-6 inline-block px-5 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium text-sm">
              {successMsg}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`rounded-2xl border p-8 flex flex-col ${plan === "free" ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-lg font-semibold">Free</span>
                </div>
                {plan === "free" && <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">Current plan</Badge>}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground ml-1.5 text-sm">/ month</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button variant="outline" disabled={plan === "free"} className="w-full">
                {plan === "free" ? "Current plan" : "Downgrade to Free"}
              </Button>
            </div>

            {/* Pro Plan */}
            <div className={`rounded-2xl border p-8 flex flex-col relative overflow-hidden ${plan === "pro" ? "border-primary/60 bg-primary/5" : "border-primary/30 bg-card"}`}>
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold">Most Popular</Badge>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg font-semibold">Pro</span>
                </div>
                {plan === "pro" && <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">Current plan</Badge>}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold">$29</span>
                <span className="text-muted-foreground ml-1.5 text-sm">/ month</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan === "pro" ? (
                <Button
                  variant="outline"
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="w-full gap-2"
                >
                  {portalLoading ? "Loading..." : "Manage subscription"}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button onClick={handleUpgrade} disabled={upgrading} className="w-full font-semibold">
                  {upgrading ? "Redirecting to Stripe..." : "Upgrade to Pro — $29/mo"}
                </Button>
              )}
            </div>
          </div>
        )}

        {plan === "pro" && (
          <p className="text-center text-xs text-muted-foreground mt-6">
            To cancel or update payment details, use the{" "}
            <button onClick={handlePortal} className="text-primary underline underline-offset-2">Stripe Customer Portal</button>.
          </p>
        )}
      </div>
    </div>
  );
}