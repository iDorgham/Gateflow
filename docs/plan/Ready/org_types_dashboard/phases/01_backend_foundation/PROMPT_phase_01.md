# Phase 1: Backend foundation — `OrganizationType` in DB, seeds, APIs, auth

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**BACKEND** (with **SECURITY** awareness for auth/session and API exposure)

### Tool selection

|               | Tool       | Why                            |
| ------------- | ---------- | ------------------------------ |
| **Preferred** | **Cursor** | Schema, migration, auth wiring |
| **Fallback**  | —          | —                              |

### Skills to load

1. `.cursor/skills/database/SKILL.md` — Prisma migrations, seeds
2. `.cursor/skills/security/SKILL.md` — auth surfaces, tenant checks
3. `.cursor/skills/api/SKILL.md` — Next.js API routes, Zod

### Context

- **Contracts:** `.antigravity/contracts/CONTRACTS.md`, `.cursor/rules/00-gateflow-core.mdc`
- **Schema today:** `Organization` in `packages/db/prisma/schema.prisma` has **no** `type` field
- **Auth today:** `apps/client-dashboard/src/lib/auth.ts` — `AccessTokenClaims` includes `orgId` but not org type
- **PRD:** `docs/archive/legacy/PRD.md` — multi-tenant model, RBAC
- **Seeding:** align with `docs/development/initiatives/IDEA_advanced_seeding_v2.md` scenarios (`luxury-compound` → REAL_ESTATE, `nightclub` → NIGHTCLUB, `private-school` → SCHOOL, `wedding-venue` → EVENT_ORGANISER; add CLUB preset or map beach/sports club to CLUB)

### Goal

Persist **`OrganizationType`** on every organization, backfill safely, expose **`type`** to trusted server code and client session flows **without breaking existing tenants**.

### Scope (in)

- Prisma enum `OrganizationType` with values: `REAL_ESTATE`, `SCHOOL`, `CLUB`, `NIGHTCLUB`, `EVENT_ORGANISER`
- New field on `Organization`, e.g. `type OrganizationType @default(REAL_ESTATE)`
- Generated migration; **default REAL_ESTATE** for all existing rows (backward compatibility)
- Update seed scripts so demo orgs use varied types for QA
- Expose `type` on organization reads used by the dashboard (e.g. session bootstrap, `/api/...` org/me endpoints — use existing patterns)
- Optionally add `orgType` (or `organizationType`) to **access token claims** when signing tokens, **only if** refresh/login paths already reload role/org data (document behavior when type changes)
- Mirror enum in `@gate-access/types` if the client imports it (preferred single import source)

### Scope (out)

- UI adaptation (Phases 2–7)
- Admin dashboard org creation UX (unless trivially needed to set type in dev)

### Steps (ordered)

1. Add Prisma enum + `Organization.type` with safe default; run `prisma migrate dev` (name migration clearly, e.g. `add_organization_type`).
2. Regenerate client; fix TypeScript fallout in packages/apps that construct `Organization`.
3. Update seeds: at least one org per type for manual testing; keep volumes batched per seeding guidelines.
4. Ensure any API that returns the current organization includes `type` and is **auth + org scoped**.
5. If extending JWT: update `signAccessToken` / verify paths and **tests** in `apps/client-dashboard/src/lib/auth.test.ts` / `auth-cookies.test.ts`; keep claims minimal (type string only).
6. Run `pnpm turbo lint` and `pnpm turbo typecheck` for affected packages; run `pnpm preflight` if feasible.

### Acceptance criteria

**Functional correctness**

- [ ] All five enum values persist and default preserves legacy behavior (`REAL_ESTATE`).
- [ ] Seeds produce orgs of multiple types for QA.

**Code quality**

- [ ] `pnpm turbo lint` and `pnpm turbo typecheck` pass for affected workspaces.

**Security & architecture**

- [ ] No API leaks `type` (or any org data) without auth; all queries remain `organizationId`-scoped and `deletedAt: null` where soft-deleted models are involved.
- [ ] Zod validation for any new write path that sets `type` (platform/admin only if exposed).

**Testing**

- [ ] Unit tests updated for JWT/session if claims change.
- [ ] Manual: connect as user in seeded REAL_ESTATE and one other type org; confirm `type` visible in network response used by app bootstrap.

**UX & polish**

- [ ] N/A (backend phase).

**Documentation**

- [ ] Comment or short internal note on default type choice and when type is read from token vs DB.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/migrations/**`
- `packages/db/**/seed*.ts`
- `packages/types/**` (enum re-export)
- `apps/client-dashboard/src/lib/auth.ts` (+ tests)
- Relevant API routes under `apps/client-dashboard/src/app/api/`
