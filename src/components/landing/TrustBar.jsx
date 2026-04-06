export default function TrustBar() {
  return (
    <div className="bg-secondary/30 border-y border-border/40 py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">API Version</p>
            <p className="text-sm font-mono text-foreground">v1</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Uptime</p>
            <p className="text-sm font-mono text-emerald-400">99.9% (SLA)</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Avg Response</p>
            <p className="text-sm font-mono text-foreground">&lt;50ms</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Data Type</p>
            <p className="text-sm font-mono text-foreground">Deterministic</p>
          </div>
        </div>
      </div>
    </div>
  );
}