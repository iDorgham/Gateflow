# Phase 4: WhatsApp Concierge (Interactive)

## Primary role: BACKEND-API

## Tool Selection

- [ ] Cursor (implement directly)

### Context

- **Initiative**: `autonomous_ops_intelligence`
- **Phase**: 04
- **Goal**: Provide zero-friction guest registration via a WhatsApp bot, then route approval to the resident via push notification and activate a resident-approved QR.

### Scope (in)

- `apps/client-dashboard/src/app/api/webhooks/whatsapp/route.ts`
- `apps/client-dashboard/src/app/api/resident/visitors/approve/route.ts` (approval activation)
- `apps/client-dashboard/src/app/api/resident/push/approval/route.ts` (optional; if you prefer separate approval push handler)

### Scope (out)

- WhatsApp provider UI in the dashboard
- Full conversation state machine (MVP: webhook request → create pending QR → notify resident)

### Steps (ordered)

1. Add WhatsApp webhook handler that validates incoming payload (Zod) and verifies authenticity with HMAC-SHA256.
2. Implement guest registration:
   - Create a pending `VisitorQR` + underlying `QRCode` with `qrCode.isActive = false`.
   - Create an `AccessRule` matching the requested type.
   - Emit `EventType.QR_CREATED` so the QR timeline can pick it up later (optional but recommended).
3. Implement approval activation:
   - Add a resident-only API route to approve (`/api/resident/visitors/approve`) and set `qrCode.isActive = true`.
   - Scope updates by `organizationId`.
4. Trigger resident push notification for approval:
   - Either directly from the WhatsApp handler or via a small internal API route.
   - Best-effort: never block QR creation if push fails.
5. Add focused Jest tests for:
   - Webhook validation + fail-closed signature handling.
   - QR is created in pending (inactive) state.
   - Approval route activates QR for the correct resident/org only.
6. Run:
   - `pnpm turbo build --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`

### Acceptance criteria

- [ ] `pnpm turbo build --filter=client-dashboard` passes.
- [ ] WhatsApp registration creates a `VisitorQR` whose QR is initially inactive (`isActive = false`).
- [ ] Resident approval activates the QR (`isActive = true`) and is org-scoped.
- [ ] Push notification is triggered as best-effort during registration.
