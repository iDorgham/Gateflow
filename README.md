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

  <!-- CI / Deploy / Quality -->
  <p>
    <a href="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml">
      <img src="https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml/badge.svg" alt="CI">
    </a>
    <a href="https://github.com/iDorgham/Gateflow/actions/workflows/deploy.yml">
      <img src="https://github.com/iDorgham/Gateflow/actions/workflows/deploy.yml/badge.svg" alt="Deploy">
    </a>
    <a href="https://github.com/iDorgham/Gateflow/releases">
      <img src="https://img.shields.io/github/v/release/iDorgham/Gateflow?style=flat-square&label=release&color=4CAF50" alt="Latest Release">
    </a>
    <a href="https://github.com/iDorgham/Gateflow/actions/workflows/lighthouse.yml">
      <img src="https://img.shields.io/badge/Lighthouse-Perf_≥90_A11y_≥95-4CAF50?style=flat-square&logo=lighthouse" alt="Lighthouse">
    </a>
  </p>

  <!-- Tech Stack -->
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js">
    </a>
    <a href="https://expo.dev">
      <img src="https://img.shields.io/badge/Expo-54-4630EB?style=for-the-badge&logo=expo" alt="Expo">
    </a>
    <a href="https://www.prisma.io/">
      <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
    </a>
    <a href="https://pnpm.io/">
      <img src="https://img.shields.io/badge/pnpm-8.15-F69220?style=for-the-badge&logo=pnpm" alt="pnpm">
    </a>
    <a href="https://turbo.build/">
      <img src="https://img.shields.io/badge/Turborepo-2.8-EF4444?style=for-the-badge&logo=turborepo" alt="Turborepo">
    </a>
  </p>

  <!-- Product Badges -->
  <p>
    <img src="https://img.shields.io/badge/Status-MVP_Complete-success?style=for-the-badge" alt="Status">
    <img src="https://img.shields.io/badge/Security-HMAC--SHA256_+_AES--256-red?style=for-the-badge" alt="Security">
    <img src="https://img.shields.io/badge/i18n-AR_+_EN_Full_RTL-blue?style=for-the-badge" alt="i18n">
    <img src="https://img.shields.io/badge/Automation-Ralph_Loop-orange?style=for-the-badge" alt="Automation">
  </p>

  <!-- Code Quality -->
  <p>
    <img src="https://img.shields.io/badge/Commitlint-Conventional_Commits-yellow?style=flat-square&logo=commitlint" alt="Commitlint">
    <img src="https://img.shields.io/badge/Lint--staged-Pre--commit-blue?style=flat-square" alt="lint-staged">
    <img src="https://img.shields.io/badge/Husky-5_Git_Hooks-green?style=flat-square" alt="Husky">
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=flat-square" alt="License">
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Vision & Core Pillars](#-vision--core-pillars)
- [📱 The 6-App Ecosystem](#-the-6-app-ecosystem)
- [🏗️ Monorepo Structure](#-monorepo-structure)
- [⚡ Quick Start](#-quick-start)
- [🤖 The Ralph Loop — Automation System](#-the-ralph-loop--automation-system)
- [📋 Command Reference](#-command-reference)
- [🔀 Best Development Workflow](#-best-development-workflow)
- [🔐 Security Architecture](#-security-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🚀 CI/CD & Deployment](#-cicd--deployment)
- [📊 Project Progress Dashboard](#-project-progress-dashboard)
- [📖 Documentation Library](#-documentation-library)

---

## ✨ Vision & Core Pillars

GateFlow is not just a QR scanner — it's **Stripe-level infrastructure for physical access**. We bridge the gap between digital marketing spend and physical gate arrivals, providing a seamless, secure, and auditable flow for gated communities, events, and enterprise facilities.

### 🛡️ Secure Access Architecture

Every access request is verified cryptographically. Zero-trust network assumption; verification on the edge so gates open in **<100ms even with zero connectivity**.

### 📈 Marketing Intelligence

Transform gate entries into data points. Capture UTM parameters, fire Meta/Google pixels on guest arrival, sync physical visits to HubSpot/Salesforce via real-time webhooks.

### 🤖 Autonomous Engineering (The Ralph Loop)

Developed with AI-assisted governance — 100% adherence to ADS design tokens, perfect RTL layout for Arabic, automated tenant isolation at the database layer, and a complete automation stack with 19 Ralph scripts, 5 git hooks, and 12 quality-check scripts.

---

## 📱 The 6-App Ecosystem

| App                                             | Status | User              | Core Capability                                                   |
| :---------------------------------------------- | :----: | :---------------- | :---------------------------------------------------------------- |
| **[Client Dashboard](./apps/client-dashboard)** |   ✅   | Property Managers | Real-time scan feeds (SSE), QR config, Marketing Suite, Team RBAC |
| **[Scanner App](./apps/scanner-app)**           |   ✅   | Security Guards   | Offline-first HMAC verify, AES-256 local queue, Haptic feedback   |
| **[Resident Mobile](./apps/resident-mobile)**   |   ✅   | Residents         | Native iOS/Android, WhatsApp share, push notifications            |
| **[Resident Portal](./apps/resident-portal)**   |   ✅   | Guests/VIPs       | Responsive web self-service for pass management                   |
| **[Admin Dashboard](./apps/admin-dashboard)**   |   ✅   | Super Admins      | Multi-tenant oversight, billing, platform health                  |
| **[Marketing Site](./apps/marketing)**          |   ✅   | Prospects         | SEO-optimized conversion funnels, industry-specific solutions     |

---

## 🏗️ Monorepo Structure

```
GateFlow/
├── apps/
│   ├── admin-dashboard/       # Internal platform operations (Next.js 14)
│   ├── client-dashboard/      # B2B Property Manager portal (Next.js 14)
│   ├── marketing/             # Public landing page & SEO (Next.js 14)
│   ├── resident-mobile/       # Native Resident app (Expo 54)
│   ├── resident-portal/       # Web-based Resident portal (Next.js 14)
│   └── scanner-app/           # Native Guard/Scanner application (Expo 54)
├── packages/
│   ├── db/                    # Shared Prisma schema, client & migrations
│   ├── ui/                    # Shared shadcn/ADS component library
│   ├── types/                 # Universal TS types & Zod schemas
│   ├── i18n/                  # AR/EN translation dictionaries
│   └── config/                # Shared ESLint, Tailwind & TSConfig
├── docs/
│   ├── plan/                  # Ralph plan lifecycle (planning→done)
│   │   ├── planning/          # Plans being drafted
│   │   ├── planned/           # Plans approved and ready
│   │   ├── in-progress/       # Plans currently being executed
│   │   ├── done/              # Shipped plans
│   │   ├── backlog/           # ALL_TASKS_BACKLOG.md
│   │   └── execution/         # Phase prompt files (PROMPT_<slug>_phase_N.md)
│   ├── guides/                # DEVELOPMENT_GUIDE, AUTOMATION_GUIDE, etc.
│   ├── core/                  # CLAUDE.md, AI tools config
│   └── INDEX.md               # Auto-generated docs index
├── scripts/
│   ├── ralph.js               # Master dashboard (pnpm ralph)
│   ├── ralph-plan.js          # Plan lifecycle automation
│   ├── ralph-run.js           # Phase runner
│   ├── ralph-docs.js          # Docs automation (changelog, release, readme)
│   ├── ralph-git.js           # Git branch/commit/merge automation
│   ├── ralph-hotfix.js        # Hotfix workflow
│   ├── ralph-organize.js      # Docs folder cleanup & indexing
│   ├── phase-close.js         # Auto-close phases from commit messages
│   ├── scan-secrets.js        # Pre-commit secret scanner (12 HIGH patterns)
│   ├── check-env.js           # Environment variable validator
│   ├── check-bundle-size.js   # Bundle size guard (10%/25% thresholds)
│   ├── check-imports.js       # Circular import detector
│   ├── check-db-drift.js      # DB schema drift detector
│   ├── pre-deploy.js          # Pre-deploy checklist (5 checks)
│   ├── todos.js               # TODO/FIXME technical debt report
│   ├── setup-dev.js           # Interactive dev onboarding
│   └── sync-ai-tools.sh       # Propagate config to all 7 AI tools
├── .husky/
│   ├── commit-msg             # commitlint — conventional commits enforcer
│   ├── pre-commit             # secret scan → lint-staged → prisma guard
│   ├── post-commit            # sync AI tools → changelog → phase auto-close
│   ├── pre-push               # branch enforcer → preflight (lint+type+test)
│   └── post-merge             # auto patch-bump on feat/* → master
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # Lint + typecheck + test
│   │   ├── deploy.yml         # Vercel deployment
│   │   ├── lighthouse.yml     # PageSpeed audits
│   │   ├── release.yml        # Auto GitHub Release from CHANGELOG
│   │   └── pr-labels.yml      # PR size label + affected packages comment
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── task.md
└── commitlint.config.js       # 13 commit types, 30 scopes
```

---

## ⚡ Quick Start

### 1. Automated Onboarding (Recommended)

```bash
git clone https://github.com/iDorgham/Gateflow.git && cd Gateflow
pnpm install
pnpm setup:dev          # Interactive onboarding: env vars, DB, husky, validation
```

`pnpm setup:dev` will:

- Prompt for `DATABASE_URL`, `NEXTAUTH_SECRET`, `QR_SIGNING_SECRET`, `ENCRYPTION_MASTER_KEY`
- Create `.env.local` in all relevant apps
- Run `prisma generate` + `prisma db push`
- Validate all environment variables
- Install and configure Husky git hooks

### 2. Manual Setup

```bash
# Clone & install
git clone https://github.com/iDorgham/Gateflow.git && cd Gateflow
pnpm install

# Environment — copy and fill in required values
cp .env.example .env.local

# Database
pnpm db:generate       # Generate Prisma client
pnpm db:push           # Push schema to DB (dev)
pnpm db:studio         # Open Prisma Studio

# Run everything
pnpm dev               # All 6 apps in parallel
pnpm dev:client        # Client dashboard only (port 3001)
pnpm dev:admin         # Admin dashboard only
pnpm dev:marketing     # Marketing site only
pnpm dev:scanner       # Scanner app (Expo)

# Quality gates before committing
pnpm preflight         # lint + typecheck + test (all workspaces)
```

### 3. Check Workspace Status

```bash
pnpm ralph             # Full automation dashboard (git, plans, hooks, quality)
pnpm ralph:short       # Compact summary (git + plans only)
```

---

## 🤖 The Ralph Loop — Automation System

Ralph is the GateFlow automation engine. Every routine task — from creating a plan to shipping a release — is orchestrated by Ralph scripts that fire automatically at the right moment.

### How It Works

```
Idea → Plan → Develop → Test → Commit → Verify → Ship → Document
  ↑                                                          ↓
  └──────────────── Ralph Loop ──────────────────────────────┘
```

### Trigger Map

| Trigger                    | What Fires                                                                      |
| :------------------------- | :------------------------------------------------------------------------------ |
| `git commit`               | commitlint → secret scan → lint-staged → AI sync → changelog → phase auto-close |
| `git push`                 | Branch enforcer → preflight (lint + typecheck + test)                           |
| `feat/* → master merge`    | Auto patch-bump → annotated git tag                                             |
| `pnpm plan:new <slug>`     | Creates plan folder + template in `planning/`                                   |
| `pnpm plan:ready <slug>`   | Moves `planning/` → `planned/`                                                  |
| `pnpm plan:start <slug>`   | Moves `planned/` → `in-progress/` + PRD update + CHANGELOG                      |
| `pnpm plan:run <slug> <N>` | Execute phase N with the right CLI + mark `[x]` + auto-done                     |
| `pnpm plan:done <slug>`    | Moves `in-progress/` → `done/` + CHANGELOG + FEATURE_LOG + README + auto PR     |
| `pnpm docs:release`        | CHANGELOG preview + version bump + close `[Unreleased]` + git tag               |
| `git push origin v*`       | GitHub Release auto-published from CHANGELOG section                            |
| PR opened/updated          | Size label (XS→XL) + affected packages comment                                  |
| `.agents/` file change     | `sync-ai-tools.sh`: propagate config to all 7 AI tools                          |

### Git Hook Chain

```
pre-commit                   post-commit                   pre-push
─────────────────────        ───────────────────────────   ─────────────────────
1. scan-secrets.js           1. sync-ai-tools.sh           1. Branch pattern check
2. lint-staged               2. ralph-docs.js changelog    2. pnpm preflight
3. prisma.prisma guard          (feat/fix/perf/security)      (lint+typecheck+test)
                             3. phase-close.js
```

---

## 📋 Command Reference

### Ralph Dashboard

| Command            | What It Does                                                            |
| :----------------- | :---------------------------------------------------------------------- |
| `pnpm ralph`       | Full workspace dashboard: git state, plans, hooks, quality, next action |
| `pnpm ralph:short` | Compact view: git + plans only                                          |

### Plan Lifecycle

| Command                             | What It Does                                                       |
| :---------------------------------- | :----------------------------------------------------------------- |
| `pnpm plan:new <slug> [--phases N]` | Create new plan in `planning/` with N phases                       |
| `pnpm plan:ready <slug>`            | Approve plan — move `planning/` → `planned/`                       |
| `pnpm plan:start <slug>`            | Begin work — move `planned/` → `in-progress/`                      |
| `pnpm plan:run <slug> <N>`          | Execute phase N (auto-selects CLI, marks `[x]`, auto-done on last) |
| `pnpm plan:done <slug>`             | Ship plan — move to `done/`, update all docs, create PR            |
| `pnpm plan:status`                  | Show all plans across all states with progress                     |
| `pnpm plan:pr <slug>`               | Create GitHub PR for a plan (also auto-runs on `plan:done`)        |

### Docs & Versioning

| Command                   | What It Does                                         |
| :------------------------ | :--------------------------------------------------- | ------- | ---------------------------- |
| `pnpm docs:release`       | Full release: CHANGELOG preview → version bump → tag |
| `pnpm docs:release:dry`   | Dry-run release — preview only, no changes           |
| `pnpm docs:changelog`     | Update CHANGELOG from current branch commits         |
| `pnpm docs:readme`        | Refresh README with latest plan/feature data         |
| `pnpm docs:organize`      | Clean docs folder + rebuild INDEX.md                 |
| `pnpm docs:index`         | Rebuild INDEX.md only                                |
| `pnpm docs:clean`         | Remove empty dirs and orphaned files                 |
| `pnpm version:bump [patch | minor                                                | major]` | Bump version in package.json |
| `pnpm version:tag`        | Create annotated git tag for current version         |
| `pnpm version:info`       | Show current version + last tag                      |

### Quality Checks

| Command                      | What It Does                                         |
| :--------------------------- | :--------------------------------------------------- |
| `pnpm preflight`             | Full gate: lint + typecheck + test (all workspaces)  |
| `pnpm check:env`             | Validate all environment variables across apps       |
| `pnpm check:env:client`      | Validate client-dashboard env vars only              |
| `pnpm check:secrets`         | Scan entire repo for leaked secrets                  |
| `pnpm check:bundle`          | Check bundle size vs baseline (warn >10%, fail >25%) |
| `pnpm check:bundle:update`   | Accept current bundle as new baseline                |
| `pnpm check:bundle:report`   | Full bundle breakdown by file                        |
| `pnpm check:imports`         | Report circular import cycles                        |
| `pnpm check:imports:fail`    | Same but exits non-zero if cycles found              |
| `pnpm check:todos`           | List all TODO/FIXME/HACK with author + age           |
| `pnpm check:todos:fixme`     | Show FIXME items only                                |
| `pnpm check:todos:old`       | Show items older than 30 days                        |
| `pnpm check:db-drift`        | Check DB schema drift vs baseline hash               |
| `pnpm check:db-drift:schema` | Offline schema hash check only                       |
| `pnpm check:pre-deploy`      | Full pre-deploy checklist (5 checks)                 |
| `pnpm check:pre-deploy:fail` | Same but exits non-zero on any failure (for CI)      |

### Hotfix Workflow

| Command                    | What It Does                                       |
| :------------------------- | :------------------------------------------------- |
| `pnpm hotfix:start <slug>` | Branch off master → `hotfix/v{ver}-{slug}`         |
| `pnpm hotfix:done <slug>`  | Preflight → bump patch → CHANGELOG → tag → auto PR |
| `pnpm hotfix:status`       | List all active hotfix branches                    |

### Dev & Database

| Command              | What It Does                         |
| :------------------- | :----------------------------------- |
| `pnpm dev`           | Start all apps in parallel           |
| `pnpm dev:client`    | Client dashboard (port 3001)         |
| `pnpm dev:admin`     | Admin dashboard                      |
| `pnpm dev:marketing` | Marketing site                       |
| `pnpm dev:scanner`   | Expo scanner app                     |
| `pnpm db:generate`   | Run `prisma generate`                |
| `pnpm db:studio`     | Open Prisma Studio                   |
| `pnpm build`         | Build all workspaces via Turborepo   |
| `pnpm lint`          | Lint all workspaces                  |
| `pnpm test`          | Test all workspaces                  |
| `pnpm typecheck`     | Typecheck all workspaces             |
| `pnpm sync`          | Manually sync config to all AI tools |
| `pnpm setup:dev`     | Run interactive dev onboarding       |

---

## 🔀 Best Development Workflow

Follow the **Ralph Loop** — every step fires automation so you never miss a quality gate.

### Starting a New Feature

```bash
# 1. Check workspace state
pnpm ralph

# 2. Create a plan
pnpm plan:new my-feature --phases 5

# 3. Edit the phase prompts in docs/plan/planning/my-feature/
#    PROMPT_my-feature_phase_1.md ... phase_5.md

# 4. Approve the plan
pnpm plan:ready my-feature

# 5. Start development (creates branch automatically)
pnpm plan:start my-feature

# 6. Work phase by phase
pnpm plan:run my-feature 1   # implements, tests, commits phase 1
pnpm plan:run my-feature 2   # implements, tests, commits phase 2
# ... continues until all phases are [x]

# 7. Ship (auto-updates docs, creates PR)
pnpm plan:done my-feature
```

### The Commit Discipline

```bash
# Always use conventional commits (enforced by commitlint)
git commit -m "feat(client): add export button to scans page — phase 3"
#                ↑ type  ↑ scope                                  ↑ auto-closes phase

# Valid types: feat, fix, chore, perf, docs, refactor, security, ci, test, hotfix
# Valid scopes: client, admin, scanner, mobile, portal, marketing, db, ui, types, i18n, config

# Phase auto-close patterns in commit messages:
# "phase 3"           → marks phase 3 [x]
# "phase 3 of slug"   → marks phase 3 of plan "slug" [x]
# "[p3]"              → shorthand
# "closes phase 3"    → explicit close
```

### Before Every Push

```bash
# pre-push hook runs this automatically, but you can run it manually
pnpm preflight   # lint + typecheck + test — must be green
```

### Releasing

```bash
# 1. Preview what the release will look like (no changes)
pnpm docs:release:dry

# 2. Run the full release
pnpm docs:release

# 3. Push the tag — GitHub Release auto-publishes from CHANGELOG
git push origin v0.2.0
```

### Emergency Hotfix

```bash
pnpm hotfix:start critical-login-bug   # branches off master
# ... fix the bug ...
git add . && git commit -m "fix(auth): resolve JWT expiry edge case"
pnpm hotfix:done critical-login-bug    # auto PR + bump + tag
```

### Checking Code Quality

```bash
pnpm check:todos:old      # find stale TODOs (30+ days)
pnpm check:imports        # find circular dependencies
pnpm check:db-drift       # check if schema changed without migration
pnpm check:secrets        # scan for leaked API keys
pnpm check:pre-deploy     # full checklist before any deployment
```

---

## 🔐 Security Architecture

GateFlow follows strict **Security-by-Design** philosophy with automated enforcement.

### Access Security

- **HMAC-SHA256 QR Signing** — every QR contains a cryptographic signature. Altering one character fails immediately.
- **AES-256 Storage** — offline sync queues and sensitive data encrypted at rest.
- **Argon2id** — strongest modern password hashing for all user credentials.
- **15-min JWT + 30-day refresh** — short-lived tokens with rotation.
- **Tenant Isolation** — Prisma middleware hard-scopes every query to `organizationId`. Callers MUST call `clearOrganizationContext()` in `finally`.
- **Audit Logging** — every admin action and scan event is logged immutably with actor attribution.

### Automated Security

- **Pre-commit secret scanner** (`scan-secrets.js`): 12 HIGH patterns (AWS keys, Stripe, GitHub PAT, OpenAI, Anthropic keys, private keys) **block commit**. 4 MEDIUM patterns warn. Skips `.github/workflows/`, test files, `node_modules`.
- **Env var validator** (`check-env.js`): Checks presence, detects placeholder values, enforces minLength for secrets.
- **Branch enforcer** (pre-push hook): Only `feat/`, `fix/`, `chore/`, `hotfix/`, `refactor/`, `docs/`, `test/`, `perf/`, `ci/`, `security/` branches allowed to push.
- **Required env vars** throw in production if missing (`NEXTAUTH_SECRET`, `QR_SIGNING_SECRET`, `ADMIN_ACCESS_KEY`).

### GitHub Secrets Required

```
# Core security
NEXTAUTH_SECRET           # ≥32 chars — JWT signing
QR_SIGNING_SECRET         # ≥32 chars — HMAC QR signing
ENCRYPTION_MASTER_KEY     # ≥32 chars — AES-256 data encryption
ADMIN_ACCESS_KEY          # Admin bypass key

# Database
CI_DATABASE_URL           # postgres://... (CI test database)

# Vercel deployment
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID_CLIENT_DASHBOARD
VERCEL_PROJECT_ID_ADMIN_DASHBOARD
VERCEL_PROJECT_ID_MARKETING
VERCEL_PROJECT_ID_RESIDENT_PORTAL

# Optional: Turborepo remote cache
TURBO_TOKEN
TURBO_TEAM
```

---

## 💻 Tech Stack

### Core

| Layer         | Technology                  | Version               |
| :------------ | :-------------------------- | :-------------------- |
| Monorepo      | Turborepo + pnpm            | Turbo 2.8 / pnpm 8.15 |
| Web Framework | Next.js (App Router + RSC)  | 14.2                  |
| Mobile        | React Native via Expo       | Expo 54               |
| Database      | PostgreSQL + Prisma ORM     | Prisma 5              |
| Language      | TypeScript (strict)         | 5.3                   |
| Styling       | Tailwind CSS v3 + shadcn/ui | Tailwind 3.4          |

### UI & Animation

| Library                     | Purpose                         |
| :-------------------------- | :------------------------------ |
| shadcn/ui + Radix           | Accessible component primitives |
| Motion.dev (Framer Motion)  | UI animations (standard choice) |
| React Spring                | Chart/data animations           |
| Lottie React                | Branded/complex animations      |
| GSAP                        | Rare, high-complexity sequences |
| Recharts / Tremor / ECharts | Analytics charts                |
| React Three Fiber           | 3D/WebGL effects                |

### Validation & Type Safety

| Library              | Purpose                         |
| :------------------- | :------------------------------ |
| Zod                  | Runtime schema validation       |
| `@gate-access/types` | Shared TS types across all apps |
| commitlint           | Conventional commit enforcement |
| ESLint + Prettier    | Code style + formatting         |

---

## 🚀 CI/CD & Deployment

### GitHub Actions Workflows

| Workflow         | Trigger              | Purpose                                        |
| :--------------- | :------------------- | :--------------------------------------------- |
| `ci.yml`         | Push / PR            | Lint + typecheck + test in parallel            |
| `deploy.yml`     | Push to master       | Deploy web apps to Vercel                      |
| `lighthouse.yml` | PR / daily           | PageSpeed: Perf ≥90, A11y ≥95, SEO ≥95         |
| `release.yml`    | `git push origin v*` | Auto-publish GitHub Release from CHANGELOG     |
| `pr-labels.yml`  | PR open/sync         | Size label (XS→XL) + affected packages comment |

### Release Flow

```
pnpm docs:release:dry    # Preview
pnpm docs:release        # Bump version, close [Unreleased] in CHANGELOG, tag
git push && git push origin v0.2.0   # Deploy + GitHub Release auto-published
```

### PR Size Labels

| Label     | Lines Changed |
| :-------- | :------------ |
| `size/XS` | < 10          |
| `size/S`  | 10–99         |
| `size/M`  | 100–499       |
| `size/L`  | 500–999       |
| `size/XL` | ≥ 1000        |

---

## 📊 Project Progress Dashboard

| Component            |  Status   | Coverage                          |
| :------------------- | :-------: | :-------------------------------- |
| **Core API / DB**    | ✅ Stable | 20+ models, 50+ migrations        |
| **Client Dashboard** | ✅ Stable | ADS tokens, 15+ pages, RTL        |
| **Scanner App**      | ✅ Stable | 5 tabs, offline sync, HMAC        |
| **Resident Mobile**  | ✅ Stable | Native iOS/Android, push, sharing |
| **Resident Portal**  | ✅ Stable | Guest management, history         |
| **Admin Dashboard**  | ✅ Stable | Multi-tenant, billing             |
| **Marketing Site**   | ✅ Stable | Multi-page, tracking, pixels      |
| **Ralph Automation** | ✅ Stable | 19 scripts, 5 hooks, 12 checks    |

### Recent Milestones

- **CRM UI** — Projects Hub with contacts, units, gallery, marketing attribution (phases 1–7)
- **Team Suite** — Full RBAC team management with roles, invites, chat
- **Marketing Suite** — UTM attribution, Meta Pixel, CRM webhooks, live dashboards
- **Ralph Automation Stack** — 19 scripts, 5 git hooks, 12 quality checks, 2 GitHub Actions
- **Security Audit** — Multi-tenancy hardening, XSS fixes, ADS token violations resolved

---

## 📖 Documentation Library

| Document                                                        | Description                                                                 |
| :-------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| [Development Guide](./docs/guides/DEVELOPMENT_GUIDE.md)         | Development workflow, conventions, and best practices                       |
| [**Automation Guide**](./docs/guides/AUTOMATION_GUIDE.md)       | **Complete Ralph automation reference — all scripts, hooks, and workflows** |
| [Tool & CLI Reference](./docs/guides/TOOL_AND_CLI_REFERENCE.md) | AI tool selection matrix and CLI limits                                     |
| [UI Component Library](./docs/guides/UI_COMPONENT_LIBRARY.md)   | ADS tokens, component patterns, animation rules                             |
| [UI Design Guide](./docs/guides/UI_DESIGN_GUIDE.md)             | Design system, RTL, accessibility                                           |
| [Security Overview](./docs/guides/SECURITY_OVERVIEW.md)         | Security architecture and threat model                                      |
| [Deployment Guide](./docs/guides/DEPLOYMENT_GUIDE.md)           | Vercel deployment, environment setup                                        |
| [Environment Variables](./docs/guides/ENVIRONMENT_VARIABLES.md) | All env vars, purpose, and validation                                       |
| [Motion & Animation](./docs/guides/MOTION_AND_ANIMATION.md)     | Animation library decision tree                                             |
| [Scanner Operations](./docs/guides/SCANNER_OPERATIONS.md)       | Scanner app architecture and offline flow                                   |
| [Analytics & Charts](./docs/guides/ANALYTICS_CHARTS_GUIDE.md)   | Chart component patterns and data flow                                      |
| [PRD v7.0](./docs/PRD_v7.0.md)                                  | Full Product Requirements Document                                          |
| [Docs Index](./docs/INDEX.md)                                   | Auto-generated index of all documentation                                   |

---

## 🤝 Contributing

1. Run `pnpm setup:dev` to onboard your environment.
2. Check `pnpm ralph` to understand current workspace state.
3. Follow the [**Best Development Workflow**](#-best-development-workflow) section above.
4. Use `pnpm` exclusively (no npm/yarn).
5. Run `pnpm preflight` before any push (also auto-enforced by pre-push hook).
6. Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, etc. (enforced by commitlint).
7. Read [docs/guides/AUTOMATION_GUIDE.md](./docs/guides/AUTOMATION_GUIDE.md) to understand all automated behaviors.

---

<div align="center">
  <p><strong>Built with precision for the modern gate.</strong></p>
  <p>
    <a href="./docs/guides/AUTOMATION_GUIDE.md">Automation Guide</a> ·
    <a href="./docs/guides/DEVELOPMENT_GUIDE.md">Dev Guide</a> ·
    <a href="./docs/PRD_v7.0.md">Product Roadmap</a> ·
    <a href="https://gateflow.site">gateflow.site</a>
  </p>
  <p>© 2026 GateFlow. All rights reserved.</p>
</div>
