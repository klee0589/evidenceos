import { InfoIcon } from "lucide-react";

export default function SandboxDisclaimer() {
  return (
    <div className="py-8 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-3 items-start p-4 rounded-lg border border-border/40 bg-secondary/20">
          <InfoIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Sandbox environment:</span> This service uses synthetic, deterministic data. No real customer information is processed or stored.
          </p>
        </div>
      </div>
    </div>
  );
}