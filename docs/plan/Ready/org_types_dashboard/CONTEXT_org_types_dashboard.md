# Context snapshot — `org_types_dashboard`

> Regenerate or extend when schema or auth contracts change. Deeper notes: `context/` (database, api, contracts).

## Product

- **Goal:** Client dashboard UX varies by `Organization.type` (`REAL_ESTATE`, `SCHOOL`, `CLUB`, `NIGHTCLUB`, `EVENT_ORGANISER`).
- **Config:** `ORGANIZATION_FEATURES` (single source of truth) — see `PLAN_org_types_dashboard.md`.

## Schema (target after phase 1)

- `Organization.type` — Prisma enum `OrganizationType`, default `REAL_ESTATE`.

## Key paths

- `packages/db/prisma/schema.prisma` — `Organization`
- `apps/client-dashboard/src/lib/auth.ts` — JWT claims (optional `orgType`)
- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx` — nav
- `packages/i18n/src/locales/en.json`, `ar-EG.json`

## Contracts

- `.antigravity/contracts/CONTRACTS.md` — `organizationId`, soft deletes, Zod, auth-first APIs.

## Env (typical)

- `DATABASE_URL`, `DIRECT_DATABASE_URL`, `NEXTAUTH_SECRET` / `JWT_SECRET`, `QR_SIGNING_SECRET` (no values here).
