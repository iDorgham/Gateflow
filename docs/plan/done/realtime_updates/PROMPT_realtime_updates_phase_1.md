# Phase 1: EventLog Schema + emitEvent Utility + Mutation Hooks

## Primary role
BACKEND-Database + BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/client-dashboard` + `packages/db`
- **Refs**:
  - `packages/db/prisma/schema.prisma` — add EventLog model here
  - `apps/client-dashboard/src/app/api/qrcodes/route.ts` — QR create/delete (add emitEvent)
  - `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` — scan record (add emitEvent)
  - `apps/client-dashboard/src/app/api/resident/visitors/route.ts` — resident QR create/delete (add emitEvent)
  - `apps/client-dashboard/src/lib/residents/` — contact create/update routes (add emitEvent)
  - `apps/client-dashboard/src/lib/require-auth.ts` — auth pattern reference

## Goal
Add the `EventLog` table to the Prisma schema, build a fire-and-forget `emitEvent()` utility, and instrument every mutation route that should broadcast a live update event to connected dashboards.

## Scope (in)

**Schema additions** (`packages/db/prisma/schema.prisma`):
```prisma
model EventLog {
  id             String    @id @default(cuid())
  organizationId String
  type           EventType
  payload        Json      @default("{}")
  createdAt      DateTime  @default(now())

  @@index([organizationId, createdAt])
}

enum EventType {
  QR_CREATED
  QR_UPDATED
  QR_DELETED
  SCAN_RECORDED
  CONTACT_CREATED
  CONTACT_UPDATED
  VISITOR_QR_CREATED
  VISITOR_QR_DELETED
}
```

Run `cd packages/db && pnpm prisma db push && pnpm prisma generate`.

**`src/lib/realtime/emit-event.ts`**:
```ts
import { prisma } from '@gate-access/db';

export async function emitEvent(
  organizationId: string,
  type: EventType,
  payload: Record<string, unknown> = {}
): Promise<void> {
  try {
    // Fire-and-forget: do not await in hot paths, but do catch errors
    await prisma.eventLog.create({
      data: { organizationId, type, payload },
    });
    // Prune rows older than 24h (async, non-blocking)
    pruneOldEvents(organizationId).catch(() => {});
  } catch {
    // Never throw — event emission must not break the primary request
  }
}

async function pruneOldEvents(organizationId: string): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await prisma.eventLog.deleteMany({
    where: { organizationId, createdAt: { lt: cutoff } },
  });
}
```

**Instrument these routes** (add `emitEvent` call after successful DB write):

| Route file | When to emit | Type |
|---|---|---|
| `api/qrcodes/route.ts` POST | After QRCode created | `QR_CREATED` with `{ qrId }` |
| `api/qrcodes/[id]/route.ts` DELETE | After soft-delete | `QR_DELETED` with `{ qrId }` |
| `api/qrcodes/[id]/route.ts` PATCH | After update | `QR_UPDATED` with `{ qrId }` |
| `api/qrcodes/validate/route.ts` | After ScanLog created (SUCCESS or DENIED) | `SCAN_RECORDED` with `{ scanId, status }` |
| `api/resident/visitors/route.ts` POST | After VisitorQR created | `VISITOR_QR_CREATED` with `{ qrId }` |
| `api/resident/visitors/[id]/route.ts` DELETE | After soft-delete | `VISITOR_QR_DELETED` with `{ qrId }` |
| Contact create route (find it) | After Contact created | `CONTACT_CREATED` with `{ contactId }` |
| Contact update route (find it) | After Contact updated | `CONTACT_UPDATED` with `{ contactId }` |

Pattern for each emission:
```ts
// After the primary DB write succeeds:
emitEvent(auth.orgId, EventType.QR_CREATED, { qrId: newQr.id }).catch(() => {});
// Never await — never let it block the response
```

**Jest tests** (`src/lib/realtime/emit-event.test.ts`):
- `emitEvent` creates an EventLog row with correct type + orgId + payload
- `emitEvent` does not throw when Prisma fails (mock Prisma error → verify no throw)
- Pruning: rows with `createdAt > 24h` are deleted; recent rows are kept

## Steps (ordered)
1. Add `EventLog` model + `EventType` enum to `packages/db/prisma/schema.prisma`.
2. Run `cd packages/db && pnpm prisma db push`.
3. Run `cd packages/db && pnpm prisma generate`.
4. Create `apps/client-dashboard/src/lib/realtime/` directory.
5. Create `apps/client-dashboard/src/lib/realtime/emit-event.ts`.
6. Read `api/qrcodes/route.ts` — add `emitEvent` after QR create.
7. Read `api/qrcodes/[id]/route.ts` — add `emitEvent` after delete/update.
8. Read `api/qrcodes/validate/route.ts` — add `emitEvent` after ScanLog insert.
9. Read `api/resident/visitors/route.ts` — add `emitEvent` after create (skip if route doesn't exist yet — it's from resident_mobile Phase 1).
10. Find contact create/update routes — add `emitEvent`.
11. Write `src/lib/realtime/emit-event.test.ts`.
12. Run `pnpm turbo lint --filter=client-dashboard`.
13. Run `pnpm turbo typecheck --filter=client-dashboard`.
14. Run `pnpm --filter=client-dashboard test`.
15. Commit: `feat(realtime): EventLog schema + emitEvent utility + mutation hooks (phase 1)`.

## Scope (out)
- SSE endpoint (Phase 2)
- Client hook (Phase 3)
- Optimistic updates (Phase 4)

## Acceptance criteria
- [ ] `prisma db push` succeeds; `EventLog` table exists in DB
- [ ] `emitEvent` creates EventLog row with correct `organizationId`, `type`, `payload`
- [ ] `emitEvent` does not throw if Prisma fails
- [ ] Pruning removes rows older than 24h; keeps recent rows
- [ ] Each instrumented route creates an EventLog row after successful mutation
- [ ] `emitEvent` calls are fire-and-forget — never `await`ed inline (no response latency impact)
- [ ] Jest: 3+ tests in `emit-event.test.ts`, all passing
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

## Files likely touched
- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/lib/realtime/emit-event.ts` (new)
- `apps/client-dashboard/src/lib/realtime/emit-event.test.ts` (new)
- `apps/client-dashboard/src/app/api/qrcodes/route.ts`
- `apps/client-dashboard/src/app/api/qrcodes/[id]/route.ts`
- `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts`
- `apps/client-dashboard/src/app/api/resident/visitors/route.ts` (if exists)
- Contact create/update route(s) (find and update)

## Git commit
```
feat(realtime): EventLog schema + emitEvent utility + mutation hooks (phase 1)
```
