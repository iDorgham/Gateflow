<div align="center">
  <img src="./docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
  
  <br />

# GateFlow
  <p>
    <strong>The Enterprise OS for Physical Access Control & Marketing Intelligence</strong>
  </p>
  <p>
    <em>Modern, Cryptographically Secure, and Marketing-First Infrastructure for the MENA Region</em>
  </p>

  <p>
    <a href="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml"><img src="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
    <a href="https://github.com/iDorgham/Gateflow/actions/workflows/deploy.yml"><img src="https://github.com/iDorgham/Gateflow/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
    <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-54.0-4630EB?style=for-the-badge&logo=expo" alt="Expo"></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"></a>
    <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-8.15-F69220?style=for-the-badge&logo=pnpm" alt="pnpm"></a>
    <br />
    <a href="https://gateflow.site"><img src="https://img.shields.io/badge/Status-MVP_100%25_Complete-success?style=for-the-badge" alt="Status"></a>
    <a href="#"><img src="https://img.shields.io/badge/Security-Strict_HMAC--SHA256-red?style=for-the-badge" alt="Security"></a>
    <a href="#"><img src="https://img.shields.io/badge/i18n-Full_AR/EN_RTL-blue?style=for-the-badge" alt="i18n"></a>
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Vision & Core Pillars](#-vision--core-pillars)
- [📱 The 6-App Ecosystem](#-the-6-app-ecosystem)
- [🏗️ Detailed MVP Functional Breakdown](#-detailed-mvp-functional-breakdown)
- [🚀 Roadmap & Phase Progress](#-roadmap--phase-progress)
- [📊 Project Progress Dashboard](#-project-progress-dashboard)
- [🔐 Security Architecture](#-security-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Monorepo Structure](#-monorepo-structure)
- [🛠️ Getting Started](#-getting-started)
- [📖 Documentation Library](#-documentation-library)

---

## ✨ Vision & Core Pillars

GateFlow is not just a QR scanner—it's **Stripe-level infrastructure for physical access**. We bridge the gap between digital marketing spend and physical gate arrivals, providing a seamless, secure, and auditable flow for gated communities, events, and enterprise facilities.

### 🛡️ Secure Access Architecture
Every access request is verified cryptographically. We assume zero trust in the network; verification happens on the edge, ensuring gates open in <100ms even in zero-connectivity environments.

### 📈 Marketing Intelligence
We transform gate entries into data points. Capture UTM parameters, fire Meta/Google pixels upon guest arrival, and sync physical visits directly to your CRM (HubSpot/Salesforce) via real-time webhooks.

### 🤖 Autonomous Engineering (The Ralph Loop)
Developed with strict AI-assisted governance, ensuring 100% adherence to Atlassian Design System (ADS) tokens, perfect RTL layout for Arabic, and automated tenant isolation at the database layer.

---

## 📱 The 6-App Ecosystem

GateFlow is an orchestrated suite of 6 strictly decoupled applications
sharing a unified core.

| App | Status | User | Core Capability |
| :--- | :--- | :--- | :--- |
| **[Project Dashboard](./apps/client-dashboard)** | ✅ 100% | Property Managers | Real-time scan feeds (SSE), QR configuration, Marketing Suite, & Team RBAC. |
| **[Scanner App](./apps/scanner-app)** | ✅ 100% | Security Guards | Offline-first HMAC verification, AES-256 local queue, & Haptic feedback. |
| **[Resident Mobile](./apps/resident-mobile)** | ✅ 100% | Residents | Native iOS/Android app, WhatsApp one-tap share, & instant push notifications. |
| **[Resident Portal](./apps/resident-portal)** | ✅ 100% | Guests/VIPs | Responsive web self-service for pass management and historical logs. |
| **[Admin Dashboard](./apps/admin-dashboard)** | ✅ 100% | Super Admins | Multi-tenant oversight, billing management, and platform health tools. |
| **[Marketing Site](./apps/marketing)** | ✅ 100% | Prospects | SEO-optimized conversion funnels & industry-specific solutions. |

---

## 🏗️ Detailed MVP Functional Breakdown

### 🔑 Identity & Access (Auth/RBAC)

- **Enterprise Auth:** Argon2id password hashing with multi-device JWT session tracking.
- **Token Rotation:** Strict 15-minute access tokens with 30-day refresh windows for maximum security.
- **Granular RBAC:** Permissions scoped to Organization -> Project -> Role. Supports custom role creation.
- **Tenant Isolation:** Hard-coded Prisma middleware ensuring every query is scoped to the `organizationId`.

### 🎟️ QR Pass Management

- **Intelligent Logic:** 
  - **Single Use:** Fixed-expiry, one-time traversal.
  - **Recurring:** Weekly/Monthly schedules (e.g., for housekeepers or staff).
  - **Permanent:** Long-term staff/VIP access with revocation capabilities.
  - **Open Links:** Public-facing registration pages for events.
- **Creation Wizards:** Multi-step UI for complex pass generation.
- **Bulk Operations:** CSV-based mass generation of hundreds of passes in seconds.

### 📡 Scanner Operations

- **Offline Mode:** Local HMAC verification of signatures—no internet required to open the gate.
- **Sync Engine:** AES-256 encrypted local buffer that auto-syncs when connectivity returns.
- **Identity Tiers:**
  - **Tier 0:** Basic metadata only.
  - **Tier 1:** Mandatory ID document photo capture.
  - **Tier 2:** Full biometric/photo check-in.
- **Supervisor Overrides:** Secure PIN-based bypass with mandatory reason logging.

### 🏠 Resident Experience

- **Native Experience:** Built with Expo 54 for true native performance on iOS and Android.
- **Social Sharing:** Deep-integration with OS share sheets for rapid WhatsApp/SMS delivery.
- **Contact Selection:** Native mobile contact picker for inviting guests directly from the phonebook.
- **Real-time Alerts:** Instant push notifications when a guest arrives at the gate.
- **GPS Integration:** "Guide to Unit" feature providing guests with directions within complex compounds.

### 📈 Marketing Suite

- **Attribution Engine:** Capture UTM tags (Source, Medium, Campaign) from the moment a guest registers.
- **Tracking Pixels:** Native support for Meta Pixel and GA4 event firing on guest arrival landing pages.
- **CRM Webhooks:** Push visit data (including UTMs) to HubSpot, Salesforce, or custom endpoints.
- **Live Dashboards:** Real-time throughput visualization using SSE (Server-Sent Events).

---

## 🚀 Roadmap & Phase Progress

### 🟢 Phase 1 & 2: Infrastructure & Core Apps (COMPLETE)
- [x] Monorepo orchestration with Turborepo & pnpm.
- [x] Prisma Schema for Multi-Project / Multi-Tenant architecture.
- [x] Client Dashboard with Recharts analytics.
- [x] Scanner App v1 (HMAC, Offline Cache, Haptics).
- [x] Resident Web Portal (Responsive).
- [x] Basic Marketing Site (SSR, SEO).

### 🟡 Phase 3: Growth & Connectivity (IN PROGRESS)
- [x] **Resident Mobile v2:** Native apps for iOS & Android with Push notifications.
- [x] **Marketing Suite:** UTM attribution dashboards and Meta Pixel integration.
- [x] **CRM Integration:** Outbound webhooks for HubSpot/Salesforce.
- [ ] **WhatsApp Bot:** Self-service QR generation via WhatsApp Business API.
- [ ] **SMS Gateway:** Automated guest invitation delivery.

### 🔵 Phase 4: Intelligence & Hardware (FUTURE)
- [ ] **LPR Integration:** Automated License Plate Recognition bridge to QR logic.
- [ ] **GateAI Concierge:** advanced AI-handling of guest requests and autonomous residents help.
- [ ] **Advanced Attribution:** Multi-touch attribution models for real estate sales cycles.

---

## 📊 Project Progress Dashboard

| Component | Status | Progress | Completion |
| :--- | :--- | :--- | :--- |
| **Core API / DB** | ✅ Stable | 100% | 20+ Models, 50+ Migrations |
| **Client Dashboard** | ✅ Stable | 100% | ADS Implementation, 15+ Pages |
| **Scanner App** | ✅ Stable | 100% | 5 Tabs, Offline Sync, HMAC |
| **Resident Mobile** | ✅ Stable | 100% | Native iOS/Android, Push, Sharing |
| **Resident Portal** | ✅ Stable | 100% | Guest Management, History |
| **Admin Dashboard** | ✅ Stable | 100% | Multi-tenant Tools, Billing |
| **Marketing Site** | ✅ Stable | 100% | Multi-page, Tracking, Pixels |

---

## 🔐 Security Architecture

GateFlow follows a strict **Security-by-Design** philosophy.

- **HMAC-SHA256 QR Signing:** Every QR code contains a cryptographic signature.
  Altering even one character of the ticket results in an immediate failure.
- **AES-256 Storage:** Sensitive resident data and offline sync queues are
  encrypted at rest using industry-standard AES.
- **Argon2id:** The strongest modern password hashing algorithm is used for
  all user credentials.
- **Audit Logging:** Every administrative action and every scan event is
  logged immutably with full actor attribution.

---

## 💻 Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/)
- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Mobile:** [React Native](https://reactnative.dev/) via [Expo 54](https://expo.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) + [Prisma 5](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Messaging:** [Lucide](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/)

---

## 🏗️ Monorepo Structure

```bash
GateFlow/
├── apps/
│   ├── admin-dashboard/       # Internal platform operations
│   ├── client-dashboard/      # B2B Property Manager portal
│   ├── marketing/             # Public landing page & SEO
│   ├── resident-mobile/       # Native Resident app (Expo)
│   ├── resident-portal/       # Web-based Resident portal
│   └── scanner-app/           # Native Guard/Scanner application
├── packages/
│   ├── db/                    # Shared Prisma schema & client
│   ├── ui/                    # Shared shadcn components (ADS Tokens)
│   ├── types/                 # Context-rich TS types & Zod schemas
│   ├── i18n/                  # AR/EN translation dictionaries
│   └── config/                # Shared ESLint, Tailwind, & TSConfig
```

---

## 🛠️ Getting Started

### 📥 Setup

1. **Clone & Install:**
   ```bash
   git clone https://github.com/iDorgham/Gateflow.git && cd Gateflow
   pnpm install
   ```

2. **Environment:**
   `cp .env.example .env` (Populate `DATABASE_URL` and `NEXTAUTH_SECRET`)

3. **Database:**
   `pnpm db:generate && pnpm db:push && pnpm db:seed`

4. **Run Dev:**
   `pnpm turbo dev` (Launches all 6 apps simultaneously)

---

## 📅 Recent Engineering Activity

- **[Live Feed] Real-time Updates:** Added SSE streaming for live dashboard
  updates (EventLog model, `/api/events/stream`).
- **[Marketing] Platform Conversion:** Completed homepage, features,
  pricing, and solutions layouts (100% stable).
- **[Resident Mobile] Core Flows:** Added native QR list, creation wizards,
  offline cache, and history tracking.
- **[Scanner App] v5 Hub:** Mapped 5 tactical tabs: Scanner, Today (Expected),
  Log, Chat, and Hardware Settings.
- **[Admin Portal] Auth Keys:** Implemented Authorization Key management
  with full cryptographic CRUD API.
- **[Client Dashboard] Analytics Rebuild:** Full data visualization overhaul
  using Recharts with multi-tenant filtering.
- **[CRM UI] Projects Hub:** Completed Phase 1-12 of the Projects CRM
  (multi-project, contacts, units).
- **[Security] Logic Update:** Hardened visitor identity levels, privacy
  controls, and watchlist flags.

---

## 🛠️ Infrastructure & Packages

| Package | Purpose | Status |
| :--- | :--- | :--- |
| **`@gate-access/db`** | Prisma schema, clients, and migrations. | ✅ Stable |
| **`@gate-access/ui`** | Shared ADS-compliant component library. | ✅ Stable |
| **`@gate-access/types`** | Universal TS definitions & Zod schemas. | ✅ Stable |
| **`@gate-access/i18n`** | AR/EN translation dictionaries & RTL logic. | ✅ Stable |
| **`@gate-access/config`** | Centralized ESLint, Tailwind, & TSConfig. | ✅ Stable |

---

## 🚀 CI/CD & Deployment

### GitHub Actions Workflows

| Workflow | Trigger | Purpose |
| :--- | :--- | :--- |
| **CI** (`ci.yml`) | Push / PR | Lint + typecheck + test in parallel |
| **Deploy** (`deploy.yml`) | Push to main | Deploy all 4 web apps to Vercel |
| **Lighthouse** (`lighthouse.yml`) | PR / daily | PageSpeed audit (perf ≥90, a11y ≥95, SEO ≥95) |
| **Sync AI Tools** (`sync-ai-tools.yml`) | `.agents/` change | Sync workflow configs to tool-native formats |

### Required GitHub Secrets

```
# CI
NEXTAUTH_SECRET          # ≥32 chars random string
QR_SIGNING_SECRET        # ≥32 chars random string
ENCRYPTION_MASTER_KEY    # ≥32 chars random string
ADMIN_ACCESS_KEY         # Admin bypass key
CI_DATABASE_URL          # postgres://... (test database)

# Vercel deploy
VERCEL_TOKEN             # From vercel.com → Settings → Tokens
VERCEL_ORG_ID            # From vercel.com → Settings
VERCEL_PROJECT_ID_CLIENT_DASHBOARD
VERCEL_PROJECT_ID_ADMIN_DASHBOARD
VERCEL_PROJECT_ID_MARKETING
VERCEL_PROJECT_ID_RESIDENT_PORTAL

# Optional: Turborepo remote cache
TURBO_TOKEN
TURBO_TEAM
```

---

## 🤝 Contributing

1. Check the [**Development Guide**](./docs/guides/DEVELOPMENT_GUIDE.md).
2. Review [**Code Conventions**](./docs/core/CLAUDE.md#code-conventions).
3. Use `pnpm` exclusively (no npm/yarn).
4. Run `pnpm preflight` before submitting PRs (lint + typecheck + test).
5. Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`

---

<div align="center">
  <p><b>Built with precision for the modern gate.</b></p>
  <p>© 2026 GateFlow. All rights reserved.</p>
</div>
