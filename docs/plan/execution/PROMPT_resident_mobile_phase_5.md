# Phase 5: GPS Guide + Arrival Notification

## Primary role
MOBILE + FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **Apps**: `apps/client-dashboard` (landing page + arrived API), `apps/resident-mobile`
- **Refs**:
  - `apps/client-dashboard/src/app/s/[shortId]/route.ts` — short URL resolver (do not break)
  - `apps/client-dashboard/src/app/api/resident/arrived/route.ts` — Phase 1 output
  - `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` — scan result context
  - `packages/db/prisma/schema.prisma` — Unit.lat + Unit.lng (Phase 1 output)

## Goal
After a visitor scans at the gate, show two new buttons on the QR landing page: "Get directions" (opens Maps) and "I've arrived" (notifies the resident). Both degrade gracefully when coordinates or push token are unavailable.

## Scope (in)

**Extend the QR landing page** (`apps/client-dashboard/src/app/s/[shortId]/route.ts` or the HTML response it serves):

The current landing page serves:
- Browser requests → pretty HTML info page
- API clients → raw payload as text/plain

Extend the browser HTML response to include a client-side JS-enhanced section shown only after a successful scan (tracked via a `?scanned=1&gateId=X` query param appended by the scanner after scan):

**"Get directions" button** (shown if Unit has lat + lng):
```html
<a href="maps://?q={lat},{lng}" id="directions-btn">Get directions</a>
<!-- fallback for Android: https://maps.google.com/?q={lat},{lng} -->
```
- Detect iOS vs Android via User-Agent to choose the correct maps scheme
- Hidden if `unit.lat` or `unit.lng` is null

**"I've arrived" button** (shown after scan succeeds):
```html
<button id="arrived-btn">I've arrived</button>
<!-- POST /api/resident/arrived with { visitorQrId } -->
```
- On click: POST `/api/resident/arrived`, then change button to "Notified your host"
- Disabled after first tap to prevent double-send
- Hidden if no `expoPushToken` on resident

**`/api/resident/arrived/route.ts`** update (Phase 1 stub → full implementation):
- Receive `{ visitorQrId }`
- Validate: QR must exist, not deleted, and have been scanned (ScanLog exists with SUCCESS)
- Find VisitorQR → Unit → User (resident)
- Send Expo push: `"<visitorName> has arrived at your door"`
- Return `{ ok: true }` or `{ error: 'already_notified' }` (idempotent — only one arrival push per scan event)

**New field**: `ScanLog.arrivalNotifiedAt DateTime?` — set when arrival push fires, used for idempotency check.
- Add to schema + `prisma db push`

## Steps (ordered)
1. Add `arrivalNotifiedAt DateTime?` to `ScanLog` in `packages/db/prisma/schema.prisma`.
2. Run `cd packages/db && pnpm prisma db push && pnpm prisma generate`.
3. Implement `/api/resident/arrived/route.ts` fully — validation, idempotency, push dispatch.
4. Extend `apps/client-dashboard/src/app/s/[shortId]/route.ts`:
   - Read `?scanned=1` query param and `gateId`
   - Look up ShortLink → VisitorQR → Unit (lat/lng) + resident (expoPushToken)
   - Inject "Get directions" and "I've arrived" buttons into the HTML response when `?scanned=1`
   - Inline JS: handle "arrived" button POST + disable after success
   - User-Agent sniff for iOS/Android maps scheme
5. Graceful degradation:
   - No `lat/lng` → hide directions button
   - No `expoPushToken` → hide arrived button
   - Both hidden → show only "Scan successful" confirmation
6. Verify scanner-app `onBarcodeScanned` flow is unaffected (API client path still returns raw payload).
7. Run `pnpm turbo lint --filter=client-dashboard`.
8. Run `pnpm turbo typecheck --filter=client-dashboard`.
9. Commit: `feat(resident-mobile): GPS guide + arrival notification on QR landing page (phase 5)`.

## Scope (out)
- Mobile History tab (Phase 6)
- RTL polish (Phase 6)

## Acceptance criteria
- [ ] `/s/[shortId]?scanned=1` shows "Get directions" button when Unit has lat/lng
- [ ] Directions button opens Maps app with correct coordinates (iOS + Android)
- [ ] "I've arrived" button POSTs and resident receives Expo push
- [ ] Button changes to "Notified your host" after tap; disabled to prevent double-send
- [ ] Both buttons hidden gracefully when conditions not met
- [ ] Scanner-app raw payload path (`Accept: text/plain`) unchanged — no regression
- [ ] `arrivalNotifiedAt` set on ScanLog after arrival push
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

## Files likely touched
- `packages/db/prisma/schema.prisma` (ScanLog.arrivalNotifiedAt)
- `apps/client-dashboard/src/app/s/[shortId]/route.ts` (extended)
- `apps/client-dashboard/src/app/api/resident/arrived/route.ts` (implemented)

## Git commit
```
feat(resident-mobile): GPS guide + arrival notification on QR landing page (phase 5)
```
