# Phase 3: Guard Mobile Checkpoint Scanner, Supervisor Alerts & Full Certification

**Initiative:** `guard_patrol_checkpoints`  
**Phase:** 3 of 3  
**Role:** QA & Security Certification Lead  
**Preferred Tool:** `claude`

## Objective

Implement the guard mobile checkpoint scan check-in mutation endpoint (`POST /api/patrols/scan`), build supervisor compliance KPI reporting table with CSV/PDF export, complete Arabic RTL layout verification, and certify the entire initiative through `pnpm preflight`.

## Steps

1. **Checkpoint Scan Mutation (`apps/client-dashboard/src/app/api/patrols/scan/route.ts`)**:
   - Validates cryptographic HMAC signature, verifies guard's active session, matches route sequence, records `PatrolLogEntry`, and updates `PatrolRun` status.
   - Logs tamper-evident audit record in `AuditLog` on invalid signature attempts.
2. **Supervisor Patrol Compliance Table (`PatrolComplianceSummary.tsx`)**:
   - Displays scheduled vs completed patrols, on-time completion percentage, average patrol duration, and missed checkpoints log.
   - CSV and PDF export capability with rate limiting and audit logging.
3. **Arabic RTL & Accessibility Verification**:
   - Verify layout directionality (`ar-EG` / `ar-SA`) on drawer, modal, and map labels.
4. **Preflight Verification & Phase Certification**:
   - Run `pnpm turbo lint typecheck test --filter=client-dashboard`.
   - Update `runtime-proof.json`, phase logs, and PRD references.

## Acceptance Criteria

- [ ] `POST /api/patrols/scan` verifies HMAC signatures and records check-in timestamps.
- [ ] Compliance summary table renders accurate patrol metrics with CSV export.
- [ ] `pnpm preflight` passes cleanly across all packages and apps.
- [ ] Runtime proof artifact generated and verified.
