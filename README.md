# GateFlow

<div align="center">

![Banner](docs/gateflow_banner.png)

**The Enterprise OS for Physical Access Control & Marketing Intelligence**

_Modern, Cryptographically Secure, and Marketing-First Infrastructure for the MENA Region_

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge)](#)
[![Status: MVP Complete](https://img.shields.io/badge/Status-MVP_Complete-success?style=for-the-badge)](#)
[![Security: HMAC-SHA256 + AES-256](https://img.shields.io/badge/Security-HMAC--SHA256_%2B_AES--256-red?style=for-the-badge)](#)

</div>

---

## Quick Links

| Resource                                              | Description                      |
| :---------------------------------------------------- | :------------------------------- |
| [Development Guide](docs/guides/DEVELOPMENT_GUIDE.md) | Setup, workflow, and conventions |
| [Automation Guide](docs/guides/AUTOMATION_GUIDE.md)   | Ralph Loop, scripts, and CI/CD   |
| [Workspace Docs](docs/workspace/README.md)            | Agents, rules, skills, commands  |
| [Workspace Changelog](docs/workspace/CHANGELOG.md)    | Workspace-only changes           |
| [API Reference](docs/guides/API_REFERENCE.md)         | REST API endpoints               |
| [Security Overview](docs/guides/SECURITY_OVERVIEW.md) | Threat model and protections     |
| [PRD v7.0](docs/PRD_v7.0.md)                          | Product roadmap and features     |

---

## Release Tracks

GateFlow now documents releases in three separate tracks:

- **Workspace**: automation, plans, prompts, AI orchestration, rules, skills, agents.
- **AI Tools**: AI SDK, assistants, prompts, transports, and AI infra behavior.
- **Apps**: end-user products (`client-dashboard`, `admin-dashboard`, `scanner-app`, `resident-mobile`, `resident-portal`, `marketing`).

### Version Badges

![Workspace Version](https://img.shields.io/badge/Workspace-v0.1.0-blue?style=for-the-badge)
![Apps Version](https://img.shields.io/badge/Apps-v0.1.0-0ea5e9?style=for-the-badge)
![AI Tools Version](https://img.shields.io/badge/AI_Tools-v6_migration_in_progress-7c3aed?style=for-the-badge)

### App Versions

| App                | Version |
| :----------------- | :------ |
| `client-dashboard` | `0.1.0` |
| `admin-dashboard`  | `0.1.0` |
| `scanner-app`      | `0.1.0` |
| `resident-mobile`  | `0.1.0` |
| `resident-portal`  | `0.1.0` |
| `marketing`        | `0.1.0` |

---

## CI/CD & Quality Badges

| Badge                                                                                                              | Description                 |
| :----------------------------------------------------------------------------------------------------------------- | :-------------------------- |
| ![CI](https://github.com/iDorgham/Gateflow/actions/workflows/ci.yml/badge.svg)                                     | Continuous Integration      |
| ![Deploy](https://github.com/iDorgham/Gateflow/actions/workflows/deploy.yml/badge.svg)                             | Production Deployment       |
| ![Lighthouse](https://img.shields.io/badge/Lighthouse-Perf_≥90_A11y_≥95-4CAF50?style=flat-square&logo=lighthouse)  | Performance & Accessibility |
| ![Release](https://img.shields.io/github/v/release/iDorgham/Gateflow?style=flat-square&label=release&color=4CAF50) | Latest Release              |

## Tech Stack

| Technology                                                                                               | Version | Purpose                          |
| :------------------------------------------------------------------------------------------------------- | :------ | :------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)               | 14.2    | Web Framework (App Router + RSC) |
| ![Expo](https://img.shields.io/badge/Expo-54-4630EB?style=for-the-badge&logo=expo)                       | SDK 54  | Mobile Development               |
| ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)                  | 5.x     | Database ORM                     |
| ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript) | 5.3     | Language                         |
| ![pnpm](https://img.shields.io/badge/pnpm-8.15-F69220?style=for-the-badge&logo=pnpm)                     | 8.15    | Package Manager                  |
| ![Turborepo](https://img.shields.io/badge/Turborepo-2.8-EF4444?style=for-the-badge&logo=turborepo)       | 2.8     | Monorepo Build                   |

## Code Quality

| Tool        | Badge                                                                                                                |
| :---------- | :------------------------------------------------------------------------------------------------------------------- |
| Commitlint  | ![Commitlint](https://img.shields.io/badge/Commitlint-Conventional_Commits-yellow?style=flat-square&logo=commitlint) |
| lint-staged | ![lint-staged](https://img.shields.io/badge/Lint--staged-Pre--commit-blue?style=flat-square)                         |
| Husky       | ![Husky](https://img.shields.io/badge/Husky-5_Git_Hooks-green?style=flat-square)                                     |

---

## Table of Contents

- [Vision & Core Pillars](#-vision--core-pillars)
- [The 6-App Ecosystem](#-the-6-app-ecosystem)
- [Monorepo Structure](#-monorepo-structure)
- [Quick Start](#-quick-start)
- [The Ralph Loop](#-the-ralph-loop--automation-system)
- [Command Reference](#-command-reference)
- [Development Workflow](#-development-workflow)
- [Security Architecture](#-security-architecture)
- [CI/CD & Deployment](#-cicd--deployment)
- [Project Progress](#-project-progress)
- [Documentation Library](#-documentation-library)

---

## Vision & Core Pillars

GateFlow is not just a QR scanner — it's **Stripe-level infrastructure for physical access**. We bridge the gap between digital marketing spend and physical gate arrivals, providing a seamless, secure, and auditable flow for gated communities, events, and enterprise facilities.

### Secure Access Architecture

Every access request is verified cryptographically. Zero-trust network assumption; verification on the edge so gates open in **<100ms even with zero connectivity**.

### Marketing Intelligence

Transform gate entries into data points. Capture UTM parameters, fire Meta/Google pixels on guest arrival, sync physical visits to HubSpot/Salesforce via real-time webhooks.

### Autonomous Engineering (The Ralph Loop)

Developed with AI-assisted governance — 100% adherence to ADS design tokens, perfect RTL layout for Arabic, automated tenant isolation at the database layer, and a complete automation stack with 19 Ralph scripts, 5 git hooks, and 12 quality-check scripts.

---

## The 6-App Ecosystem

| App                                           |   Status   | User              | Core Capability                                                   |
| :-------------------------------------------- | :--------: | :---------------- | :---------------------------------------------------------------- |
| **[Client Dashboard](apps/client-dashboard)** | Production | Property Managers | Real-time scan feeds (SSE), QR config, Marketing Suite, Team RBAC |
| **[Scanner App](apps/scanner-app)**           | Production | Security Guards   | Offline-first HMAC verify, AES-256 local queue, Haptic feedback   |
| **[Resident Mobile](apps/resident-mobile)**   | Production | Residents         | Native iOS/Android, WhatsApp share, push notifications            |
| **[Resident Portal](apps/resident-portal)**   | Production | Guests/VIPs       | Responsive web self-service for pass management                   |
| **[Admin Dashboard](apps/admin-dashboard)**   | Production | Super Admins      | Multi-tenant oversight, billing, platform health                  |
| **[Marketing Site](apps/marketing)**          | Production | Prospects         | SEO-optimized conversion funnels, industry-specific solutions     |

---

## Monorepo Structure

```
GateFlow/
├── apps/                          # Applications
│   ├── admin-dashboard/            # Internal platform operations (Next.js 14)
│   ├── client-dashboard/          # B2B Property Manager portal (Next.js 14)
│   ├── marketing/                 # Public landing page & SEO (Next.js 14)
│   ├── resident-mobile/           # Native Resident app (Expo 54)
│   ├── resident-portal/            # Web-based Resident portal (Next.js 14)
│   └── scanner-app/              # Native Guard/Scanner application (Expo 54)
├── packages/                      # Shared Libraries
│   ├── db/                        # Prisma schema, client & migrations
│   ├── ui/                        # Shared shadcn/ADS component library
│   ├── types/                     # Universal TS types & Zod schemas
│   ├── i18n/                      # AR/EN translation dictionaries
│   ├── api-client/                # Shared fetch utilities
│   └── config/                    # Shared ESLint, Tailwind & TSConfig
├── docs/                          # Documentation
│   ├── plan/                      # Ralph plan lifecycle (backlog→done)
│   │   ├── backlog/               # ALL_TASKS_BACKLOG.md
│   │   ├── context/               # IDEA_<slug>.md files
│   │   ├── planning/              # Plans being drafted
│   │   ├── planned/               # Plans approved and ready
│   │   ├── in-progress/           # Plans currently being executed
│   │   ├── done/                  # Shipped plans
│   │   └── execution/             # Phase prompt files
│   ├── guides/                    # Development, automation, security guides
│   ├── core/                      # CLAUDE.md, AI tools config
│   └── INDEX.md                   # Auto-generated docs index
├── scripts/                       # Ralph Automation Scripts
│   ├── ralph.js                   # Master dashboard (pnpm ralph)
│   ├── ralph-plan.js              # Plan lifecycle automation
│   ├── ralph-run.js               # Phase runner
│   ├── ralph-docs.js              # Docs automation
│   ├── scan-secrets.js            # Pre-commit secret scanner (12 HIGH patterns)
│   ├── check-*.js                 # Quality check scripts
│   └── *.js                       # Utility scripts
├── .husky/                        # Git Hooks
│   ├── commit-msg                 # commitlint — conventional commits
│   ├── pre-commit                 # secret scan → lint-staged → prisma guard
│   ├── post-commit                # sync AI tools → changelog → phase close
│   ├── pre-push                   # branch enforcer → preflight
│   └── post-merge                # auto patch-bump on feat/* → master
├── .github/workflows/             # GitHub Actions
│   ├── ci.yml                     # Lint + typecheck + test
│   ├── deploy.yml                 # Vercel deployment
│   ├── lighthouse.yml             # PageSpeed audits
│   ├── release.yml                # Auto GitHub Release
│   └── pr-labels.yml             # PR size label + affected packages
└── commitlint.config.js           # 13 commit types, 30 scopes
```

---

## Quick Start

### Automated Onboarding (Recommended)

```bash
git clone https://github.com/iDorgham/Gateflow.git && cd Gateflow
pnpm install
pnpm setup:dev          # Interactive onboarding: env vars, DB, husky
```

`pnpm setup:dev` will:

- Prompt for `DATABASE_URL`, `NEXTAUTH_SECRET`, `QR_SIGNING_SECRET`, `ENCRYPTION_MASTER_KEY`
- Create `.env.local` in all relevant apps
- Run `prisma generate` + `prisma db push`
- Validate all environment variables
- Install and configure Husky git hooks

### Manual Setup

```bash
# Clone & install
git clone https://github.com/iDorgham/Gateflow.git && cd Gateflow
pnpm install

# Environment — copy and fill in required values
cp .env.example .env.local

# Database
pnpm db:generate       # Generate Prisma client
pnpm db:push           # Push schema to DB (dev)

# Run everything
pnpm dev               # All 6 apps in parallel
pnpm dev:client        # Client dashboard only (port 3001)
pnpm dev:admin         # Admin dashboard only
pnpm dev:marketing     # Marketing site only
pnpm dev:scanner       # Scanner app (Expo)

# Quality gates before committing
pnpm preflight         # lint + typecheck + test
```

### Check Workspace Status

```bash
pnpm ralph             # Full automation dashboard
pnpm ralph:short       # Compact summary
```

---

## The Ralph Loop — Automation System

Ralph is the GateFlow automation engine. Every routine task — from creating a plan to shipping a release — is orchestrated by Ralph scripts.

### Workflow

```
Idea → Plan → Develop → Test → Commit → Verify → Ship → Document
  ↑                                                        ↓
  └──────────────── Ralph Loop ──────────────────────────────┘
```

### Trigger Map

| Trigger                    | What Fires                                                                      |
| :------------------------- | :------------------------------------------------------------------------------ |
| `git commit`               | commitlint → secret scan → lint-staged → AI sync → changelog → phase auto-close |
| `git push`                 | Branch enforcer → preflight (lint + typecheck + test)                           |
| `feat/* → master`          | Auto patch-bump → annotated git tag                                             |
| `pnpm plan:new <slug>`     | Creates plan folder + template                                                  |
| `pnpm plan:ready <slug>`   | Moves planning/ → planned/                                                      |
| `pnpm plan:start <slug>`   | Moves planned/ → in-progress/                                                   |
| `pnpm plan:run <slug> <N>` | Execute phase N                                                                 |
| `pnpm plan:done <slug>`    | Moves in-progress/ → done/                                                      |
| `pnpm docs:release`        | CHANGELOG preview + version bump + tag                                          |
| `git push origin v*`       | GitHub Release auto-published                                                   |

### Git Hook Chain

```
pre-commit                   post-commit                   pre-push
─────────────────────        ───────────────────────────   ─────────────────────
1. scan-secrets.js           1. sync-ai-tools.sh           1. Branch pattern check
2. lint-staged               2. ralph-docs.js changelog    2. pnpm preflight
3. prisma.prisma guard       3. phase-close.js
```

---

## Command Reference

### Ralph Dashboard

| Command            | What It Does              |
| :----------------- | :------------------------ |
| `pnpm ralph`       | Full workspace dashboard  |
| `pnpm ralph:short` | Compact view: git + plans |

### Plan Lifecycle

| Command                             | What It Does                 |
| :---------------------------------- | :--------------------------- |
| `pnpm plan:new <slug> [--phases N]` | Create new plan              |
| `pnpm plan:ready <slug>`            | Approve plan                 |
| `pnpm plan:start <slug>`            | Begin work                   |
| `pnpm plan:run <slug> <N>`          | Execute phase N              |
| `pnpm plan:done <slug>`             | Ship plan + create PR        |
| `pnpm plan:status`                  | Show all plans with progress |

### Quality Checks

| Command                 | What It Does                       |
| :---------------------- | :--------------------------------- |
| `pnpm preflight`        | Full gate: lint + typecheck + test |
| `pnpm check:env`        | Validate environment variables     |
| `pnpm check:secrets`    | Scan for leaked secrets            |
| `pnpm check:bundle`     | Bundle size vs baseline            |
| `pnpm check:imports`    | Circular import detection          |
| `pnpm check:db-drift`   | DB schema drift detection          |
| `pnpm check:pre-deploy` | Full pre-deploy checklist          |

### Dev & Database

| Command              | What It Does                 |
| :------------------- | :--------------------------- |
| `pnpm dev`           | Start all apps in parallel   |
| `pnpm dev:client`    | Client dashboard (port 3001) |
| `pnpm dev:admin`     | Admin dashboard (port 3002)  |
| `pnpm dev:marketing` | Marketing site (port 3000)   |
| `pnpm db:generate`   | Run `prisma generate`        |
| `pnpm db:studio`     | Open Prisma Studio           |
| `pnpm build`         | Build all workspaces         |
| `pnpm setup:dev`     | Run interactive onboarding   |

---

## Development Workflow

### Starting a New Feature

```bash
# 1. Check workspace state
pnpm ralph

# 2. Create a plan
pnpm plan:new my-feature --phases 5

# 3. Edit phase prompts in docs/plan/planning/my-feature/

# 4. Approve the plan
pnpm plan:ready my-feature

# 5. Start development
pnpm plan:start my-feature

# 6. Work phase by phase
pnpm plan:run my-feature 1
pnpm plan:run my-feature 2
# ... continues until all phases are [x]

# 7. Ship
pnpm plan:done my-feature
```

### The Commit Discipline

```bash
# Always use conventional commits
git commit -m "feat(client): add export button to scans page — phase 3"

# Valid types: feat, fix, chore, perf, docs, refactor, security, ci, test, hotfix
# Valid scopes: client, admin, scanner, mobile, portal, marketing, db, ui, types, i18n, config
```

### Before Every Push

```bash
pnpm preflight   # lint + typecheck + test — must be green
```

### Emergency Hotfix

```bash
pnpm hotfix:start critical-login-bug   # branches off master
# ... fix the bug ...
git add . && git commit -m "fix(auth): resolve JWT expiry edge case"
pnpm hotfix:done critical-login-bug    # auto PR + bump + tag
```

---

## Security Architecture

GateFlow follows strict **Security-by-Design** philosophy.

### Access Security

- **HMAC-SHA256 QR Signing** — every QR contains a cryptographic signature
- **AES-256 Storage** — offline sync queues encrypted at rest
- **Argon2id** — strongest modern password hashing
- **15-min JWT + 30-day refresh** — short-lived tokens with rotation
- **Tenant Isolation** — Prisma middleware hard-scopes every query to `organizationId`
- **Audit Logging** — every admin action and scan event logged

### Automated Security

- **Pre-commit secret scanner** — 12 HIGH patterns block commit
- **Env var validator** — checks presence and validates values
- **Branch enforcer** — only whitelisted branch patterns allowed

### Required GitHub Secrets

```
# Core
NEXTAUTH_SECRET           # ≥32 chars
QR_SIGNING_SECRET        # ≥32 chars
ENCRYPTION_MASTER_KEY    # ≥32 chars
ADMIN_ACCESS_KEY

# Database
CI_DATABASE_URL

# Vercel
VERCEL_TOKEN, VERCEL_ORG_ID
VERCEL_PROJECT_ID_*
```

---

## CI/CD & Deployment

### Workflows

| Workflow         | Trigger              | Purpose                        |
| :--------------- | :------------------- | :----------------------------- |
| `ci.yml`         | Push / PR            | Lint + typecheck + test        |
| `deploy.yml`     | Push to master       | Deploy to Vercel               |
| `lighthouse.yml` | PR / daily           | PageSpeed audits               |
| `release.yml`    | `git push origin v*` | Auto GitHub Release            |
| `pr-labels.yml`  | PR                   | Size label + affected packages |

### Release Flow

```bash
pnpm docs:release:dry    # Preview
pnpm docs:release        # Bump version, close [Unreleased], tag
git push && git push origin v0.2.0   # Deploy + GitHub Release
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

## Project Progress

| Component            |   Status   | Notes                             |
| :------------------- | :--------: | :-------------------------------- |
| **Core API / DB**    | Production | 20+ models, 50+ migrations        |
| **Client Dashboard** | Production | ADS tokens, 15+ pages, RTL        |
| **Scanner App**      | Production | 5 tabs, offline sync, HMAC        |
| **Resident Mobile**  | Production | Native iOS/Android, push, sharing |
| **Resident Portal**  | Production | Guest management, history         |
| **Admin Dashboard**  | Production | Multi-tenant, billing             |
| **Marketing Site**   | Production | Multi-page, tracking, pixels      |
| **Ralph Automation** | Production | 19 scripts, 5 hooks, 12 checks    |

### Recent Milestones

- **CRM UI** — Projects Hub with contacts, units, gallery, marketing attribution
- **Team Suite** — Full RBAC team management with roles, invites, chat
- **Marketing Suite** — UTM attribution, Meta Pixel, CRM webhooks
- **Ralph Automation Stack** — 19 scripts, 5 git hooks, 12 quality checks
- **Security Audit** — Multi-tenancy hardening, XSS fixes, ADS token violations

---

## Documentation Library

| Document                                                           | Description                                |
| :----------------------------------------------------------------- | :----------------------------------------- |
| [Development Guide](docs/guides/DEVELOPMENT_GUIDE.md)              | Development workflow and conventions       |
| [Automation Guide](docs/guides/AUTOMATION_GUIDE.md)                | Ralph automation reference                 |
| [Tool & CLI Reference](docs/guides/TOOL_AND_CLI_REFERENCE.md)      | AI tool selection matrix                   |
| [Release Notes Template](docs/workspace/RELEASE_NOTES_TEMPLATE.md) | Workspace/AI Tools/Apps changelog template |
| [UI Design Guide](docs/guides/UI_DESIGN_GUIDE.md)                  | Design system, RTL, accessibility          |
| [Security Overview](docs/guides/SECURITY_OVERVIEW.md)              | Security architecture                      |
| [Deployment Guide](docs/guides/DEPLOYMENT_GUIDE.md)                | Vercel deployment                          |
| [Environment Variables](docs/guides/ENVIRONMENT_VARIABLES.md)      | All env vars                               |
| [Motion & Animation](docs/guides/MOTION_AND_ANIMATION.md)          | Animation library guide                    |
| [Scanner Operations](docs/guides/SCANNER_OPERATIONS.md)            | Scanner architecture                       |
| [Analytics & Charts](docs/guides/ANALYTICS_CHARTS_GUIDE.md)        | Chart patterns                             |
| [PRD v7.0](docs/PRD_v7.0.md)                                       | Product Requirements                       |
| [Docs Index](docs/INDEX.md)                                        | Auto-generated index                       |

---

## Contributing

1. Run `pnpm setup:dev` to onboard your environment
2. Check `pnpm ralph` to understand current state
3. Follow the [Development Workflow](#-development-workflow)
4. Use `pnpm` exclusively (no npm/yarn)
5. Run `pnpm preflight` before any push
6. Use [Conventional Commits](https://www.conventionalcommits.org)
7. Read [Automation Guide](docs/guides/AUTOMATION_GUIDE.md)

---

<div align="center">

**Built with precision for the modern gate.**

[Automation Guide](docs/guides/AUTOMATION_GUIDE.md) ·
[Dev Guide](docs/guides/DEVELOPMENT_GUIDE.md) ·
[Product Roadmap](docs/PRD_v7.0.md) ·
[gateflow.site](https://gateflow.site)

&copy; 2026 GateFlow. All rights reserved.

</div>
