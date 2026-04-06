import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Download } from "lucide-react";
import { toast } from "sonner";
import SampleReportPreview from "./SampleReportPreview";

export default function ReportsSection() {
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    toast.loading("Generating audit-ready report...");

    try {
      const response = await fetch("https://evidenceos-api.onrender.com/api/reports/access-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "azure-ad",
          userCount: 487,
          status: "Warning",
          includeRecommendations: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "evidenceos-audit-report.json";
      a.click();
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Report generated and downloaded");
    } catch (error) {
      toast.dismiss();
      toast.error("Could not generate report. Try the sample below.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary bg-primary/5">
            <Zap className="w-3 h-3 mr-1.5" /> Compliance Reports
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Turn Access Reviews Into Audit-Ready Reports in Seconds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate structured compliance reports with flagged users, MFA gaps, and actionable recommendations — ready to hand to your auditor.
          </p>
        </motion.div>

        {/* Two-column: Preview + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          {/* Left: Sample Report */}
          <SampleReportPreview />

          {/* Right: CTA + Features */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3">Generate in Real-Time</h3>
              <p className="text-muted-foreground leading-relaxed">
                No spreadsheets. No manual review. EvidenceOS generates structured, audit-ready compliance reports with findings, flags, and recommendations—all from a single API call.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Executive Summary", desc: "User count, flagged items, severity breakdown" },
                { label: "Findings List", desc: "Critical, warning, and pass-status items with counts" },
                { label: "Recommendations", desc: "Actionable remediation steps for each finding" },
                { label: "Audit-Ready Format", desc: "JSON or PDF, timestamped, suitable for SOC 2 / ISO" },
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <div>
                    <p className="text-sm font-semibold">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={handleGenerateReport}
              disabled={generating}
              className="w-full text-base px-6 h-11 font-semibold gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate Sample Report
                </>
              )}
            </Button>

            {/* Pricing note */}
            <div className="rounded-lg border border-border/40 bg-secondary/30 p-4 space-y-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">Plan Limits</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Free Plan:</span>
                  <span className="font-semibold text-foreground">3 reports/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Pro Plan:</span>
                  <span className="font-semibold text-primary">Unlimited + Advanced Endpoints</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}