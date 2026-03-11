## Tasks — Plan: resident_portal

Track progress for each phase of the Resident Portal & Resident Mobile plan. Update this file in the same pass as commits when finishing phases so `/guide` and `/dev` stay accurate.

### Phase 1 — Schema & RBAC foundations for Resident models

- [x] Add `Unit`, `VisitorQR`, `AccessRule`, `ResidentLimit` models to Prisma schema.
- [x] Update enums (`UserRole`, `QRCodeType`) and seeds for RESIDENT and visitor/open QR types.
- [x] Run Prisma migrate/generate and ensure `@gate-access/db` typechecks.

### Phase 2 — Resident Portal web shell & authentication

- [x] Scaffold `apps/resident-portal` with shared config and App Router structure.
- [x] Implement RESIDENT login flow using shared auth patterns.
- [x] Build mobile-friendly dashboard shell with routes for Visitor QRs and History.

### Phase 3 — Visitor QR creation & quota enforcement (web)

- [x] Implement resident-facing API routes for listing/creating/revoking visitor QRs.
- [x] Enforce `ResidentLimit` quotas and rule-type validation.
- [x] Build resident-portal UI for creating and managing visitor and open QRs.

### Phase 4 — Visitor history & notification pipeline (backend)

- [x] Implement resident history API endpoint(s) scoped to resident units.
- [ ] Wire scan-success events into a resident notification abstraction. *(pending model + helper)*
- [x] Build resident-portal History page backed by the new API.

### Phase 5 — Resident mobile foundation (Expo app)

- [x] Implement RESIDENT auth and navigation in `apps/resident-mobile`.
- [x] Add visitor QR list and detail screens, consuming resident APIs.
- [x] Implement offline QR display and basic native share flows.

