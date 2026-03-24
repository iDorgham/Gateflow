# Architecture & Stack

## Monorepo

pnpm workspaces + Turborepo 2. Full snapshot: `docs/cache/WORKSPACE_INDEX.md`

## Apps

| App                     | Port | Framework             | Purpose               |
| ----------------------- | ---- | --------------------- | --------------------- |
| `apps/client-dashboard` | 3001 | Next.js 15 App Router | Main SaaS portal      |
| `apps/admin-dashboard`  | 3002 | Next.js 15 App Router | Super-admin panel     |
| `apps/scanner-app`      | 8081 | Expo SDK 54           | Mobile QR scanner     |
| `apps/resident-mobile`  | —    | Expo SDK 54           | Resident mobile app   |
| `apps/resident-portal`  | 3004 | Next.js 15 App Router | Resident web portal   |
| `apps/marketing`        | 3000 | Next.js 15 App Router | Public marketing site |

## Packages

| Package               | Alias                     | Purpose                                                           |
| --------------------- | ------------------------- | ----------------------------------------------------------------- |
| `packages/db`         | `@gate-access/db`         | Prisma 5 + schema + auth helpers; re-exports all `@prisma/client` |
| `packages/types`      | `@gate-access/types`      | Shared TS types + Zod schemas + QR verify                         |
| `packages/ui`         | `@gate-access/ui`         | shadcn/ui + Radix + Tailwind components                           |
| `packages/i18n`       | `@gate-access/i18n`       | i18next, en + ar-EG locales                                       |
| `packages/api-client` | `@gate-access/api-client` | HTTP client SDK                                                   |
| `packages/stripe`     | `@gate-access/stripe`     | Stripe billing                                                    |
| `packages/config`     | `@gate-access/config`     | Shared ESLint + TS configs                                        |

## Key Dep Versions (client-dashboard)

Next.js 15 · React 18 · Prisma 5 · Zod 3.25 · Tailwind 3.4 · Framer Motion 11
Upstash Redis `^1.36.2` · Vercel AI SDK `^4.3` · Recharts 2 · Expo SDK 54

## Core Mandates

1. **Package manager:** always `pnpm` — never npm or yarn
2. **Multi-tenancy:** every DB query must include `organizationId` scope
3. **Soft deletes:** always filter `deletedAt: null` — never hard delete
4. **Auth:** access tokens 15 min + refresh tokens 30 d, HttpOnly cookies only
5. **QR security:** every QR must be HMAC-SHA256 signed — no unsigned codes
6. **Offline core:** scanner syncs via `scanUuid` — never break deduplication
7. **Monorepo pathing:** use workspace packages (`@gate-access/ui`) for shared logic
8. **RTL/Arabic:** every new UI feature must support en + ar-EG with perfect RTL

## UI Stack

shadcn/ui + Radix UI · Tailwind v3 · Framer Motion (micro-interactions) ·
React Spring (chart animations) · Lottie (branded animations) · Recharts/ECharts/D3
Accent color: #ED4B00 (Kimchi) — 3.74:1 on white, use on non-text only

## Commands

```bash
pnpm install             # install all
pnpm turbo dev           # start all apps
pnpm turbo build         # build all
pnpm turbo lint          # lint all
pnpm preflight           # lint + typecheck + test (run before committing)

# DB (from packages/db)
npx prisma generate      # regenerate client after schema change
npx prisma db push       # push schema changes in dev (no migration file)
npx prisma migrate dev   # create migration for production
npx prisma db seed       # seed data
```
