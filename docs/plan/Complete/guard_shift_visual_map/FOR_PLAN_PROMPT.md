# FOR_PLAN_PROMPT — `guard_shift_visual_map`

**Slug:** `guard_shift_visual_map`  
**Target Application:** `apps/client-dashboard`  
**Created:** 2026-08-28  
**Source:** [`DRAFT_guard_shift_visual_map.md`](./DRAFT_guard_shift_visual_map.md)

---

## 1. Mission

Deliver a real-time **Guard Shift Visual Map & Gate Terminal Monitor** in `apps/client-dashboard`, providing facility directors, operations managers, and chief security officers with instant situational awareness across compound access points. The system visualizes active gates, live guard shifts (`ShiftLog` sessions), scanner terminal connectivity heartbeats, shift handover timers, and alerts for unmanned gates or shift overruns.

---

## 2. Definition of Done

- [x] `GET /api/shifts/live` returns tenant-scoped active shifts, assignments, and gate health status.
- [x] Visual map and terminal card grid live in `apps/client-dashboard/src/app/[locale]/dashboard/organizations/[orgId]/gates/`.
- [x] Shift detail drawer supports inspecting guard info and triggering emergency shift handover.
- [x] Visual alerts highlight unmanned active gates and shift overruns (>8h).
- [x] RTL layout, dark mode, and keyboard accessibility verified.
- [x] Unit & component test suites pass; monorepo `pnpm preflight` is green.
- [x] `CHANGELOG.md` updated under `[Unreleased]` -> `### Apps` -> `[Client]`.
