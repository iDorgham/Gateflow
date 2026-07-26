# Phase 04: Permissions & QR Access Rule Matrix

**App:** `apps/client-dashboard`  
**Date:** 2026-07-26  
**Status:** Locked

---

## 1. QR Permission Endpoints

| Endpoint                   | Method | Scope             | Tenant Guard     | Access Rule Types                  | Status   |
| -------------------------- | ------ | ----------------- | ---------------- | ---------------------------------- | -------- |
| `/api/qrcodes`             | GET    | List permissions  | `organizationId` | `ONETIME`, `MULTIUSE`, `RECURRING` | Verified |
| `/api/qrcodes`             | POST   | Generate QR pass  | `organizationId` | `ONETIME`, `MULTIUSE`, `RECURRING` | Verified |
| `/api/qrcodes/validate`    | POST   | Validate QR token | Signature check  | Decodes signed capability          | Verified |
| `/api/qrcodes/export`      | GET    | Export CSV/PDF    | `organizationId` | Filtered list export               | Verified |
| `/api/qrcodes/bulk-delete` | POST   | Revoke passes     | `organizationId` | Bulk status update                 | Verified |

---

## 2. Access Rule Invariants

- **ONETIME**: Single-use pass. Revoked automatically after first `SUCCESS` scan log.
- **MULTIUSE**: Multi-use pass bounded by `validFrom` and `validUntil` timestamps.
- **RECURRING**: Recurring pass with day-of-week & hour-of-day time windows.

---

## 3. Test Verification

- QR code API unit tests: **Passing** (`src/app/api/qrcodes/route.test.ts`, `src/app/api/qrcodes/export/route.test.ts`, `src/app/api/qrcodes/bulk-delete/route.test.ts`).
- Workflow contract test suite: **58/58 passed**.
