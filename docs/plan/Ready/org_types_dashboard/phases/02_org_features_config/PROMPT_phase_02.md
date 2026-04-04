# Phase 2: Organization context & `ORGANIZATION_FEATURES` config

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**ARCHITECTURE** / **FRONTEND** (configuration layer)

### Tool selection

|               | Tool       | Why                    |
| ------------- | ---------- | ---------------------- |
| **Preferred** | **Cursor** | Types, provider, hooks |
| **Fallback**  | —          | —                      |

### Skills to load

1. `.cursor/skills/architecture/SKILL.md`
2. `.cursor/skills/i18n/SKILL.md` — key naming, RTL-ready structure (no Arabic yet beyond key stubs if desired)

### Context

- **Canonical spec:** `PLAN_org_types_dashboard.md` → section **Canonical config: ORGANIZATION_FEATURES**
- **Phase 1 dependency:** `Organization.type` available on org payload
- **Contracts:** config is **data for UX only** — never bypass RBAC or tenant checks

### Goal

Implement **`ORGANIZATION_FEATURES`** as the **single source of truth** for type-specific dashboard behavior and expose it through **`useOrganizationFeatures()`** plus a **React context provider** wired high in the client-dashboard tree (inside authenticated layout).

### Scope (in)

- Typed `OrganizationType` union / import from shared package aligned with Prisma
- `ORGANIZATION_FEATURES` constant: full entries for **all five** types with MENA-aware **English key paths** (values are i18n keys, not hard-coded Arabic)
- `OrganizationFeatures` interface covering: `terminology`, `sidebar`, `dashboard`, `qrFlows`, `settings`, `flags` (extend as needed; keep DRY with deep merge from a `base` partial if useful)
- `OrganizationFeaturesProvider` + `useOrganizationFeatures()` hook (throw or no-op fallback documented when used outside provider during SSR — follow existing dashboard patterns)
- Resolve features from `organization.type` with **exhaustive** `switch` or record lookup
- Unit tests for: each type returns defined config; unknown type fails closed to `REAL_ESTATE` **or** throws in dev only (choose one strategy and document)

### Scope (out)

- Sidebar/dashboard UI consumption (Phases 3–4)
- Arabic strings (Phase 7)

### Steps (ordered)

1. Create module(s) per PLAN (prefer `@gate-access/types` export if shared).
2. Implement the five type configs with polished terminology **keys** (e.g. `orgType.realEstate.unitLabel`).
3. Add provider next to existing org/session context if one exists; otherwise create minimal provider fed from server-loaded org.
4. Wire server component or layout loader to pass `type` into provider **without** `localStorage` token hacks.
5. Add tests in `packages/types` or `apps/client-dashboard` as appropriate.
6. `pnpm turbo lint` + `pnpm turbo typecheck` for affected workspaces.

### Acceptance criteria

**Functional correctness**

- [ ] All five types have complete config objects (no missing required keys at runtime).
- [ ] REAL_ESTATE config reflects compound/residential emphasis per PLAN.

**Code quality**

- [ ] Modular, config-driven; no giant `if (type === …)` scattered outside the config module.
- [ ] Lint/typecheck pass for affected workspaces.

**Security & architecture**

- [ ] Features derived only from server-trusted `organization.type`; client cannot escalate modules via query params.

**Testing**

- [ ] Unit tests for config resolution and exhaustiveness.

**UX & polish**

- [ ] N/A (infrastructure).

**Documentation**

- [ ] Short comment block at top of config file describing extension rules and i18n key conventions.

### Files likely touched

- `packages/types/src/**` and/or `apps/client-dashboard/src/config/**`
- `apps/client-dashboard/src/components/dashboard/**` (provider placement)
- Test files alongside the above
