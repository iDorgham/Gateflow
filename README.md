# GateFlow (Gate-Access Monorepo)

GateFlow is a **Zero-Trust Digital Gate Infrastructure Platform** for gated compounds, events, schools, marinas, and access-controlled venues in MENA. It replaces manual guest lists and screenshot QR chaos with **cryptographically-signed access**, **offline-capable scanning**, and **auditable logs**.

## Monorepo layout (Turborepo)

- `apps/client-dashboard` — Main SaaS portal (Next.js 14) — port **3001**
- `apps/admin-dashboard` — Platform super-admin (Next.js 14) — port **3002**
- `apps/scanner-app` — Mobile QR scanner (Expo SDK 54) — Metro **8081**
- `apps/marketing` — Public site (Next.js 14) — port **3000**
- `apps/resident-portal` — Resident web portal (planned)
- `apps/resident-mobile` — Resident mobile app (planned)

Shared packages:

- `packages/db` — Prisma schema + client
- `packages/types` — Shared TypeScript types/enums
- `packages/ui` — Shared UI component library (shadcn-style)
- `packages/api-client` — Shared fetch utilities/types
- `packages/i18n` — Arabic/English i18n
- `packages/config` — Shared ESLint/TS config

## Quickstart

**Package manager:** `pnpm` only.

```bash
pnpm install
pnpm turbo dev
```

Common checks:

```bash
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test
pnpm turbo build
```

## Key docs (start here)

- `CLAUDE.md` — Repo conventions + security invariants (high-signal)
- `docs/README.md` — Documentation index
- `docs/PRD_v5.0.md` — Product requirements (source of truth)
- `docs/APP_DESIGN_DOCS.md` — App routes + architecture map
- `docs/AI_SKILLS_SUBAGENTS_RULES.md` — How to work with AI in this repo
- `docs/SUGGESTED_IMPROVEMENTS_AND_FUNCTIONS.md` — Consolidated functions map + prioritized improvements

