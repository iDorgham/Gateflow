# Run 4 — CURSOR (Phase 11 only)

**Run this in Cursor.** Phase 11: apply the same advanced table pattern to Contacts and Units.

---

**Context:** GateFlow client-dashboard. Phases 6–10 are done for QR Codes (TanStack Table, column reorder, filtering, sort, pagination, export, bulk). Refs: `docs/plan/in-progress/projects_crm_ui/PROMPT_projects_crm_ui_phase_11.md`. Load skills: react, gf-design-guide, gf-security (CONTRACTS for any API usage).

**Goal:** Reuse the same table pattern for **Contacts** and **Units** pages: TanStack Table, column reorder + localStorage persistence, filtering (search, date range), sort, pagination, export button, bulk selection and bulk actions (export selected, delete selected with confirmation). Use existing `/api/contacts` and `/api/units`; extend with same query param pattern as QR codes (search, date range, sort, pagination) and add export + bulk-delete endpoints if not present (same security as Phase 10: auth, org scope, audit).

**Contacts table default columns:** avatar, firstName, lastName, phone, email, company, jobTitle, units (badges), QRs count, tags, createdAt, lastUpdated. Persist column order e.g. `client-dashboard.contacts.columns`.

**Units table default columns:** unitNumber, type, size, floor, owner/resident, linked contacts count, linked QRs count, accessRules summary, lastAccess. Persist column order e.g. `client-dashboard.units.columns`.

**Steps:**
1. Ensure Contacts and Units list APIs support search, date range, sort, pagination, and org scope; add export and bulk-delete endpoints if missing (mirror Phase 10 security).
2. Build Contacts table with TanStack Table + reorder, filter bar, sort, pagination, export, bulk selection/actions. Reuse or adapt components from QR Codes table.
3. Build Units table with same feature set and column set.
4. Extract shared hooks/components (e.g. `useTableState`, `TableToolbar`, `FilterBar`) where it reduces duplication without over-abstracting.
5. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`. Commit when green.

**Acceptance:** Contacts and Units tables have full advanced table behavior; list/export/bulk APIs are auth’d and org-scoped; lint/typecheck/tests pass.
