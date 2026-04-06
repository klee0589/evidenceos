import { motion } from "framer-motion";
import { Star } from "lucide-react";

const logos = [
  "CloudLayer", "StackBase", "TrustSeed", "CompliPilot", "SecureLoop"
];

const quotes = [
  {
    text: "We used to spend 2 days before every audit compiling access review evidence. EvidenceOS made that a 5-minute API call.",
    author: "Sarah Chen",
    title: "Head of Security, CloudLayer",
  },
  {
    text: "The fact that I can programmatically generate evidence and feed it into our GRC tool is a game changer.",
    author: "Marcus Rivera",
    title: "CTO, StackBase",
  },
  {
    text: "Finally, an API-first approach to compliance. This is how modern SaaS companies should handle SOC 2.",
    author: "Priya Patel",
    title: "VP Engineering, TrustSeed",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Trusted by early-stage SaaS teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((name) => (
              <span key={name} className="text-sm font-semibold text-muted-foreground/50 tracking-wider uppercase">
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Quotes */}
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={q.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/60 bg-card"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-primary/80 text-primary/80" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 mb-5">"{q.text}"</p>
              <div>
                <p className="text-sm font-semibold">{q.author}</p>
                <p className="text-xs text-muted-foreground">{q.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}