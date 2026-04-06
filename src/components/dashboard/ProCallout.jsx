import { Zap, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const BENEFITS = [
  "10,000 API calls per day",
  "Live Google Workspace integration",
  "Live GitHub integration",
  "Live AWS IAM integration",
  "Live Okta integration",
  "Timestamped audit-ready reports",
  "Priority support",
];

export default function ProCallout() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-8 flex flex-col md:flex-row items-start gap-8"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg">Unlock Pro</span>
        </div>
        <p className="text-muted-foreground text-sm mb-5 max-w-md leading-relaxed">
          You're on the Free plan with 100 API calls/day and demo data only. Upgrade to Pro for live integrations across all your systems and 100× the API limit.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <Link to="/pricing">
          <Button className="font-semibold gap-2">
            <Zap className="w-4 h-4" /> Upgrade to Pro — $29/mo
          </Button>
        </Link>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-primary/5 border border-primary/20 min-w-[160px]">
        <p className="text-5xl font-extrabold text-primary">$29</p>
        <p className="text-sm text-muted-foreground mt-1">per month</p>
        <p className="text-xs text-muted-foreground mt-3">Cancel anytime</p>
      </div>
    </motion.section>
  );
}