import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function WaitlistForm({ formRef }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [integration, setIntegration] = useState("Both");
  const [painPoint, setPainPoint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    await base44.entities.WaitlistSignup.create({
      name,
      email,
      integration_preference: integration,
      pain_point: painPoint || undefined,
    });
    setSubmitting(false);
    setSubmitted(true);
    toast.success("You're on the list!");
  };

  if (submitted) {
    return (
      <section id="waitlist" ref={formRef} className="py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">You're on the list!</h2>
          <p className="text-muted-foreground text-lg">
            We'll reach out when your spot opens up. In the meantime, keep an eye on your inbox.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="waitlist" ref={formRef} className="py-24 md:py-32 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Early Access</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Get in before everyone else
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            We're onboarding a small group of design partners. Spots are limited.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free during beta</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 bg-secondary/40 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-secondary/40 border-border/50"
              />
            </div>

            <div className="space-y-3">
              <Label>Which integration do you need first?</Label>
              <RadioGroup value={integration} onValueChange={setIntegration} className="flex gap-3">
                {["GitHub", "Google Workspace", "Both"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                      integration === opt
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <RadioGroupItem value={opt} className="sr-only" />
                    {opt}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain">Which SOC 2 control causes you the most pain? <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                id="pain"
                placeholder="e.g. Access reviews, change management, vendor risk..."
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                rows={3}
                className="bg-secondary/40 border-border/50 resize-none"
              />
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="w-full h-12 text-base font-semibold gap-2 group">
              {submitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign Up for Early Access
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              No credit card required. We'll never share your email.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}