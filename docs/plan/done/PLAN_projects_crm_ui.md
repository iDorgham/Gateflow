# PLAN: projects_crm_ui — Unified Real Estate CRM & Operations Hub

**IDEA:** `docs/plan/context/IDEA_projects_crm_ui.md`

**PLAN:** `docs/plan/planning/PLAN_projects_crm_ui.md`

**Status:** 🔄 In-Progress

**Target:** Q4 2026

- [x] Phase 1 — Foundation: Real Estate Palette & Tokens
- [x] Phase 2 — Core Schema & API: CRM Aggregates
- [x] Phase 3 — Shared UI: EditPanel & Advanced Table Engine
- [x] Phase 4 — Project Hub: List & Detail Views
- [x] Phase 5 — CRM Management: Contacts & Units
- [x] Phase 6 — Sync & Operations: Project Logs & Team
- [x] Phase 7 — Final Audit: Polish, RTL & Security

---

## Phase 1: Foundation — Real Estate Palette & Tokens (P0)

- **Primary Role**: DESIGN-TOKEN
- **Goal**: Apply the professional "Real Estate" color palette (Midnight Blue 
  & Kimchi Orange) across the dashboard.
- **Steps**:
  1. [x] Define semantic tokens in `packages/ui/src/globals.css`.
  2. [x] Map `--background` to Anti-Flash White (`#F2F3F4`) and `--foreground` to 
     Midnight Blue (`#020035`).
  3. [x] Map `--primary` to Kimchi Orange (`#ED4B00`).
  4. [x] Update `LoginShell` and `DashboardShell` to use the new Midnight Blue 
     sidebar theme.
- **Acceptance Criteria**:
  - Entire Client Dashboard uses the new Midnight Blue/Kimchi theme.
  - WCAG contrast ratios (18:1+) met for all primary text.

## Phase 2: Core Schema & API — CRM Aggregates (P0)

- **Primary Role**: BACKEND-API
- **Goal**: Extend the data model and API to support project-level metrics 
  and time-scoped assignments.
- **Steps**:
  1. [x] Extend `GateAssignment` in `schema.prisma` with optional `startTime` 
     and `endTime`.
  2. [x] Implement an API route for Project Aggregates (`contactsCount`, 
     `qrUsage`, `weeklyScans`).
  3. [x] Create specialized Prisma helpers to calculate relative growth 
     (e.g., scan volume % change).
- **Acceptance Criteria**:
  - `pnpm prisma db push` successful.
  - API returns correct aggregates for a given `projectId`.

## Phase 3: Shared UI — EditPanel & Advanced Table Engine (P1)

- **Primary Role**: FRONTEND
- **Goal**: Create the reusable "Edit" utility and the base TanStack 
  Table v8 engine.
- **Steps**:
  1. [x] Implement a slide-from-right `EditPanel` component with a dimming overlay.
  2. [x] Scaffold the `DataTable` base component using TanStack Table v8.
  3. [x] Add support for server-side sorting, pagination, and multi-field 
     global search.
- **Acceptance Criteria**:
  - `EditPanel` slides smoothly and blocks background clicks.
  - Table handles pagination calls to the API correctly.

## Phase 4: Project Hub — List & Detail Views (P1)

- **Primary Role**: FRONTEND
- **Goal**: Implement the unified Project detail page and navigation.
- **Steps**:
  1. [x] Update `/dashboard/projects` list to use high-density cards with 
     KPI sparklines.
  2. [x] Create `/[locale]/dashboard/projects/[projectId]/page.tsx` with 
     a rich hero header.
  3. [x] Integrate KPI cards (Contacts, Units, Active QRs, Scans) into the header.
- **Acceptance Criteria**:
  - Navigation from project list to detail works flawlessly.
  - Hero header displays project-specific metrics and imagery.

## Phase 5: CRM Management — Contacts & Units (P1)

- **Primary Role**: FRONTEND + BACKEND-API
- **Goal**: Full CRM lifecycle management for project-scoped contacts 
  and units.
- **Steps**:
  1. [x] Implement the "Contacts" and "Units" tabs within the Project detail page.
  2. [x] Use the `EditPanel` for creating/editing Contacts and Units.
  3. [x] Implement bulk actions (Export CSV, Bulk Delete).
- **Acceptance Criteria**:
  - Creating a contact via `EditPanel` updates the project totals.
  - Advanced filtering (by unit type, project role) works on the CRM tables.

## Phase 6: Sync & Operations — Project Logs & Team (P2)

- **Primary Role**: BACKEND-API + FRONTEND
- **Goal**: Integrate real-time scan logs and gate assignments into the 
  project hub.
- **Steps**:
  1. [ ] Add a "Live Logs" feed to the project page filtered by project gates.
  2. [ ] Implement a "Team" tab to manage gate assignments specifically for 
     this project.
  3. [ ] Allow assigning users to gates with the new time-scope fields.
- **Acceptance Criteria**:
  - Live logs update via SSE/WS when a scan occurs at a project gate.
  - Team assignments are correctly scoped to the project gates.

## Phase 7: Final Audit — Polish, RTL & Security (P2)

- **Primary Role**: SECURITY + QA
- **Goal**: Conduct a global layout and security audit of the new CRM features.
- **Steps**:
  1. [ ] Conduct a full RTL layout audit for Arabic support.
  2. [ ] Perform a "Tenant Isolation" check on all new CRM API routes.
  3. [ ] Final design polish (animations, transitions, particles).
- **Acceptance Criteria**:
  - 100% RTL compliance in Arabic.
  - Zero cross-org data leaks in CRM endpoints.

---

## Technical Constraints

- Every API query must include `organizationId: claims.orgId`.
- No raw CSS; use Tailwind logical properties (`ps-`, `pe-`, `ms-`, `me-`).
- All interactive elements must have unique, descriptive IDs for E2E testing.
