# Draft — `guard_patrol_checkpoints`

**Slug:** `guard_patrol_checkpoints`  
**Last updated:** 2026-08-28  
**Champion:** Client Dashboard & Mobile Security Engineering  
**Initiative Link:** `docs/development/initiatives/IDEA_guard_patrol_checkpoints.md`  
**Target:** Q3/Q4 2026

> Refined planning notes for **Guard Patrol Checkpoints & QR Route Scanner**. When this feels complete, run **`/prompt guard_patrol_checkpoints`** then **`/plan guard_patrol_checkpoints`**.

---

## Changelog

- **2026-08-28 (Initial Capture)**: Initial draft capturing perimeter patrol routes, physical checkpoint QR verification, visual map telemetry integration, and supervisor compliance reporting.

---

## 1. Executive Summary & Goals

### Problem Statement

Security supervisors and compound administrators currently lack verifiable proof of physical perimeter patrols. While gate stations have static guard occupancy tracking via `GuardShiftVisualMap`, guards on roving patrols along perimeter fences, back gates, and clubhouse zones cannot report real-time station visits without manual radios or logbooks.

### Strategic Goals

- **Perimeter Route & Checkpoint Management**: Allow supervisors on `client-dashboard` to define ordered or flexible patrol routes linking perimeter gates, fences, and facility checkpoints.
- **Physical QR Checkpoint Verification**: Generate cryptographically signed (HMAC-SHA256), printable checkpoint QR tags that guards scan using the mobile scanner app to record verifiable timestamped check-ins.
- **Real-Time Patrol Telemetry on Visual Map**: Render roving patrol progress, active guard coordinates, and completed/missed checkpoints directly on `GuardShiftVisualMap`.
- **Missed Patrol Alerts & Compliance Reports**: Trigger supervisor alerts when a scheduled patrol exceeds its SLA window (> 30 min delay) and provide exportable compliance completion reports.

### Non-Goals

- Continuous background GPS tracking of guards (avoids mobile battery drain and privacy concerns; uses geofenced checkpoint QR scans instead).
- Third-party hardware guard wand integration (utilizes standard GateFlow mobile scanner app).

---

## 2. Target Users & Personas

- **Security Supervisor / Operations Manager (`client-dashboard`)**:
  - Configures patrol routes (e.g. "Night North Perimeter Loop", "Clubhouse & Pool Hourly Check").
  - Monitors real-time patrol progress on the perimeter radar map.
  - Receives alerts for skipped or overdue checkpoints and reviews patrol audit logs.
- **Roving Security Guard (`scanner-app` / mobile view)**:
  - Views assigned patrol route, next expected checkpoint, and time window.
  - Scans physical QR tags at each physical checkpoint to log instant verified arrival.

---

## 3. Technical Architecture & Invariants

```
               [Client Dashboard: /dashboard/organizations/[orgId]/gates]
                                       |
                       +---------------+---------------+
                       |                               |
             [PatrolRouteManager]            [GuardShiftVisualMap]
         (Route & Checkpoint Config)       (Live Patrol Breadcrumbs &
                       |                    Checkpoint Node Pulses)
                       |                               ^
         [POST /api/patrols/routes]                    | [GET /api/patrols/live]
                       |                               |
               [PostgreSQL / Prisma] <-----------------+
         - PatrolRoute                                 |
         - PatrolCheckpoint                            |
         - PatrolRun & PatrolLogEntry                  |
                       ^                               |
                       | [POST /api/patrols/scan]      |
                       +-------------------------------+
                                       |
                         [Mobile Scanner / Guard View]
                     (Scans Checkpoint HMAC QR Payload)
```

### Technical Constraints & Invariants

- **Multi-Tenancy**: Every `PatrolRoute`, `PatrolCheckpoint`, `PatrolRun`, and `PatrolLogEntry` must strictly enforce `organizationId` scoping.
- **Tamper-Proof Checkpoint Payload**: Checkpoint QR codes must contain HMAC-SHA256 signed payloads (`orgId`, `checkpointId`, `sequence`, `secretHash`) preventing forged scans.
- **Soft Deletes**: Deleting a route or checkpoint must use `deletedAt: new Date()` to preserve historical patrol compliance logs.
- **ADS & RTL Standards**: Full support for Atlassian Design System tokens, dark mode elevation tokens, and Arabic (`ar-EG` / `ar-SA`) mirror layouts.

---

## 4. In Scope vs Out of Scope

### In Scope

1. **Prisma Schema & Database Models**:
   - `PatrolRoute` (name, frequencyMinutes, startGateId, active, organizationId).
   - `PatrolCheckpoint` (name, lat/lng or SVG map coordinates, orderIndex, qrPayloadHash, organizationId).
   - `PatrolRun` (routeId, guardId, status: `SCHEDULED` | `IN_PROGRESS` | `COMPLETED` | `MISSED`, startedAt, completedAt).
   - `PatrolLogEntry` (runId, checkpointId, scannedAt, latencySeconds).
2. **Backend API Endpoints**:
   - `GET /api/patrols/routes` — List routes and checkpoints for the active tenant.
   - `POST /api/patrols/routes` — Create / update patrol route and checkpoints.
   - `GET /api/patrols/live` — Real-time telemetry feed of active runs and checkpoint statuses.
   - `POST /api/patrols/scan` — Guard checkpoint check-in mutation with HMAC validation.
3. **Frontend UI Components (`client-dashboard`)**:
   - `PatrolRouteList.tsx` & `PatrolRouteModal.tsx` — CRUD interface for routes & printable QR tags.
   - `GuardShiftVisualMap.tsx` extension — Overlay patrol waypoint nodes, animated path breadcrumbs, and live guard position indicator.
   - `PatrolComplianceCard.tsx` — KPI summary of scheduled vs completed patrols and overdue warnings.
4. **Printable QR Tag Export**:
   - High-contrast printable PDF / SVG checkpoint tags using native hex tokens.

### Out of Scope

- Offline biometric face match during checkpoint scan (uses active guard session identity).
- Vehicle automatic number-plate recognition (ANPR) within patrol routes.

---

## 5. Suggested Phased Roadmap

1. **Phase 1 — Schema, Route APIs & Cryptographic Checkpoint Signing**:
   - Define Prisma models for `PatrolRoute`, `PatrolCheckpoint`, `PatrolRun`, and `PatrolLogEntry`.
   - Implement `GET /api/patrols/routes`, `POST /api/patrols/routes`, `POST /api/patrols/scan`.
   - Implement HMAC checkpoint QR code generation with printable SVG/PDF export.
2. **Phase 2 — Perimeter Visual Map Patrol Telemetry & Real-Time Monitoring**:
   - Add live patrol path overlays and animated waypoint pulse indicators to `GuardShiftVisualMap.tsx`.
   - Implement `GET /api/patrols/live` SWR polling with latency badges and missed checkpoint warnings.
   - Build `PatrolRouteList` drawer and route configuration modal.
3. **Phase 3 — Guard Mobile Checkpoint Scanner, Supervisor Alerts & Documentation**:
   - Provide mobile checkpoint scanning interface with vibration/audio haptic feedback.
   - Build `PatrolComplianceSummary` table and exportable CSV/PDF compliance reports.
   - Update PRD, architecture references, and test suite.

---

## 6. Open Questions & Risks

- [ ] **Checkpoint Sequence Flexibility**: Should routes enforce strict sequential checkpoint scanning (`1 -> 2 -> 3`), or allow flexible order within a time window? _(Proposed: configurable `isStrictSequence: boolean` per route)._
- [ ] **Overdue Alert Escalation**: Should overdue patrols trigger immediate in-app toast alerts or email/push notifications? _(Proposed: in-app telemetry badge + push notification to active supervisor)._

---

## 7. References

- **Visual Perimeter Map**: `apps/client-dashboard/src/components/dashboard/gates/GuardShiftVisualMap.tsx`
- **Shift Telemetry Route**: `apps/client-dashboard/src/app/api/shifts/live/route.ts`
- **QR Crypto Utilities**: `packages/security` & `packages/db/src/lib/crypto.ts`
- **ADS Token Standards**: `@gate-access/ui/tokens` & `docs/guides/UI_DESIGN_GUIDE.md`
