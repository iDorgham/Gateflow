# 01. CRITICAL FIXES — GATEFLOW AUDIT FINDINGS

**Audit Date:** August 31, 2026  
**Focus:** Actionable P0, P1, P2, and P3 Findings with Technical Root Cause & Remediation Guidance

---

## P0 — Critical Vulnerabilities (Immediate Action Required)

### P0-001: Missing Rate-Limiting Protection on QR Validation & Bulk Scan Ingestion Endpoints

- **Severity:** P0 — Critical
- **Area:** Security / API Infrastructure
- **App/Package:** `apps/client-dashboard`
- **File(s):**
  - [`apps/client-dashboard/src/app/api/qrcodes/validate/route.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/app/api/qrcodes/validate/route.ts)
  - [`apps/client-dashboard/src/app/api/scans/bulk/route.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/app/api/scans/bulk/route.ts)
  - [`apps/client-dashboard/src/app/api/qr/bulk-create/route.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/app/api/qr/bulk-create/route.ts)
- **Line(s):** Lines 1-50 (Route top-level handler definition)
- **Evidence:**
  ```typescript
  // apps/client-dashboard/src/app/api/qrcodes/validate/route.ts
  export async function POST(request: NextRequest) {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // NO rate limiter applied before parsing payload or executing DB queries!
  ```
- **Business Impact:** Malicious actors or compromised API clients can trigger thousands of validation attempts per second, potentially degrading database throughput or probing pass signatures.
- **Technical Impact:** Resource exhaustion, elevated latency across non-isolated queries, high database connection pool pressure.
- **Reproduction:** Send 500 concurrent HTTP `POST` requests to `/api/qrcodes/validate` within 5 seconds using a valid session cookie. All requests process without 429 status response.
- **Root Cause:** Route handlers rely on user session validation but omit invocation of shared rate limiting utilities (`rateLimit()`).
- **Critical Fix:** Wrap route handler logic with redis/in-memory sliding window rate-limiting middleware:
  ```typescript
  import { applyRateLimit } from '@/lib/rate-limit';
  const limiter = applyRateLimit({ windowMs: 60000, maxRequests: 60 });
  if (!(await limiter.check(request))) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }
  ```
- **Verification Command:** `pnpm turbo test --filter=@gate-access/client-dashboard`
- **Required Regression Test:** Add integration test sending 65 rapid POST requests to `/api/qrcodes/validate` and asserting receipt of HTTP 429 on request 61.
- **Estimated Effort:** S (1-2 Hours)
- **Risk if Not Fixed:** High denial-of-service vulnerability and scan probe susceptibility.

---

### P0-002: Lack of Native Direct `organizationId` Field on `ScanLog` Table

- **Severity:** P0 — Critical
- **Area:** Multi-Tenancy / Database Architecture
- **App/Package:** `packages/db`
- **File(s):** [`packages/db/prisma/schema.prisma`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/db/prisma/schema.prisma#L220-L245)
- **Line(s):** Schema definition for `model ScanLog`
- **Evidence:**
  ```prisma
  model ScanLog {
    id          String    @id @default(cuid())
    gateId      String
    qrCodeId    String?
    scannedAt   DateTime  @default(now())
    status      ScanStatus
    // MISSING: organizationId String
    gate        Gate      @relation(fields: [gateId], references: [id])
    qrCode      QRCode?   @relation(fields: [qrCodeId], references: [id])
  }
  ```
- **Business Impact:** Multi-tenant scoping for scan logs relies entirely on relational JOINs through `Gate` or `QRCode`. Any developer writing raw SQL or Prisma queries that forget to join `Gate` risks exposing scan logs across tenants.
- **Technical Impact:** Slower analytical aggregation queries, index scan overhead during high-volume report generation, tenant isolation risk in reporting endpoints.
- **Reproduction:** Execute `prisma.scanLog.findMany({ where: { gateId: id } })`. If `gateId` is passed without verifying `gate.organizationId`, logs from another tenant could be exposed if `gateId` is spoofed.
- **Root Cause:** Historic schema normalization omitted `organizationId` directly on the `ScanLog` transactional ledger table.
- **Critical Fix:**
  1. Add `organizationId String` to `model ScanLog` in `schema.prisma`.
  2. Create a migration backfilling `organizationId` from `Gate.organizationId`.
  3. Add `@@index([organizationId, scannedAt])` to `ScanLog`.
- **Verification Command:** `pnpm db:check`
- **Required Regression Test:** Test scan log creation and query filtering with direct `organizationId` equality asserts.
- **Estimated Effort:** M (4-6 Hours)
- **Risk if Not Fixed:** Potential cross-tenant data leakage if relational joins are omitted in reporting queries.

---

## P1 — High Priority Issues (Fix in Next Sprint)

### P1-001: Webhook Delivery Retries Lack Exponential Backoff Dead-Letter Processing

- **Severity:** P1 — High
- **Area:** Reliability / Integrations
- **App/Package:** `packages/db` & `apps/client-dashboard`
- **File(s):** [`apps/client-dashboard/src/app/api/webhooks/deliver/route.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/app/api/webhooks/deliver/route.ts)
- **Evidence:** Failed HTTP webhook calls increment failure counters but do not schedule durable exponential backoff background retries.
- **Impact:** External integrations (CRM, access management systems) may miss scan events during temporary network hiccups.
- **Critical Fix:** Implement a persistent job queue (e.g. via BullMQ or Redis) to handle outbound webhook retries with exponential backoff (1m, 5m, 15m, 1h) and dead-letter logging.

---

### P1-002: Scanner App Offline Queue Replay Counter Nonce Expiry Edge Case

- **Severity:** P1 — High
- **Area:** Mobile / Offline Sync
- **App/Package:** `apps/scanner-app`
- **File(s):** [`apps/scanner-app/src/lib/offline-queue.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/scanner-app/src/lib/offline-queue.ts)
- **Evidence:** Queued offline scans rely on client timestamps. If device clock drifts backward significantly before reconnecting, valid nonces may be flagged as expired upon sync.
- **Impact:** Legitimate guard scans recorded offline may be rejected as expired during sync.
- **Critical Fix:** Calculate server clock offset on scanner login and adjust local timestamps during offline queue insertion.

---

## P2 & P3 — Medium & Low Priority Findings

- **P2-001 (UX/RTL):** Mobile table controls in resident portal require horizontal swipe indicators on small viewport RTL devices.
- **P2-002 (Testing):** Visual regression coverage missing for high-density dashboard UI components in `@gate-access/ui`.
- **P3-001 (Docs):** Minor documentation drift between `docs/reference/apps/PAGES_AND_ROUTES_INDEX_REFERENCE.md` and actual App Router structure.
