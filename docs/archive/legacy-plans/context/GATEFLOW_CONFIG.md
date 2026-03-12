# GateFlow — Project Config

## Purpose

Capture the **operational configuration** of the GateFlow monorepo in one place: apps, ports, security invariants, Git workflow, and shared directories.  
Tools should read this file alongside `CLAUDE.md` and `.cursor/rules/00-gateflow-core.mdc` when reasoning about environment or setup.

## Runtime & tech stack

- **Web**: Next.js 14 (App Router), TypeScript (strict), pnpm workspace, Turborepo.
- **Mobile**: Expo SDK 54 (scanner-app, resident-mobile planned).
- **Database**: PostgreSQL 15+, Prisma 5 (`packages/db`).
- **Shared packages**: `@gate-access/db`, `@gate-access/types`, `@gate-access/ui`, `@gate-access/api-client`, `@gate-access/i18n`, `@gate-access/config`.

## Apps and ports

| App                | Path                              | Port  |
|--------------------|-----------------------------------|-------|
| Marketing          | `apps/marketing`                 | 3000  |
| Client dashboard   | `apps/client-dashboard`          | 3001  |
| Admin dashboard    | `apps/admin-dashboard`           | 3002  |
| Resident portal    | `apps/resident-portal` (planned) | 3004  |
| Scanner app (Expo) | `apps/scanner-app`               | 8081  |
| Resident mobile    | `apps/resident-mobile` (planned) | 8082  |

## Security & data invariants (summary)

Authoritative details live in `.cursor/rules/00-gateflow-core.mdc`, `.cursor/rules/gateflow-security.mdc`, and `.cursor/contracts/CONTRACTS.md`.  
Tools should **never** propose changes that violate these:

- **Multi‑tenancy**
  - Every tenant data query must scope by `organizationId`.
  - Never rely on implicit scoping; always include `organizationId` explicitly.

- **Soft deletes**
  - Mutable models use `deletedAt DateTime?` with `@@index([deletedAt])`.
  - Queries must filter `deletedAt: null`; deletions set `deletedAt` instead of hard‑deleting.

- **QR & scanner**
  - All QR payloads are **HMAC‑SHA256 signed** using `QR_SIGNING_SECRET`.
  - Scanner uses `scanUuid` as the **deduplication key** for offline sync; do not change this contract.

- **Auth & tokens**
  - Access tokens are short‑lived; support refresh/rotation flows.
  - Web apps must not store tokens in `localStorage`; use secure cookies.
  - Mobile apps must store tokens only in SecureStore.

- **Secrets**
  - `.env` / `.env.local` must never be committed.
  - Use `.env.example` with placeholder values; fail‑closed on missing critical env vars.

## Git & branching

- **Package manager**: `pnpm` only (never `npm` or `yarn`).
- **Root scripts**: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm preflight`.
- **Phase branches**: For phased plans, prefer `feat/phase-<N>-<slug>` to isolate each phase and enable rollback.
- **Commits**: Conventional style, e.g. `feat(<scope>): Phase <N> <title>`.

## Shared planning & learning directories

- `docs/plan/context/IDEA_<slug>.md` — initiative/epic context.
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — master backlog.
- `docs/plan/execution/PLAN_<slug>.md` — phased plan per initiative.
- `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` — pro prompts per phase.
- `docs/plan/learning/patterns.md`, `incidents.md`, `decisions.md` — cross‑phase learnings.
- `docs/plan/guidelines/*.md` — AI skills, subagents, workflows, tools.

## Reference documents

- **Architecture & product**
  - `CLAUDE.md`
  - `docs/PRD_v5.0.md`
  - `docs/APP_DESIGN_DOCS.md`

- **Security & quality**
  - `.cursor/rules/00-gateflow-core.mdc`
  - `.cursor/rules/gateflow-security.mdc`
  - `.cursor/contracts/CONTRACTS.md`
  - `docs/SECURITY_OVERVIEW.md`
  - `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md`

