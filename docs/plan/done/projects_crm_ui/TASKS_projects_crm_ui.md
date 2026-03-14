# Tasks: Project CRM & Advanced UI

## Current Project Status
- **Initiative**: Project Detail CRM Overhaul
- **Current Phase**: Phase 4 Complete
- **Overall Completion**: 80%

---

## Phase 1 — Project Dashboard & Activity Refactor
**Status: Done**

- [x] Refactor dashboard project cards for richer metadata (type, occupancy, activity).
- [x] Implement the hero-style header for project detail pages.
- [x] Integrate high-level activity KPIs (24h/7d scans).
- [x] `pnpm preflight` passes.

---

## Phase 2 — Real-time Activity Logs & Global Feed
**Status: Done**

- [x] Implement the project-specific real-time log list.
- [x] Add status-based color coding (SUCCESS/FAIL/WARNING) to logs.
- [x] Provide a global activity overview at the organization level.
- [x] `pnpm preflight` passes.

---

## Phase 3 — Advanced Contacts & Units UI (EditPanel)
**Status: Done**
- **Objective**: Implement a unified side-panel approach for CRUD.

**Tasks:**
- [x] Expand Contacts & Units interfaces for richer metadata.
- [x] Implement `EditPanel` side-sheet for project-level additions.
- [x] Implement inline individual edit UI within the project context.
- [x] Standardize on `csrfFetch` for all secondary data mutations.

---

## Phase 4 — Project Edit UX, Gates & Team Assignment
**Status: Done**
- **Objective**: Refine project-level metadata and gate assignments.

**Tasks:**
- [x] Add Project Edit fields in `EditPanel` (external URL, media gallery, gate mode toggle).
- [x] Implement backend persistence for new Project fields.
- [x] Refine Gate topology UI (Single vs Multi mode logic in views).
- [x] Add project-scoped CSV import entry points/UX for units and contacts.
- [x] Handle gate-team assignment management UI.

---

## Phase 5 — CRM Polish & Search (Next)
**Status: Pending**
- [ ] Add project-level search/filtering for units/contacts sub-lists.
- [ ] Implement layout & settings split in project sidebar.
- [ ] `pnpm preflight` passes.
