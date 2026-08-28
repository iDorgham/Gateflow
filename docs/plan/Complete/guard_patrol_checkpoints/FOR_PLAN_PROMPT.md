# Plan Prompt — `guard_patrol_checkpoints`

Use this handoff prompt to drive **`/plan guard_patrol_checkpoints`**.

---

## 1. Mission

Implement **Guard Patrol Checkpoints & QR Route Scanner** in GateFlow (`apps/client-dashboard`, `packages/db`, `packages/types`, `packages/security`). Enable security operations supervisors to configure perimeter patrol routes and physical QR-tagged checkpoints, guards to scan cryptographic HMAC-SHA256 checkpoint QR codes via mobile devices, and operations dashboards to render real-time patrol telemetry, animated waypoint breadcrumbs, and compliance SLA reports directly on `GuardShiftVisualMap`.

---

## 2. In Scope vs Out of Scope

### In Scope

- **Data Models (`packages/db`)**:
  - `PatrolRoute`: Multi-tenant route definitions, frequency, start gate reference, active status.
  - `PatrolCheckpoint`: Checkpoint station names, map coordinates (SVG/lat-lng), order index, QR payload secret hash.
  - `PatrolRun`: Active and historical patrol sessions, assigned guard, status (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `MISSED`).
  - `PatrolLogEntry`: Checkpoint scan timestamps, latency deltas, scan validity receipts.
- **Backend APIs (`apps/client-dashboard/src/app/api/patrols/*`)**:
  - `GET /api/patrols/routes` & `POST /api/patrols/routes`: Multi-tenant route & checkpoint configuration.
  - `GET /api/patrols/live`: Real-time telemetry feed of active runs, current guard locations, and waypoint statuses.
  - `POST /api/patrols/scan`: High-speed checkpoint check-in mutation with cryptographic HMAC-SHA256 validation.
- **Frontend Components (`apps/client-dashboard`)**:
  - `GuardShiftVisualMap.tsx` extension: Overlay patrol waypoint nodes, animated path breadcrumbs, and live guard position indicator.
  - `PatrolRouteManager.tsx` & `PatrolRouteModal.tsx`: Route creation, checkpoint sequencing, and printable high-contrast QR tag export.
  - `PatrolComplianceSummary.tsx`: Supervisor SLA tracking, overdue checkpoint alerts, and exportable compliance logs.
- **Verification & Documentation**:
  - 100% unit and integration test coverage for all APIs and components.
  - Arabic RTL (`ar-EG` / `ar-SA`) mirror layouts and Atlassian Design System tokens.

### Out of Scope

- Continuous real-time GPS tracking (relies on physical geofenced QR checkpoint scans).
- Offline biometric verification during checkpoint check-in (uses active authenticated guard session).

---

## 3. Users & Constraints

- **Target Apps & Packages**:
  - `apps/client-dashboard`
  - `packages/db`
  - `packages/types`
  - `packages/security`
- **Multi-Tenancy & Security Invariants**:
  - All DB queries and mutations must be scoped to `organizationId`.
  - Soft deletes only (`deletedAt: null`).
  - Cryptographic HMAC-SHA256 checkpoint verification (`{ orgId, routeId, checkpointId, nonce, hmac }`).
  - Zero raw PII exposure in live telemetry endpoints or audit logs.
- **Design System & Performance**:
  - Full adherence to `@gate-access/ui/tokens` and ADS dark mode tokens.
  - Zero hydration errors, no CLS regressions, SWR live polling optimization.

---

## 4. Definition of Done

1. Prisma migration applied and validated with `pnpm db:generate`.
2. All API endpoints unit tested with Jest (`route.test.ts`) achieving 100% pass rate.
3. Interactive UI verified with ADS tokens, dark mode elevation, and Arabic RTL support.
4. `pnpm preflight` (lint, typecheck, tests) passing cleanly across all workspaces.
5. Plan logs, runtime proof, and documentation updated.

---

## 5. Suggested Phase Breakdown

1. **Phase 1 — Schema, Route APIs & Cryptographic Checkpoint Signing**
   - Prisma models, route CRUD APIs, checkpoint HMAC generation, printable QR tags.
2. **Phase 2 — Perimeter Visual Map Patrol Telemetry & Real-Time Monitoring**
   - Waypoint overlays on `GuardShiftVisualMap`, live SWR polling, overdue alerts, route management UI.
3. **Phase 3 — Guard Mobile Checkpoint Scanner, Supervisor Alerts & Full Certification**
   - Mobile check-in mutation, compliance summary table, Arabic RTL verification, preflight tests, and docs.

---

## 6. References

- **Draft Document**: [`docs/plan/Draft/guard_patrol_checkpoints/DRAFT_guard_patrol_checkpoints.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/guard_patrol_checkpoints/DRAFT_guard_patrol_checkpoints.md)
- **Context Notes**: [`docs/plan/Draft/guard_patrol_checkpoints/CONTEXT_guard_patrol_checkpoints.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/guard_patrol_checkpoints/CONTEXT_guard_patrol_checkpoints.md)
- **Perimeter Map Component**: [`apps/client-dashboard/src/components/dashboard/gates/GuardShiftVisualMap.tsx`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/components/dashboard/gates/GuardShiftVisualMap.tsx)

---

## Next Command

```text
/plan guard_patrol_checkpoints
```
