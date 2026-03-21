# Pro Prompt — marketing_suite Phase 1

## Phase 1: UTM Schema, Session Capture & Propagation (P0)

### Primary role
BACKEND-Database

### Preferred tool
- [x] Gemini CLI — fast structural analysis and schema expansion

### Context
- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Goal**: Establish the storage and capture mechanism for UTM parameters.
- **Rules**: Prisma multi-tenant (`organizationId`); soft deletes (`deletedAt: null`).
- **Existing**: `QRCode` model already has `utmCampaign` and `utmSource`. We need a full set.

### Goal
Extend the database schema to support full UTM attribution tracking and implement the utility to capture these from the URL during visitor registration.

### Scope (in)
- Update `schema.prisma`: Add `utmMedium`, `utmContent`, `utmTerm` to `QRCode`.
- Update `schema.prisma`: Add full UTM set (`source`, `medium`, `campaign`, `content`, `term`) to `ScanLog`.
- Create `packages/api-client/src/utils/utm-capture.ts` to extract params from `window.location.search`.
- Update `VisitorQR` creation flow to include captured UTMs.

### Scope (out)
- No UI changes in this phase (except hidden form inputs if needed).
- No analytics dashboards.

### Steps (ordered)
1. **Schema Update**:
   - Add the missing UTM fields to `QRCode` and `ScanLog` in `packages/db/prisma/schema.prisma`.
   - Run `pnpm prisma generate` and `pnpm prisma db push` (or create migration if in production mode).
2. **Capture Utility**:
   - Create `packages/api-client/src/utils/utm-capture.ts`.
   - Implement `getUtmParams()` which returns an object of UTM values from the current URL.
   - Implement `persistUtmParams()` to store them in `sessionStorage` so they survive navigation to the registration form.
3. **Propagation Logic**:
   - Update the QR creation API in `apps/client-dashboard` or `apps/resident-portal` to accept UTM fields in the request body.
   - Ensure `ScanLog` creation (during verification) inherits UTM data from the parent `QRCode`.
4. **Verification**:
   - Run `pnpm turbo build --filter=@gate-access/db` to ensure types are generated.
   - Run `pnpm turbo lint` to ensure no regressions.

### Acceptance criteria
- [ ] Prisma schema successfully extended and migrated.
- [ ] `ScanLog` records created during testing contain the correct UTM parameters from the parent QR.
- [ ] `utm-capture.ts` successfully reads and persists `?utm_source=google&utm_medium=cpc`.
- [ ] `pnpm turbo typecheck` passes across the monorepo.

### Files likely touched
- `packages/db/prisma/schema.prisma`
- `packages/api-client/src/utils/utm-capture.ts`
- `apps/resident-portal/src/lib/actions/qr-actions.ts` (or similar)
- `packages/api/src/verification/verify-qr.ts` (or similar)
