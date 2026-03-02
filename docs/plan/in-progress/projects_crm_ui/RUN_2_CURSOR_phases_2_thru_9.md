# Run 2 — CURSOR (Phases 2–9 UI in one run)

**Run this in Cursor.** Implement the following phases in order in a single session (or consecutive sessions). After each logical phase, run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`; run tests where added. Commit at the end of the run (or per phase if you prefer).

---

**Context:** GateFlow client-dashboard (Next.js 14). Phase 1 is done (schema + API extensions). Refs: `docs/plan/in-progress/projects_crm_ui/PROMPT_projects_crm_ui_phase_2.md` through `PROMPT_projects_crm_ui_phase_9.md`. Design: shared EditPanel, real-estate palette, Projects → Contacts → Units → QR → Settings. Load skills: react, gf-design-guide, gf-architecture, gf-api, gf-security (for any API you touch), gf-i18n.

**Goal:** Deliver all UI and frontend behavior for Phases 2–9 so the dashboard has project hub, CRM Contacts/Units, project edit, header/settings split, and the full QR Codes table (TanStack Table, column reorder, filtering UI, sort/pagination UI). Backend for Phase 8 (filter API) and Phase 9 (sort/pagination API) can be minimal stubs or implemented here if you prefer; otherwise Run 3 (Claude) will implement those APIs.

---

## Phase 2 — Project page & header project switching
- Projects index links to project detail; project detail is the “project dashboard” (hero, KPIs, gates, team).
- Header shows current project; switching project in header navigates to that project’s detail (e.g. `router.push`), smooth update.
- Project cards: name, location, logo, cover (or gradient), key counts (gates, QRs, units, contacts). Loading/empty/404 states.

## Phase 3 — Advanced CRM-style Contacts & Units UI
- Contacts and Units views: richer forms and EditPanel (avatar, job title, company, notes, unit/contact linkage). Wider side panel; CRM-style density.

## Phase 4 — Project edit UX, gates & team assignment
- Project edit panel: Basics, Branding & Media (logo, cover, gallery), CSV import entry for units/contacts, Gates & team.
- Gate mode toggle (single vs multi); single-gate vs multi-gate UI. Team assignments per gate (add/remove) using existing gate-assignment API. Persist via project/gate APIs.

## Phase 5 — Header layout & settings split
- Avatar and theme switch at top-right. Avatar menu → user-centric settings (profile, workspace, billing, security). `/dashboard/settings` = system/GateFlow config (org-level tabs).

## Phase 6 — TanStack Table base (QR Codes)
- QR Codes page: TanStack Table (React Table v8), server-side data from existing `/api/qrcodes`. Default columns: code/preview, type, createdAt, expiresAt, status, createdBy, scans count, lastScanAt, etc. No reorder/filter/export yet.

## Phase 7 — Column reorder & persistence
- Drag-and-drop column reorder on QR Codes table; persist order in localStorage (e.g. `client-dashboard.qrcodes.columns`), restore on load.

## Phase 8 — Advanced filtering & date range (QR Codes)
- Filter bar: global search (debounced), date range (from/to) for createdAt, expiresAt, lastScanAt (@gate-access/ui DatePicker). Wire to API query params. If filter API is not ready, use stub params so UI is ready; Run 3 will implement API.
- Ensure API (or stub) validates params with Zod and uses org scope (or document what Run 3 must do).

## Phase 9 — Sorting & pagination UI (QR Codes)
- Sortable column headers (asc/desc); pagination controls (page size, prev/next). Wire to API params. If sort/pagination API is not ready, use stub params; Run 3 will implement API.

**Acceptance (combined):** All phase-2–9 UI and flows work; navigation, project switch, edit panel, gate mode, team assignment, QR table with columns, reorder, filters, sort, pagination. Lint and typecheck pass. Tests added where reasonable. No regressions to existing behavior.
