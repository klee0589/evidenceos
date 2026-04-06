import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Evidence<span className="text-primary">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="https://github.com/klee0589/evidenceos-api" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">API Docs</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="mailto:hello@evidenceos.io" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EvidenceOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}