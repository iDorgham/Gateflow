# Phase 05: Gates & Access Logs Matrix

**App:** `apps/client-dashboard`  
**Date:** 2026-07-26  
**Status:** Locked

---

## 1. Gate Configuration & Assignment Endpoints

| Endpoint                 | Method   | Scope               | Tenant Guard     | Purpose                               | Status   |
| ------------------------ | -------- | ------------------- | ---------------- | ------------------------------------- | -------- |
| `/api/gates`             | GET/POST | Gate management     | `organizationId` | Create/list security gate checkpoints | Verified |
| `/api/gates/assignments` | POST     | Operator assignment | `organizationId` | Assign security personnel to gate     | Verified |
| `/api/gates/assigned`    | GET      | Operator lookup     | `organizationId` | Fetch current gate assignments        | Verified |

---

## 2. Scan Log Sync & Denial Overrides

| Endpoint                   | Method | Scope                  | Security Guard         | Event Invariant                           | Status   |
| -------------------------- | ------ | ---------------------- | ---------------------- | ----------------------------------------- | -------- |
| `/api/scans/bulk`          | POST   | Edge scanner log sync  | Secret-authenticated   | Append-only `ScanLog` insertion           | Verified |
| `/api/scans/[scanId]/deny` | POST   | Manual denial override | Operator-authenticated | Sets `status = DENIED` with operator note | Verified |
| `/api/scans/my-recent`     | GET    | Recent scans feed      | `organizationId`       | Query last 50 scan events                 | Verified |
| `/api/scans/export`        | GET    | Audit log export       | `organizationId`       | Filtered CSV export of scan logs          | Verified |

---

## 3. Test Verification

- Gate API unit tests: **Passing** (`src/app/api/gates/route.test.ts`, `src/app/api/gates/assignments/route.test.ts`).
- Scan Log API unit tests: **Passing** (`src/app/api/scans/bulk/route.test.ts`, `src/app/api/scans/[scanId]/deny/route.test.ts`).
- Workflow contract test suite: **58/58 passed**.
