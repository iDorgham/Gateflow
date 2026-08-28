# Tasks — `guard_patrol_checkpoints`

- [x] **Phase 1: Schema, Route APIs & Cryptographic Checkpoint Signing**
  - [x] Add Prisma models: `PatrolRoute`, `PatrolCheckpoint`, `PatrolRun`, `PatrolLogEntry` in `packages/db/prisma/schema.prisma`
  - [x] Add shared TypeScript interfaces in `packages/types/src/patrol.ts`
  - [x] Implement `GET /api/patrols/routes` and `POST /api/patrols/routes` in `apps/client-dashboard`
  - [x] Implement HMAC-SHA256 checkpoint QR generator with printable SVG export
  - [x] Write unit & integration tests (`route.test.ts`) for Phase 1

- [x] **Phase 2: Perimeter Visual Map Patrol Telemetry & Real-Time Monitoring**
  - [x] Implement `GET /api/patrols/live` telemetry endpoint with active runs & latency tracking
  - [x] Extend `GuardShiftVisualMap.tsx` with animated patrol path overlays and checkpoint node indicators
  - [x] Build `PatrolRouteManager.tsx` and `PatrolRouteModal.tsx` for route/checkpoint CRUD
  - [x] Build SWR hook `use-live-patrols.ts` with real-time heartbeat polling
  - [x] Write unit & snapshot tests for visual map extensions

- [x] **Phase 3: Guard Mobile Checkpoint Scanner, Supervisor Alerts & Full Certification**
  - [x] Implement `POST /api/patrols/scan` check-in endpoint with HMAC verification & audit logging
  - [x] Build mobile checkpoint scanner view with audio/haptic feedback
  - [x] Build `PatrolComplianceSummary.tsx` table with SLA tracking & CSV/PDF export
  - [x] Run full preflight verification (`pnpm turbo lint typecheck test`)
  - [x] Generate phase logs, runtime proof, and documentation
