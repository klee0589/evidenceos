import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal, ChevronRight, RefreshCw, Download, Settings2, X } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const BASE_URL = "https://evidenceos-api.onrender.com/api/demo";

const SYSTEMS = [
  { label: "Google Workspace", key: "google-workspace", live: true },
  { label: "GitHub", key: "github", live: true },
  { label: "AWS", key: "aws", live: true },
  { label: "Okta", key: "okta", live: true },
  { label: "Azure AD", key: "azure-ad", live: false },
  { label: "Salesforce", key: "salesforce", live: false },
  { label: "Jira", key: "jira", live: false },
  { label: "ServiceNow", key: "servicenow", live: false },
];

const STATUS_COLORS = {
  Pass: "text-emerald-400",
  Warning: "text-amber-400",
  Fail: "text-red-400",
};

function generateMockData(system, userCount, status, note) {
  const ts = new Date().toISOString();
  const flagged = status === "Pass" ? 0 : status === "Warning" ? Math.ceil(userCount * 0.2) : Math.ceil(userCount * 0.5);

  const usersBySystem = {
    "google-workspace": Array.from({ length: userCount }, (_, i) => ({
      email: `user${i + 1}@company.com`,
      role: i === 0 ? "Owner" : i < 3 ? "Admin" : "Member",
      flag: i < flagged ? (i % 2 === 0 ? "excess_perms" : "inactive_90d") : null,
      ...(note && i === 0 ? { note } : {}),
    })).filter(u => u),
    "github": Array.from({ length: userCount }, (_, i) => ({
      login: `dev-${i + 1}`,
      role: i === 0 ? "owner" : "member",
      mfa: i >= flagged,
      ...(note && i === 0 ? { note } : {}),
    })),
    "aws": Array.from({ length: userCount }, (_, i) => ({
      iam_user: `iam-user-${i + 1}`,
      policies: i < flagged ? ["AdministratorAccess"] : ["ReadOnlyAccess"],
      mfa_active: i >= flagged,
      ...(note && i === 0 ? { note } : {}),
    })),
    "okta": Array.from({ length: userCount }, (_, i) => ({
      login: `user${i + 1}@company.com`,
      status: i < flagged ? "STAGED" : "ACTIVE",
      mfa_enrolled: i >= flagged,
      ...(note && i === 0 ? { note } : {}),
    })),
    "azure-ad": Array.from({ length: userCount }, (_, i) => ({
      upn: `user${i + 1}@tenant.onmicrosoft.com`,
      role: i === 0 ? "Global Administrator" : i < 3 ? "Security Reader" : "User",
      mfa_registered: i >= flagged,
      guest: i === userCount - 1,
      ...(note && i === 0 ? { note } : {}),
    })),
    "salesforce": Array.from({ length: userCount }, (_, i) => ({
      username: `user${i + 1}@company.salesforce.com`,
      profile: i === 0 ? "System Administrator" : i < 3 ? "Sales Manager" : "Standard User",
      last_login_days_ago: i < flagged ? 95 + i * 10 : i * 5,
      flag: i < flagged ? "inactive_90d" : null,
      ...(note && i === 0 ? { note } : {}),
    })),
    "jira": Array.from({ length: userCount }, (_, i) => ({
      account_id: `aid-${(Math.random() * 1e8 | 0).toString(16)}`,
      display_name: `User ${i + 1}`,
      project_roles: i === 0 ? ["Administrator"] : ["Developer"],
      active: i >= flagged,
      ...(note && i === 0 ? { note } : {}),
    })),
    "servicenow": Array.from({ length: userCount }, (_, i) => ({
      sys_id: `sn-${i + 1}`,
      user_name: `user.${i + 1}`,
      roles: i === 0 ? ["admin", "itil"] : ["itil"],
      locked_out: i < flagged,
      ...(note && i === 0 ? { note } : {}),
    })),
  };

  const users = usersBySystem[system] || usersBySystem["google-workspace"];
  const summaryMap = {
    Pass: `${userCount} users reviewed, 0 violations`,
    Warning: `${flagged} of ${userCount} users flagged for review`,
    Fail: `${flagged} critical violations detected across ${userCount} users`,
  };

  return {
    status,
    summary: summaryMap[status],
    timestamp: ts,
    system,
    total_users: userCount,
    flagged,
    users,
  };
}

function SyntaxHighlight({ json }) {
  const text = JSON.stringify(json, null, 2);
  const highlighted = text
    .replace(/"([^"]+)":/g, '<span class="text-sky-400">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
    .replace(/: (true|false)/g, ': <span class="text-amber-400">$1</span>')
    .replace(/: (\d+)/g, ': <span class="text-violet-400">$1</span>');
  return (
    <pre
      className="text-sm leading-relaxed font-mono whitespace-pre-wrap break-words"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

export default function APIDemo() {
  const [activeSystem, setActiveSystem] = useState(SYSTEMS[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  // Customization controls (session-only)
  const [customUserCount, setCustomUserCount] = useState(8);
  const [customStatus, setCustomStatus] = useState("Warning");
  const [customNote, setCustomNote] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const isLiveSystem = activeSystem.live && !useCustom;

  const fetchData = useCallback(async (system) => {
    setLoading(true);
    setError(null);
    setData(null);
    base44.analytics.track({ eventName: "api_demo_system_toggle", properties: { system: system.key } });

    if (!system.live || useCustom) {
      // Generate mock locally
      await new Promise(r => setTimeout(r, 400)); // simulate latency
      setData(generateMockData(system.key, customUserCount, customStatus, customNote));
      setLoading(false);
      return;
    }

    const url = system.key === "google-workspace"
      ? `${BASE_URL}/access-review`
      : `${BASE_URL}/access-review?system=${system.key}`;
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [useCustom, customUserCount, customStatus, customNote]);

  useEffect(() => {
    fetchData(activeSystem).catch((e) => {
      setError(e.message);
      setLoading(false);
    });
  }, [activeSystem, fetchData]);

  const applyCustom = () => {
    setUseCustom(true);
    setShowCustomize(false);
    base44.analytics.track({ eventName: "api_demo_custom_apply", properties: { system: activeSystem.key, status: customStatus, userCount: customUserCount } });
  };

  const resetCustom = () => {
    setUseCustom(false);
    setShowCustomize(false);
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success("Copied to clipboard");
    base44.analytics.track({ eventName: "api_demo_copy", properties: { system: activeSystem.key } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evidenceos-${activeSystem.key}-access-review.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    toast.success("Evidence package downloaded");
    base44.analytics.track({ eventName: "api_demo_download", properties: { system: activeSystem.key } });
    setTimeout(() => setDownloaded(false), 2000);
  };

  const actionsDisabled = loading || !data;
  const statusColor = data ? STATUS_COLORS[data.status] || "text-muted-foreground" : "";

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Live API Sandbox</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Try the API — 8 systems, zero setup
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Select a system, customize mock data, and download an audit-ready JSON report in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-[hsl(222,50%,5%)] shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-[hsl(222,44%,7%)]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="ml-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="font-mono">response.json</span>
                  {useCustom && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30">custom mock</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowCustomize(v => !v)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                  <Settings2 className="w-3.5 h-3.5 mr-1" /> Customize
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopy} disabled={actionsDisabled}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" aria-label="Copy JSON">
                  {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload} disabled={actionsDisabled}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" aria-label="Download report">
                  {downloaded ? <Check className="w-3.5 h-3.5 mr-1" /> : <Download className="w-3.5 h-3.5 mr-1" />}
                  {downloaded ? "Saved" : "Download"}
                </Button>
              </div>
            </div>

            {/* Customize panel */}
            {showCustomize && (
              <div className="px-5 py-4 border-b border-border/40 bg-[hsl(222,44%,8%)] space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Customize Mock Data</p>
                  <button onClick={() => setShowCustomize(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Users ({customUserCount})</label>
                    <input
                      type="range" min={3} max={20} value={customUserCount}
                      onChange={e => setCustomUserCount(Number(e.target.value))}
                      className="w-full accent-primary h-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                    <div className="flex gap-2">
                      {["Pass", "Warning", "Fail"].map(s => (
                        <button key={s} onClick={() => setCustomStatus(s)}
                          className={`flex-1 text-xs py-1 rounded-lg border transition-colors ${
                            customStatus === s
                              ? s === "Pass" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : s === "Warning" ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                                : "bg-red-500/20 border-red-500/40 text-red-400"
                              : "border-border/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Custom note</label>
                    <input
                      type="text" value={customNote} onChange={e => setCustomNote(e.target.value)}
                      placeholder="e.g. reviewed by security team"
                      className="w-full text-xs bg-secondary/50 border border-border/40 rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={applyCustom} className="h-7 text-xs font-medium">Apply</Button>
                  {useCustom && (
                    <Button size="sm" variant="ghost" onClick={resetCustom} className="h-7 text-xs text-muted-foreground">Reset to live</Button>
                  )}
                </div>
              </div>
            )}

            {/* System toggle */}
            <div className="px-5 py-3 border-b border-border/30 flex items-center gap-2 flex-wrap">
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.key}
                  onClick={() => setActiveSystem(sys)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSystem.key === sys.key
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                  }`}
                >
                  {sys.label}
                  {!sys.live && (
                    <span className="ml-1 text-[9px] text-muted-foreground/60">mock</span>
                  )}
                </button>
              ))}
            </div>

            {/* Request line */}
            <div className="px-5 py-2.5 border-b border-border/20 flex items-center gap-2 text-xs font-mono overflow-hidden">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold px-1.5 flex-shrink-0">
                GET
              </Badge>
              <span className="text-muted-foreground truncate">
                /api/demo/access-review
                {activeSystem.key !== "google-workspace" && (
                  <span>?system=<span className="text-foreground">{activeSystem.key}</span></span>
                )}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto flex-shrink-0" />
              {loading && <Badge className="bg-secondary/60 text-muted-foreground border-border/30 text-[10px] px-1.5 flex-shrink-0">Loading</Badge>}
              {!loading && !error && data && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 flex-shrink-0">200 OK</Badge>}
              {error && !loading && <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px] px-1.5 flex-shrink-0">Error</Badge>}
            </div>

            {/* JSON body */}
            <div className="p-5 overflow-auto max-h-[420px] min-h-[200px] flex items-start">
              {loading && (
                <pre className="text-sm font-mono text-muted-foreground m-auto flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin inline-block" /> // Fetching data...
                </pre>
              )}
              {error && !loading && (
                <pre className="text-sm font-mono text-red-400 m-auto">// Error: {error}</pre>
              )}
              {!loading && !error && data && <SyntaxHighlight json={data} />}
            </div>
          </div>

          {/* Status pills */}
          {data && !loading && !error && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className={`flex items-center gap-2 text-xs bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40 ${statusColor}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${data.status === "Pass" ? "bg-emerald-400" : data.status === "Fail" ? "bg-red-400" : "bg-amber-400"}`} />
                Status: {data.status}
              </div>
              {data.users && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {data.users.length} users reviewed
                </div>
              )}
              {data.flagged > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {data.flagged} flagged
                </div>
              )}
              {data.summary && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5 border border-border/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {data.summary}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}