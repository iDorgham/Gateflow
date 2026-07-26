# Phase 02: Shared Contract Matrix

**App:** `apps/client-dashboard` & shared packages (`@gate-access/types`, `@gate-access/db`, `@gateflow/ai`)  
**Date:** 2026-07-26  
**Status:** Locked

---

## 1. Identity & RBAC Contracts

| Entity / Role | Contract Interface       | Tenant Isolation Rule                          | Verification Status |
| ------------- | ------------------------ | ---------------------------------------------- | ------------------- |
| `SUPER_ADMIN` | Platform-wide management | Admin access key required (`ADMIN_ACCESS_KEY`) | Verified            |
| `ORG_ADMIN`   | Full tenant control      | Hard-isolated to `organizationId`              | Verified            |
| `OPERATOR`    | Security gate operator   | Gate assignment + `organizationId` scope       | Verified            |
| `RESIDENT`    | Resident self-service    | Unit assignment + `organizationId` scope       | Verified            |

---

## 2. Signed QR Credentials & Arrival Capability

| Capability / Token   | HMAC Secret                               | Payload Invariants                             | Replay / Expiration Policy             | Status   |
| -------------------- | ----------------------------------------- | ---------------------------------------------- | -------------------------------------- | -------- |
| Guest Visitor QR     | `QR_SIGNING_SECRET`                       | `{ id, code, validFrom, validUntil }`          | Expiration check + single-use scan log | Verified |
| Arrival Capability   | `QR_SIGNING_SECRET`                       | `{ visitorQRId, iat, exp }`                    | 15-minute TTL (`SCAN_FRESHNESS_MS`)    | Verified |
| Webhook Replay Guard | `STRIPE_WEBHOOK_SECRET` / WhatsApp secret | HMAC signature + minute-level timestamp window | Replay-rejected                        | Verified |

---

## 3. Deterministic Scan Decision Reason Codes

| Decision  | Reason Code         | Meaning                              | HTTP / Log Mapping                     |
| --------- | ------------------- | ------------------------------------ | -------------------------------------- |
| `GRANTED` | `SUCCESS`           | Access allowed by valid QR           | Status 200, `ScanLog.status = SUCCESS` |
| `DENIED`  | `EXPIRED`           | QR pass past expiration date         | Status 403, `ScanLog.status = DENIED`  |
| `DENIED`  | `REVOKED`           | Pass manually revoked by resident    | Status 403, `ScanLog.status = DENIED`  |
| `DENIED`  | `INVALID_SIGNATURE` | HMAC verification failed             | Status 401, `ScanLog.status = DENIED`  |
| `DENIED`  | `REPLAYED`          | Capability token re-used past window | Status 429, `ScanLog.status = DENIED`  |

---

## 4. Verification

- Workflow contract test suite: **58/58 passed**.
- All shared packages (`@gate-access/types`, `@gate-access/db`, `@gate-access/api-client`) typecheck cleanly (**22/22 turbo tasks passed**).
