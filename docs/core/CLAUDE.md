# GateFlow — AI Assistant Guide (CLAUDE.md)

**Product:** GateFlow — Modern Digital Gate Infrastructure & Access Control
**Version:** 1.0.0 (Production)
**Status:** MVP 100% Complete | Unified Ecosystem
**Stack:** Next.js 14 · Expo SDK 54 · PostgreSQL 15 · Prisma 5 · pnpm 8 · Turborepo 2

---

## Repository Overview

GateFlow is a **Turborepo monorepo** with 6 apps and 6 shared packages. It is hard-scoped for the MENA region with full RTL/Arabic support and high-security architecture.

```
Gate-Access/
├── apps/
│   ├── client-dashboard/    # Main SaaS portal (Next.js 14, Port 3001)
│   ├── admin-dashboard/     # Super-admin panel (Next.js 14, Port 3002)
│   ├── scanner-app/         # Mobile QR scanner (Expo SDK 54, Port 8081)
│   ├── resident-mobile/     # Resident app (Expo SDK 54)
│   ├── resident-portal/     # Resident web portal (Next.js 14, Port 3004)
│   └── marketing/           # Public marketing site (Next.js 14, Port 3000)
├── packages/
│   ├── db/                  # Prisma schema, client, migrations, seed
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # Shared UI library (Atlassian Design System tokens)
│   ├── i18n/                # Arabic/English internationalization
│   ├── api-client/          # Shared fetch utilities
│   └── config/              # Shared ESLint/TS configs
├── docs/                    # Technical, Product, and Guide documentation
└── infra/                   # Infrastructure configurations
```

---

## Essential Commands

```bash
# General
pnpm install                 # Install dependencies
pnpm turbo dev               # Start all apps in dev mode
pnpm turbo build             # Build all apps/packages
pnpm turbo lint              # Run all linters
pnpm preflight               # Run full verification (lint + typecheck + test)

# Database (from packages/db)
npx prisma generate          # Regenerate Client
npx prisma migrate dev       # Create migration
npx prisma db seed           # Seed data

# Strategic AI Commands
/idea [<slug>]               # Refine initiative
/brainstorm [<topic>]        # Strategic roadmap & market research
/plan [<slug>]               # Phased development planning
/dev [<slug>] [<phase>]      # Phased implementation
/ship [<slug>]               # Full-cycle completion
/guide                       # Workspace state & recommendations
```

---

## Core Mandates for AI Assistants

1.  **Package Manager**: Always use `pnpm`. Never mention `npm` or `yarn`.
2.  **Multi-Tenancy**: Every database query MUST include `organizationId` scope.
3.  **Soft Deletes**: Always filter `deletedAt: null`. Never use hard deletes.
4.  **Auth Architecture**: Access tokens (15m) + Refresh tokens (30d). Secure HttpOnly cookies only.
5.  **QR Security**: Every QR must be HMAC-SHA256 signed. No unsigned codes ever.
6.  **Offline Core**: Scanner app syncs via `scanUuid`. Do not break this deduplication contract.
7.  **Monorepo Pathing**: Use workspace packages (`@gate-access/ui`) for shared logic.
8.  **RTL/Arabic**: Every new UI feature must support English and Arabic with perfect RTL layout.

---

## Documentation Index

| Index Section    | Primary Files                                                                                       |
| :--------------- | :-------------------------------------------------------------------------------------------------- |
| **Product**      | [PRD Final v1.0](../product/PRD_v1.0_FINAL.md)                                                      |
| **Architecture** | [System Design](../arch/README.md) · [DB Schema](../arch/DATABASE_SCHEMA.md)                        |
| **Security**     | [Security Overview](../guides/SECURITY_OVERVIEW.md)                                                 |
| **Guides**       | [Environment Variables](../guides/ENVIRONMENT_VARIABLES.md) · [Deployment](../deployment/README.md) |
| **Planning**     | [Backlog](../plan/backlog/ALL_TASKS_BACKLOG.md)                                                     |

---

_This guide is the primary mandate for all AI agents working in this repository. Maintain strict adherence to the defined patterns._
