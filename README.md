<h1 align="center">GateFlow</h1>

<p align="center">
  <img src="assets/Images/gateflow-compound-access-cover-v10.png" alt="A young driver and happy golden-brown dog presenting a mobile access pass at a Red Sea residential compound" width="100%">
</p>

<p align="center">
  <b>Secure arrivals. Connected communities. One access platform.</b><br>
  <i>GateFlow connects residents, visitors, security teams, and property operators across every gate—from invitation to verified entry.</i>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/ci.yml?branch=master&label=CI&style=flat-square" alt="CI status"></a>
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/codeql-analysis.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/codeql-analysis.yml?branch=master&label=CodeQL&style=flat-square" alt="CodeQL status"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/release-0.3.0-6366f1?style=flat-square" alt="Release 0.3.0"></a>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20 or later">
  <img src="https://img.shields.io/badge/pnpm-8.15-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm 8.15">
  <img src="https://img.shields.io/badge/license-proprietary-lightgrey?style=flat-square" alt="Proprietary license">
</p>

<p align="center">
  <a href="#what-is-gateflow">Product</a> ·
  <a href="#-application-ecosystem">Applications</a> ·
  <a href="#-quick-start--local-development">Quick start</a> ·
  <a href="#-master-architecture">Architecture</a> ·
  <a href="docs/INDEX.md">Documentation</a>
</p>

---

## What is GateFlow?

**GateFlow is a multi-tenant access-management platform for gated compounds, residential communities, resorts, and other controlled properties.** It replaces phone calls, handwritten visitor lists, and disconnected gate tools with one secure flow shared by residents, visitors, security teams, and property operators.

A resident creates a guest pass from the mobile app or web portal. The visitor receives a signed QR credential. At arrival, security validates that credential with the scanner app—even during an internet outage. The property team sees the result immediately in its operational dashboard, with a complete audit trail.

| At a glance  | GateFlow                                                                     |
| :----------- | :--------------------------------------------------------------------------- |
| **Product**  | Multi-tenant physical-access and visitor-management platform                 |
| **Surfaces** | Six product applications plus an internal design-system application          |
| **Web**      | Next.js, React, TypeScript, and Tailwind CSS                                 |
| **Mobile**   | Expo and React Native for residents and gate security                        |
| **Data**     | PostgreSQL, Prisma, and a tenant-scoped domain model                         |
| **Security** | Signed QR credentials, RBAC, encrypted offline queues, and audited overrides |
| **Markets**  | Arabic and English, LTR and RTL, designed for MENA operations                |

### Who it serves

| User                   | What GateFlow gives them                                                                               |
| :--------------------- | :----------------------------------------------------------------------------------------------------- |
| **Residents**          | Fast guest invitations, reusable passes, arrival alerts, and visibility into visitor quotas.           |
| **Visitors**           | A simple digital credential that removes calls, paper lists, and uncertainty at the gate.              |
| **Security teams**     | Fast QR verification, offline operation, shift tools, incident workflows, and auditable overrides.     |
| **Property teams**     | Live gate activity, resident and unit management, access policies, reporting, and operational control. |
| **Platform operators** | Tenant onboarding, subscription oversight, cross-organization governance, and infrastructure health.   |

### From invitation to verified entry

1. **Create** — A resident or property operator creates a time-bound or recurring visitor pass.
2. **Share** — GateFlow delivers a cryptographically signed QR credential through the resident's preferred channel.
3. **Verify** — The guard scans the credential and validates its signature, access window, gate, and status.
4. **Admit or deny** — The scanner returns a clear decision and records any supervised override or incident.
5. **Sync and monitor** — Offline scans synchronize when connectivity returns, while dashboards surface activity in real time.

### What this repository contains

This repository is the GateFlow product monorepo. It contains six customer- and operator-facing applications, an internal design-system application, shared TypeScript packages, the Prisma data layer, localization resources, security primitives, tests, documentation, and deployment automation.

The apps do not operate as separate products. They share the same organizations, properties, units, residents, passes, gates, scan events, permissions, and design language.

---

<details>
<summary><b>Table of contents</b></summary>

- [Application Ecosystem](#-application-ecosystem)
- [Upcoming features](#-upcoming-features)
- [Quick Start & Local Development](#-quick-start--local-development)
- [Master Architecture](#-master-architecture)
- [Strategic Core Pillars](#-strategic-core-pillars)
- [Security & Compliance](#-security--compliance)
- [Recent Engineering Activity](#-recent-engineering-activity)
- [Analytics & Intelligence](#-analytics--intelligence)
- [Localization & i18n](#-localization--i18n)
- [The Ralph Loop Automation](#-the-ralph-loop-automation)
- [Performance & Governance](#-performance--governance)
- [Documentation & Support](#-documentation--support)

</details>

---

## 🏗️ Application Ecosystem

GateFlow separates each audience into a focused application while keeping data, permissions, security rules, and UI foundations shared across the platform.

### Property and platform operations

| Application                                   | Primary users                                   | Responsibility                                                                                                                                            |
| :-------------------------------------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Client Dashboard](apps/client-dashboard)** | Property managers, community teams, supervisors | The operational control tower for properties, projects, units, residents, gates, teams, passes, live scan activity, incidents, watchlists, and reporting. |
| **[Admin Dashboard](apps/admin-dashboard)**   | GateFlow platform administrators                | Platform-wide tenant onboarding, organization lifecycle management, subscriptions, global analytics, administrative access, and infrastructure health.    |

### Resident and visitor experience

| Application                                 | Primary users                  | Responsibility                                                                                                                                            |
| :------------------------------------------ | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Resident Mobile](apps/resident-mobile)** | Residents using iOS or Android | The native everyday experience for creating and sharing guest passes, managing recurring access, tracking quotas, and receiving arrival notifications.    |
| **[Resident Portal](apps/resident-portal)** | Residents using a browser      | Web self-service for visitor and pass management, multi-unit access, detailed history, revocation, and account settings without requiring the mobile app. |

### Gate operations and growth

| Application                          | Primary users                      | Responsibility                                                                                                                                                         |
| :----------------------------------- | :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Scanner App](apps/scanner-app)**  | Guards and gate supervisors        | The frontline iOS/Android tool for rapid QR scanning, offline signature validation, encrypted scan queues, shift activity, supervisor overrides, and incident capture. |
| **[Marketing Site](apps/marketing)** | Prospective customers and partners | The public bilingual website for product education, industry solutions, pricing, lead capture, SEO content, and conversion tracking.                                   |

### Product foundation

| Workspace                               | Primary users           | Responsibility                                                                                                                              |
| :-------------------------------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **[Design System](apps/design-system)** | Designers and engineers | Interactive documentation for GateFlow tokens, UI primitives, product patterns, accessibility behavior, and Arabic/English RTL conventions. |
| **[Shared Packages](packages)**         | All applications        | Database access, schemas, API clients, reusable UI, types, configuration, security helpers, and localization dictionaries.                  |

### How the apps connect

```text
Resident Mobile / Portal
          │ creates and shares a signed pass
          ▼
     Visitor QR credential
          │ presented at the compound entrance
          ▼
       Scanner App ────── offline queue and sync
          │ records verification and entry
          ▼
      Client Dashboard ── live operations and reporting
          │
          └────────────── Admin Dashboard for platform governance
```

---

## 🔮 Upcoming features

**Single source of truth:** [`docs/reference/product/UPCOMING.md`](docs/reference/product/UPCOMING.md) — active initiatives (with plan links), planning backlog, recently shipped highlights, and Q3 strategic goals.

The README does **not** duplicate that document. Open **UPCOMING.md** for tables, sprint status, and initiative detail; refresh this section only when you want a new high-level teaser line here.

> **Snapshot (see UPCOMING.md for live status):** Audit remediation 2026 phases 1–4 shipped · Design System + Admin Evolution complete · next Ready: resident-portal responsive · scanner onboarding.

---

## 🚀 Quick Start & Local Development

End state: **monorepo root** with Node 20+, **pnpm**, **PostgreSQL**, root **`.env.local`**, generated Prisma Client, schema applied (`db push` or migrations), and one or more **Next.js** or **Expo** dev servers running.

### Prerequisites

| Requirement        | Notes                                                                           |
| :----------------- | :------------------------------------------------------------------------------ |
| **Node.js ≥ 20**   | Matches `engines` in root `package.json`.                                       |
| **pnpm 8.15**      | Repo pins `packageManager`; use **Corepack** (recommended) or a global install. |
| **PostgreSQL 16+** | Local, Docker, or managed (Neon, Supabase, RDS, etc.).                          |
| **Git**            | Clone, hooks (Husky), and CI-aligned workflows.                                 |

**pnpm via Corepack (recommended):**

```bash
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

Optional: **Bun** (used for `@gate-access/db` tests), **Expo Go** or simulators for mobile apps.

### 1. Clone the monorepo

**HTTPS**

```bash
git clone https://github.com/iDorgham/Gateflow.git
cd Gateflow
```

**SSH**

```bash
git clone git@github.com:iDorgham/Gateflow.git
cd Gateflow
```

Your folder name may be `Gateflow`, `Gate-Access`, or another checkout name—what matters is that **`package.json`** and **`pnpm-workspace.yaml`** are at the current directory for all commands below.

### 2. Create a PostgreSQL database

Pick one approach:

| Approach      | Example                                                                                                            |
| :------------ | :----------------------------------------------------------------------------------------------------------------- |
| **Local CLI** | `createdb gate_access` then build a URL like `postgresql://USER:PASSWORD@localhost:5432/gate_access?schema=public` |
| **Docker**    | `docker run --name gateflow-pg -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=gate_access -p 5432:5432 -d postgres:16`    |
| **Hosted**    | Create a database in your provider’s UI and copy the connection string                                             |

**Prisma** (`packages/db/prisma/schema.prisma`) uses **`DATABASE_URL`** and a **`directUrl`** from **`DIRECT_DATABASE_URL`**.

- **Local Postgres (no Accelerate):** set **`DATABASE_URL`** and **`DIRECT_DATABASE_URL`** to the **same** direct connection string in **root** `.env.local`.
- **Prisma Accelerate / pooled URL for runtime:** keep **`DATABASE_URL`** as the pooled/accelerate URL if your deployment requires it, but set **`DIRECT_DATABASE_URL`** to the **direct** Postgres URL for migrations, `db push`, and CLI.

See also `packages/db/.env.example` and **[Environment variables](docs/guides/ENVIRONMENT_VARIABLES.md)**.

### 3. Install dependencies

```bash
pnpm install
```

### 4. Environment variables (minimal mental model)

| Variable                                  | Role                                                                   |
| :---------------------------------------- | :--------------------------------------------------------------------- |
| **`DATABASE_URL`**                        | App/runtime database access                                            |
| **`DIRECT_DATABASE_URL`**                 | Prisma migrations & direct CLI (often same as `DATABASE_URL` locally)  |
| **`NEXTAUTH_SECRET`**, **`NEXTAUTH_URL`** | Auth for Next.js apps                                                  |
| **`QR_SIGNING_SECRET`**                   | HMAC for QR payloads (must align with scanner `EXPO_PUBLIC_QR_SECRET`) |
| **`ENCRYPTION_MASTER_KEY`**               | Sensitive field encryption                                             |

Full matrix, per-app keys, and optional services (Redis, AI, Stripe): **[ENVIRONMENT_VARIABLES.md](docs/guides/ENVIRONMENT_VARIABLES.md)** and root **`.env.example`**.

### 5. Bootstrap the database (choose one path)

#### Path A — Automated (recommended)

```bash
pnpm setup:dev
```

`scripts/dev/setup-dev.js` will, among other steps:

1. Ensure dependencies (`pnpm install --frozen-lockfile`).
2. Seed **root** `.env.local` from `.env.example` and prompt for critical secrets.
3. Run **`pnpm db:generate`** (Prisma Client).
4. Run **`prisma db push`** (good for a fresh dev database).
5. Run **`pnpm check:env --app client`** (warnings are OK for optional keys).
6. Install **Husky** hooks.

If **`DIRECT_DATABASE_URL`** is missing from `.env.local`, add it (usually **identical** to `DATABASE_URL` for local Postgres).

#### Path B — Manual

```bash
cp .env.example .env.local
# Edit .env.local: DATABASE_URL, DIRECT_DATABASE_URL, NEXTAUTH_*, QR_SIGNING_SECRET, ENCRYPTION_MASTER_KEY, ADMIN_ACCESS_KEY, …
pnpm db:generate
pnpm --filter @gate-access/db exec prisma db push
```

**Versioned migrations** (instead of `db push`):

```bash
pnpm --filter @gate-access/db exec prisma migrate dev
```

**Inspect data:**

```bash
pnpm db:studio
```

**Env layering:** root `.env` / `.env.local` plus `apps/<app>/.env.local` (later wins). See `scripts/check/check-env.js` for how checks resolve files.

**App-specific examples:** `apps/marketing/.env.example`, `apps/resident-mobile/.env.example`.

### 6. Validate before you run UI

```bash
pnpm check:env              # all configured apps
pnpm check:env:client       # client dashboard only
pnpm preflight              # changelog + lint + typecheck + tests (slower CI-like gate)
pnpm workflow:v2:guide      # Workflow v2 status / next command (state: `.ai/workflow-v2/state.json`)
```

### 7. Run development servers

Commands are **Turborepo** wrappers from root `package.json` (`turbo dev` with a **filter**). **`pnpm dev`** runs **every** workspace that exposes a `dev` script—heavy on a laptop; prefer **filtered** commands for day-to-day work.

| Command                  | Turbo / package    | What you get                          | Default URL / notes                        |
| :----------------------- | :----------------- | :------------------------------------ | :----------------------------------------- |
| **`pnpm dev`**           | all `dev` tasks    | Parallel dev for the whole monorepo   | High CPU/RAM; use when you need everything |
| **`pnpm dev:client`**    | `client-dashboard` | Property / B2B dashboard + API routes | **http://localhost:3001**                  |
| **`pnpm dev:admin`**     | `admin-dashboard`  | Platform admin                        | **http://localhost:3002**                  |
| **`pnpm dev:marketing`** | `marketing`        | Public marketing site                 | **http://localhost:3000**                  |
| **`pnpm dev:resident`**  | `resident-portal`  | Resident web portal                   | **http://localhost:3004**                  |
| **`pnpm dev:scanner`**   | `scanner-app`      | Expo dev server (scanner)             | Terminal QR / Expo Go                      |
| **`pnpm dev:mobile`**    | `resident-mobile`  | Expo dev server (resident)            | Terminal QR / Expo Go                      |

**Custom filter (advanced):** same as scripts, e.g. `pnpm turbo dev --filter=client-dashboard`.

Ports change if a port is already in use—always trust the terminal output.

**Typical first session:** one terminal with **`pnpm dev:client`**. Add **`pnpm dev:admin`** when you need platform ops UI.

**Production build (all packages that define `build`):**

```bash
pnpm build
```

Per-app production **start** scripts live in each app’s `package.json` (e.g. `next start` after `next build`).

### 8. Mobile (Expo)

1. Install **Expo Go** (device) or use **iOS Simulator** / **Android Emulator**.
2. Run **`pnpm dev:scanner`** or **`pnpm dev:mobile`**.
3. Open the URL or scan the QR from the CLI.

**Scanner:** set **`EXPO_PUBLIC_API_URL`** (e.g. `http://localhost:3001/api` or your LAN IP for a physical device) and **`EXPO_PUBLIC_QR_SECRET`** to match **`QR_SIGNING_SECRET`**. Configure under `apps/scanner-app/.env` / `.env.local` or inherited env; use **`pnpm check:env`** if QR or auth fails.

### 9. Optional: `setup.sh`

Legacy bash helper (may create `apps/client-dashboard/.env.local`). Prefer **`pnpm setup:dev`** for one **root** `.env.local` aligned with `setup-dev.js`.

---

## 🏗️ Master Architecture

GateFlow follows a modern, enterprise-grade, scalable monorepo structure powered by **Turborepo** and **pnpm**, ensuring consistent versioning and
high-speed delivery paths.

```text
/GateFlow (Root)
├── /apps                          # Mission-Critical Applications
│   ├── admin-dashboard            # Internal Platform Operations (Next.js 16)
│   ├── client-dashboard           # B2B Property Manager Portal (Next.js 16)
│   ├── marketing                  # Public Landing & SEO Funnels (Next.js 16)
│   ├── resident-mobile            # Native iOS/Android Apps (Expo 54)
│   ├── resident-portal            # Web-based Resident Utility (Next.js 16)
│   └── scanner-app               # Field Verification (React Native, Offline-First)
├── /packages                      # Shared Core Infrastructure
│   ├── db                         # Prisma + Multi-tenant middleware + Seeding
│   ├── ui                         # Atlassian Design System (ADS) Component Library
│   ├── types                      # Universal TS Types & Zod Cross-App Schemas
│   ├── i18n                       # Localized AR/EN Dictionaries
│   ├── api-client                 # Shared Type-safe Fetch Utilities
│   └── config                    # Shared ESLint + Tailwind + TSConfig Presets
└── /scripts                       # The Ralph Loop Automation Backbone
```

---

## 🛡️ Strategic Core Pillars

### 1. Cryptographic Access (Zero-Trust)

Verification happens exclusively on the edge. Every QR code contains a cryptographic proof of origin, ensuring gate operations continue even with zero connectivity. All sensitive field data is encrypted at rest using **AES-256**.

### 2. Physical-to-Digital Marketing ROI

The first platform to bridge the gap between digital spend and physical arrivals.

- **UTM Lifecycle Persistence**: Track visitors from ad-click (Meta/Google/SMS) to the physical scanner.
- **Conversion APIs**: Automated server-side firing to Meta Pixel and GA4 upon gate entry.

### 3. Atlassian Design System (ADS) Foundation

A global design token architecture ensures that brand identity, typography, and spacing are 100% consistent across web and native mobile interfaces.

---

## 🔒 Security & Compliance

GateFlow is built with a "Security-by-Design" philosophy.

- **HMAC-SHA256 Signing**: Every QR pass is cryptographically signed and immutable.
- **Fail-closed Tenant Isolation**: Request-local Prisma tenant context (`AsyncLocalStorage`) scopes `organizationId` and fails closed when context is missing.
- **AES-256 Encryption**: Native encryption for sensitive offline scan queues.
- **RBAC + API Guards**: Granular Role-Based Access Control; high-risk admin APIs use auth, validation, and rate limits.
- **Shared Security Headers**: HSTS + CSP applied across Next.js apps; CMS HTML/CSS sanitized at trust boundaries.
- **Trustworthy CI**: Repo scanners fail on zero-file or unavailable advisory results; full dashboard typecheck in preflight.

See **[PRD §9](docs/reference/product/PRD.md)** and **[CHANGELOG](CHANGELOG.md)** for the 2026 audit remediation outcomes.

---

## 📅 Recent Engineering Activity

- **[Client Dashboard Readiness 2026]:** complete phase 5
- **[Workflow-V2]:** bootstrap guide status/next/prompt/delivery
- **[Audit Remediation 2026]:** Phases 1–4 shipped — P0 containment, fail-closed tenancy, CI scanners, API guards + security headers (PRs #153–#155)
- **[Deploy]:** Vercel `ignoreCommand` skips Dependabot and automatic Preview builds (Hobby quota)
- **[DB]:** Production migrate unblock for stuck `platform_evolution` migration

---

## 🧠 Analytics & Intelligence

Transforming physical arrivals into actionable data intelligence.

- **Real-time Monitoring**: Server-Sent Events (SSE) push scan logs directly to administrative panels.
- **GateAI Co-pilot**: An agentic intelligence layer to manage infrastructure via natural language.
- **Advanced Charts**: High-density Recharts data visualization integrated into the "Resident CRM".

---

## 🌐 Localization & i18n

Engineered specifically for the Middle Eastern market.

- **Arabic-First Design**: Full RTL (Right-to-Left) layout support for Arabic speakers.
- **Zero-Friction Switching**: Clean, localized typography (Cairo font) for bi-directional support.
- **Dynamic LTRS/RTL**: UI components automatically adjust dimensions based on the active locale.

---

## 🚀 The Ralph Loop Automation

Every routine engineering task is managed by **Ralph**, the GateFlow autonomous engineering backbone.

- **19+ Automation Scripts**: From hierarchical seeding to automated traffic emulation.
- **5 Husky Git Hooks**: Enforcing committed secrets scanning, linting, and AI-tool sync.
- **Phase Runner**: Plan-to-dev automation with explicit gates (lint, tests, docs checks per phase).
- **Type-Safe Sync**: Cross-package synchronization for universal types and schemas.

---

## 📊 Performance & Governance

Quality is enforced in **CI** (lint, typecheck, tests) and optional **Lighthouse** workflows; dependency alignment is tracked across workspaces.

<p align="left">
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/lighthouse.yml"><img src="https://img.shields.io/badge/Lighthouse-workflow-FF6B35?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Lighthouse workflow"></a>
  <img src="https://img.shields.io/badge/Deps-pnpm_overrides-7C3AED?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm overrides">
</p>

- **Lighthouse initiative**: Goal is consistent **100/100** where applicable; track progress in **[UPCOMING.md](docs/reference/product/UPCOMING.md)** and the `lighthouse.yml` workflow—not a hard guarantee on every page at every commit.
- **pnpm overrides**: Root `package.json` `pnpm.overrides` pins shared transitive versions across workspaces.
- **CI/CD**: GitHub Actions for verification; web apps target **Vercel**, mobile via **Expo EAS** (see [`infra/README.md`](infra/README.md)).

---

## 📚 Documentation & Support

| Resource                                                          | Purpose                                                          |
| :---------------------------------------------------------------- | :--------------------------------------------------------------- |
| **[PRD (product reference)](docs/reference/product/PRD.md)**      | Technical product specification                                  |
| **[UPCOMING.md](docs/reference/product/UPCOMING.md)**             | **Roadmap SSOT** — initiatives, shipped work, strategic goals    |
| **[Environment variables](docs/guides/ENVIRONMENT_VARIABLES.md)** | Required and optional keys per app                               |
| **[Marketing Suite](docs/reference/product/MARKETING_SUITE.md)**  | Physical attribution and growth                                  |
| **[Automation guide](docs/guides/AUTOMATION_GUIDE.md)**           | Ralph Loop scripts and hooks                                     |
| **[Infrastructure](infra/README.md)**                             | Vercel, EAS, and related deployment notes                        |
| **[CHANGELOG](CHANGELOG.md)**                                     | Release history                                                  |
| **[Docs index](docs/INDEX.md)**                                   | Generated map of `docs/` (run `pnpm docs:index` after doc moves) |

---

<p align="center">
  <a href="https://github.com/iDorgham/Gateflow/stargazers"><img src="https://img.shields.io/github/stars/iDorgham/Gateflow?style=flat-square&logo=github&color=0ea5e9" alt="GitHub stars"></a>
  <a href="https://github.com/iDorgham/Gateflow/network/members"><img src="https://img.shields.io/github/forks/iDorgham/Gateflow?style=flat-square&logo=github&color=8b5cf6" alt="GitHub forks"></a>
  <img src="https://img.shields.io/github/languages/top/iDorgham/Gateflow?style=flat-square&color=3178C6" alt="Top language">
  <img src="https://img.shields.io/github/repo-size/iDorgham/Gateflow?style=flat-square&color=0ea5e9" alt="Repository size">
  <img src="https://img.shields.io/badge/Infrastructure-Vercel_+_EAS-000000?style=flat-square&logo=vercel&logoColor=white" alt="Infrastructure">
  <img src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=flat-square" alt="License">
</p>

<div align="center">
  <sub>Managed by the <b>Ralph Loop</b> Autonomous Engineering Infrastructure.</sub><br>
  <sub>&copy; 2026 GateFlow. All rights reserved.</sub>
</div>
