import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function Navbar({ onWaitlistClick }) {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setPlan(me?.plan || "free");
      }
    });
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Evidence<span className="text-primary">OS</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
          <a href="#demo" className="hover:text-foreground transition-colors">API Demo</a>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <a href="#waitlist" className="hover:text-foreground transition-colors">Early Access</a>
        </div>
        <div className="flex items-center gap-2">
          {plan && (
            <Badge className={plan === "pro" ? "bg-primary text-primary-foreground text-xs" : "bg-secondary text-muted-foreground border-border text-xs"}>
              {plan === "pro" ? "Pro" : "Free"}
            </Badge>
          )}
          <Button size="sm" onClick={onWaitlistClick} className="font-medium">
            Get Free API Key
          </Button>
        </div>
      </div>
    </nav>
  );
}