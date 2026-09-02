# Session Memory — v9.0_ENHANCED_BLUEPRINT

**Last Updated:** 2026-09-02  
**Status:** All 7 phases (0–6) `COMPLETED` — plan finished

---

## 📌 Active State

- ## Current Execution Status

- **Active Plan**: `docs/plan/Active/v9.0_ENHANCED_BLUEPRINT/PLAN_v9.0_ENHANCED_BLUEPRINT.md`
- **Current Phase**: none — `v9.0_ENHANCED_BLUEPRINT` complete (Phases 0–6)
- **Completed Phases**:
  - `Phase 0`: Audit Remediation, Foundation Hardening & Deployment Connectivity (Log: `phase_logs/PHASE_LOG_phase_00.md`)
  - `Phase 1`: Wallet Pass Issuance & Vehicle ANPR / LPR Access (Log: `phase_logs/PHASE_LOG_phase_01.md`)
  - `Phase 2`: GateAI 2.0 & WebRTC Intercom (Log: `phase_logs/PHASE_LOG_phase_02.md`)
  - `Phase 3`: Hardware Telemetry, BLE Proximity & On-Device LPR (Log: `phase_logs/PHASE_LOG_phase_03.md`)
  - `Phase 4`: Marketing Growth Calculator & Self-Service Sandbox (Log: `phase_logs/PHASE_LOG_phase_04.md`)
  - `Phase 5`: Design System & Observability (Log: `phase_logs/PHASE_LOG_phase_05.md`)
  - `Phase 6`: MENA Compliance & Launch (Log: `phase_logs/PHASE_LOG_phase_06.md`)

---

## 🛠️ Cross-Session Decisions (Phase 6)

- **Compliance export engine** (`src/lib/compliance/regimes.ts`, `export-engine.ts`,
  `apps/client-dashboard/src/app/api/compliance/export/route.ts`): org-scoped GET
  returning CSV or PDF posture report under Egyptian Law 151 Art. 20 / KSA PDPL
  Art. 24 (data access, correction, erasure, portability).
- **Nightly PII purge** (`packages/db/src/lib/retention-apply.ts`,
  `lib/retention-runner.ts`, `packages/db/scripts/retention-apply.ts`,
  `apps/client-dashboard/src/app/api/cron/retention/route.ts`, `vercel.json`
  `"0 2 * * *"`): deterministic non-reversible SHA-256 redaction with org-scoped
  salt, `CRON_SECRET` fail-closed gate.
- **Per-tenant/IP allow-list enforcer** (`src/lib/enforce-tenant-access.ts`,
  `src/lib/allow-list.ts`, `src/app/api/security/ip-allowlist/route.ts`):
  `enforceTenantAccess` replaces per-subject `checkRateLimit` on
  `/api/qrcodes/validate`, `/api/scans/bulk`, `/api/qr/bulk-create`; keys are
  `${keyPrefix}:${orgId}:${ip}`; deny_allowlist → 403, rate_limited → 429.
- **Security scanners upgraded during Task 6.4**: `fuzz-security-routes.js` now
  recognizes `enforceTenantAccess` as an auth guard; `scan-secrets.js` `--all`
  skips git-ignored `.env*` files and `.metro`/`.expo` caches (fixed false
  positives on env-local credentials and build caches); test/spec skip extended
  to `.mjs`.

## 🐛 Discovered Gotchas (Phase 6)

- Jest `clearAllMocks()` does not reset `mockResolvedValue` — re-set defaults in
  `beforeEach` for mock + enforcer tests.
- `@gate-access/db` re-exports the `Prisma` namespace (`export * from
'@prisma/client'`), so `import { prisma, Prisma }` is valid from that package.
- `Prisma.InputJsonObject` cast required when rebuilding `scannerConfig` JSON in
  `ip-allowlist` route (avoid `Prisma.JsonNull` assignment errors).
- `Node 26.5`: `jest.mock` `require()` style import in a mocked module triggers
  `@typescript-eslint/no-require-imports`; prefer top-level `import` of the
  mocked export.
- `scan-secrets.js --all` scans the working tree (not just git-tracked files),
  so git-ignored `.env.local`/`.env.production` were flagged as HIGH — the fix
  was adding env/cache skip patterns, not weakening the exclusions.

---

## 🛠️ Key Architectural & Security Invariants

1. **ScanLog Tenant Field:** `ScanLog.organizationId` direct column is present with `@@index([organizationId])` and `@@index([organizationId, scannedAt])`.
2. **Rate Limiting & Allow-List:** All bulk API routes (`/api/qrcodes/validate`, `/api/scans/bulk`, `/api/qr/bulk-create`) enforce `enforceTenantAccess` (per-tenant/IP allow-list + Upstash sliding-window rate limit, `${keyPrefix}:${orgId}:${ip}`) before body parsing and database queries; deny_allowlist → 403, rate_limited → 429 with `Retry-After`.
3. **Compliance Export:** `/api/compliance/export` is org-scoped and auth-gated (GET); regime = Egyptian Law 151 or KSA PDPL; CSV + PDF posture report.
4. **Retention Cron:** nightly `/api/cron/retention` at `0 2 * * *` UTC is `CRON_SECRET` fail-closed; redaction is deterministic, non-reversible SHA-256 with org-scoped salt.
5. **Webhook DLQ:** Webhook delivery failures transition to `DEAD_LETTER` after 3 retries (exponential backoff 0s → 1s → 4s).
6. **Soft-Delete Filtering:** All raw SQL queries in `units/route.ts` and `contacts/route.ts` enforce `u."deletedAt" IS NULL` alongside `sl."deletedAt" IS NULL` and `qr."deletedAt" IS NULL`.
7. **Integration Credentials:** `IntegrationCredential` model stores provider credentials encrypted with AES-256-GCM (`packages/db` crypto).
