# Phase Log: Phase 01 — Enforce Auth and Tenant Scoping on Scans Bulk API

**Plan:** `security_hotfix_v1`  
**Date:** 2026-08-28  
**Status:** Completed 🟢

---

## 1. Objectives

- Authenticate and tenant-scope `POST /api/scans/bulk` in `apps/client-dashboard`.
- Enforce scan permissions/roles (`Gate Operator`, `Security Manager`, `Org Admin`, `Super Admin`).
- Enforce payload constraints (`<= 500` scans limit via `BulkScanRequestSchema`).
- Harden database writes using `skipDuplicates: true` in `processBulkScans`.
- Return explicit HTTP status codes (`401`, `403`, `400`, `201`).
- Provide automated unit test coverage across all security boundary conditions.

---

## 2. Changes Made

1. **`packages/types/src/scan-event.ts`**:
   - Added `.max(500)` constraint to `BulkScanRequestSchema`.

2. **`apps/client-dashboard/src/app/api/scans/bulk/route.ts`**:
   - Added role and permission validation (`hasPermission(authResult, 'scans:view')` or authorized role check).
   - Validated required `orgId` context (returns `403` if missing).
   - Validated payload shape and size via `BulkScanRequestSchema` (returns `400` if invalid or `> 500`).
   - Updated success response status to `201 Created`.

3. **`apps/client-dashboard/src/lib/scans/bulk-sync.ts`**:
   - Added `skipDuplicates: true` to `tx.scanLog.createMany` calls for database insertion resilience.

4. **`apps/client-dashboard/src/app/api/scans/bulk/route.test.ts`**:
   - Added test for unauthorized/insufficient permission (`403`).
   - Added test for payload exceeding 500 items (`400`).
   - Updated success test to assert `201` status.

---

## 3. Verification

- **Unit Tests**:
  - `pnpm --filter=client-dashboard exec jest src/app/api/scans/bulk/route.test.ts` (8/8 tests passed)
- **Typecheck**:
  - `pnpm --filter=@gate-access/types typecheck` (Passed)
  - `pnpm --filter=client-dashboard typecheck` (Passed)

---

## 4. Next Action

Proceed to Phase 2: Migrate CryptoJS to native AES-256-GCM (`/dev security_hotfix_v1 2`).
