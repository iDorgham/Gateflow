# Pro Prompt — projects_crm_ui — Phase 5

## Phase 5: CRM Management — Contacts & Units

### Primary role

FRONTEND | BACKEND-API

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, types
- **Rules**: pnpm only; use TanStack Table v8; multi-tenant.
- **Refs**: `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (Phase 4), `docs/plan/Draft/PLAN_projects_crm_ui.md`

### Goal

Implement the full CRM lifecycle (Create, Read, Update, Delete) for Contacts and Units within the project hub using high-density tables and the `EditPanel`.

### Scope (in)

- `apps/client-dashboard/src/components/crm/ContactTable.tsx` (New)
- `apps/client-dashboard/src/components/crm/UnitTable.tsx` (New)
- `apps/client-dashboard/src/components/crm/ContactForm.tsx` (New)
- `apps/client-dashboard/src/components/crm/UnitForm.tsx` (New)
- `apps/client-dashboard/src/app/api/crm/contacts/route.ts` (API)
- `apps/client-dashboard/src/app/api/crm/units/route.ts` (API)

### Scope (out)

- Project header redesign.
- Gate Operations.

### Steps (ordered)

1. **API Endpoints**: Create `/[locale]/api/crm/contacts/` and `/[locale]/api/crm/units/` with:
   - GET (Paginated, Sorted, Filtered).
   - POST (Create).
   - PATCH (Update).
   - DELETE (Soft delete).
2. **Contact Table**: Implement `ContactTable.tsx` using the `AdvancedTable` engine.
   - Columns: Name, Phone, Unit, Project Role, CreatedAt.
   - Row action: Open `EditPanel` with contact data.
3. **Unit Table**: Implement `UnitTable.tsx` using the `AdvancedTable` engine.
   - Columns: Unit Number, Block, Floor, Type, Contacts count.
   - Row action: Open `EditPanel` with unit data.
4. **CRM Forms**: Create `ContactForm.tsx` and `UnitForm.tsx` for use inside the `EditPanel`.
   - Zod validation; client-side errors.
   - Organization scoping on form submission.
5. **Bulk Actions**: Add "Export CSV" and "Bulk Delete" to the table header.
6. **Security Audit**: Ensure every row change checks the `organizationId`.
7. Run `pnpm turbo test --filter=client-dashboard`
8. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### Subagents

| Subagent    | When          | Prompt                                                                                             |
| ----------- | ------------- | -------------------------------------------------------------------------------------------------- |
| **explore** | Field mapping | "Find all Zod schemas for Contacts and Units to ensure form validation is consistent with the DB." |

### Acceptance criteria

- [ ] Creating a contact correctly increments the Project aggregate totals from Phase 2.
- [ ] Table filtering works for "Unit Type" or "Project Role."
- [ ] Soft deletion works correctly (record remains in DB but `deletedAt` set).
- [ ] Export CSV generates valid data for the filtered results.

### Files likely touched

- `apps/client-dashboard/src/components/crm/ContactTable.tsx`
- `apps/client-dashboard/src/components/crm/UnitTable.tsx`
- `apps/client-dashboard/src/components/crm/ContactForm.tsx`
- `apps/client-dashboard/src/components/crm/UnitForm.tsx`
- `apps/client-dashboard/src/app/api/crm/contacts/route.ts`
- `apps/client-dashboard/src/app/api/crm/units/route.ts`
- `packages/types/src/crm.ts`
