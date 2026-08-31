# Session Memory — v9.0_ENHANCED_BLUEPRINT

**Last Updated:** 2026-08-31  
**Active Phase:** Phase 2

---

## 📌 Active State

- ## Current Execution Status

- **Active Plan**: `docs/plan/Active/v9.0_ENHANCED_BLUEPRINT/PLAN_v9.0_ENHANCED_BLUEPRINT.md`
- **Current Phase**: `Phase 5: Design System Upgrade & Observability (Weeks 29–32)`
- **Completed Phases**:
  - `Phase 0`: Audit Remediation, Foundation Hardening & Deployment Connectivity (Log: `phase_logs/PHASE_LOG_phase_00.md`)
  - `Phase 1`: Wallet Pass Issuance & Vehicle ANPR / LPR Access (Log: `phase_logs/PHASE_LOG_phase_01.md`)
  - `Phase 2`: GateAI 2.0 & WebRTC Intercom (Log: `phase_logs/PHASE_LOG_phase_02.md`)
  - `Phase 3`: Hardware Telemetry, BLE Proximity & On-Device LPR (Log: `phase_logs/PHASE_LOG_phase_03.md`)
  - `Phase 4`: Marketing Growth Calculator & Self-Service Sandbox (Log: `phase_logs/PHASE_LOG_phase_04.md`)

---

## 🛠️ Key Architectural & Security Invariants

1. **ScanLog Tenant Field:** `ScanLog.organizationId` direct column is present with `@@index([organizationId])` and `@@index([organizationId, scannedAt])`.
2. **Rate Limiting:** All bulk API routes (`/api/qrcodes/validate`, `/api/scans/bulk`, `/api/qr/bulk-create`) enforce Upstash Redis rate limits (`checkRateLimit`) at step 1.5 before body parsing and database queries.
3. **Webhook DLQ:** Webhook delivery failures transition to `DEAD_LETTER` after 3 retries (exponential backoff 0s → 1s → 4s).
4. **Soft-Delete Filtering:** All raw SQL queries in `units/route.ts` and `contacts/route.ts` enforce `u."deletedAt" IS NULL` alongside `sl."deletedAt" IS NULL` and `qr."deletedAt" IS NULL`.
5. **Integration Credentials:** `IntegrationCredential` model stores provider credentials encrypted with AES-256-GCM (`packages/db` crypto).
