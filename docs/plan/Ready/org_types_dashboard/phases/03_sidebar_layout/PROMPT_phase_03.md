# Phase 3: Dynamic sidebar & layout

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why             |
| ------------- | ---------- | --------------- |
| **Preferred** | **Cursor** | Layout refactor |
| **Fallback**  | —          | —               |

### Skills to load

1. `.cursor/skills/i18n/SKILL.md` — RTL sidebar, `start`/`end` awareness
2. `.cursor/skills/ads-accessibility-rtl/SKILL.md` — navigation semantics
3. `.cursor/skills/design-guide/SKILL.md` — density and grouping

### Context

- **Current implementation:** `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx` — static `navItems` arrays and groups
- **Phase 2:** `useOrganizationFeatures()` available
- **Charts/routes:** must stay permission-gated as today; **config filters** items **after** permission filter (or merges with permission mask)

### Goal

Replace hard-coded sidebar structure with **config-driven** ordering, grouping, and visibility for **all five** organization types, for **desktop and mobile** sidebars.

### Scope (in)

- Map each nav entry to a stable **`NavCapabilityId`** (string union) aligned with `ORGANIZATION_FEATURES.sidebar`
- Build nav lists by: **permissions** ∩ **org type config** ∩ **route existence**
- Preserve collapsible sidebar, active states, i18n via existing `t('sidebar.*')` keys; add **type-specific labels** only through terminology keys (e.g. dynamic label for Units vs Students)
- Group headers (`Main`, `Platform`, `Residents`, `Access`) driven by config where possible
- Ensure **RTL**: icons chevrons, border-e/s, scroll areas mirror correctly

### Scope (out)

- New routes or pages
- Admin dashboard

### Steps (ordered)

1. Extract nav metadata (href, icon, permission requirements) into a small registry keyed by `NavCapabilityId`.
2. Implement `buildSidebarNav(features, permissions, t)` (pure function) with tests.
3. Replace inline arrays in `LeftSidebar` / `MobileSidebar` with builder output.
4. Verify REAL_ESTATE shows maintenance/residents emphasis; NIGHTCLUB emphasizes guest/VIP paths if configured; EVENT_ORGANISER emphasizes projects/events wording.
5. Manual RTL pass in Arabic locale after Phase 7 can re-verify; for this phase use logical CSS and avoid hard-coded `left`/`right`.

### Acceptance criteria

**Functional correctness**

- [ ] All five types render appropriate nav sets; no dead links for hidden modules.
- [ ] REAL_ESTATE matches compound-oriented ordering from config.

**Code quality**

- [ ] `pnpm turbo lint` / `pnpm turbo typecheck` pass for client-dashboard.

**Security & architecture**

- [ ] Permission checks unchanged or stricter; no nav item bypasses RBAC.

**Testing**

- [ ] Unit tests for `buildSidebarNav` with fixture configs per type.
- [ ] Manual: spot-check three types + permission-denied user.

**UX & polish**

- [ ] Mobile + desktop parity; collapsed sidebar still usable.

**Documentation**

- [ ] List `NavCapabilityId` values in config module comment.

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`
- `apps/client-dashboard/src/**/organization-features*` (imports)
- New `apps/client-dashboard/src/lib/navigation/**` (if extracted)
