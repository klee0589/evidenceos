# EvidenceOS

**Sandbox API + Compliance Reports for Identity & Access Reviews**

EvidenceOS is a production-grade sandbox API that simulates Okta, AWS, GitHub, Google Workspace, and more — and generates audit-ready compliance reports. Test workflows, demo to customers, build SOC 2 evidence, and show value in seconds. No real data. No setup.

---

## 🚀 What It Does

- **Simulate 8 identity systems** — Google Workspace, GitHub, AWS IAM, Okta, Azure AD, Salesforce, Jira, ServiceNow
- **Generate audit-ready JSON reports** — access reviews, user inventories, flagged accounts, MFA status
- **Deterministic, realistic responses** — same inputs produce consistent outputs for reproducible testing
- **Webhook support** — simulate real-time identity events
- **Compliance reporting** — SOC 2-ready evidence packages downloadable as JSON

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│   Landing Page · Dashboard · Pricing · API Demo          │
│   Built with: Vite + React + Tailwind + shadcn/ui        │
└──────────────────┬───────────────────────────────────────┘
                   │  base44 SDK (functions.invoke)
┌──────────────────▼───────────────────────────────────────┐
│               Backend Functions (Deno)                   │
│   getUsage · registerUser · createCheckoutSession        │
│   stripeWebhook · createPortalSession · notifyPlanChange │
└──────────────────┬───────────────────────────────────────┘
                   │  HTTPS
┌──────────────────▼───────────────────────────────────────┐
│          EvidenceOS External API                         │
│   https://evidenceos-api.onrender.com                    │
│   /api/v1/usage  ·  /api/auth/register                   │
│   /api/demo/access-review?system=<system>                │
│   /api/v1/reports/generate                               │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
├── pages/
│   ├── Landing.jsx          # Main marketing/landing page
│   ├── Dashboard.jsx        # Authenticated user dashboard
│   ├── Pricing.jsx          # Standalone pricing page
│   └── TestDashboard.jsx    # Internal testing page
│
├── components/
│   ├── landing/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── TrustBar.jsx
│   │   ├── QuickStartCode.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── SystemsSupported.jsx
│   │   ├── BuiltForDevelopers.jsx
│   │   ├── DeveloperOnboarding.jsx
│   │   ├── TestingUseCases.jsx
│   │   ├── ReportsSection.jsx
│   │   ├── ResponseFormatExample.jsx
│   │   ├── ProductionFeatures.jsx
│   │   ├── APIDemo.jsx          # Live interactive API sandbox
│   │   ├── AuthSection.jsx
│   │   ├── WaitlistForm.jsx     # Registration + API key delivery
│   │   ├── PricingSection.jsx
│   │   ├── SandboxDisclaimer.jsx
│   │   └── Footer.jsx
│   │
│   └── dashboard/
│       ├── DashboardHeader.jsx  # Shows API key, plan badge
│       ├── APIUsage.jsx         # Fetches + displays usage metrics
│       ├── APISnippets.jsx      # cURL / code examples
│       ├── QuickStart.jsx
│       └── ProCallout.jsx
│
├── functions/                   # Deno backend functions
│   ├── getUsage.js              # Proxies /api/v1/usage (uses server-side API key)
│   ├── registerUser.js          # Calls /api/auth/register, returns real API key
│   ├── createCheckoutSession.js # Stripe checkout
│   ├── stripeWebhook.js         # Stripe webhook handler
│   ├── createPortalSession.js   # Stripe billing portal
│   ├── billingWebhook.js        # Plan change sync
│   └── notifyPlanChange.js      # Post-upgrade notifications
│
├── entities/
│   └── WaitlistSignup.json      # Stores signup form data
│
└── App.jsx                      # Router (React Router v6)
```

---

## 🔌 API Reference

### Base URL
```
https://evidenceos-api.onrender.com
```

### Authentication
All authenticated endpoints require your API key:
```bash
-H "X-API-Key: eos_your_key_here"
```

---

### Demo Endpoints (No Auth Required)

#### GET `/api/demo/access-review`
Returns a simulated Google Workspace access review.

```bash
curl https://evidenceos-api.onrender.com/api/demo/access-review
```

#### GET `/api/demo/access-review?system=<system>`
Returns a simulated access review for the specified system.

**Supported systems:** `github` · `aws` · `okta` · `azure-ad` · `salesforce` · `jira` · `servicenow`

```bash
curl https://evidenceos-api.onrender.com/api/demo/access-review?system=github
curl https://evidenceos-api.onrender.com/api/demo/access-review?system=aws
curl https://evidenceos-api.onrender.com/api/demo/access-review?system=okta
```

**Example Response:**
```json
{
  "status": "Warning",
  "summary": "3 of 8 users flagged for review",
  "timestamp": "2026-04-07T00:00:00.000Z",
  "system": "github",
  "total_users": 8,
  "flagged": 3,
  "users": [
    { "login": "dev-1", "role": "owner", "mfa": false },
    { "login": "dev-2", "role": "member", "mfa": false },
    { "login": "dev-3", "role": "member", "mfa": true }
  ]
}
```

---

### Authenticated Endpoints

#### GET `/api/v1/usage`
Returns your API usage metrics for the current period.

```bash
curl https://evidenceos-api.onrender.com/api/v1/usage \
  -H "X-API-Key: eos_your_key_here"
```

**Response:**
```json
{
  "apiKey": "eos_live_...",
  "plan": "pro",
  "today": {
    "calls": 142,
    "limit": 10000,
    "remaining": 9858,
    "resetsAt": "midnight UTC"
  },
  "period": {
    "days": 30,
    "totalCalls": 4201,
    "totalErrors": 12,
    "avgResponseMs": 87
  },
  "bySystem": [
    { "system": "github", "calls": 1200, "errors": 3, "avg_ms": 72 }
  ],
  "byEndpoint": [...],
  "daily": [...]
}
```

#### POST `/api/auth/register`
Register a new user and receive an API key.

```bash
curl -X POST https://evidenceos-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@company.com",
    "integration_preference": "GitHub"
  }'
```

**Response:**
```json
{
  "apiKey": "eos_abc123..."
}
```

---

## 🔐 Security Model

- **API keys are never stored in the browser.** All authenticated calls to the EvidenceOS API are proxied through Deno backend functions using the server-side `EVIDENCEOS_API_KEY` secret.
- **User API keys** (shown in the dashboard) are for display/documentation purposes — the actual server calls use the master key stored in environment variables.
- **Stripe webhooks** are validated using `STRIPE_WEBHOOK_SECRET` before processing any billing events.

---

## 💳 Plans

| Feature | Free | Pro |
|---|---|---|
| Daily API calls | 500 | 10,000 |
| Systems supported | 4 | 8 |
| Compliance reports | 5/mo | Unlimited |
| Webhook support | ✗ | ✓ |
| Priority support | ✗ | ✓ |

Billing is handled via **Stripe**. Users upgrade through the dashboard or landing page pricing section.

---

## ⚙️ Environment Variables (Secrets)

| Secret | Description |
|---|---|
| `EVIDENCEOS_API_KEY` | Master API key for the EvidenceOS external API (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key for checkout + portal sessions |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for event validation |
| `STRIPE_PRICE_ID` | Stripe Price ID for the Pro plan |

---

## 🧪 Local Development

This project runs on the [Base44](https://base44.com) platform (Vite + React frontend, Deno backend functions). To run locally:

1. Clone the repo
2. Set environment secrets in your Base44 dashboard under **Settings → Environment Variables**
3. The frontend auto-connects to your backend functions via the Base44 SDK

---

## 📊 Supported Systems

| System | Status | Endpoint param |
|---|---|---|
| Google Workspace | ✅ Live | *(default)* |
| GitHub | ✅ Live | `github` |
| AWS IAM | ✅ Live | `aws` |
| Okta | ✅ Live | `okta` |
| Azure AD | 🔜 Coming soon | `azure-ad` |
| Salesforce | 🔜 Coming soon | `salesforce` |
| Jira | 🔜 Coming soon | `jira` |
| ServiceNow | 🔜 Coming soon | `servicenow` |

---

## 📄 License

MIT © EvidenceOS 2026