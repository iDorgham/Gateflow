# TASKS_project_dashboard

**Plan:** `PLAN_project_dashboard.md`  
**Status:** Not started  

---

## Phase 1 — Project Detail Data Layer

**Status:** Pending  

- [ ] Create `[projectId]/page.tsx` route
- [ ] Implement project query with org scope
- [ ] Add aggregates (contacts, unit types, QR/access metrics)
- [ ] Fetch recent scan logs
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (new)

---

## Phase 2 — Project Detail Page Shell

**Status:** Pending  

- [ ] Hero section (cover image, fallback)
- [ ] Title, location, description
- [ ] Semantic tokens only
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`

---

## Phase 3 — KPIs, Gates, Team & Logs

**Status:** Pending  

- [ ] KPI cards (contacts, unit types, QR/access metrics)
- [ ] Gates list
- [ ] Team section
- [ ] Gate logs table
- [ ] Security shift placeholder
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`

---

## Phase 4 — Navigation & Integration

**Status:** Pending  

- [ ] Projects list links to detail
- [ ] Settings projects tab links to detail
- [ ] "Manage gate assignments" CTA on project detail
- [ ] Gate assignments project filter (optional)
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/`

---

## Phase 5 — Edit Panel (Shared Component)

**Status:** Pending  

- [ ] Create EditPanel component (overlay + panel, Save/Quit only)
- [ ] RTL support (slide from left)
- [ ] Semantic tokens only
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/components/dashboard/EditPanel.tsx`

---

## Phase 6 — Edit Panel + Project Page

**Status:** Pending  

- [ ] Edit project (PATCH)
- [ ] Add contact (POST)
- [ ] Add unit (POST, projectId from context)
- [ ] Add/Edit gate (POST, PATCH; projectId in create)
- [ ] Manage gate assignments (assign/unassign users to gates)
- [ ] Add/Edit watchlist entry (POST; PATCH if added)
- [ ] Search in panel (optional)
- [ ] Permission checks (gates:manage for assignments, watchlist)
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- Form components or inline forms for each entity
- `apps/client-dashboard/src/app/api/gates/route.ts` (projectId in create)
- `apps/client-dashboard/src/app/api/watchlist/route.ts` (PATCH if added)

---

## Phase 7 — Projects Settings Tab (First Project + Gates)

**Status:** Pending  

- [ ] Settings Projects tab = only place for first project (redirect /dashboard/projects when 0 projects)
- [ ] Project + gates combined wizard in Settings Projects tab
- [ ] Create project and add gates in same flow
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/components/project-wizard.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`

---

## Phase 8 — Gate Assignments with Time

**Status:** Pending  

- [ ] Add startTime, endTime (or equivalent) to GateAssignment schema
- [ ] Migration for time fields
- [ ] API: POST/GET assignments with time
- [ ] Gate-assignments UI: assign user + gate + time
- [ ] `pnpm preflight` passes

**Files to touch:**
- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/gates/assignments/route.ts`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/`
