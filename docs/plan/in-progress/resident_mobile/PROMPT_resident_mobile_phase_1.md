# Phase 1: Schema Verify + Resident API Layer

## Primary role
BACKEND-API + SECURITY

## Preferred tool
- [x] Cursor (default)

## Context
- **Apps**: `apps/client-dashboard` (API routes), `packages/db` (schema)
- **Refs**:
  - `packages/db/prisma/schema.prisma` — verify Unit, VisitorQR, AccessRule, ResidentLimit, User
  - `apps/client-dashboard/src/lib/require-auth.ts` — existing auth helper to extend
  - `apps/client-dashboard/src/app/api/gates/route.ts` — reference pattern for API routes
  - `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` — reference for QR logic
  - `docs/plan/context/IDEA_resident_mobile.md` — API contract definition

## Goal
Verify the database models are correct, add missing fields (lat/lng on Unit, expoPushToken on User), and build all `/api/resident/*` routes in client-dashboard with a RESIDENT role auth guard.

## Scope (in)

**Schema changes** (`packages/db/prisma/schema.prisma`):
- Verify `Unit` model exists with: `id`, `unitNumber`, `unitType (UnitType enum)`, `building String?`, `userId String?`, `organizationId`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`
- Add to Unit if missing: `lat Float?`, `lng Float?`
- Verify `VisitorQR` model: links QRCode + Unit + visitorName + visitorPhone? + isOpenQR + accessRuleId
- Verify `AccessRule` model: type (AccessRuleType enum), startDate?, endDate?, recurringDays?, startTime?, endTime?
- Verify `ResidentLimit` model: organizationId, unitType, monthlyQuota, canCreateOpenQR
- Add to `User` if missing: `expoPushToken String?`
- Run `pnpm prisma db push` from `packages/db` after any schema change

**New auth helper** (`apps/client-dashboard/src/lib/require-resident.ts`):
```ts
import { requireAuth } from './require-auth';
export async function requireResident(req) {
  const auth = await requireAuth(req);
  if (!auth.success) return auth;
  if (auth.role !== 'RESIDENT') return { success: false, status: 403, message: 'forbidden' };
  return auth;
}
```

**New API routes** in `apps/client-dashboard/src/app/api/resident/`:
- `me/route.ts` — GET: return unit linked to `auth.sub`, quota used this month vs limit
- `visitors/route.ts` — GET: list VisitorQRs for resident's unit (paginated, `deletedAt: null`); POST: create VisitorQR + AccessRule
- `visitors/[id]/route.ts` — GET: single VisitorQR; DELETE: soft-delete
- `open-qr/route.ts` — POST: create Open QR (isOpenQR: true, permanent access rule)
- `history/route.ts` — GET: ScanLogs for QRs belonging to resident's unit, newest first, paginated
- `push-token/route.ts` — POST: upsert `expoPushToken` on User record
- `arrived/route.ts` — POST: receive `{ visitorQrId }`, look up resident, send Expo push

**Jest tests** (`apps/client-dashboard/src/app/api/resident/`):
- `me.test.ts` — returns 401 without token, returns unit + quota with valid RESIDENT JWT
- `visitors.test.ts` — POST creates VisitorQR + AccessRule; GET returns list
- `push-token.test.ts` — upserts token, returns 403 for non-RESIDENT role

## Steps (ordered)
1. Read `packages/db/prisma/schema.prisma` — verify all models listed above exist and are correct.
2. Patch schema: add `lat Float?`, `lng Float?` to Unit; add `expoPushToken String?` to User.
3. Run `cd packages/db && pnpm prisma db push` to apply schema changes.
4. Run `cd packages/db && pnpm prisma generate` to regenerate client.
5. Create `apps/client-dashboard/src/lib/require-resident.ts`.
6. Create `apps/client-dashboard/src/app/api/resident/me/route.ts` — query Unit by `userId: auth.sub`, count VisitorQRs this month vs ResidentLimit.
7. Create `apps/client-dashboard/src/app/api/resident/visitors/route.ts` — GET + POST.
8. Create `apps/client-dashboard/src/app/api/resident/visitors/[id]/route.ts` — GET + DELETE (soft).
9. Create `apps/client-dashboard/src/app/api/resident/open-qr/route.ts` — POST.
10. Create `apps/client-dashboard/src/app/api/resident/history/route.ts` — GET scan logs.
11. Create `apps/client-dashboard/src/app/api/resident/push-token/route.ts` — POST upsert.
12. Create `apps/client-dashboard/src/app/api/resident/arrived/route.ts` — POST, send Expo push via HTTPS to `https://exp.host/--/api/v2/push/send`.
13. Write Jest tests: `me.test.ts`, `visitors.test.ts`, `push-token.test.ts`.
14. Run `pnpm turbo lint --filter=client-dashboard`.
15. Run `pnpm turbo typecheck --filter=client-dashboard`.
16. Run `pnpm --filter=client-dashboard test`.
17. Commit: `feat(resident-api): add /api/resident/* routes + requireResident guard (phase 1)`.

## Scope (out)
- Mobile app UI (Phase 2)
- Push notification in scan flow (Phase 4)
- GPS/arrival features (Phase 5)

## Acceptance criteria
- [ ] Schema has `lat/lng` on Unit and `expoPushToken` on User; `prisma db push` succeeds
- [ ] All 7 route files exist under `apps/client-dashboard/src/app/api/resident/`
- [ ] Every route returns 401 without Authorization header
- [ ] Every route returns 403 for non-RESIDENT role JWT
- [ ] `/api/resident/me` returns `{ unit, quotaUsed, quotaLimit }` for valid RESIDENT
- [ ] Jest: at least 3 test files, all passing
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

## Files likely touched
- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/lib/require-resident.ts` (new)
- `apps/client-dashboard/src/app/api/resident/me/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/visitors/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/visitors/[id]/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/open-qr/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/history/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/push-token/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/arrived/route.ts` (new)
- `apps/client-dashboard/src/app/api/resident/*.test.ts` (3 new)

## Git commit
```
feat(resident-api): add /api/resident/* routes + requireResident guard (phase 1)
```
