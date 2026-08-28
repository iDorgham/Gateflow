# Tasks Checklist — `guard_shift_visual_map`

**Slug:** `guard_shift_visual_map`  
**Plan:** `docs/plan/Complete/guard_shift_visual_map/PLAN_guard_shift_visual_map.md`

---

## Phase 1: Live Shift & Gate Telemetry API (API & Security)

- [x] Create `GET /api/shifts/live` route handler in `apps/client-dashboard`.
- [x] Implement query logic joining `Gate`, active `ShiftLog` (`endTime: null`), `GateAssignment`, and `User`.
- [x] Enforce strict multi-tenancy (`organizationId`), soft-delete filters (`deletedAt: null`), and supervisor/admin RBAC.
- [x] Calculate live shift status (`ACTIVE`, `SCHEDULED`, `UNMANNED`, `OVERRUN`, `OFFLINE`).
- [x] Author unit and route tests in `apps/client-dashboard/src/app/api/shifts/live/route.test.ts`.
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`.

---

## Phase 2: Guard Shift Visual Map & Interactive Grid UI (Frontend)

- [x] Create `useLiveShifts` hook with SWR / React Query polling and error handling.
- [x] Build `GuardShiftVisualMap` component with interactive gate markers and coordinate plotting.
- [x] Build `GateTerminalCard` component with guard profile, duration counter, and battery/network badges.
- [x] Build KPI summary banner (Total Gates, Active Shifts, Unmanned Alerts, Terminal Health).
- [x] Integrate view mode switcher in `/dashboard/organizations/[orgId]/gates` with filter controls.
- [x] Verify ADS token semantics and dark mode rendering.
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`.

---

## Phase 3: Shift Handover Drawer, Real-Time Alerts & Documentation (QA & DevOps)

- [x] Build `ShiftDetailDrawer` with guard contact info, shift clock-in history, and emergency handover action.
- [x] Add visual alert banners for unmanned gates and shift overruns (>8h).
- [x] Verify full bidirectional Arabic RTL (`dir="rtl"`) layout and keyboard navigation.
- [x] Run monorepo preflight `pnpm preflight`.
- [x] Update `CHANGELOG.md` under `[Unreleased]` -> `### Apps` -> `[Client]`.
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`.

---

## Final Review & Hand-off

- [x] All 3 phase logs completed in `phase_logs/`.
- [x] `pnpm preflight` green on entire monorepo.
- [x] Move plan to `Complete/` and update backlog.
