# FOR_PLAN_PROMPT — `guard_shift_visual_map`

**Slug:** `guard_shift_visual_map`  
**Target Application:** `apps/client-dashboard`  
**Created:** 2026-08-28  
**Source:** [`DRAFT_guard_shift_visual_map.md`](./DRAFT_guard_shift_visual_map.md)

---

## 1. Mission

Deliver a real-time **Guard Shift Visual Map & Gate Terminal Monitor** in `apps/client-dashboard`, providing facility directors, operations managers, and chief security officers with instant situational awareness across compound access points. The system visualizes active gates, live guard shifts (`ShiftLog` sessions), scanner terminal connectivity heartbeats, shift handover timers, and alerts for unmanned gates or shift overruns.

---

## 2. In Scope vs Out of Scope

### In Scope:

- **Live Shift Telemetry API (`GET /api/shifts/live`)**: Aggregates active `ShiftLog` records (`endTime: null`), scheduled `GateAssignment` data, and `Gate` coordinates with multi-tenancy (`organizationId`) scoping.
- **Interactive Perimeter & Terminal Map / Grid Component**: Visual gate layout (schematic coordinates or card grid) showing status indicators (Active, Scheduled, Unmanned, Overrun, Disconnected).
- **Shift Roster & Details Drawer**: Slide-over drawer with guard avatar, contact actions, elapsed shift duration timer, and supervisor handover action.
- **Perimeter Health KPI Strip**: Top metric badges displaying Total Gates, Active Gates, Unmanned Alerts, and Active Guards.
- **ADS Design Tokens & RTL Localization**: Full token compliance (`@atlaskit/tokens`), dark mode styling, and bidirectional Arabic layout (`ar-EG`, `ar-SA`).
- **Automated Tests & Typecheck**: Unit and route tests verifying tenant isolation, shift duration calculation, and state filtering.

### Out of Scope:

- Modbus/Relay hardware control directly from browser (handled by Edge Controller Bridge).
- Biometric hardware clock-in integration (handled natively on scanner mobile app).

---

## 3. Users & Constraints

- **Primary Persona**: Security Supervisor / Property Operations Manager managing multi-gate compounds.
- **Multi-Tenancy**: Mandatory `organizationId` scoping on all queries; soft-delete filtering (`deletedAt: null`).
- **Security & Privacy**: Strictly zero raw PII in audit logs; role-based access control (Admin / Security Supervisor).
- **Performance**: Zero Cumulative Layout Shift ($CLS = 0.00$); dynamic imports for visual map widgets.
- **Localization**: Full Arabic RTL & English support via `@gate-access/i18n`.
- **Target Workspaces**: `apps/client-dashboard`, `packages/db`, `packages/types`.

---

## 4. Definition of Done

- [ ] `GET /api/shifts/live` returns tenant-scoped active shifts, assignments, and gate health status.
- [ ] Visual map and terminal card grid live in `apps/client-dashboard/src/app/[locale]/dashboard/organizations/[orgId]/gates/`.
- [ ] Shift detail drawer supports inspecting guard info and triggering emergency shift handover.
- [ ] Visual alerts highlight unmanned active gates and shift overruns (>8h).
- [ ] RTL layout, dark mode, and keyboard accessibility verified.
- [ ] Unit & component test suites pass; monorepo `pnpm preflight` is green.
- [ ] `CHANGELOG.md` updated under `[Unreleased]` -> `### Apps` -> `[Client]`.

---

## 5. Suggested Phased Breakdown

1. **Phase 1 — Live Shift & Gate Telemetry API (`api & security`)**:
   - `GET /api/shifts/live` endpoint with active `ShiftLog` aggregation, `GateAssignment` schedules, and gate telemetry.
   - Tenant isolation (`organizationId`) and zero-PII security invariants.
   - Comprehensive route and unit tests.

2. **Phase 2 — Guard Shift Visual Map & Interactive Grid UI (`frontend`)**:
   - Build `GuardShiftVisualMap` and `GateTerminalCard` components with live status badges.
   - Integrate into `/dashboard/organizations/[orgId]/gates/shifts` tab with filter controls.
   - Top metrics KPI strip for perimeter status overview.

3. **Phase 3 — Shift Handover Drawer, Real-Time Alerts & Documentation (`qa & devops`)**:
   - Slide-over `ShiftDetailDrawer` with guard contact, clock-in timeline, and handover action.
   - Visual alert banners for unmanned gates and terminal disconnects.
   - RTL audit, changelog update, and plan completion.

---

## 6. References

- Draft: [`docs/plan/Draft/guard_shift_visual_map/DRAFT_guard_shift_visual_map.md`](./DRAFT_guard_shift_visual_map.md)
- Schema: `packages/db/prisma/schema.prisma` (`Gate`, `GateAssignment`, `ShiftLog`, `User`)
- Gates Client: `apps/client-dashboard/src/app/[locale]/dashboard/organizations/[orgId]/gates/`
- Design Tokens: `.agents/skills/ads-foundations/SKILL.md`

---

## 7. Next Step

```text
/plan guard_shift_visual_map
```
