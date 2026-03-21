# Pro Prompt — marketing_suite Phase 3

## Phase 3: CRM Webhooks & Integration (P1)

### Primary role
BACKEND-API

### Preferred tool
- [x] Claude CLI — logic-heavy, event emitter architecture.
- [x] Gemini CLI — fast structural refactor for `ScanLog` triggers.

### Context
- **Project**: GateFlow — Zero-Trust
- **Goal**: Implement the background engine for emitting webhooks on successful visitor arrival.
- **Rules**: Multi-tenant isolation; retry logic; signature security.
- **Existing**: `Webhook` and `WebhookDelivery` models in DB.

### Goal
Implement a reliable, asynchronous webhook engine that notifies external CRM systems like HubSpot when a physical visit occurs.

### Scope (in)
- Create `packages/api/src/services/webhook-service.ts` to manage event processing and HTTP POSTing.
- Implement an event emitter in `apps/scanner-app` or the scan-verification API that registers a `SCAN_SUCCESS` event.
- Secure the webhook delivery with an HMAC-SHA256 signature calculated from the payload and the organization's `webhookSecret`.
- Ensure all delivery attempts are logged in `WebhookDelivery`.

### Scope (out)
- No complex "HubSpot Native Authentication" (keep it to Generic Webhooks for P1).
- No frontend for webhook log visualization (just the engine).

### Steps (ordered)
1. **Webhook Engine**:
   - Create `WebhookService` with `sendEvent(orgId: string, event: WebhookEvent, payload: Json)` method.
   - Use `prisma.webhook.findMany` to select all active webhooks for that org subscribed to that event.
2. **Event Trigger**:
   - Add a trigger in the successful scan verification path (`packages/api/src/verification` or similar).
   - Use a non-blocking calling pattern (background job or `setTimeout`/`setImmediate`) to ensure low latency for the scanner operator.
3. **Payload Structure**:
   - Define the P1 JSON payload including `visitorName`, `visitorPhone`, `scannedAt`, `gateName`, and captured `UTM` fields.
4. **Security**:
   - Calculate and append `X-GateFlow-Signature` to the webhook headers.
5. **Verification**:
   - Use a service like `webhook.site` or a local mock server to verify successful payload arrival.
   - Check `WebhookDelivery` records for the correctly logged status codes.

### Acceptance criteria
- [ ] Successful scan immediately triggers a webhook POST.
- [ ] Payload contains correct visitor and UTM data.
- [ ] HMAC signature is correct and verifiable.
- [ ] Failed deliveries (retryable) are correctly status-logged.
- [ ] `pnpm turbo build --filter=@gate-access/api` passes.

### Files likely touched
- `packages/api/src/services/webhook-service.ts`
- `packages/api/src/verification/verify-qr.ts` (or similar)
- `packages/db/prisma/schema.prisma`
