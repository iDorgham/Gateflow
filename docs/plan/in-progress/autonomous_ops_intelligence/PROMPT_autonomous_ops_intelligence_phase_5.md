# Phase 5: Resident Super-App (Convergence) — Marketplace + Booking + Payment v0.1

## Primary role: MOBILE

## Tool Selection

- [ ] Cursor (implement directly)

### Context

- **Initiative**: `autonomous_ops_intelligence`
- **Phase**: 05
- **Goal**: Add a friction-free “services marketplace” to the resident mobile app and connect it to org-scoped backend APIs.

### Scope (in)

- DB schema:
  - `Merchant` model
  - `Service` model
  - `ServiceBooking` model (MVP payment status = `PAID`)
- Backend (client-dashboard):
  - `GET /api/marketplace/services` (list services for the resident’s org)
  - `POST /api/marketplace/book` (book a service; create a `ServiceBooking` marked `PAID`)
- Mobile (resident-mobile):
  - Add `Marketplace` tab in `app/(tabs)/_layout.tsx`
  - Implement `app/(tabs)/marketplace/index.tsx` to list services and allow booking

### Scope (out)

- Full payments integration (Stripe Connect, etc.) — v0.1 is “instant paid” on booking.
- Marketplace provider UI in the dashboard.

### Rules / invariants

- **Multi-tenancy**: all tenant reads/writes must include `organizationId`.
- **Soft deletes**: all reads must use `deletedAt: null` for soft-deletable models.
- **Auth**: resident routes use `requireResident()` and derive org scoping from claims.

### Steps (ordered)

1. Update `packages/db/prisma/schema.prisma`:
   - Add `Merchant`, `Service`, `ServiceBooking` (plus needed enums)
2. Generate Prisma client:
   - `pnpm db:generate`
3. Add backend endpoints under `apps/client-dashboard/src/app/api/marketplace/`:
   - `services/route.ts` (GET)
   - `book/route.ts` (POST)
4. Add Jest tests for the two new endpoints (org scoping + status transitions).
5. Add resident-mobile marketplace tab + screen:
   - Fetch `GET /api/marketplace/services`
   - Render list + “Book” button
   - On press call `POST /api/marketplace/book` and show confirmation
6. Run:
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=resident-mobile`
   - `pnpm turbo test --filter=client-dashboard`

### Acceptance criteria

- [ ] Residents can view a list of services from the backend (org-scoped).
- [ ] Booking creates `ServiceBooking` with status `PAID` (org-scoped).
- [ ] Marketplace tab is present in the mobile bottom tabs.
- [ ] Jest tests for marketplace endpoints pass.
- [ ] Typecheck passes for both `client-dashboard` and `resident-mobile`.
