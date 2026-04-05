# PROMPT: Phase 1 — Nested Organizational Hierarchy & Routing Foundation

**Mission**: Strategic backend refactor of the Admin Dashboard to transition from global entities to an **Organization-centric Hub**. Every resource (User, Project, Gate) must be strictly nested inside an `Organization` with smart context switching and scoped routing.

---

## 🏛️ Strategic Goals

1.  **Strict Nesting**: Move `User`, `Project`, and `Gate` entities into a child-parent relationship with `Organization`.
2.  **Scoped Routing**: Implement `/organizations/[orgId]` as the root workspace in the Admin Dashboard.
3.  **Context (Org) Switcher**: A premium Sidebar component for super-admins/operators to instantly hop between org contexts with micro-animations.
4.  **Middleware Guard**: Ensure every route under `/organizations/[orgId]` is strictly guarded by `organizationId` scoping at the Edge/Server level.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Database Refactor (BACKEND)

- Load `gateflow-database` skill.
- Update `prisma/schema.prisma`:
  - Ensure `User`, `Project`, and `Gate` have a required `organizationId`.
  - Create `OrganizationType` and `OrganizationStatus` enums.
  - Add `AiActionLog` table for auditing AI workflows (Phase 2-6 foundation).
- Run `npx prisma migrate dev --name init_org_nesting`.

### Step 2: Scoped Routing Foundation (FRONTEND/ARCHITECTURE)

- Refactor `apps/admin-dashboard/src/app/[locale]/(dashboard)`:
  - Move default dashboard pages into `(dashboard)/organizations/[orgId]`.
  - Redirect `/` to the first available organization or an `/organizations` picker.
- Update `OrganizationContext` to provide the current `orgId` to all child components.

### Step 3: Premium Context Switcher (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Build `OrgSwitcher.tsx` in `apps/admin-dashboard/src/components/sidebar`:
  - Features: Searchable list of organizations, "Quick Switch" via `Cmd+K`.
  - Style: Premium dark-mode (bg: `#191a1c`, border: `#2f2f33`).
  - Animation: Framer Motion `LayoutGroup` for smooth indicator transitions.
- **MENA/RTL**: Ensure the switcher's labels and chevron icons mirror correctly for Arabic.

### Step 4: Multi-Tenant Middleware (SECURITY)

- Load `gf-security`.
- Update `apps/admin-dashboard/src/middleware.ts`:
  - Verify the authenticated user has access to the `orgId` in the URL.
  - Automatically inject `x-organization-id` header into the request for downstream API use.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **Data Integrity**: Queries for Users/Gates naturally filter by `organizationId`.
- [ ] **Routing**: Navigating to `/organizations/[orgId]/projects` works correctly.
- [ ] **Visuals**: Org switcher is 100% ADS-compliant with no hardcoded hex.
- [ ] **RTL**: Arabic layout is perfectly mirrored and terminology is culturally appropriate.
- [ ] **Performance**: Pre-flight checks (`pnpm turbo lint/typecheck`) pass across all affected packages.
