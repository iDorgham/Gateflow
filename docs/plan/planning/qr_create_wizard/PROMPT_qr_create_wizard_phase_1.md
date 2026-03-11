# Phase 1: Schema & API — Guest Metadata on QRCode

## Primary role
BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db
- **Rules**: Multi-tenant scoping (organizationId on every query); soft deletes; never break existing QR signing payload.
- **Refs**:
  - `packages/db/prisma/schema.prisma` — `QRCode` model (lines ~150–180)
  - `apps/client-dashboard/src/app/api/qrcodes/route.ts` — GET/POST handlers
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/actions.ts` — `createQRCode()` server action

## Goal
Add optional guest metadata fields to the `QRCode` model and propagate them through the API and server action so future wizard steps can persist guest name, email, phone, and linked contact.

## Scope (in)
- Add 4 optional fields to `QRCode`: `guestName String?`, `guestEmail String?`, `guestPhone String?`, `contactId String?`.
- Run `prisma db push` to apply.
- Update `POST /api/qrcodes` Zod schema + `prisma.qRCode.create` to accept the 4 new fields.
- Update `GET /api/qrcodes` select to return the 4 new fields.
- Update `createQRCode()` server action (in `actions.ts`) to accept and persist `guestName`, `guestEmail`, `guestPhone`, `contactId`.

## Scope (out)
- No UI changes (wizard is Phase 2 & 3).
- No Contact FK relation enforcement (contactId is stored as a plain string reference for now, no Prisma relation, to keep the migration atomic).

## Steps (ordered)
1. Open `packages/db/prisma/schema.prisma`. In the `QRCode` model, add below `utmSource`:
   ```prisma
   guestName  String?
   guestEmail String?
   guestPhone String?
   contactId  String?  /// Optional reference to Contact.id
   ```
2. Run `cd packages/db && npx prisma db push` and verify it applies cleanly.
3. Open `apps/client-dashboard/src/app/api/qrcodes/route.ts`.
   - In `CreateQRCodeSchema`, add:
     ```ts
     guestName:  z.string().max(200).optional().nullable(),
     guestEmail: z.string().email().max(200).optional().nullable(),
     guestPhone: z.string().max(30).optional().nullable(),
     contactId:  z.string().max(50).optional().nullable(),
     ```
   - In `prisma.qRCode.create({ data: { ... } })`, include the 4 fields from `parsed.data`.
   - In the GET handler's `select`, add `guestName: true, guestEmail: true, guestPhone: true, contactId: true`.
4. Open `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/actions.ts`.
   - Add the 4 guest fields to the action's parameter signature and `prisma.qRCode.create` call.
5. Run `pnpm turbo typecheck --filter=client-dashboard` — fix any errors.
6. Run `pnpm turbo test --filter=client-dashboard` — all tests must pass.
7. Commit: `feat(qrcodes): add guest metadata fields to QRCode schema and API (phase 1)`.

## Acceptance criteria
- [ ] `prisma db push` completes without data loss warnings on the QRCode table.
- [ ] POST `/api/qrcodes` accepts `guestName`, `guestEmail`, `guestPhone`, `contactId` (all optional).
- [ ] GET `/api/qrcodes` returns all 4 new fields in each row.
- [ ] `createQRCode()` action accepts and persists the guest fields.
- [ ] Typecheck passes; existing tests pass.
