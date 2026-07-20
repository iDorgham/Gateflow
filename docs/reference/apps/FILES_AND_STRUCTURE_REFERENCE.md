# Files and Structure Reference (Deep Pass)

This file is the filesystem map for planning agents. It answers "where should this change live?" before implementation starts.

## Coverage Scope

- Monorepo topography for `apps/`, `packages/`, and planning docs.
- Ownership boundaries (which app/package owns what).
- Critical path map for UI, API routes, shared contracts, and DB schema.
- Known structural anomalies that can affect automated tooling.

## 1) Workspace Topology

- Root model: Turborepo + pnpm workspaces.
- Runtime apps are in `apps/`.
- Shared code and contracts are in `packages/`.
- Planning lifecycle is in `docs/plan/`.
- Process and automation docs are in `docs/development/` and `docs/guides/`.

## 2) Apps Directory (Primary Product Surfaces)

- `apps/client-dashboard`
  - Largest operational app (UI + API surface).
  - Core folder roots:
    - `src/app/[locale]/...` (pages/routes)
    - `src/app/api/...` (route handlers)
    - `src/components/...` (feature UI)
    - `src/lib/...` (domain/service utilities)
- `apps/admin-dashboard`
  - Platform/governance console with dedicated API routes.
  - Core folder roots:
    - `src/app/[locale]/(dashboard)/...`
    - `src/app/api/...`
    - `src/components/...`
    - `src/lib/...`
- `apps/marketing`
  - Public marketing site + attribution/event APIs.
  - Core folder roots:
    - `app/[locale]/...`
    - `app/api/...`
    - `locales/...`
- `apps/resident-portal`
  - Resident-facing web portal.
  - Core folder roots:
    - `src/app/(portal)/...`
    - `src/app/api/resident/...`
    - `src/components/...`
- `apps/scanner-app`
  - Expo/mobile scanner app (native/mobile-first structure; not App Router pages).
- `apps/resident-mobile`
  - Mobile app surface (Expo structure).
- `apps/design-system`
  - Design-system app scaffold surface.

## 3) Packages Directory (Shared Foundation)

- `packages/db`
  - Prisma schema, migrations, seeds, DB utilities.
  - Source of truth: `packages/db/prisma/schema.prisma`
- `packages/types`
  - Shared cross-app type contracts.
- `packages/ui`
  - Shared component library and tokenized UI primitives.
- `packages/i18n`
  - Localization foundations.
- `packages/api-client`
  - Shared API client logic/patterns.
- `packages/config`
  - Shared build/config conventions.
- `packages/stripe`
  - Billing integration helpers.
- `packages/utils`
  - Utility helpers (cross-cutting).
- `packages/ai`
  - Agentic AI components and patterns (`@gateflow/ai`).
- `packages/components`
  - High-level product layouts and composed UI patterns.
- `packages/theme`
  - Next.js-friendly theme providers and hooks.
- `packages/tokens`
  - Foundational OKLCH design tokens for the design system.

## 4) Planning and Execution Folders

- `docs/plan/Active`
- `docs/plan/Ready`
- `docs/plan/Complete`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

Canonical lifecycle and shape docs:

- `docs/development/PLAN_LIFECYCLE.md`
- `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`
- `docs/reference/apps/PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md`

## 5) Structure Ownership Rules

- UI pages should live in app-local route trees (not shared packages).
- API route handlers remain app-local in `app/api`.
- Shared validation/contracts/types belong in `packages/types` or shared package modules.
- DB schema changes belong in `packages/db/prisma/`.
- Reusable visual primitives belong in `packages/ui`.

## 6) Critical Path Map (Where to Look First)

- Route/page issues:
  - `apps/*/src/app/**/page.tsx`
  - `apps/marketing/app/**/page.tsx`
- API behavior:
  - `apps/*/src/app/api/**/route.ts`
  - `apps/marketing/app/api/**/route.ts`
- DB model/relations:
  - `packages/db/prisma/schema.prisma`
- Shared design primitives:
  - `packages/ui/src/components/ui/*`
  - `packages/ui/src/tokens.ts`
- Cross-app contracts:
  - `packages/types/src/*`

## 7) Known Structural Anomalies

- App directories use hyphenated names (for example `resident-mobile`, `resident-portal`, `scanner-app`).
- Automated scripts must use exact filesystem paths from `ls apps` or `find apps`; do not infer paths from display labels or human-readable names.

## 8) Fast Scan Commands

Use these to regenerate structure context quickly:

- List apps:
  - `ls apps`
- List packages:
  - `ls packages`
- Page files:
  - `rg --files apps -g "**/app/**/page.tsx"`
- API route handlers:
  - `rg --files apps -g "**/app/api/**/route.ts"`
- Prisma models:
  - `rg "^model\\s+\\w+" packages/db/prisma/schema.prisma`

## 9) Planning Notes for AI Tools

- Always decide ownership first (app-local vs shared package).
- When touching API + DB + UI in one initiative, split work into phased changes per layer.
- Never treat one app's `src/lib` as globally reusable by default; promote only intentionally into shared packages.
