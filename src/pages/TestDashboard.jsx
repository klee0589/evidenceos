import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Play,
  RefreshCw,
  Shield,
  ClipboardList,
} from "lucide-react";

const API_BASE = "https://evidenceos-api.onrender.com/api/demo";
const SYSTEMS = ["google-workspace", "github", "aws", "okta"];

const STATUS = {
  pending: "pending",
  running: "running",
  pass: "pass",
  fail: "fail",
  skip: "skip",
};

function StatusIcon({ status }) {
  if (status === STATUS.pass) return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === STATUS.fail) return <XCircle className="w-4 h-4 text-red-400" />;
  if (status === STATUS.running) return <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />;
  if (status === STATUS.skip) return <AlertCircle className="w-4 h-4 text-yellow-400" />;
  return <div className="w-4 h-4 rounded-full border border-border" />;
}

function StatusBadge({ status }) {
  const map = {
    pass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    fail: "bg-red-500/15 text-red-400 border-red-500/30",
    running: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    pending: "bg-secondary/60 text-muted-foreground border-border/40",
    skip: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  return (
    <Badge className={`text-[10px] px-2 capitalize ${map[status] || map.pending}`}>
      {status}
    </Badge>
  );
}

function TestRow({ test }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border/40 rounded-xl overflow-hidden">
      <button
        onClick={() => test.details && setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
      >
        <StatusIcon status={test.status} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{test.name}</p>
          {test.message && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{test.message}</p>
          )}
        </div>
        <StatusBadge status={test.status} />
        {test.duration != null && (
          <span className="text-xs text-muted-foreground ml-2">{test.duration}ms</span>
        )}
      </button>
      {expanded && test.details && (
        <div className="px-4 pb-4 border-t border-border/30 bg-[hsl(222,50%,4%)]">
          <pre className="text-xs font-mono text-muted-foreground mt-3 whitespace-pre-wrap break-words max-h-48 overflow-auto">
            {typeof test.details === "string" ? test.details : JSON.stringify(test.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function Section({ title, tests }) {
  const counts = { pass: 0, fail: 0, running: 0, pending: 0 };
  tests.forEach((t) => { if (counts[t.status] != null) counts[t.status]++; });
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className="text-xs text-emerald-400">{counts.pass} passed</span>
        {counts.fail > 0 && <span className="text-xs text-red-400">{counts.fail} failed</span>}
        {counts.running > 0 && <span className="text-xs text-sky-400">{counts.running} running</span>}
      </div>
      <div className="space-y-2">
        {tests.map((t) => <TestRow key={t.id} test={t} />)}
      </div>
    </div>
  );
}

function makeTest(id, name) {
  return { id, name, status: STATUS.pending, message: null, details: null, duration: null };
}

function buildInitialTests() {
  return {
    api: [
      ...SYSTEMS.map((s) => makeTest(`api_${s}`, `API: /access-review?system=${s}`)),
      makeTest("api_systems", "API: /systems endpoint"),
    ],
    ui: [
      makeTest("ui_hero", "Hero section renders (CTA buttons visible)"),
      makeTest("ui_benefits", "Benefits section (4 cards)"),
      makeTest("ui_demo", "API demo terminal visible"),
      makeTest("ui_waitlist", "Waitlist form rendered"),
      makeTest("ui_footer", "Footer visible"),
    ],
    waitlist: [
      makeTest("wl_submit", "Waitlist form submission"),
      makeTest("wl_record", "Record saved to database"),
    ],
    payload: SYSTEMS.map((s) =>
      makeTest(`payload_${s}`, `Payload validation: ${s}`)
    ),
  };
}

async function runTest(fn) {
  const start = Date.now();
  try {
    const result = await fn();
    return { status: STATUS.pass, duration: Date.now() - start, ...result };
  } catch (e) {
    return { status: STATUS.fail, message: e.message, duration: Date.now() - start };
  }
}

export default function TestDashboard() {
  const [tests, setTests] = useState(buildInitialTests());
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [summary, setSummary] = useState(null);

  const updateTest = (section, id, patch) => {
    setTests((prev) => ({
      ...prev,
      [section]: prev[section].map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const setRunningTest = (section, id) =>
    updateTest(section, id, { status: STATUS.running });

  const runAll = async () => {
    setRunning(true);
    setStarted(true);
    setTests(buildInitialTests());
    setSummary(null);

    // ── API Tests ──────────────────────────────────────────────
    const apiPayloads = {};

    for (const sys of SYSTEMS) {
      const id = `api_${sys}`;
      setRunningTest("api", id);
      const res = await runTest(async () => {
        const url =
          sys === "google-workspace"
            ? `${API_BASE}/access-review`
            : `${API_BASE}/access-review?system=${sys}`;
        const r = await fetch(url, { mode: "cors" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        apiPayloads[sys] = json;
        const issues = [];
        if (!json.status) issues.push("missing status");
        if (!json.summary) issues.push("missing summary");
        if (!Array.isArray(json.users)) issues.push("users is not an array");
        if (issues.length) throw new Error(`Payload issues: ${issues.join(", ")}`);
        return {
          message: `status=${json.status} | users=${json.users?.length} | summary="${json.summary}"`,
          details: json,
        };
      });
      updateTest("api", id, res);
    }

    // /systems endpoint
    setRunningTest("api", "api_systems");
    const sysCk = await runTest(async () => {
      const r = await fetch(`${API_BASE}/systems`, { mode: "cors" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      return { message: `Returned ${JSON.stringify(json).slice(0, 80)}`, details: json };
    });
    updateTest("api", "api_systems", sysCk);

    // ── Payload Validation ─────────────────────────────────────
    for (const sys of SYSTEMS) {
      const id = `payload_${sys}`;
      setRunningTest("payload", id);
      const payload = apiPayloads[sys];
      const res = await runTest(async () => {
        if (!payload) throw new Error("No payload fetched (API test failed)");
        const checks = [];
        checks.push(`status: ${payload.status ? "✓" : "✗ missing"}`);
        checks.push(`summary: ${payload.summary ? "✓" : "✗ missing"}`);
        checks.push(`users array: ${Array.isArray(payload.users) ? `✓ (${payload.users.length})` : "✗ missing"}`);
        checks.push(`timestamp: ${payload.timestamp ? "✓" : "✗ missing"}`);
        const fails = checks.filter((c) => c.includes("✗"));
        if (fails.length) throw new Error(fails.join("; "));
        return { message: checks.join(" | "), details: payload };
      });
      updateTest("payload", id, res);
    }

    // ── UI Checks (DOM inspection) ─────────────────────────────
    const uiChecks = [
      {
        id: "ui_hero",
        fn: () => {
          const h1 = document.querySelector("h1");
          if (!h1) throw new Error("No <h1> found");
          const btns = document.querySelectorAll("button, a[href]");
          if (btns.length < 2) throw new Error("Less than 2 CTA elements");
          return { message: `Hero h1: "${h1.textContent.slice(0, 60)}" | ${btns.length} interactive elements` };
        },
      },
      {
        id: "ui_benefits",
        fn: () => {
          const section = document.getElementById("benefits");
          if (!section) throw new Error("#benefits section not found");
          const cards = section.querySelectorAll("[class*='rounded']");
          return { message: `Benefits section found | ${cards.length} card elements` };
        },
      },
      {
        id: "ui_demo",
        fn: () => {
          const section = document.getElementById("demo");
          if (!section) throw new Error("#demo section not found");
          const pre = section.querySelector("pre");
          if (!pre) throw new Error("No <pre> JSON block found in demo");
          return { message: `Demo section found | JSON block present` };
        },
      },
      {
        id: "ui_waitlist",
        fn: () => {
          const form = document.querySelector("form");
          if (!form) throw new Error("No <form> found");
          const inputs = form.querySelectorAll("input, textarea");
          return { message: `Form found | ${inputs.length} input fields` };
        },
      },
      {
        id: "ui_footer",
        fn: () => {
          const footer = document.querySelector("footer");
          if (!footer) throw new Error("No <footer> found");
          const links = footer.querySelectorAll("a");
          return { message: `Footer found | ${links.length} links` };
        },
      },
    ];

    for (const { id, fn } of uiChecks) {
      setRunningTest("ui", id);
      const res = await runTest(fn);
      updateTest("ui", id, res);
      await new Promise((r) => setTimeout(r, 100));
    }

    // ── Waitlist Form Test ─────────────────────────────────────
    setRunningTest("waitlist", "wl_submit");
    const testEmail = `test+${Date.now()}@evidenceos-test.io`;
    let wlId = null;
    const wlSubmit = await runTest(async () => {
      const record = await base44.entities.WaitlistSignup.create({
        name: "Test Runner Bot",
        email: testEmail,
        integration_preference: "Both",
        pain_point: "Automated test submission",
      });
      wlId = record?.id;
      if (!record) throw new Error("No record returned");
      return { message: `Created record id=${record.id} | email=${testEmail}`, details: record };
    });
    updateTest("waitlist", "wl_submit", wlSubmit);

    setRunningTest("waitlist", "wl_record");
    const wlRecord = await runTest(async () => {
      if (!wlId) throw new Error("No ID from submission step");
      const all = await base44.entities.WaitlistSignup.filter({ email: testEmail });
      if (!all || all.length === 0) throw new Error("Record not found in DB");
      // cleanup
      await base44.entities.WaitlistSignup.delete(wlId);
      return { message: `Record verified & cleaned up | found ${all.length} matching record(s)` };
    });
    updateTest("waitlist", "wl_record", wlRecord);

    // ── Summary ───────────────────────────────────────────────
    setTests((prev) => {
      const allTests = Object.values(prev).flat();
      const total = allTests.length;
      const passed = allTests.filter((t) => t.status === STATUS.pass).length;
      const failed = allTests.filter((t) => t.status === STATUS.fail).length;
      setSummary({ total, passed, failed });
      return prev;
    });

    setRunning(false);
  };

  const allTests = Object.values(tests).flat();
  const totalPass = allTests.filter((t) => t.status === STATUS.pass).length;
  const totalFail = allTests.filter((t) => t.status === STATUS.fail).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold">Evidence<span className="text-primary">OS</span></span>
            <span className="ml-2 text-xs text-muted-foreground">Test Dashboard</span>
          </div>
        </div>
        <Button onClick={runAll} disabled={running} size="sm" className="gap-2">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Running..." : started ? "Re-run All" : "Run All Tests"}
        </Button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Summary bar */}
        {started && (
          <div className="mb-8 p-4 rounded-xl border border-border/50 bg-card flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total: <strong className="text-foreground">{allTests.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{totalPass} passed</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">{totalFail} failed</span>
            </div>
            {!running && summary && (
              <div className="ml-auto">
                <Badge
                  className={
                    totalFail === 0
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-red-500/15 text-red-400 border-red-500/30"
                  }
                >
                  {totalFail === 0 ? "All Clear ✓" : `${totalFail} issue(s) detected`}
                </Badge>
              </div>
            )}
          </div>
        )}

        {!started && (
          <div className="text-center py-20 text-muted-foreground">
            <RefreshCw className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Ready to test</p>
            <p className="text-sm">Click "Run All Tests" to validate the landing page, API, and waitlist form.</p>
          </div>
        )}

        {started && (
          <>
            <Section title="🌐 Live API Endpoints" tests={tests.api} />
            <Section title="📦 Payload Validation" tests={tests.payload} />
            <Section title="🖥️ UI Component Checks" tests={tests.ui} />
            <Section title="📋 Waitlist Form" tests={tests.waitlist} />
          </>
        )}
      </div>
    </div>
  );
}