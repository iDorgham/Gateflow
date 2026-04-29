# PROMPT: Phase 1 — Nested Organizational Hierarchy & Routing Foundation

**Mission**: Strategic backend refactor of the Admin Dashboard to transition from global entities to an **Organization-centric Hub**. Every resource (User, Project, Gate) must be strictly nested inside an `Organization` with smart context switching and scoped routing.

> **Depends on:** `org_types_dashboard` Phase 1 must be merged and migrations pushed **before** running this phase's DB steps. The `OrganizationType` enum is **owned by `org_types_dashboard`** — do not redefine it here. Consume it from `@gate-access/types`.

---

## ⚠️ Migration Conflict Prevention

This phase and `org_types_dashboard` Phase 1 both touch `packages/db/prisma/schema.prisma`. To prevent conflicts:

1. **`org_types_dashboard` P1 runs first** — it adds `OrganizationType` enum and `Organization.type`.
2. **This phase runs second** — adds `AiActionLog`, `AiGeneratedAsset`, and org-scoped routing infrastructure.
3. **Never run both DB migrations simultaneously.** Each gets a distinct migration name.
4. After `org_types` P1 is merged: `git pull --rebase`, then start Step 1a below.

---

## 🏛️ Strategic Goals

1. **Strict Nesting**: Move `User`, `Project`, and `Gate` entities into a child-parent relationship with `Organization`.
2. **Scoped Routing**: Implement `/organizations/[orgId]` as the root workspace in the Admin Dashboard.
3. **301 Redirects**: All legacy `/dashboard/*` routes redirect to `/organizations/[orgId]/*` to preserve existing bookmarks and integrations.
4. **Context (Org) Switcher**: A premium Sidebar component for super-admins/operators to instantly switch org contexts with micro-animations.
5. **Middleware Guard**: Every route under `/organizations/[orgId]` is strictly guarded by `organizationId` scoping at the Edge/Server level.
6. **Admin Org Provisioning**: Admin must be able to set `orgType` when creating or editing an organization (needed for `org_types_dashboard` feature-flagging to be testable).

---

## 🛠️ Implementation (3 Sub-Phases)

### Sub-Phase 1a: Database Refactor (BACKEND only)

- Load `gateflow-database` skill.
- Update `prisma/schema.prisma`:
  - Ensure `User`, `Project`, and `Gate` have a required `organizationId` (verify already exists; add if missing).
  - Add `AiActionLog` table with fields: `id`, `organizationId`, `userId`, `action`, `status` (`PENDING_CONFIRMATION` | `CONFIRMED` | `REJECTED`), `payload (Json)`, `reasoning (String?)`, `createdAt`, `updatedAt`.
  - Add `AiGeneratedAsset` table for Phase 5-6 image assets: `id`, `organizationId`, `aiActionLogId`, `url`, `type`, `createdAt`.
  - **Do NOT add `OrganizationType` here** — consume from `org_types_dashboard` migration.
- Run `npx prisma migrate dev --name add_ai_action_log_and_asset`.
- Run `pnpm turbo typecheck --filter=packages/db`.

### Sub-Phase 1b: Scoped Routing & Legacy Redirects (ARCHITECTURE)

- Refactor `apps/admin-dashboard/src/app/[locale]/(dashboard)`:
  - Move default dashboard pages into `(dashboard)/organizations/[orgId]`.
  - Redirect `/` → first available org or `/organizations` picker.
  - **Add 301 permanent redirects** from all legacy `/dashboard/*` routes → `/organizations/[orgId]/*` in `next.config.ts` redirects array.
- Update `OrganizationContext` to provide `orgId` and `orgType` to all child components.
- Update `useOrganization()` hook to read from context.
- Verify: `pnpm turbo build --filter=admin-dashboard` passes.

### Sub-Phase 1c: Premium OrgSwitcher UI + Admin Provisioning (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Build `OrgSwitcher.tsx` in `apps/admin-dashboard/src/components/sidebar`:
  - Features: Searchable list of organizations, "Quick Switch" via `Cmd+K`.
  - Style: Premium dark-mode using ADS tokens only (no hardcoded hex).
  - Animation: CSS `creative-animation` transitions for smooth open/close. Only add `framer-motion` if a specific layout morph acceptance criterion is added below.
  - **MENA/RTL**: Labels and chevron icons mirror correctly for Arabic.
- Build `OrgProvisioningForm.tsx` in Admin Org settings:
  - Field: `orgType` (select from `OrganizationType` enum values).
  - This enables the `org_types_dashboard` feature-flagging system to be tested per org.
- Load `gf-security` and update `apps/admin-dashboard/src/middleware.ts`:
  - Verify user belongs to the `orgId` in the URL.
  - Inject `x-organization-id` header for downstream API use.

---

## ✅ Acceptance Criteria (Definition of Done)

**Sub-Phase 1a (DB)**

- [ ] `AiActionLog` and `AiGeneratedAsset` tables exist and migrate cleanly.
- [ ] No duplicate/conflict with `org_types_dashboard` migration history.
- [ ] `pnpm turbo typecheck --filter=packages/db` passes.

**Sub-Phase 1b (Routing)**

- [ ] Navigating to `/organizations/[orgId]/projects` works correctly.
- [ ] Legacy `/dashboard` routes return 301 → org-scoped URL.
- [ ] `pnpm turbo build --filter=admin-dashboard` passes with no broken imports.

**Sub-Phase 1c (UI + Provisioning)**

- [ ] OrgSwitcher is 100% ADS token-compliant (no hardcoded hex).
- [ ] Admin can set `orgType` on org create/edit form; value persists to DB.
- [ ] Arabic layout is perfectly mirrored and culturally appropriate.
- [ ] Middleware blocks access to `orgId` the user does not belong to.
- [ ] `pnpm preflight` passes across all affected packages.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/migrations/**`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/**`
- `apps/admin-dashboard/next.config.ts` (redirect rules)
- `apps/admin-dashboard/src/middleware.ts`
- `apps/admin-dashboard/src/components/sidebar/OrgSwitcher.tsx`
- `apps/admin-dashboard/src/components/org/OrgProvisioningForm.tsx`
- `apps/admin-dashboard/src/lib/hooks/useOrganization.ts`
