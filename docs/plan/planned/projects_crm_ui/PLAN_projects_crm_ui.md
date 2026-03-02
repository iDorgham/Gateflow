# PLAN_projects_crm_ui — Projects CRM, Settings & Advanced Tables

**Canonical initiative** for all client-dashboard CRM, dashboard, palette, and advanced-table work. Do not start ad-hoc client-dashboard work outside this plan.

---

## Design brief (one UX story)

- **Primary users:** Property manager (main), security head, marketing lead. Same data, different entry points.
- **First view:** Project detail or Projects list (header project switcher drives context). From there: Contacts, Units, QR Codes, Gates, Settings.
- **Navigation:** Projects → project detail → EditPanel for project/contact/unit/gate/watchlist. Sidebar: Projects, Residents (Contacts / Units), QR Codes, Gates, Analytics, Settings. Header: project selector, theme toggle, avatar (Profile, Workspace, Billing, Security).
- **Consistency:** Shared **EditPanel** and **real-estate palette** (semantic tokens) across analytics, projects, contacts, units, settings so the dashboard feels like one coherent app.
- **Implementation:** Use `gf-design-guide`, `ui-ux`, `tailwind`, `gf-creative-ui-animation`; consider SuperDesign once for unified project/CRM layout before locking JSX.

---

## Relationship to other plans

- **PLAN_project_dashboard** — Phases 1–7 are **already done** on `feat/real-estate-palette` (project detail, EditPanel, navigation, settings first-project). Phase 8 (Gate Assignments with Time) can be a later phase in this plan or a follow-up.
- **PLAN_client_dashboard_ui_refine** — Palette and shell work is absorbed into this plan (header, theme, settings split, semantic tokens).
- **dashboard_enhancements_v1** — 6-phase idea folded in (header/panel, project form, units/contacts/QR, settings reorg).
- **Advanced tables** — Core requirements for Contacts, Units, and QR Codes tables are added as Phases 6–12 (TanStack Table, column reorder, filtering, sort/pagination, export/bulk, apply to all three, polish).

---

## Phase summary

| Phase | Title | Primary role | Depends on |
|-------|--------|--------------|------------|
| 1 | CRM data model & API extensions | BACKEND-Database / BACKEND-API | — |
| 2 | Project page & header project switching | FRONTEND | 1 |
| 3 | Advanced CRM-style Contacts & Units UI | FRONTEND | 1 |
| 4 | Project edit UX, gates & team assignment | FRONTEND / BACKEND-API | 1, 2 |
| 5 | Header layout & settings split (User vs GateFlow) | ARCHITECTURE / FRONTEND | — (parallel OK) |
| 6 | Advanced tables — TanStack Table base (QR Codes first) | FRONTEND | — |
| 7 | Column reorder & persistence | FRONTEND | 6 |
| 8 | Advanced filtering & date range (QR Codes first) | FRONTEND / BACKEND-API | 6 |
| 9 | Sorting, pagination, server-side | BACKEND-API / FRONTEND | 6, 8 |
| 10 | Export (CSV) & bulk selection | BACKEND-API / FRONTEND | 6, 9 |
| 11 | Apply table pattern to Contacts & Units | FRONTEND | 6, 7, 8, 9, 10 |
| 12 | Tables polish, performance, mobile, security audit | FRONTEND / QA / SECURITY | 11 |

---

## Phases 1–5 (CRM & settings)

*(Unchanged from original PLAN_projects_crm_ui; see phase prompts for full scope.)*

- **Phase 1:** Backend fields and APIs for Contact, Unit, Project, Gate (jobTitle, source, avatarUrl, notes; project gallery, single/multi-gate; org scope, soft deletes).
- **Phase 2:** Project detail page, header project selector, Projects cards (logo, cover, KPIs), navigation coherence.
- **Phase 3:** Contacts & Units CRM UI — richer forms, EditPanel, unit/contact linkage, wider side panel.
- **Phase 4:** Project edit — location, website, logo/cover/gallery, CSV import for units/contacts, single/multi-gate UI, gate assignment in project context.
- **Phase 5:** Header (avatar right, theme toggle), settings split (User: Profile/Workspace/Billing vs GateFlow system settings), profile page enhancements.

---

## Phases 6–12 (Advanced tables — Contacts, Units, QR Codes)

**Core requirements** (apply to all three tables):

1. **Column customization & reordering** — Drag-and-drop column headers (e.g. GripVertical), persist order per user (localStorage first, later API).
2. **Advanced filtering** — Global search, per-column filters (text, select, multi-select, number ranges), date range (createdAt, expiresAt, lastScanAt for QR); debounced, server-side where needed.
3. **Sorting** — Clickable headers, asc/desc, multi-sort (shift+click).
4. **Pagination & virtualization** — Server-side pagination (limit/offset or cursor); row virtualization for >500–1000 rows.
5. **Export** — Toolbar “Export” → CSV (filtered/sorted); options: visible columns / all / selected rows; server-side endpoint; audit log.
6. **CRM-like** — Bulk selection (checkboxes), bulk actions (export selected, delete with confirm), loading skeleton, error states, responsive (collapse columns or horizontal scroll).
7. **Page-specific column sets** (customizable defaults):
   - **Contacts:** avatar, firstName, lastName, phone, email, company, jobTitle, units (badges), QRs count, tags, createdAt, lastUpdated.
   - **Units:** unitNumber, type, size, floor, owner, linked contacts/QRs count, accessRules summary, lastAccess.
   - **QR Codes:** code/preview, type, createdAt, expiresAt, status, createdBy, scans count, lastScanAt, linked unit(s), linked contact(s), source.
8. **UI polish** — @gate-access/ui (Button, Badge, Input, DatePicker), toolbar (search, filters, export, refresh, density), consistent theme, smooth transitions.

**Phase 6 — TanStack Table base + QR Codes page**  
- Introduce TanStack Table (React Table) for the QR Codes table; server-side data fetching; default columns for QR (code, type, createdAt, expiresAt, status, scans count, lastScanAt, etc.). No reorder/filter/export yet.  
- **Priority:** QR Codes first (time-sensitive for scan logs & security).

**Phase 7 — Column reorder + persistence**  
- Drag-and-drop column headers (GripVertical), persist column order per user (localStorage key e.g. `client-dashboard.qrcodes.columns`); later extend to Contacts/Units.

**Phase 8 — Advanced filtering + date range**  
- Global search; per-column filters; date range (from/to) for createdAt, expiresAt, lastScanAt (QR Codes); debounced inputs; server-side filter params.  
- Use @gate-access/ui DatePicker in popover or filter bar.

**Phase 9 — Sorting, pagination, server-side**  
- Sortable headers (asc/desc), multi-sort (shift+click); server-side pagination (limit/offset or cursor); optional virtualization for large lists.

**Phase 10 — Export (CSV) + bulk selection**  
- “Export” button → CSV download (filtered & sorted); server-side export endpoint; audit log for export action. Bulk row selection (checkboxes), bulk actions (export selected, delete selected with confirmation).  
- Load gf-security; respect CONTRACTS (org scope, soft deletes, no data leak).

**Phase 11 — Apply table pattern to Contacts & Units**  
- Reuse same TanStack Table + column reorder, filtering, sort, pagination, export, bulk selection for Contacts and Units pages with their column sets.

**Phase 12 — Polish, performance, mobile, security audit**  
- Loading skeletons, error states, responsive (mobile: collapse columns or horizontal scroll), inline loading when filtering/sorting/paginating. Performance check (virtualization if >500 rows). Security review: export auth, bulk delete auth, org scoping on all table APIs.

---

## Risks & notes

- All new queries must scope by `organizationId` and `deletedAt: null`. Follow `.cursor/contracts/CONTRACTS.md` and `.cursor/skills/gf-security/SKILL.md` for table/export/bulk APIs.
- Backward compatibility: no breaking existing flows; feature-flag or optional fields where needed.
- Each phase prompt must load gf-security when touching APIs/data, and include acceptance criteria: lint, typecheck, unit/integration tests pass.

---

## Execution

When approved, run **`/plan ready projects_crm_ui`** to move this folder from `planning/` to `planned/`. Then run **`/dev`** with the desired `PROMPT_projects_crm_ui_phase_<N>.md` to execute one phase at a time.
