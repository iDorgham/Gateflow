# Pro Prompt — Residents & Analytics: Phase 2 (Contacts: Filter Bar, Table, Tags)

## Phase 2: Contacts — Filter Bar, Table, Tags

### Primary role

**FRONTEND + BACKEND-API** — Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — Turborepo, pnpm, Next.js 14 App Router
- **Rules:** multi-tenant, soft deletes; use @gate-access/ui, Tailwind
- **Refs:** PLAN_residents_analytics.md, apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx

### Goal

Refactor the Contacts page to use React Query and React Table; add a shared ResidentsFilterBar (date range, search, unitType, tags); implement tag column with inline multi-select and bulk tag actions; add table customizer (reorder/hide columns, save to User.preferences); add "View Units" row action modal.

### Scope (in)

- Add @tanstack/react-query and @tanstack/react-table to client-dashboard
- ResidentsFilterBar component: date range (7d/30d/custom), search, unitType dropdown, tag multi-select; sync state to URL (search, from, to, unitType, tagIds)
- Contacts page: useContacts( filters ) hook (fetch /api/contacts with query params); React Table with column definitions (avatar, firstName, lastName, birthday, company, phone, email, tags, units, visitsInRange, passesInRange, lastVisitInRange, actions)
- Tag column: inline multi-select dropdown to add/remove tags; bulk selection + "Add tag to selected" / "Remove tag from selected"
- Table customizer modal: list columns with checkboxes (visibility) and drag-drop order; "Save as view" and "Load view" from User.preferences.tableViews.contacts; prevent hiding id and name columns
- Row action "View Units": open modal/sheet with linked units and optional per-unit metrics (from contact.units or refetch)
- Parse URL on load (searchParams) and pass to filters; update URL when filters change (shallow replace)

### Scope (out)

- Units page changes (Phase 3)
- Analytics page changes (Phase 4)
- Redis caching

### Steps (ordered)

1. `pnpm add @tanstack/react-query @tanstack/react-table` in apps/client-dashboard. Wrap app or layout with QueryClientProvider if not already present.
2. Create ResidentsFilterBar: props (filters, onFiltersChange, tags[]). Date range presets + custom from/to; search input; unitType select; tag multi-select. Emit changes to onFiltersChange; sync from URL in parent.
3. Create useContacts(filters) hook: useQuery with key that includes filter params; call GET /api/contacts?dateFrom=...&dateTo=...&tagIds=...&unitType=...&search=...&sort=...&page=... Return data, isLoading, refetch.
4. Refactor Contacts page: read searchParams (from, to, search, unitType, tagIds); pass to ResidentsFilterBar and useContacts. Replace current table with React Table (getCoreRowModel, getVisibleColumns from preferences). Define columns including visitsInRange, passesInRange, lastVisitInRange, tags (cell with dropdown), actions (Edit, Delete, View Units).
5. Implement tag column: fetch tags from GET /api/tags; per-row dropdown to add/remove tags (call POST/DELETE /api/contacts/[id]/tags); invalidate useContacts on success.
6. Bulk action: row selection state; toolbar "Add tag to selected" / "Remove tag from selected"; call POST /api/contacts/tags/bulk; invalidate queries.
7. Table customizer modal: open from toolbar; list columns (id, firstName, ...); toggle visibility; drag to reorder; "Save view" (name) writes to PATCH /api/users/me/preferences { tableViews: { contacts: { visible, order } } }; "Load view" restores. Apply visibility/order to React Table state.
8. View Units modal: on row action, open sheet/modal; pass contact.id; fetch or use contact.units; display list with optional visitsInRange per unit (if API returns).
9. Ensure RTL and i18n keys for new labels (filter bar, customizer, View Units).
10. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.

### Acceptance criteria

- [ ] ResidentsFilterBar updates URL and useContacts refetches with new params
- [ ] Contacts table shows all columns including aggregates and tags; tag column supports add/remove; bulk tag actions work
- [ ] Table customizer saves/loads from User.preferences; column order and visibility persist
- [ ] "View Units" opens modal with linked units
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

### Files likely touched

- apps/client-dashboard/package.json
- apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx
- apps/client-dashboard/src/components/dashboard/residents/ResidentsFilterBar.tsx (new)
- apps/client-dashboard/src/components/dashboard/residents/TableCustomizerModal.tsx (new)
- apps/client-dashboard/src/components/dashboard/residents/ViewUnitsModal.tsx (new)
- apps/client-dashboard/src/lib/residents/use-contacts.ts (new)
- packages/i18n/src/locales/en.json, ar-EG.json
