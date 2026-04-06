import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero({ onWaitlistClick, onDemoClick, heroImage }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary bg-primary/5">
            Developer Sandbox · Free API Key Available
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
        >
          The Developer Sandbox for
          <br />
          <span className="text-primary">Access Reviews — Start Free, Upgrade to Pro.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          8 systems. One API. Structured, timestamped JSON across Google Workspace, GitHub, AWS, Okta, Azure AD, Salesforce, Jira, and ServiceNow — ready for auditors, GRC tools, or CI/CD pipelines.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base text-muted-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Security teams use EvidenceOS to catch over-permissioned accounts, prove compliance,
          and eliminate the quarterly spreadsheet scramble — in seconds, not days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" onClick={onWaitlistClick} className="text-base px-8 h-12 font-semibold gap-2 group">
            Get Free API Key
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button size="lg" variant="outline" onClick={onDemoClick} className="text-base px-8 h-12 font-semibold gap-2 border-border/60 hover:bg-secondary">
            <Play className="w-4 h-4" />
            See Live Demo
          </Button>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 md:mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
            <img
              src={heroImage}
              alt="EvidenceOS compliance automation dashboard"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}