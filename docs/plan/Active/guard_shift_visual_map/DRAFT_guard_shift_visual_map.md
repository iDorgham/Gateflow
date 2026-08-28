# Draft — `guard_shift_visual_map`

**Slug:** `guard_shift_visual_map`  
**Last updated:** 2026-08-28  
**Champion:** Operations & Security Engineering Team  
**Initiative Link:** `docs/development/initiatives/IDEA_guard_shift_visual_map.md`  
**Target:** Client Dashboard Q3/Q4 2026 Release

> Refined planning notes for **Guard Shift Visual Map & Real-time Gate Terminal Monitor**. When this feels complete, run **`/prompt guard_shift_visual_map`** then **`/plan guard_shift_visual_map`**.

---

## Changelog

- **2026-08-28 (Initial)**: Draft created from backlog priority `P1: Guard Shift Visual Map` for `apps/client-dashboard`.

---

## 1. Executive Summary & Goals

### Problem Statement

Property managers, facility directors, and chief security officers currently lack a unified, real-time visual monitor to oversee compound perimeter gates, scanner terminal connectivity, active guard shifts, and roster compliance. Security supervisors must navigate separate tables to determine which gates are unmanned, which guards are currently clocked in, and whether scanner terminals are operating normally.

### Strategic Goals

- **Perimeter Situational Awareness**: Provide an interactive visual map and terminal card grid showcasing all gates within the organization/project, geo-coordinates, active scanner heartbeats, and current gate occupancy.
- **Real-Time Shift Monitoring**: Display live guard shifts (`ShiftLog` and `GateAssignment`), clock-in timestamps, elapsed shift duration counters, and upcoming shift handovers.
- **Operational Warning Badges**: Proactively highlight unattended gates, offline scanner terminals (no heartbeat in >5 min), and shift overruns (>8–12 hours without rotation).
- **Seamless ADS & RTL Experience**: Follow Atlassian/GateFlow Design System token standards (`@atlaskit/tokens` / `nativeTokens`), full dark mode, and complete Arabic RTL layout support.

### Non-Goals

- Physical hardware gate controller relays (e.g. sending raw Modbus/Relay signals to open boom barriers directly from this monitor; that is handled by Edge Controller Bridge).
- In-depth payroll or biometric timecard calculation (focus is operational security state and roster visualization).

---

## 2. Target Users & Personas

- **Security Supervisor / Operations Manager**: Monitors all compound access points in real-time on a large operations display or desktop dashboard; requires instant detection of unmanned gates and terminal disconnects.
- **Property Community Manager**: Reviews daily shift logs, guard coverage metrics, and perimeter activity reports across different projects/compounds.
- **Chief Security Officer (CSO)**: Inspects high-level security readiness, guard punctuality, and incident escalation logs.

---

## 3. Technical Architecture & Invariants

```
+-----------------------------------------------------------------------------------+
|                           Client Dashboard (Next.js 16)                           |
|  [Perimeter Map / Grid View] <--> [Shift Roster Timeline] <--> [Live Alert Strip] |
+-----------------------------------------+-----------------------------------------+
                                          |
                                    GET /api/shifts/live (SWR / React Query)
                                          |
+-----------------------------------------v-----------------------------------------+
|                               Server Route Handlers                               |
|            (Tenant Scoping: organizationId + deletedAt: null Verification)        |
+-----------------------------------------+-----------------------------------------+
                                          |
                                    Prisma ORM
                                          |
+-----------------------------------------v-----------------------------------------+
|                  PostgreSQL Database (Accelerate / Direct)                        |
|   - Gate (id, name, location, lat, lng, isActive)                                 |
|   - GateAssignment (userId, gateId, shiftStart, shiftEnd, scheduleJson)           |
|   - ShiftLog (guardId, gateId, startTime, endTime, createdAt)                     |
|   - User (id, name, email, avatar, role)                                         |
+-----------------------------------------------------------------------------------+
```

### Technical Constraints

- **Stack**: Next.js 16 (App Router), React 19, TypeScript strict mode, `@gateflow/ui` / `@atlaskit/tokens`, Lucide icons, Framer Motion for subtle status transitions.
- **Multi-tenancy**: Mandatory `organizationId` scoping on all queries and mutations. Soft-delete filter `deletedAt: null` where applicable.
- **Performance**: High-density operational data rendering with zero layout shift ($CLS = 0.00$) and lightweight client bundles using `next/dynamic` for heavy visual components.
- **Security & Privacy**: Zero raw PII in audit logs and status feeds.
- **RTL & Localization**: Complete Arabic (`ar-EG` / `ar-SA`) and English (`en-US`) support via `@gate-access/i18n` / `react-i18next`.

---

## 4. In Scope vs Out of Scope

### In Scope:

- **Live Shift API Endpoint** (`/api/shifts/live`): Fetches active shifts (`ShiftLog` with `endTime: null`), scheduled `GateAssignment` records, and real-time gate occupancy status.
- **Perimeter Map & Terminal Grid Component**: Visual interactive map view (with fallback to responsive card grid) displaying gate nodes, guard avatars, active shift status, and terminal heartbeat badges.
- **Shift Roster & Timeline Drawer**: Detail view showing active guard info, shift duration timer, contact button, and emergency supervisor handover action.
- **Operational Health Summary**: Top metrics row showing Total Gates, Active Gates, Unmanned Gates, Active Guards, and Terminal Health score.
- **Unit & Integration Tests**: Comprehensive tests for shift calculation logic, tenant scoping, and state handling.

### Out of Scope:

- Biometric fingerprint scanner hardware integration (handled on native scanner mobile devices).
- Automated SMS/IVR guard wake-up calls.

---

## 5. Suggested Phased Roadmap

1. **Phase 1 — Live Shift & Gate Telemetry API (`api & security`)**:
   - Create `GET /api/shifts/live` endpoint aggregating active `ShiftLog` sessions, `GateAssignment` schedules, and `Gate` metadata.
   - Enforce multi-tenancy (`organizationId`), soft-delete filters, and role-based access control.
   - Add unit tests for shift state resolution (Active, Scheduled, Unmanned, Overrun).

2. **Phase 2 — Guard Shift Visual Map & Interactive Grid UI (`frontend`)**:
   - Build `GuardShiftVisualMap` component with interactive gate nodes and live status indicators.
   - Build `GateTerminalCard` component with guard profile, duration counter, and battery/network health.
   - Integrate with `/dashboard/organizations/[orgId]/gates/shifts` or main gates tab.
   - Implement row/grid density controls and filter bar (by project, status, gate).

3. **Phase 3 — Shift Handover Drawer, Real-Time Alerts & Documentation (`qa & docs`)**:
   - Build `ShiftDetailDrawer` with guard profile, clock-in history, and emergency re-assignment trigger.
   - Add warning alerts for unmanned gates and shift overruns.
   - Conduct Arabic RTL, keyboard navigation, and dark mode audit.
   - Monorepo preflight verification, changelog update, and plan completion.

---

## 6. Open Questions & Risks

- [x] **Map Rendering Approach**: Provide a lightweight SVG/Canvas schematic layout with coordinates (`latitude`, `longitude`) when set, with seamless fallback to a responsive high-density interactive terminal grid.
- [ ] **Real-time Updates**: Initial release uses polling (15s interval via React Query) with optional SSE streaming hook for low-latency updates.
- [ ] **Supervisor Override Action**: Allow authorized managers to perform an emergency "End Shift" or "Reassign Guard" mutation with audit logging.

---

## 7. References

- **Prisma Models**: `Gate`, `GateAssignment`, `ShiftLog`, `User` in `packages/db/prisma/schema.prisma`.
- **Existing Gates UI**: `apps/client-dashboard/src/app/[locale]/dashboard/organizations/[orgId]/gates/`.
- **ADS Tokens & Design**: `.agents/skills/ads-foundations/SKILL.md`, `.agents/skills/ads-data/SKILL.md`.
- **Workflow Guide**: `docs/workspace/COMMAND_GUIDE.md`.
