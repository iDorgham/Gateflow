# Pro Prompt Template — Phase 2: Core Logic - Fast Link Generation

This phase implements the "Silent Generation" of invitation links, allowing residents to generate a shareable URL before filling in guest details.

---

## Phase 2: Core Logic - Fast Link Generation

### Primary role

BACKEND-API | BACKEND-Database

### Preferred tool

- [x] Claude CLI — API structure, validation logic
- [ ] Gemini CLI — DB/schema work
- [ ] Cursor IDE — wiring and testing

### Context

- **Project**: GateFlow
- **App**: client-dashboard (Server API)
- **Rules**: Multi-tenant (`organizationId`); link signatures; HMAC-SHA256
- **Refs**: `PLAN_resident_mobile_one_tap.md`, `packages/db/src/security.ts`

### Goal

Implement the `/api/resident/express-invite` endpoint that generates a signed, pre-authorized `QrShortLink`.

### Scope (in)

- Create `apps/client-dashboard/src/app/api/resident/express-invite/route.ts`.
- Logic:
  1. Authenticate resident and resolve `unitId`.
  2. Generate a `QRCode` record (type: GUEST, status: PENDING).
  3. Generate a signed `shortId` using `createSecureInviteSignature`.
  4. Create a `QrShortLink` record linking to the `QRCode`.
  5. Return the full `shareUrl` (e.g., `https://gateflow.site/s/[shortId]?sig=[signature]`).
- Ensure link expires in 24 hours.

### Scope (out)

- Mobile UI (Phase 3).
- Landing page redesign (Phase 4).

### Steps (ordered)

1. Create the API route `apps/client-dashboard/src/app/api/resident/express-invite/route.ts`.
2. Implement HMAC-signed URL generation using the utility from `Phase 1`.
3. Add a helper in `packages/db/src/queries/qr.ts` to handle the atomic creation of `QRCode` + `QrShortLink`.
4. Add unit tests for the API route (mocking auth and DB).
5. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`.
6. **Auto-Sync:** git add, commit, push.

### Acceptance criteria

- [ ] POST `/api/resident/express-invite` returns a valid, signed short link.
- [ ] Record created in `QRCode` and `QrShortLink`.
- [ ] Signature in the URL matches the payload when verified.
- [ ] 401/403 returned if resident is not authorized for the unit.

### Files likely touched

- `apps/client-dashboard/src/app/api/resident/express-invite/route.ts`
- `packages/db/src/queries/qr.ts`
