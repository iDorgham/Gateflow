# Pro Prompt — projects_crm_ui — Phase 3

## Phase 3: Shared UI — EditPanel & Advanced Table Engine

### Primary role

FRONTEND | ARCHITECTURE

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, types
- **Rules**: pnpm only; use TanStack Table v8; follow ADS layout.
- **Refs**: `packages/ui/src/components/tables/DataTable.tsx` (base), `docs/plan/Draft/PLAN_projects_crm_ui.md`

### Goal

Develop the reusable side-drawer `EditPanel` and a high-density `DataTable` engine that supports server-side sorting, pagination, and multi-field global search.

### Scope (in)

- `packages/ui/src/components/panels/EditPanel.tsx` (New)
- `packages/ui/src/components/tables/AdvancedTable.tsx` (New engine)
- `apps/client-dashboard/src/components/layout/panel-provider.tsx` (Optional state layer)

### Scope (out)

- Contacts/Units specific implementation logic.
- API endpoints.

### Steps (ordered)

1. **Implement EditPanel**: Create a slide-from-right drawer with a dimming backdrop.
   - Support `onClose`, `onSave`, and dynamic `children`.
   - Block background interaction while open.
   - Apply Midnight Blue header if the panel belongs to a project.
2. **DataTable Engine**: Scaffold `AdvancedTable.tsx` using TanStack Table v8.
   - Implement server-side pagination (manual control).
   - Add column sorting (multi-column support).
   - Implement the "Advanced Filtering" UI (Global Search and Column Filters).
3. **Data Density Toggle**: Support "Compact" and "Comfortable" density views.
4. **Loading States**: Add a skeleton/spinner for table load.
5. **Security**: Ensure all table actions (Edit, Delete, Bulk Action) are validated for the current session.
6. Run `pnpm turbo build --filter=@gate-access/ui`
7. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### Acceptance criteria

- [ ] `EditPanel` slides smoothly (LTR/RTL compliant).
- [ ] `AdvancedTable` supports URL-driven pagination/sorting (e.g., `?page=2&sort=name:asc`).
- [ ] High-density view toggle reduces row padding for maximum information visibility.
- [ ] `pnpm turbo build --filter=client-dashboard` passes

### Files likely touched

- `packages/ui/src/components/panels/EditPanel.tsx`
- `packages/ui/src/components/tables/AdvancedTable.tsx`
- `apps/client-dashboard/src/hooks/use-data-table.ts`
- `packages/ui/src/index.ts`
