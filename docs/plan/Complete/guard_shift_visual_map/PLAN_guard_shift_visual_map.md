# PLAN: Guard Shift Visual Map & Real-Time Gate Monitor

**Slug:** `guard_shift_visual_map`  
**Status:** complete  
**Created:** 2026-08-28  
**Completed:** 2026-08-28  
**Target:** Client Dashboard Q3/Q4 2026 Release  
**Focused App:** `apps/client-dashboard`

## Overview

Deliver an operational **Guard Shift Visual Map & Real-Time Gate Monitor** on `apps/client-dashboard`. The system provides facility managers and security supervisors with live perimeter situational awareness: interactive gate nodes and high-density cards displaying gate occupancy, active `ShiftLog` sessions, `GateAssignment` schedules, scanner terminal connectivity heartbeats, shift duration timers, and visual alert strips for unmanned gates and shift overruns.

## Objectives

1. **Live Shift & Telemetry API**: Provide a high-performance endpoint (`GET /api/shifts/live`) aggregating active shifts, assigned guards, and gate health status with strict `organizationId` multi-tenancy scoping.
2. **Interactive Visual Map & Grid View**: Deliver an interactive compound gate map with coordinate nodes and responsive card grid supporting density controls and status filters.
3. **Shift Details & Supervisor Handover**: Slide-over drawer displaying guard profile, shift clock-in timeline, and emergency handover / re-assignment actions.
4. **Proactive Operational Alerts**: Real-time warning badges for unmanned active gates and shift overruns (>8h without rotation).
5. **ADS Tokens & RTL Semantics**: Complete design token alignment (`@atlaskit/tokens` / `nativeTokens`), dark mode styling, and bidirectional Arabic layout (`ar-EG`, `ar-SA`).

## Hard Invariants

- **Multi-tenancy**: Mandatory `organizationId` scoping on all queries and `deletedAt: null` filtering.
- **Privacy & PII**: Zero raw PII in audit metadata and server telemetry logs.
- **Design Tokens**: Standardized CSS variables via `@atlaskit/tokens` without hardcoded hex values.
- **Layout Performance**: Deterministic layout structure with zero layout shift ($CLS = 0.00$) and dynamic widget code-splitting.
- **Tooling**: `pnpm` only. No `npm` or `yarn`.

## Phases

| #   | Phase                                                               | Primary Role | Preferred Tool  | Status |
| --- | ------------------------------------------------------------------- | ------------ | --------------- | ------ |
| 1   | Live Shift & Gate Telemetry API (API & Security)                    | SECURITY     | claude / cursor | [x]    |
| 2   | Guard Shift Visual Map & Interactive Grid UI (Frontend)             | FRONTEND     | cursor / gemini | [x]    |
| 3   | Shift Handover Drawer, Real-Time Alerts & Documentation (QA/DevOps) | QA           | cursor / gemini | [x]    |

## Canonical Prompt Paths

- Phase 1: `phases/01_live_shift_gate_telemetry_api/PROMPT_phase_01.md`
- Phase 2: `phases/02_visual_map_interactive_grid_ui/PROMPT_phase_02.md`
- Phase 3: `phases/03_shift_handover_drawer_alerts_docs/PROMPT_phase_03.md`

## Dependencies

- Phase 2 UI consumes data shapes provided by the Phase 1 `/api/shifts/live` route.
- Phase 3 integrates handover actions and alerts into Phase 2 components.
