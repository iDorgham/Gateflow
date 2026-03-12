# PLAN_project_dashboard — Unified Real Estate Project Page

**Initiative:** Combine project page with gates and gate assignments; rich project detail view  
**Source idea:** `docs/plan/context/IDEA_project_dashboard.md`  
**Status:** Not started  

---

## 1. Objectives

- Create a **unified project detail page** at `/[locale]/dashboard/projects/[projectId]`.
- Present each project as a real estate showcase: images, title, location, description, KPIs from DB.
- Show: contacts, unit types, avg daily/weekly/monthly QR usage, avg daily/weekly/monthly access (scans), team (gate assignments), gates, gate logs.
- Security shift countdown: placeholder or stub (no Shift model yet).
- Update navigation: projects list links to detail; optionally integrate gate assignments from project page.

---

## 2. High-Level Phases

| Phase | Title | Primary role | Scope |
|-------|-------|--------------|-------|
| 1 | Project Detail Data Layer | BACKEND-Database | Server-side aggregates, project + gates + assignments + metrics |
| 2 | Project Detail Page Shell | FRONTEND | Route, layout, hero, title, location, description |
| 3 | KPIs, Gates, Team & Logs | FRONTEND | Metrics cards, gates list, team section, gate logs, shift placeholder |
| 4 | Navigation & Integration | FRONTEND | Projects list links, sidebar, gate assignments shortcut |
| 5 | Edit Panel (Shared Component) | FRONTEND | Slide-from-right panel, dim overlay, block interaction, Save/Quit |
| 6 | Edit Panel + Project Page | FRONTEND | Edit project, Add contact, Add unit, Add/Edit gate, Manage gate assignments, Add/Edit watchlist, Search in panel |
| 7 | Projects Settings Tab — First Project + Gates | FRONTEND | Settings Projects tab = only place for first project; project + gates combined wizard |
| 8 | Gate Assignments with Time | BACKEND-Database + FRONTEND | Extend GateAssignment with time; Team/gate-assignments UI: assign user + gate + time |

Each phase = one focused `/dev` session. Run `pnpm preflight` before each commit.

---

## 3. Phase 1 — Project Detail Data Layer

**Goal:** Implement server-side data fetching for project detail with all aggregates.

**Primary role:** BACKEND-Database

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (new — data fetching only, or shared loader)
- Prisma queries: project by id + gates, units, qrCodes, gateAssignments
- Aggregates: contacts count, unit types, QR metrics (daily/weekly/monthly), access metrics (scans daily/weekly/monthly)
- Recent scan logs for project gates

**Scope (out):** UI components, navigation changes

**Key tasks:**
- Add `[projectId]` dynamic route
- Query project with `organizationId` + `deletedAt: null`
- Include: gates (with _count scanLogs, qrCodes), units (with type, contacts), gateAssignments (user)
- Compute: unique contacts, unit type list/count
- Compute QR metrics: avg created or scans per QR over last 7d, 30d (clarify with product)
- Compute access metrics: scan count for last 1d, 7d, 30d
- Fetch recent scan logs (e.g. last 20) for gates in project
- Return 404 if project not found or not in org

**Acceptance criteria:**
- Project detail page route exists and returns correct data (or minimal shell)
- All queries scoped by `organizationId`
- `pnpm preflight` passes

---

## 4. Phase 2 — Project Detail Page Shell

**Goal:** Build the visual shell: hero/cover image, title, location, description, layout.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- Hero section (coverUrl, fallback), title, location, description
- Semantic tokens (real estate palette)

**Scope (out):** KPIs, gates, team, logs (Phase 3)

**Key tasks:**
- Server component: fetch project data
- Hero: cover image, gradient overlay, title, location badge
- Description block
- Responsive layout, RTL support
- **SuperDesign:** Optional design draft for hero and layout before implementation

**Acceptance criteria:**
- Page renders with hero, title, location, description
- Uses semantic tokens only
- `pnpm preflight` passes

---

## 5. Phase 3 — KPIs, Gates, Team & Logs

**Goal:** Add KPI cards, gates list, team section, gate logs, security shift placeholder.

**Primary role:** FRONTEND

**Scope (in):**
- Project detail page — KPI section (contacts, unit types, QR avg, access avg)
- Gates list (name, status, last access, QR count)
- Team section (users assigned to gates via GateAssignment)
- Gate logs (recent scans table or list)
- Security shift countdown (placeholder: "Shift status" or "Next shift" stub)

**Scope (out):** Full gate assignment management (can link to existing page)

**Key tasks:**
- KPI cards: Contacts, Unit types, Avg QR (daily/weekly/monthly), Avg access (daily/weekly/monthly)
- Gates: cards or table with gate name, status, lastAccessedAt, QR count
- Team: list users assigned to project gates
- Gate logs: recent ScanLog entries (gate, QR, time, status)
- Shift placeholder: simple badge or "—" for now

**Acceptance criteria:**
- All sections render with real data
- Semantic tokens only
- `pnpm preflight` passes

---

## 6. Phase 4 — Navigation & Integration

**Goal:** Wire projects list to detail page, update sidebar, gate assignments shortcut.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx` — card links to `[projectId]`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx` — link to detail
- Sidebar: ensure Projects links to list; optional project switcher context
- Project detail: "Manage gate assignments" button → `/dashboard/team/gate-assignments?project=:id` or inline modal

**Scope (out):** Admin dashboard, marketing

**Key tasks:**
- Projects list: clicking a project navigates to `/projects/[projectId]`
- Settings projects tab: same
- Add "Manage assignments" CTA on project detail linking to gate-assignments (with project filter if supported)
- Verify sidebar nav

**Acceptance criteria:**
- Projects list → detail flow works
- Gate assignments reachable from project page
- `pnpm preflight` passes

---

## 7. Dependencies & Risks

| Phase | Depends on | Risks |
|-------|------------|-------|
| 1 | — | Metric definitions (avg QR, avg access) may need product input |
| 2 | 1 | None |
| 3 | 1, 2 | Shift model doesn't exist — use placeholder |
| 4 | 2, 3 | Gate-assignments page may need project filter param |
| 5 | — | EditPanel is standalone |
| 6 | 5 | Depends on EditPanel; project detail helps but list page can use EditPanel too |
| 7 | 4 | ProjectWizard exists; extend for gates |
| 8 | 4, 6 | Schema change; scanner may need time-aware check (optional) |

---

## 9. Phase 5 — Edit Panel (Shared Component)

**Goal:** Create a reusable edit panel that slides from the right, dims the page, and blocks interaction until Save or Quit.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/components/dashboard/EditPanel.tsx` (new — shared)
- Uses semantic tokens; RTL support (slide from left when RTL)

**Scope (out):** Integration into specific pages (Phase 6)

**Key tasks:**
- Create EditPanel: open, onOpenChange, title, children, onSave, isLoading
- Overlay: dim (bg-black/50 or bg-background/80), covers full viewport, does NOT close on click (only Save/Quit close)
- Panel: slides from right (left in RTL), fixed, z-50, scrollable content area
- Footer: Save button (primary), Quit/Cancel button (closes without saving)
- Export from components; document for reuse in contacts, units, etc.

**Acceptance criteria:**
- EditPanel renders with overlay + panel
- Overlay blocks interaction (pointer-events)
- Only Save and Quit close the panel
- RTL: panel slides from left
- Semantic tokens only
- `pnpm preflight` passes

---

## 10. Phase 6 — Edit Panel + Project Page

**Goal:** Integrate EditPanel into project page: Edit project, Add contact, Add unit, Add/Edit gate, Manage gate assignments, Add/Edit watchlist entry; search within panel.

**Primary role:** FRONTEND

**Scope (in):**
- Project detail page (or projects list) — Edit, Add contact, Add unit, Add gate, Manage assignments, Add watchlist buttons
- EditPanel with: project form, contact form, unit form, gate form, gate-assignment form, watchlist form
- Search: reuse /api/search or embed Command in panel header; select result → load entity in panel for edit

**Scope (out):** Contacts page, Units page, Gates page, Watchlist page integration (future — same EditPanel, different forms)

**Key tasks:**
- **Edit project** — Button opens EditPanel; form (name, description, location, etc.); PATCH /api/projects/[id]
- **Add contact** — Button opens EditPanel; contact form; POST /api/contacts
- **Add unit** — Button opens EditPanel; unit form (projectId from context); POST /api/units
- **Add/Edit gate** — Button opens EditPanel; gate form (name, location, projectId, isActive); POST /api/gates (with projectId in body if from project context), PATCH /api/gates for edit. Extend gates API if projectId not supported in POST.
- **Manage gate assignments** — Button opens EditPanel; form to assign users to gates (project gates or org gates); GET /api/gates/assignments, POST /api/gates/assignments, DELETE for unassign. User dropdown + gate multi-select.
- **Add/Edit watchlist entry** — Button opens EditPanel; watchlist form (name, idNumber, phone, notes); POST /api/watchlist for add. If PATCH for watchlist doesn't exist, add PATCH /api/watchlist (by id in body) or /api/watchlist/[id] for edit.
- **Search** — Optional: Command in panel headerExtra; search contacts, units, QRs, gates, watchlist; select → load in panel
- Semantic tokens; RTL; permission checks (gates:manage for assignments and watchlist)

**Acceptance criteria:**
- Edit project works from project page
- Add contact opens panel with form
- Add unit opens panel with form (project context)
- Add gate opens panel; new gate can be linked to project
- Edit gate opens panel with existing gate data
- Manage gate assignments: assign/unassign users to gates
- Add watchlist entry opens panel with form
- Edit watchlist entry opens panel (or add PATCH if missing)
- Search (or link) to find and edit entities
- `pnpm preflight` passes

---

## 11. Phase 7 — Projects Settings Tab (First Project + Gates)

**Goal:** Make the Settings Projects tab the **only** place to create the first project. Combine project creation with gates in one flow.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- Project wizard: extend to add gates as part of project creation (project + gates in one flow)
- When org has zero projects: hide or redirect "New Project" from `/dashboard/projects`; CTA points to Settings → Projects tab

**Scope (out):** Admin dashboard, scanner app

**Key tasks:**
- Ensure first-project creation happens only from Settings → Projects tab (or Projects tab is the canonical entry; /dashboard/projects shows empty state with "Go to Settings to create your first project" when org has 0 projects)
- Extend ProjectWizard (or projects-tab create flow) to include gates: create project, then add one or more gates in the same flow (e.g. step 2: add gates to project)
- Combined flow: Project name, description → Add gates (name, location per gate) → Done

**Acceptance criteria:**
- First project can only be created from Settings → Projects tab
- Project creation includes gate setup in the same flow
- `pnpm preflight` passes

---

## 12. Phase 8 — Gate Assignments with Time

**Goal:** Allow assigning team members to gates **with time** (shift window or schedule).

**Primary role:** BACKEND-Database (schema) + FRONTEND (UI)

**Scope (in):**
- `packages/db/prisma/schema.prisma` — extend GateAssignment with time fields (e.g. startTime, endTime as Time? or shiftId reference)
- `apps/client-dashboard/src/app/api/gates/assignments/` — support time in POST/GET
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/` — UI: assign user + gate + time range
- Settings Team tab or gate-assignments page: show and edit assignments with time

**Scope (out):** Full Shift model (optional; can use simple start/end time per assignment first)

**Key tasks:**
- **Schema:** Add `startTime Time?`, `endTime Time?` to GateAssignment (or `dayOfWeek Int?`, `shiftStart Time?`, `shiftEnd Time?` for recurring). PostgreSQL supports `TIME` type.
- **Migration:** Create migration for new fields.
- **API:** Extend POST /api/gates/assignments to accept startTime, endTime (optional).
- **UI:** Gate-assignments form: user dropdown, gate select, time range inputs (e.g. 08:00–16:00 or day + time). List assignments with time display.
- Scanner/validation: When checking gate assignment, optionally consider current time (future: only allow scan if within assigned window).

**Acceptance criteria:**
- GateAssignment supports time (startTime, endTime or equivalent)
- UI allows assigning user + gate + time
- API accepts and returns time for assignments
- `pnpm preflight` passes

---

## 13. Execution

Run each phase via `/dev`:

```
/dev
```
Then paste the contents of `docs/plan/execution/PROMPT_project_dashboard_phase_N.md` for the desired phase.
