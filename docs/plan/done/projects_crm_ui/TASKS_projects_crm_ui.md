# TASKS_projects_crm_ui

**Plan:** `PLAN_projects_crm_ui.md`  
**Status:** Not started  

**Reality check (feat/real-estate-palette):** Work from `PLAN_project_dashboard` Phases 1–7 is **already done** on this branch (project detail page, EditPanel, navigation, settings first-project, gate assignments). Phases 2 and 4 of this plan overlap; when running `/dev` for Phase 2 or 4, verify against existing implementation and extend rather than duplicate. See `docs/plan/execution/TASKS_project_dashboard.md` for completed items.

---

## Phase 1 — CRM data model & API extensions

**Status:** Not started  

- [ ] Extend Prisma schema for Contacts, Projects, and any supporting models.
- [ ] Generate and apply Prisma migration(s).
- [ ] Update API routes for contacts, projects, units, and gates to accept new fields.
- [ ] Update shared types as needed.
- [ ] `pnpm preflight` (lint + typecheck + tests for client-dashboard/db/types) passes.

---

## Phase 2 — Project page under Projects & header project switching

**Status:** Partially done (see TASKS_project_dashboard Phases 1–4)  

- [ ] Ensure Projects cards link correctly to project detail.
- [ ] Enhance Projects cards to show logo, cover, description, location, and key counts.
- [ ] Wire header project selector to navigate/update the project dashboard.
- [ ] Verify analytics/residents filters behave correctly when project changes.
- [ ] `pnpm preflight` passes.

---

## Phase 3 — Advanced CRM-style Contacts & Units UI

**Status:** Not started  

- [ ] Add CRM fields (job title, source, notes, avatar, etc.) to contact forms.
- [ ] Improve unit tagging UX in the contact form.
- [ ] Ensure Units/Contacts tables stay in sync for relationships.
- [ ] Widen and refine the edit/right panel layout for CRM data.
- [ ] `pnpm preflight` passes.

---

## Phase 4 — Project edit UX, gates & team assignment

**Status:** Partially done (see TASKS_project_dashboard Phases 5–6)  

- [ ] Extend project edit panel with advanced fields (branding, gallery, external URL).
- [ ] Add project-scoped CSV import entry points/UX for units and contacts.
- [ ] Implement single vs multi gate mode toggle at project level.
- [ ] Integrate gate–team assignment management into the project context.
- [ ] `pnpm preflight` passes.

---

## Phase 5 — Header layout & settings split (User vs GateFlow system)

**Status:** Not started  

- [ ] Move avatar to header right and add visible theme toggle.
- [ ] Create/extend Profile page with richer user profile data.
- [ ] Split user vs system settings so avatar menu drives user settings.
- [ ] Refine `/dashboard/settings` tabs to focus on GateFlow/system configuration.
- [ ] `pnpm preflight` passes.

---

## Phase 6 — Advanced tables: TanStack Table base (QR Codes first)

**Status:** Not started  

- [ ] Add TanStack Table to QR Codes page with default column set.
- [ ] Server-side data fetching (org-scoped API); loading and error states.
- [ ] Toolbar placeholder (search/filters/refresh).
- [ ] `pnpm preflight` passes.

---

## Phase 7 — Column reorder & persistence

**Status:** Not started  

- [ ] Drag-and-drop column headers (GripVertical) on QR Codes table.
- [ ] Persist column order to localStorage; restore on load.
- [ ] `pnpm preflight` passes.

---

## Phase 8 — Advanced filtering & date range (QR Codes first)

**Status:** Not started  

- [ ] Extend QR list API with search and date range params (createdAt, expiresAt, lastScanAt).
- [ ] Filter bar with debounced search and date pickers; server-side filtering.
- [ ] `pnpm preflight` passes (include API tests).

---

## Phase 9 — Sorting, pagination, server-side

**Status:** Not started  

- [ ] Sortable headers (asc/desc, optional multi-sort); server-side sort params.
- [ ] Pagination (page/pageSize); optional virtualization for large lists.
- [ ] `pnpm preflight` passes (include API tests).

---

## Phase 10 — Export (CSV) & bulk selection

**Status:** Not started  

- [ ] Export endpoint (CSV, filtered/sorted); audit log for export.
- [ ] Bulk soft-delete with audit; row checkboxes, Select all, bulk actions (Export selected, Delete selected with confirm).
- [ ] `pnpm preflight` passes (include export/bulk tests).

---

## Phase 11 — Apply table pattern to Contacts & Units

**Status:** Done  

- [x] Contacts table: same pattern (reorder, filter, sort, pagination, export, bulk) with Contacts columns.
- [x] Units table: same pattern with Units columns.
- [x] APIs extended for list/export/bulk where needed; org scope and auth on all.
- [x] `pnpm preflight` passes.

---

## Phase 12 — Tables polish, performance, mobile, security audit

**Status:** Done  

- [x] Loading skeleton, error state with retry, inline loading on filter/sort/page.
- [x] Responsive: mobile collapse or horizontal scroll; toolbar usable.
- [x] Virtualization where >500 rows; no unbounded queries.
- [x] Security audit: list/export/bulk endpoints — auth, org scope, soft deletes, validation, audit log; fix gaps.
- [x] `pnpm preflight` passes.
