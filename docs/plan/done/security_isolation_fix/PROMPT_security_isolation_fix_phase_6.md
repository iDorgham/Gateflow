# Pro Prompt — security_isolation_fix — Phase 6: Gate-Assignment UI

This phase implements the dashboard UI for managing user-to-gate assignments as defined in the design draft.

---

## Phase 6: Gate-Assignment Management UI

### Primary role

FRONTEND | SECURITY

### Preferred tool

- [x] Cursor IDE — UI implementation, components, layouts
- [ ] Claude CLI — Backend/API work (security context)

### Context

- **Project**: GateFlow (Monorepo)
- **Initiative**: `security_isolation_fix`
- **Plan**: `docs/plan/planned/security_isolation_fix/PLAN_security_isolation_fix.md`
- **Design Draft**: `docs/design/draft-gate-assignment-screen.md`
- **Pathing**:
  - Page: `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/page.tsx`
  - API: `apps/client-dashboard/src/app/api/gates/assignments/route.ts` (Phase 2 hardening)

### Goal

Implement a secure, multi-tenant UI for assigning organization users to specific gates.

### Scope (in)

- `/dashboard/team/gate-assignments` page.
- Assign form: (Search/Select User) + (Multi-select Gates).
- Assignments table: (User, Gates List, Actions).
- RTL and i18n support.
- Organization-level scoping for all lists.

### Scope (out)

- Global security certification (Phase 7).

### Steps (ordered)

1. **Scaffold Page**: Create the route at `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/page.tsx`.
2. **Permission Guard**: Protect the page with RBAC check (`gates:manage`).
3. **Assign Form**:
   - Fetch users (org-scoped).
   - Fetch gates (org-scoped).
   - Multi-select component for gates.
4. **Table**:
   - List current assignments via `GET /api/gates/assignments`.
   - Implement "Unassign" action via `DELETE /api/gates/assignments`.
5. **i18n**: Add all strings to translation files (dashboard namespace).
6. **Git Cycle**: `git add .`, `git commit -m "feat(security): add gate-assignment management UI"`, `git push`.

### Acceptance criteria

- [ ] Page is only visible to users with `gates:manage`.
- [ ] Users and Gates lists are strictly filtered by `organizationId`.
- [ ] Successfully assigning a user to a gate updates the assignments table.
- [ ] RTL layout works perfectly when Cairo/Arabic locale is active.
- [ ] 100% adherence to ADS design tokens.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/page.tsx`
- `packages/ui/src/components/shared/gate-assignment-form.tsx` (new)
- `packages/ui/src/components/shared/gate-assignments-table.tsx` (new)
- `apps/client-dashboard/src/lib/i18n/locales/en/dashboard.json`
- `apps/client-dashboard/src/lib/i18n/locales/ar/dashboard.json`
