# <p align="center">GateFlow — The Invisible Sentinel</p>

<p align="center">
  <img src="assets/Images/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<p align="center">
  <b>Enterprise platform for physical access control and marketing intelligence.</b><br>
  <i>Multi-tenant Next.js dashboards, Expo field apps, signed QR flows, and Arabic/English RTL—built for high-trust PropTech (including MENA).</i>
</p>

<!-- Release, automation, activity -->
<p align="center">
  <a href="https://github.com/iDorgham/Gateflow/blob/master/package.json"><img src="https://img.shields.io/badge/Release-v0.1.0-0ea5e9?style=for-the-badge&logo=github" alt="Release v0.1.0"></a>
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/ci.yml?branch=master&label=CI&logo=github&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/lighthouse.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/lighthouse.yml?branch=master&label=Lighthouse&logo=lighthouse&style=for-the-badge" alt="Lighthouse workflow"></a>
  <a href="https://github.com/iDorgham/Gateflow/actions/workflows/codeql-analysis.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Gateflow/codeql-analysis.yml?branch=master&label=CodeQL&logo=github&style=for-the-badge" alt="CodeQL"></a>
  <img src="https://img.shields.io/github/commit-activity/m/iDorgham/Gateflow?style=for-the-badge&color=blueviolet&logo=github" alt="Commit activity">
</p>

<!-- Runtime, package manager, posture -->
<p align="center">
  <img src="https://img.shields.io/badge/node.js-≥20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 20+">
  <img src="https://img.shields.io/badge/pnpm-8.15-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm 8.15">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.9">
  <img src="https://img.shields.io/badge/Status-Production--ready-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/QR_signing-HMAC--SHA256-critical?style=for-the-badge" alt="HMAC-SHA256 QR signing">
</p>

<!-- Application stack (pinned to repo) -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma 5.22">
  <img src="https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16+">
  <img src="https://img.shields.io/badge/Expo-54-4630EB?style=for-the-badge&logo=expo&logoColor=white" alt="Expo 54">
  <img src="https://img.shields.io/badge/Turborepo-2.8-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo 2.8">
</p>

---

## 💎 The Vision

GateFlow treats **every physical arrival** as a first-class digital event: signed QR credentials, tenant-safe data, offline-capable scanners, and marketing attribution from ad click to gate entry. The monorepo delivers six coordinated apps—web dashboards, resident surfaces, and native field tools—on one shared design system, schema, and automation toolchain.

---

## 🗂️ Table of Contents

1.  [The 6-App Ecosystem](#-the-6-app-ecosystem)
2.  [Upcoming features](#-upcoming-features)
3.  [Clone, database & run (from GitHub)](#-quick-start--local-development)
4.  [Master Architecture](#-master-architecture)
5.  [Strategic Core Pillars](#-strategic-core-pillars)
6.  [Security & Compliance](#-security--compliance)
7.  [Analytics & Intelligence](#-analytics--intelligence)
8.  [Localization & i18n](#-localization--i18n)
9.  [The Ralph Loop Automation](#-the-ralph-loop-automation)
10. [Performance & Governance](#-performance--governance)
11. [Documentation & Support](#-documentation--support)

---

## 🏗️ The 6-App Ecosystem

GateFlow is a technical monorepo orchestrating six specialized applications, unified by a shared core of design tokens, cryptographic standards, and real-time data flows.

<details open>
<summary><b>View App Matrix</b></summary>

| Application                                   | Role           | Key Capability                                    | Deployment              |
| :-------------------------------------------- | :------------- | :------------------------------------------------ | :---------------------- |
| **[Client Dashboard](apps/client-dashboard)** | Property Hub   | Real-time monitoring (SSE), Marketing ROI & CRM.  | Vercel                  |
| **[Admin Dashboard](apps/admin-dashboard)**   | Platform Ops   | Multi-tenant isolation & Cloud platform health.   | Vercel                  |
| **[Resident Mobile](apps/resident-mobile)**   | User Interface | Native iOS/Android pass creation & WhatsApp sync. | App Store/Play          |
| **[Scanner App](apps/scanner-app)**           | Field Agent    | Offline-first HMAC validation & Haptic feedback.  | Enterprise Distribution |
| **[Resident Portal](apps/resident-portal)**   | Web Access     | Guest management & Pass self-service utility.     | Vercel                  |
| **[Marketing Site](apps/marketing)**          | Growth Node    | High-SEO conversion funnels & Tracking events.    | Vercel                  |

</details>

---

## 🔮 Upcoming features

**Single source of truth:** [`docs/reference/product/UPCOMING.md`](docs/reference/product/UPCOMING.md) — active initiatives (with plan links), planning backlog, recently shipped highlights, and Q3 strategic goals.

The README does **not** duplicate that document. Open **UPCOMING.md** for tables, sprint status, and initiative detail; refresh this section only when you want a new high-level teaser line here.

> **Snapshot (see UPCOMING.md for live status):** GitHub security hardening follow-ups · WhatsApp/SMS gateway · Hierarchical seeding v2 · Q3 focus: Lighthouse initiative, offline HMAC hardening, self-serve billing.

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
│   ├── admin-dashboard            # Internal Platform Operations (Next.js 15)
│   ├── client-dashboard           # B2B Property Manager Portal (Next.js 15)
│   ├── marketing                  # Public Landing & SEO Funnels (Next.js 15)
│   ├── resident-mobile            # Native iOS/Android Apps (Expo 54)
│   ├── resident-portal            # Web-based Resident Utility (Next.js 15)
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
- **Tenant Isolation**: Prisma middleware enforces `organizationId` scoping on every database query.
- **AES-256 Encryption**: Native encryption for sensitive offline scan queues.
- **RBAC Enforcement**: Granular Role-Based Access Control across all dashboards.

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
