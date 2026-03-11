# TASKS_project_dashboard

**Plan:** `PLAN_project_dashboard.md`  
**Status:** Phases 1–7 done (synced with `feat/real-estate-palette`); Phase 8 pending  

---

## Phase 1 — Project Detail Data Layer

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Create `[projectId]/page.tsx` route
- [x] Implement project query with org scope
- [x] Add aggregates (contacts, unit types, QR/access metrics)
- [x] Fetch recent scan logs
- [x] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (new)

---

## Phase 2 — Project Detail Page Shell

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Hero section (cover image, fallback)
- [x] Title, location, description
- [x] Semantic tokens only
- [x] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`

---

## Phase 3 — KPIs, Gates, Team & Logs

**Status:** Done  
**Completed:** 2026-03-02  

- [x] KPI cards (contacts, unit types, QR/access metrics)
- [x] Gates list
- [x] Team section
- [x] Gate logs table
- [x] Security shift placeholder
- [x] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`

---

## Phase 4 — Navigation & Integration

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Projects list links to detail
- [x] Settings projects tab links to detail
- [x] "Manage gate assignments" CTA on project detail
- [x] Gate assignments project filter (optional)
- [x] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/`

---

## Phase 5 — Edit Panel (Shared Component)

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Create EditPanel component (overlay + panel, Save/Quit only)
- [x] RTL support (slide from left; auto-detect from document.dir or isRtl prop)
- [x] Semantic tokens only
- [x] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/components/dashboard/EditPanel.tsx`

---

## Phase 6 — Edit Panel + Project Page

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Edit project (PATCH)
- [x] Add contact (POST)
- [x] Add unit (POST, projectId from context)
- [x] Add/Edit gate (POST, PATCH; projectId in create)
- [x] Manage gate assignments (assign/unassign users to gates)
- [x] Add/Edit watchlist entry (POST; PATCH if added)
- [ ] Search in panel (optional — deferred)
- [x] Permission checks (gates:manage for assignments, watchlist)
- [x] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- `apps/client-dashboard/src/components/dashboard/project-detail/` (ProjectDetailActions, ProjectDetailContent, GatesCardWithEdit)
- `apps/client-dashboard/src/app/api/projects/[id]/route.ts` (extended PATCH schema)
- `apps/client-dashboard/src/app/api/gates/route.ts` (projectId, isActive in create)
- `apps/client-dashboard/src/app/api/watchlist/[id]/route.ts` (new PATCH)

---

## Phase 7 — Projects Settings Tab (First Project + Gates)

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Settings Projects tab = only place for first project (/dashboard/projects with 0 projects shows CTA to Settings)
- [x] Project + gates combined wizard in Settings Projects tab (ProjectWizard already has gates step)
- [x] Create project and add gates in same flow (wizard API)
- [x] `pnpm preflight` passes

**Files touched:**
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
- `packages/i18n/src/locales/en.json`
- `packages/i18n/src/locales/ar-EG.json`

---

## Phase 8 — Gate Assignments with Time

**Status:** Done  
**Completed:** 2026-03-11  

- [x] Add shiftStart, shiftEnd (String?, HH:mm) to GateAssignment schema
- [x] Migration for time fields (`add_gate_assignment_time`)
- [x] API: POST accepts optional shiftStart/shiftEnd; GET returns time for assignments
- [x] Gate-assignments UI: optional shift start/end inputs; table shows Shift column
- [x] `pnpm preflight` passes

**Files touched:**
- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/migrations/20260311000000_add_gate_assignment_time/migration.sql`
- `apps/client-dashboard/src/app/api/gates/assignments/route.ts`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/gate-assignments-client.tsx`
