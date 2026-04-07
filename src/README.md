<div align="center">

<img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=200&fit=crop&crop=center" alt="EvidenceOS Banner" width="100%" style="border-radius: 12px;" />

<br/><br/>

<h1>🛡️ EvidenceOS</h1>

<p><strong>The Sandbox API for Identity & Access Compliance</strong></p>

<p>
  <img src="https://img.shields.io/badge/API-v1-4ade80?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Built%20with-React-61dafb?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Deno-000000?style=for-the-badge&logo=deno&logoColor=white" />
  <img src="https://img.shields.io/badge/Billing-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Live-4ade80?style=for-the-badge" />
</p>

<p>Simulate Okta, AWS, GitHub, Google Workspace & more. Generate audit-ready SOC 2 reports.<br/>No real data. No setup. Just instant compliance evidence.</p>

<a href="https://evidenceos-api.onrender.com/api/demo/access-review"><strong>🚀 Try the Demo API →</strong></a>

</div>

---

## ✨ What is EvidenceOS?

EvidenceOS is a **production-grade sandbox API** that simulates enterprise identity systems and generates audit-ready compliance reports. Whether you're building a security product, demoing to customers, or testing SOC 2 workflows — EvidenceOS gives you realistic, deterministic data instantly.

```bash
# No API key needed — try it right now ⚡
curl https://evidenceos-api.onrender.com/api/demo/access-review?system=github
```

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🏢 **8 Identity Systems** | Google Workspace, GitHub, AWS IAM, Okta, Azure AD, Salesforce, Jira, ServiceNow |
| 📋 **Audit-Ready Reports** | SOC 2 evidence packages, access reviews, MFA status, flagged accounts |
| ♻️ **Deterministic Responses** | Same inputs = same outputs. Perfect for reproducible tests |
| 🔔 **Webhook Simulation** | Real-time identity event streams |
| ⚡ **Zero Setup** | Get an API key in seconds, no infrastructure needed |
| 🔐 **Secure by Design** | API keys server-side only, Stripe webhook validation, signed secrets |

---

## 🚀 Quick Start

### 1. Get your API key (free)

Sign up at [evidenceos.com](https://evidenceos.com) — you'll get an API key instantly.

### 2. Make your first call

```bash
# Demo endpoint — no auth required
curl "https://evidenceos-api.onrender.com/api/demo/access-review?system=github"
```

```json
{
  "status": "Warning",
  "summary": "3 of 8 users flagged for review",
  "system": "github",
  "total_users": 8,
  "flagged": 3,
  "users": [
    { "login": "dev-1", "role": "owner",  "mfa": false, "flag": "⚠️ MFA disabled" },
    { "login": "dev-2", "role": "member", "mfa": false, "flag": "⚠️ MFA disabled" },
    { "login": "dev-3", "role": "member", "mfa": true  }
  ]
}
```

### 3. Authenticated usage

```bash
curl https://evidenceos-api.onrender.com/api/v1/usage \
  -H "X-API-Key: eos_your_key_here"
```

---

## 🌐 Supported Systems

| System | Status | `?system=` param |
|---|:---:|---|
| 🔵 Google Workspace | ✅ **Live** | *(default)* |
| 🐙 GitHub | ✅ **Live** | `github` |
| 🟠 AWS IAM | ✅ **Live** | `aws` |
| 🔷 Okta | ✅ **Live** | `okta` |
| 🔵 Azure AD | 🔜 Coming Soon | `azure-ad` |
| ☁️ Salesforce | 🔜 Coming Soon | `salesforce` |
| 🟦 Jira | 🔜 Coming Soon | `jira` |
| ⚙️ ServiceNow | 🔜 Coming Soon | `servicenow` |

---

## 📡 API Reference

**Base URL:** `https://evidenceos-api.onrender.com`

### Public Endpoints

#### `GET /api/demo/access-review`
Simulated access review — no auth required.

```bash
curl "https://evidenceos-api.onrender.com/api/demo/access-review?system=aws"
curl "https://evidenceos-api.onrender.com/api/demo/access-review?system=okta"
```

#### `POST /api/auth/register`
Register a new user and receive an API key.

```bash
curl -X POST https://evidenceos-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@company.com"}'
```

### Authenticated Endpoints

#### `GET /api/v1/usage`
Returns usage metrics — daily calls, limits, breakdowns by system and endpoint.

```bash
curl https://evidenceos-api.onrender.com/api/v1/usage \
  -H "X-API-Key: eos_your_key_here"
```

**Response shape:**
```json
{
  "today":  { "calls": 142, "limit": 10000, "remaining": 9858 },
  "period": { "totalCalls": 4201, "totalErrors": 12, "avgResponseMs": 87 },
  "bySystem":   [{ "system": "github", "calls": 1200 }],
  "byEndpoint": [{ "endpoint": "/access-review", "calls": 980 }],
  "daily":      [{ "date": "2026-04-07", "calls": 142 }]
}
```

### Error Codes

| Code | Meaning |
|---|---|
| `401` | Missing or invalid API key |
| `403` | Plan limit exceeded |
| `429` | Rate limit — slow down |
| `500` | Server error — try again shortly |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)               │
│         Landing · Dashboard · Pricing · Docs             │
│         Tailwind CSS · shadcn/ui · Framer Motion         │
└──────────────────────┬──────────────────────────────────┘
                       │  Base44 SDK  (functions.invoke)
┌──────────────────────▼──────────────────────────────────┐
│                 Backend Functions (Deno)                 │
│  getUsage · registerUser · createCheckoutSession         │
│  stripeWebhook · createPortalSession · billingWebhook    │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTPS + X-API-Key / X-Webhook-Secret
┌──────────────────────▼──────────────────────────────────┐
│               EvidenceOS External API                    │
│         https://evidenceos-api.onrender.com              │
│   /api/demo/access-review  ·  /api/v1/usage              │
│   /api/auth/register  ·  /api/v1/billing/webhook         │
└─────────────────────────────────────────────────────────┘
```

---

## 💳 Plans

|  | 🆓 Free | ⚡ Pro |
|---|:---:|:---:|
| Daily API calls | 500 | 10,000 |
| Identity systems | 4 | 8 |
| Compliance reports | 5 / mo | Unlimited |
| Webhook support | ✗ | ✓ |
| Priority support | ✗ | ✓ |
| **Price** | **$0** | **$29/mo** |

Billing via **Stripe** — upgrade from your dashboard or the pricing page.

---

## 🔐 Security Model

- **API keys are never in the browser.** All EvidenceOS API calls are proxied through Deno backend functions using `EVIDENCEOS_API_KEY` stored server-side.
- **Stripe webhooks** are validated with `STRIPE_WEBHOOK_SECRET` via `constructEventAsync` before any billing logic runs.
- **Billing sync** between Stripe → Base44 → EvidenceOS is secured with a shared `BASE44_WEBHOOK_SECRET` header.

---

## ⚙️ Environment Variables

| Secret | Where | Description |
|---|---|---|
| `EVIDENCEOS_API_KEY` | Base44 | Master API key — server-side only |
| `STRIPE_SECRET_KEY` | Base44 | Stripe secret for checkout & portal |
| `STRIPE_WEBHOOK_SECRET` | Base44 | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Base44 | Stripe Price ID for Pro plan |
| `BASE44_WEBHOOK_SECRET` | Base44 + Render | Shared secret for billing sync webhook |

---

## 📁 Project Structure

```
├── pages/
│   ├── Landing.jsx          # Marketing / landing page
│   ├── Dashboard.jsx        # Authenticated user dashboard
│   ├── Pricing.jsx          # Pricing + upgrade page
│   ├── Docs.jsx             # API documentation
│   └── TestDashboard.jsx    # Internal QA test suite
│
├── components/
│   ├── landing/             # 15+ landing page sections
│   │   ├── Hero.jsx
│   │   ├── APIDemo.jsx      # Live interactive sandbox
│   │   ├── WaitlistForm.jsx # Signup + API key delivery
│   │   └── ...
│   └── dashboard/
│       ├── DashboardHeader.jsx   # API key display + plan badge
│       ├── APIUsage.jsx          # Live usage metrics
│       └── APISnippets.jsx       # Code examples
│
├── functions/               # Deno serverless functions
│   ├── getUsage.js          # Proxies /api/v1/usage
│   ├── registerUser.js      # Handles signup + API key
│   ├── stripeWebhook.js     # Stripe event handler
│   ├── createCheckoutSession.js
│   ├── createPortalSession.js
│   └── billingWebhook.js    # Plan sync from Stripe → EvidenceOS
│
└── entities/
    └── WaitlistSignup.json  # Signup form data store
```

---

## 🧪 Testing the Billing Webhook

```bash
# Test the EvidenceOS billing webhook directly
curl -X POST https://evidenceos-api.onrender.com/api/v1/billing/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_BASE44_WEBHOOK_SECRET" \
  -d '{
    "event": { "type": "upgrade" },
    "data": { "email": "jane@company.com", "plan": "pro" },
    "old_data": { "plan": "free" }
  }'
```

Expected response: `{ "received": true, "updatedKeys": 1 }`

---

<div align="center">

**Built with ❤️ on [Base44](https://base44.com)**

<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
<img src="https://img.shields.io/badge/Made%20with-☕-brown?style=flat-square" />

</div>