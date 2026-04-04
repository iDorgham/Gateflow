# Phase 3: Perimeter Bridge (Architecture) — Webhook + Incidents + SSE

## Primary role: ARCHITECTURE

## Tool Selection

| Priority | Tool      | Why                                              |
| :------- | :-------- | :----------------------------------------------- |
| Tool 1   | Multi-CLI | Complex multi-file infra + security adjustments. |
| Tool 2   | Cursor    | Follow-up refinements in code + tests.           |

### Skills to load

- [ ] `security`
- [ ] `api`
- [ ] `database`
- [ ] `architecture`
- [ ] `testing`

### Context

- **Initiative**: `autonomous_ops_intelligence`
- **Phase**: 03
- **Goal**: Ingest real-time perimeter (tailgating/LPR/forced entry) events, create incidents when appropriate, and stream incident alerts to the dashboard via the existing SSE event bus.

### Rules / invariants (must not break)

- **Multi-tenancy**: every tenant-scoped DB query must include `organizationId`.
- **Soft deletes**: if a model has `deletedAt`, filter `deletedAt: null` for reads.
- **QR/scanner invariants**: `scanUuid` is the scan dedup key (do not repurpose).
- **Webhook security**: perimeter webhook payloads must be validated with **HMAC-SHA256** using a required secret env var (fail-closed; no dev fallback).

### Goal

Implement/repair `POST /api/perimeter/webhook` so it:

1. Verifies HMAC signature (SHA-256) using `x-gf-signature` + `x-gf-timestamp`.
2. Detects tailgating/LPR anomalies by cross-referencing recent scan logs.
3. Creates an `Incident` with correct `organizationId`.
4. Emits an SSE event that the dashboard already listens to for security alerts.

### Scope (in)

- `apps/client-dashboard/src/app/api/perimeter/webhook/route.ts`
- `apps/client-dashboard/src/lib/types/perimeter.ts` (validate payload shape)
- `apps/client-dashboard/src/components/dashboard/realtime/SecurityNotifier.tsx` (payload + severity mapping)
- `apps/client-dashboard/src/lib/realtime/use-realtime-events.ts` (if event types/payload shape change)
- `apps/client-dashboard/src/app/api/events/stream/route.ts` (only if SSE needs adjustment; generally should already work)

### Scope (out)

- WhatsApp Concierge (Phase 4)
- Mobile marketplace (Phase 5)

### Steps (ordered)

1. **Webhook contract**: ensure `PerimeterWebhookPayload` validation covers:
   - `organizationId`, `projectId`, `gateId`, `type`, `payload`, `timestamp`
2. **Fail-closed HMAC**:
   - Require presence of `x-gf-signature` and `x-gf-timestamp`
   - Require `process.env.PERIMETER_WEBHOOK_SECRET` (throw/refuse if missing)
   - Compute HMAC-SHA256 over a stable string representation of `(timestamp + body)` using the same format as sender expects
   - Compare signatures using constant-time compare (e.g., `crypto.timingSafeEqual`)
3. **Multi-tenant scan cross-reference**:
   - When checking “recent success scans” for a gate, ensure the scan query is scoped to the webhook `organizationId`
   - Use Prisma relation filters (e.g. via `scanLog.qrCode.organizationId`) rather than assuming gateId is globally safe
4. **Incident logic**:
   - Tailgating/LPR rules: detect anomaly based on recent `ScanLog` status within a tight time window (start with 5s unless plan specifies otherwise)
   - Create `Incident` records with:
     - `organizationId`, `gateId`, `reason`, `status: UNDER_REVIEW`
     - optional linking to `scanLogId` when you can safely identify the triggering scan
   - Add basic idempotency guard (avoid creating duplicate incidents for identical events in the same window)
5. **SSE incident alerts**:
   - Emit the correct `prisma.eventLog` record(s) so connected clients receive the incident alert
   - If you need to reuse `EventType.WATCHLIST_ALERT`, map incident severity into what `SecurityNotifier` understands (update the notifier if needed)
6. **Tests**:
   - Add a unit test for signature verification (valid signature passes, invalid fails)
   - Add a unit test for incident creation under tailgating/LPR conditions
   - Ensure tests mock Prisma in the same style as other route tests
7. **Preflight**:
   - Run `pnpm turbo lint --filter=client-dashboard`
   - Run `pnpm turbo typecheck --filter=client-dashboard`
   - Run `pnpm turbo test --filter=client-dashboard`

### Acceptance criteria

- [ ] `POST /api/perimeter/webhook` fails closed when secret or signature headers are missing/invalid.
- [ ] Multi-tenant scoping is enforced in all DB reads/writes using `organizationId`.
- [ ] Tailgating/LPR anomaly conditions create `Incident` records with correct `organizationId`.
- [ ] Dashboard receives incident alerts through existing SSE + `SecurityNotifier` flow.
- [ ] Tests for the webhook pass.

### Files likely touched

- `apps/client-dashboard/src/app/api/perimeter/webhook/route.ts`
- `apps/client-dashboard/src/components/dashboard/realtime/SecurityNotifier.tsx`
- `apps/client-dashboard/src/lib/realtime/use-realtime-events.ts`
- `apps/client-dashboard/src/app/api/perimeter/webhook/route.test.ts` (new)
