import { Shield, Zap, Copy, Check, LogOut, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { base44 } from "@/api/base44Client";

const API_LIMITS = { free: 100, pro: 10000 };

export default function DashboardHeader({ user, plan }) {
  const [copied, setCopied] = useState(false);
  const apiKey = user?.api_key || "";
  const limit = API_LIMITS[plan] || 100;

  const copyKey = () => {
    const el = document.getElementById("api-key-input");
    if (el) {
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Evidence<span className="text-primary">OS</span>
            </span>
          </Link>
          <span className="text-muted-foreground/40 hidden md:block">|</span>
          <span className="text-sm text-muted-foreground hidden md:block">
            Welcome back, <span className="text-foreground font-medium">{user?.full_name || user?.email}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Plan badge */}
          <Badge className={plan === "pro"
            ? "bg-primary text-primary-foreground gap-1.5"
            : "bg-secondary text-muted-foreground border-border gap-1.5"
          }>
            {plan === "pro" ? <Zap className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
            {plan === "pro" ? "Pro" : "Free"} · {limit.toLocaleString()} calls/day
          </Badge>

          {/* API Key */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-secondary/50 overflow-hidden">
            <Key className="w-3 h-3 text-muted-foreground ml-2.5 flex-shrink-0" />
            <input
              id="api-key-input"
              readOnly
              value={apiKey}
              className="text-xs font-mono bg-transparent text-foreground px-2 py-1.5 w-48 outline-none select-all cursor-text"
            />
            <button
              onClick={copyKey}
              className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-secondary transition-colors border-l border-border/60"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </div>

          {plan !== "pro" && (
            <Link to="/pricing">
              <Button size="sm" className="font-medium gap-1.5 h-8">
                <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
              </Button>
            </Link>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1.5 text-muted-foreground"
            onClick={() => base44.auth.logout("/")}
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}