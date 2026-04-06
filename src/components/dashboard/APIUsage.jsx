import { useEffect, useState } from "react";
import { RefreshCw, Zap, Clock, AlertTriangle, Activity } from "lucide-react";

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-secondary/40 border border-border/40 px-4 py-3 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
}

function TableSection({ title, rows, cols }) {
  if (!rows?.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
      <div className="rounded-xl border border-border/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/30">
              {cols.map((c) => (
                <th key={c.key} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors">
                {cols.map((c) => (
                  <td key={c.key} className="px-4 py-2.5 font-mono text-xs text-foreground/80">
                    {c.format ? c.format(row[c.key]) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function buildMockData(plan) {
  const limit = plan === "pro" ? 10000 : 100;
  const calls = Math.floor(Math.random() * limit * 0.4);
  const remaining = limit - calls;
  const now = new Date();
  const resetsAt = new Date(now);
  resetsAt.setUTCHours(24, 0, 0, 0);

  const systems = ["google-workspace", "github", "aws", "okta", "azure-ad", "salesforce"];
  const bySystem = systems.slice(0, 4).map(s => ({
    system: s,
    calls: Math.floor(Math.random() * (calls / 3)),
    errors: Math.floor(Math.random() * 2),
    avg_ms: 80 + Math.random() * 120,
  }));

  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayCalls = i === 6 ? calls : Math.floor(Math.random() * limit * 0.3);
    return {
      date: d.toISOString().slice(0, 10),
      calls: dayCalls,
      errors: Math.floor(Math.random() * 3),
      avg_ms: 80 + Math.random() * 100,
    };
  });

  const totalCalls = daily.reduce((s, d) => s + d.calls, 0);
  const totalErrors = daily.reduce((s, d) => s + d.errors, 0);

  return {
    today: { calls, remaining, limit, resetsAt: resetsAt.toISOString() },
    period: { totalCalls, totalErrors, avgResponseMs: 95 + Math.random() * 40 },
    bySystem,
    byEndpoint: [
      { endpoint: "/api/demo/access-review", calls: Math.floor(calls * 0.8), errors: totalErrors, avg_ms: 90 },
      { endpoint: "/api/usage", calls: Math.floor(calls * 0.2), errors: 0, avg_ms: 45 },
    ],
    daily,
  };
}

export default function APIUsage({ apiKey, plan }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsage = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setTimeout(() => {
      setData(buildMockData(plan));
      setLoading(false);
      setRefreshing(false);
    }, 600);
  };

  useEffect(() => { fetchUsage(); }, [plan]);

  const today = data?.today || {};
  const period = data?.period || {};
  const pct = today.limit ? Math.min(100, Math.round((today.calls / today.limit) * 100)) : 0;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">API Usage</p>
          <h2 className="text-2xl font-bold">Usage & Analytics</h2>
        </div>
        <button
          onClick={() => fetchUsage(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border/50 hover:bg-secondary"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-6">
        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground py-6">
            <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
            <span className="text-sm">Fetching usage data…</span>
          </div>
        ) : (
          <>
            {/* Today */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" /> Today
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatCard label="Calls used" value={today.calls?.toLocaleString() ?? "—"} />
                <StatCard label="Remaining" value={today.remaining?.toLocaleString() ?? "—"} />
                <StatCard label="Daily limit" value={today.limit?.toLocaleString() ?? "—"} sub={plan === "pro" ? "Pro plan" : "Free plan"} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{pct}% used</span>
                  {today.resetsAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Resets {new Date(today.resetsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-primary"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Period summary */}
            {(period.totalCalls != null) && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" /> Period Summary
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Total calls" value={period.totalCalls?.toLocaleString() ?? "—"} />
                  <StatCard label="Total errors" value={period.totalErrors?.toLocaleString() ?? "—"} />
                  <StatCard label="Avg response" value={period.avgResponseMs != null ? `${Math.round(period.avgResponseMs)}ms` : "—"} />
                </div>
              </div>
            )}

            {/* By System */}
            <TableSection
              title="By System"
              rows={data?.bySystem}
              cols={[
                { key: "system", label: "System" },
                { key: "calls", label: "Calls", format: (v) => v?.toLocaleString() },
                { key: "errors", label: "Errors", format: (v) => v?.toLocaleString() },
                { key: "avg_ms", label: "Avg ms", format: (v) => v != null ? `${Math.round(v)}ms` : "—" },
              ]}
            />

            {/* By Endpoint */}
            <TableSection
              title="By Endpoint"
              rows={data?.byEndpoint}
              cols={[
                { key: "endpoint", label: "Endpoint" },
                { key: "calls", label: "Calls", format: (v) => v?.toLocaleString() },
                { key: "errors", label: "Errors", format: (v) => v?.toLocaleString() },
                { key: "avg_ms", label: "Avg ms", format: (v) => v != null ? `${Math.round(v)}ms` : "—" },
              ]}
            />

            {/* Daily breakdown */}
            {data?.daily?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-primary" /> Daily Breakdown
                </p>
                <div className="space-y-1.5">
                  {data.daily.map((d, i) => {
                    const dayPct = today.limit ? Math.min(100, Math.round((d.calls / today.limit) * 100)) : 0;
                    return (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground w-24 flex-shrink-0 font-mono">{d.date}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${dayPct}%` }} />
                        </div>
                        <span className="text-foreground/70 w-16 text-right">{d.calls?.toLocaleString()} calls</span>
                        {d.errors > 0 && <span className="text-red-400 w-14 text-right">{d.errors} err</span>}
                        {d.avg_ms != null && <span className="text-muted-foreground/60 w-14 text-right">{Math.round(d.avg_ms)}ms</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}