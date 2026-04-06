import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const BASE_URL = "https://evidenceos-api.onrender.com";

const tabs = ["cURL", "JavaScript", "Python"];

export default function APISnippets({ apiKey }) {
  const [activeTab, setActiveTab] = useState("cURL");
  const [copied, setCopied] = useState(false);

  const snippets = {
    cURL: `curl -X GET \\
  "${BASE_URL}/api/demo/access-review?system=github" \\
  -H "x-api-key: ${apiKey}"`,
    JavaScript: `const response = await fetch(
  "${BASE_URL}/api/demo/access-review?system=github",
  {
    headers: {
      "x-api-key": "${apiKey}"
    }
  }
);
const data = await response.json();
console.log(data);`,
    Python: `import requests

response = requests.get(
    "${BASE_URL}/api/demo/access-review",
    params={"system": "github"},
    headers={"x-api-key": "${apiKey}"}
)
data = response.json()
print(data)`,
  };

  const copy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    base44.analytics.track({ eventName: "dashboard_code_copied", properties: { language: activeTab } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Your API Key</p>
        <h2 className="text-2xl font-bold">Ready-to-use code snippets</h2>
        <p className="text-muted-foreground text-sm mt-1">Your API key is pre-filled. Copy and run immediately.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center border-b border-border/60 px-4 pt-3 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? "bg-background border border-border/60 border-b-background text-foreground -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={copy}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Code block */}
        <pre className="p-5 text-sm font-mono text-foreground overflow-x-auto bg-background/40">
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>
    </section>
  );
}