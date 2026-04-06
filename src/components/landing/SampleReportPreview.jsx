import { AlertCircle, CheckCircle2, AlertTriangle, Download } from "lucide-react";

export default function SampleReportPreview() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-2xl shadow-black/30">
      {/* Report Header */}
      <div className="px-6 py-5 border-b border-border/40 bg-secondary/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
              Sample Report
            </p>
            <h3 className="text-lg font-bold">Azure AD Access Review</h3>
            <p className="text-xs text-muted-foreground mt-1">Generated: 2026-04-06 • Reviewed by: SOC 2 Auditor</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-border/40 bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="px-6 py-5 border-b border-border/40">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Executive Summary</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/40 bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Users</p>
            <p className="text-xl font-bold">487</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">Critical Findings</p>
            <p className="text-xl font-bold text-red-400">12</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">Review Required</p>
            <p className="text-xl font-bold text-amber-400">34</p>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="px-6 py-5 border-b border-border/40">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Key Findings</p>
        <div className="space-y-3">
          {[
            {
              icon: AlertCircle,
              color: "text-red-400 bg-red-500/10 border-red-500/30",
              severity: "Critical",
              title: "Global Administrators without MFA",
              count: "6 users",
            },
            {
              icon: AlertTriangle,
              color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
              severity: "Warning",
              title: "Guest users with active assignments",
              count: "8 users",
            },
            {
              icon: AlertTriangle,
              color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
              severity: "Warning",
              title: "Stale identities (90+ days inactive)",
              count: "18 users",
            },
          ].map((finding, i) => {
            const Icon = finding.icon;
            return (
              <div key={i} className={`flex gap-3 rounded-lg border ${finding.color} p-3`}>
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-0.5">
                    {finding.severity}: {finding.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{finding.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-6 py-5 border-b border-border/40">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Recommendations</p>
        <div className="space-y-2">
          {[
            "Enforce MFA on all Global Administrator accounts by Q2 2026",
            "Audit and revoke guest user assignments for inactive projects",
            "Implement automated removal of identities inactive for 90+ days",
            "Review and document all privileged account justifications",
          ].map((rec, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-secondary/20 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground text-center">
          This report was generated using EvidenceOS Sandbox API and is suitable for SOC 2, ISO 27001, and internal audit use.
        </p>
      </div>
    </div>
  );
}