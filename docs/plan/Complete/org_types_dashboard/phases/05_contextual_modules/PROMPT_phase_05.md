# Phase 5: Contextual modules — Units, QR, contacts, maintenance

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**FRONTEND** (with **BACKEND** touch only if an API is missing for existing UI — avoid scope creep)

### Tool selection

|               | Tool       | Why           |
| ------------- | ---------- | ------------- |
| **Preferred** | **Cursor** | Multi-page UX |
| **Fallback**  | —          | —             |

### Skills to load

1. `.cursor/skills/qr-branding/SKILL.md` / `.cursor/skills/qr-crypto/SKILL.md` — do **not** change signing; UX only
2. `.cursor/skills/property-domain/SKILL.md` if present for real-estate wording
3. `.cursor/skills/api/SKILL.md` if any route copy changes need aligned error messages

### Context

- **Shared models:** `Unit`, `Contact`, `Project`, QR flows, `WorkOrder` / maintenance (REAL_ESTATE)
- **Config:** `terminology`, `qrFlows`, `flags.maintenanceModule`, `flags.vipListEmphasis`, etc.
- **PRD v7.0:** resident, marketing, security modules — align language only

### Goal

Adapt **labels, wizard steps, empty states, and visible sub-flows** for:

- **Units** (and equivalents: students/members/zones/sections via terminology)
- **QR creation** flows (emphasis order, helper text, templates if any)
- **Contacts / guests** lists (column headers, CTAs)
- **Maintenance requests** for REAL_ESTATE (hide for types without flag)

### Scope (in)

- Page titles, breadcrumbs, table column labels driven by `useOrganizationFeatures()`
- QR wizard / bulk upload pages: step descriptions and recommended path badges
- Contacts page: guardian/VIP/guest language as appropriate
- Maintenance: show module only when `flags.maintenanceModule` true; hide nav already handled in Phase 3 — double-check deep links return 404 or redirect gracefully

### Scope (out)

- New QR types or crypto changes
- Schema changes for “student” entity
- Scanner app changes

### Steps (ordered)

1. Grep key pages: `units`, `contacts`, `qr`, `maintenance`, `projects`.
2. Introduce thin `useModuleTerminology()` helper if it reduces duplication.
3. Replace user-visible strings with i18n keys (English values); ensure **no hard-coded Arabic** in TSX.
4. Add focused tests for conditional rendering (maintenance visibility).
5. Manual walkthrough REAL_ESTATE + SCHOOL + NIGHTCLUB.

### Acceptance criteria

**Functional correctness**

- [ ] Maintenance visible only for appropriate types (at minimum REAL_ESTATE).
- [ ] CLUB/NIGHTCLUB/EVENT_ORGANISER show context-appropriate CTAs and headings.

**Code quality**

- [ ] Lint/typecheck pass; minimal duplication.

**Security & architecture**

- [ ] Route handlers unchanged unless fixing a bug; still Zod + auth + org scope.

**Testing**

- [ ] Component or integration tests for maintenance gating.
- [ ] Manual verification per PLAN (REAL_ESTATE + two others).

**UX & polish**

- [ ] Empty states explain what to do next per type (via i18n keys).

**Documentation**

- [ ] Terminology key map in config comments for `Unit`/`Contact` aliases.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/units/**`
- `apps/client-dashboard/src/app/[locale]/dashboard/contacts/**`
- `apps/client-dashboard/src/app/[locale]/dashboard/qr*/**`
- `apps/client-dashboard/src/app/[locale]/dashboard/maintenance/**`
- Shared components under `apps/client-dashboard/src/components/dashboard/**`
