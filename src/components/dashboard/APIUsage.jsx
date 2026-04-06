import { useEffect, useState } from "react";
import { BarChart2, RefreshCw, Zap } from "lucide-react";

const API_BASE = "https://evidenceos-api.onrender.com";
const PLAN_LIMITS = { free: 100, pro: 10000 };

export default function APIUsage({ apiKey, plan }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsage = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/usage`, {
        headers: { "x-api-key": apiKey },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsage(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (apiKey) fetchUsage();
  }, [apiKey]);

  const limit = PLAN_LIMITS[plan] || 100;
  const used = usage?.calls_today ?? usage?.used ?? usage?.count ?? 0;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const remaining = Math.max(0, limit - used);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">API Usage</p>
          <h2 className="text-2xl font-bold">Today's call usage</h2>
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

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground py-4">
            <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
            <span className="text-sm">Fetching usage data…</span>
          </div>
        ) : error ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Could not load usage data.{" "}
              <button onClick={() => fetchUsage()} className="text-primary underline underline-offset-2">
                Retry
              </button>
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1 font-mono">{error}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-secondary/40 border border-border/40 px-4 py-3 text-center">
                <p className="text-2xl font-bold">{used.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Used today</p>
              </div>
              <div className="rounded-xl bg-secondary/40 border border-border/40 px-4 py-3 text-center">
                <p className="text-2xl font-bold">{remaining.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Remaining</p>
              </div>
              <div className="rounded-xl bg-secondary/40 border border-border/40 px-4 py-3 text-center">
                <p className="text-2xl font-bold">{limit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Daily limit</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{pct}% used</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {plan === "pro" ? "Pro plan" : "Free plan"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Reset info */}
            <p className="text-xs text-muted-foreground">
              Usage resets daily at midnight UTC.
              {usage?.reset_at && (
                <span className="ml-1">Next reset: <span className="text-foreground">{new Date(usage.reset_at).toLocaleTimeString()}</span></span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}