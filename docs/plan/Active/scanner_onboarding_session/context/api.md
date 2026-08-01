# API notes — scanner_onboarding_session

## Scanner shift (Phase 03)

Hosted under **client-dashboard** (scanner uses `EXPO_PUBLIC_API_URL`).

| Method | Path                       | Auth       | Body              | Notes                                                                                                                                            |
| ------ | -------------------------- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/api/scanner/shift/start` | Bearer JWT | `{ gateId }`      | Creates open `ShiftLog`; org + gate scoped; assignment-checked; idempotent if already open at same gate; closes prior open shift at another gate |
| POST   | `/api/scanner/shift/end`   | Bearer JWT | `{ shiftLogId? }` | Closes open shift owned by caller; omit id to close current open shift                                                                           |

Handlers:

- `apps/client-dashboard/src/app/api/scanner/shift/start/route.ts`
- `apps/client-dashboard/src/app/api/scanner/shift/end/route.ts`
- Helpers: `apps/client-dashboard/src/lib/scanner-shift.ts`

## Validate linkage

`POST /api/qrcodes/validate` requires an open `ShiftLog` for `claims.sub` + resolved `gateId` + `orgId`. Reject reason: `no_active_shift`.

`scanContext.shiftLogId` (optional) must match the open shift when provided.

Association persisted on `ScanLog.auditTrail[]` entry details as `shiftLogId` (no FK column yet).
