# 06. QR ACCESS & SCAN LIFECYCLE AUDIT — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Pass Creation, HMAC Cryptographic Signing, Mobile Verification, Offline Queue Resilience, Replay Prevention, and Supervisor Override Controls

---

## 1. End-to-End Access Lifecycle

```
[1. Resident / Admin] ──> Creates Visitor Pass ──> Encodes HMAC Signature + Nonce
                                                            │
                                                            ▼
[4. Scan Ledger / Sync] <── [3. Mobile Scanner] <── [2. Visitor Presents QR]
   (Online DB / Offline)    (Validates HMAC &       (Displays on Mobile/Paper)
                            Usage Limits)
```

1. **Pass Creation**: Resident (`apps/resident-portal`) or Property Manager (`apps/client-dashboard`) generates a visitor pass bound to a unit and date range.
2. **HMAC Signing**: Server signs payload `[qrId, contactId, unitId, expiry, maxUses, nonce]` using HMAC-SHA256 with `QR_HMAC_SECRET`.
3. **Pass Delivery**: QR image rendered with embedded signature and shortened verification link (`/q/[shortId]`).
4. **Guard Scan**: `apps/scanner-app` captures QR payload via device camera.
5. **Local / Remote Validation**:
   - **Online**: Sends POST request to `/api/qrcodes/validate`. Server verifies HMAC, expiration, remaining usage count, and active revocation state.
   - **Offline**: Mobile scanner parses payload, validates HMAC using local key stored in `expo-secure-store`, checks local SQLite pass cache, and enqueues scan in `offline-queue.ts`.
6. **Decision & Escalation**:
   - **Granted**: Displays green overlay, plays audio chime, logs scan.
   - **Denied**: Displays red overlay with denial reason (e.g. `EXPIRED_PASS`, `REVOKED`, `MAX_USES_EXCEEDED`).
   - **Supervisor Override**: Allows guard to request supervisor PIN to override access denial with mandatory reason capture.

---

## 2. Security & Offline Invariants

### 2.1 Replay Prevention

Every pass encodes a unique UUID nonce (`nonce`). Scanned nonces are committed to local SQLite and central `ScanLog` tables. Duplicate nonces trigger `REPLAY_ATTEMPT_DENIED`.

### 2.2 Device Time Manipulation Safeguards

Offline validation logic verifies that scan timestamps do not precede the pass `validFrom` timestamp or exceed `validTo`. On initial login, `apps/scanner-app` calculates server clock offset to compensate for local device drift.

### 2.3 Supervisor Override PIN Security

Supervisor PINs are hashed using SHA-256 before comparison against stored credentials in `apps/scanner-app/src/lib/security/secure-pin.ts`.

---

## 3. Findings & Recommendations

### Pros

- Enterprise-grade HMAC-SHA256 cryptographic pass signing and nonce replay prevention.
- Seamless offline guard experience supported by SQLite persistence and local key validation.
- Secure Supervisor Override workflow with audit logging and PIN hashing.

### Cons

- Missing rate-limiting middleware wrappers on API scan validation endpoints (documented in P0-001).
- Device clock skew fallback optimization required for multi-day offline scanning (documented in P1-002).

### QR Verification Commands

```bash
# Inspect QR HMAC verification logic
rg -n "verifyQrSignature|hmac" apps/scanner-app/src/lib
rg -n "validateQr" apps/client-dashboard/src/app/api/qrcodes
```
