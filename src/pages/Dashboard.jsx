import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickStart from "@/components/dashboard/QuickStart";
import APISnippets from "@/components/dashboard/APISnippets";
import ProCallout from "@/components/dashboard/ProCallout";
import APIUsage from "@/components/dashboard/APIUsage";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin("/dashboard");
        return;
      }
      const me = await base44.auth.me();
      // Fetch full user record with custom fields from the User entity
      const users = await base44.entities.User.filter({ email: me.email });
      let userRecord = users[0] ? { ...me, ...users[0] } : me;

      // Auto-generate API key if missing
      if (!userRecord.api_key) {
        const key = "eos_" + Array.from(crypto.getRandomValues(new Uint8Array(20)))
          .map(b => b.toString(16).padStart(2, "0")).join("");
        await base44.auth.updateMe({ api_key: key });
        userRecord = { ...userRecord, api_key: key };
      }
      setUser(userRecord);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const plan = user?.plan || "free";
  const apiKey = user?.api_key || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader user={user} plan={plan} />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <APIUsage apiKey={apiKey} plan={plan} />
        <QuickStart plan={plan} apiKey={apiKey} />
        <APISnippets apiKey={apiKey} />
        {plan !== "pro" && <ProCallout />}
      </main>
    </div>
  );
}