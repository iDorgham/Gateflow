# Pro Prompt — Phase 11: Apply table pattern to Contacts & Units

## Phase 11: Apply table pattern to Contacts & Units

### Primary role

FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] react — React/Next.js patterns
- [x] gf-design-guide — layout, tokens
- [x] gf-security — org scope on any new API usage (CONTRACTS.md)
- [ ] gf-testing — Jest, test patterns
- [ ] gf-i18n — AR/EN labels for new UI

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — client-dashboard. Phases 6–10 done for QR Codes (TanStack Table, column reorder, filtering, sort, pagination, export, bulk selection).
- **Refs:** `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/`, `residents/units/`; existing Contacts and Units pages and APIs.

### Goal

Reuse the **same advanced table pattern** (TanStack Table, column reorder, persistence, filtering, sort, pagination, export, bulk selection) for **Contacts** and **Units** pages, with their respective column sets and APIs.

### Scope (in)

- **Contacts table:** Default columns — avatar, firstName, lastName, phone, email, company, jobTitle, units (badges), QRs count, tags, createdAt, lastUpdated. Column reorder persistence (e.g. `client-dashboard.contacts.columns`). Filtering (search, date range for createdAt), sort, pagination, export, bulk selection/actions. Use existing `/api/contacts` or extend with same query params pattern as QR codes.
- **Units table:** Default columns — unitNumber, type, size, floor, owner/resident name, linked contacts count, linked QRs count, accessRules summary, lastAccess. Same features: reorder, filter, sort, pagination, export, bulk. Use existing `/api/units` or extend.
- Shared: Extract reusable hooks/components (e.g. `useTableState`, `TableToolbar`, `FilterBar`) where it reduces duplication without over-abstracting.

### Scope (out)

- No new backend models; only extend existing list/export APIs if needed. Prefer reusing patterns from QR codes implementation.

### Steps (ordered)

1. Ensure Contacts and Units list APIs support the same query param pattern (search, date range, sort, pagination) and org scope; add export and bulk-delete endpoints if not present (same security as Phase 10).
2. Build Contacts table with TanStack Table, default column set, column order persistence, filter bar, sort, pagination, export, bulk selection/actions. Reuse or adapt components from QR Codes table.
3. Build Units table similarly with its column set and APIs.
4. Add i18n keys for new labels (filter placeholders, bulk actions, export) in `en.json` and `ar-EG.json`.
5. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] Contacts page has advanced table (reorder, filter, sort, pagination, export, bulk) with Contacts-specific columns.
- [ ] Units page has advanced table with Units-specific columns and same feature set.
- [ ] All list/export/bulk APIs are org-scoped and auth-protected; soft deletes only.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (no regression).

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ContactsTable.tsx` (new or refactored)
- `apps/client-dashboard/src/components/dashboard/residents/UnitsTable.tsx` (new or refactored)
- `apps/client-dashboard/src/app/api/contacts/route.ts`, `api/units/route.ts` (extend)
- `packages/i18n/src/locales/en.json`, `ar-EG.json`
