# Phase Log — 03 Shift Management

**Plan:** `scanner_onboarding_session`  
**Completed:** 2026-08-01  
**Branch:** `feat/scanner-phase-03-shift`  
**App:** `scanner-app` (+ `client-dashboard` API)

## What shipped

- API: `POST /api/scanner/shift/start` and `POST /api/scanner/shift/end` (Bearer, org + gate scoped, assignment-aware, IDOR-safe)
- `apps/client-dashboard/src/lib/scanner-shift.ts` — open-shift helpers
- Validate path requires an open `ShiftLog` for guard+gate; stores `shiftLogId` in `ScanLog.auditTrail`
- Client: `shift-session` SecureStore persistence, `useShiftSession`, `shift-api`
- Scanner shell: Start/End shift controls; camera barcode handler blocked without active shift for selected gate
- Types: `scanContext.shiftLogId`, reject reason `no_active_shift`

## Commands / evidence

```bash
pnpm --filter scanner-app test
# Test Suites: 8 passed | Tests: 89 passed
pnpm --filter scanner-app lint  # green
cd apps/client-dashboard && pnpm exec jest src/app/api/scanner/shift src/app/api/qrcodes/validate/route.test.ts --forceExit
# Test Suites: 3 passed | Tests: 35 passed
```

## Decisions / scope notes

- **Terminology mapping:** Prompt spec uses `clock-in`/`clock-out`; implementation uses `start`/`end` endpoints and `ShiftLog` model. The original prompt scope of "clock-in/clock-out shifts" maps to `/api/scanner/shift/start` and `/api/scanner/shift/end`.
- **ShiftLog association:** No `ScanLog.shiftLogId` column yet — association via `auditTrail` JSON (`shiftLogId`) to avoid migration in this phase.
- Gate Permission QR decoding deferred; clock-in uses selected `gateId` (assignment-checked).
- Home duty UI / live timer remains Phase 04.

## Naming aliases (PROMPT immutability)

- PROMPT `clock-in` / `clock-out` → shipped `POST /api/scanner/shift/start|end`
- PROMPT `ShiftId` → shipped `ShiftLog.id` / client `shiftLogId` / `auditTrail.shiftLogId`

## Review fixes (post-PR #205)

Round 1:

- End route: invalid JSON with Content-Type → 400 (empty/whitespace body → `{}`)
- Start: `startOrReuseShift` Serializable txn + retry; close elsewhere covered in helper tests
- `closeShift`: CAS via `updateMany` (`endTime: null`)
- Validate: re-check open shift inside scan transaction; auditTrail + mismatch tests
- Hook: catch errors; require SecureStore save; offline local end; clear-failure messaging
- App: best-effort server clock-out on logout; mount `CameraView` only when on duty
- Offline queue + bulk sync carry optional `shiftLogId`

Round 2:

- `scans:view` required on start/end/active (blocks Resident clock-in)
- Validate: `SELECT … FOR UPDATE` via `lockOpenShiftForGate` vs clock-out race
- Reuse path closes other open shifts; shared `serializeShift`
- End: 503 on DB failure; empty JSON body with Content-Type clocks out
- Client: fetch timeout; `GET …/active` stale-session check; pending_end / ended tombstones
- Override UI hidden for `no_active_shift`
- Bulk sync verifies `shiftLogId` org/guard/gate + window; LWW audit carries `shiftLogId`
- SESSION_MEMORY synced to continue on PR #205 (not a new draft PR)

## Next

- Push review fixes onto existing draft PR **#205** (not a new PR)
- `/dev` Phase 04 — master scan home
