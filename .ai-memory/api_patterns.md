# API Patterns

## Auth (3 modes)

### Session-based — dashboard routes

```ts
const claims = await getSessionClaims();
if (!claims?.orgId)
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// claims.sub = userId | claims.email | claims.role | claims.orgId
```

### Bearer JWT — scanner + mobile

```ts
const auth = await requireAuth(); // throws 401 if invalid
// auth.sub = userId (NOT auth.userId)
```

Routes: `/api/scans/my-recent`, `/api/scans/bulk`, all `/api/resident/*`

### Admin auth

```ts
const ok = await isAdminAuthorized(request); // key-based + cookie
```

`ADMIN_ACCESS_KEY` required; dev default shown only when `NODE_ENV !== 'production'`

### Public (no auth)

`/api/qrcodes/validate` · `/api/auth/login` · `/api/auth/refresh` ·
`/api/marketing/utm-track` · `/api/webhooks/stripe` (Stripe sig) · `/s/[shortId]`

---

## Multi-tenancy

Every DB query must include `organizationId`. Use tenant context:

```ts
setOrganizationContext(orgId);
try {
  // queries auto-scoped
} finally {
  clearOrganizationContext(); // MUST be in finally
}
```

All Redis cache keys must include `orgId` — never cache without tenant scope.

---

## Soft Deletes

Always filter `deletedAt: null`. Never hard delete.

```ts
// read
prisma.contact.findMany({ where: { organizationId, deletedAt: null } });
// delete
prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } });
```

Models with soft delete: Organization, Project, Gate, QRCode, Unit, Contact,
GateAssignment, Tag, WatchlistEntry, Task, AiAutomation, Webhook, User

---

## QR Security

- All QR payloads signed with HMAC-SHA256 (`QR_SIGNING_SECRET` env)
- Verify with `verifyScanQR()` from `packages/types`
- `QRCode` model → Prisma accessor: `prisma.qRCode` (camelCase)
- Test QRs (create-test page) not saved to DB → validate returns 403 "not_found"

---

## Offline Sync

POST `/api/scans/bulk` · Bearer JWT · LWW conflict resolution
Dedup key: `scanUuid` — never break this contract

- **4xx = rejection** — show rejected, do NOT queue
- **5xx / network = offline** — queue, show "accepted offline"

---

## ScanLog.auditTrail

Type is `Json[]` — always spread + cast:

```ts
const trail = (existing.auditTrail as unknown[]) ?? [];
data: {
  auditTrail: [...trail, newEntry] as unknown as Prisma.JsonArray;
}
```

---

## Redis Cache (analytics)

```ts
import { getCached, setCached, cacheKey } from '@/lib/analytics-cache';
const key = cacheKey('analytics:heatmap', { orgId, dateFrom, dateTo });
const cached = await getCached<T>(key);
if (cached) return NextResponse.json(cached);
await setCached(key, result, 600); // 600s TTL
```

Only `/api/analytics/heatmap` is currently cached. Others are candidates.
Key pattern: `{prefix}:orgId={id}:field=value` — parts sorted alphabetically.

---

## Route Conventions

- `organizationId` always from `claims.orgId` — never from URL params
- Pagination: `?page=1&limit=20` — always bound limit to a max
- Sort: `?sortBy=createdAt&sortOrder=desc`
- Export routes: `Content-Disposition: attachment; filename=...`
- Bulk delete: POST `/{resource}/bulk-delete` with `{ ids: string[] }`

---

## Enum Imports

```ts
import { ContactSource, GateMode, ScanStatus } from '@gate-access/db';
// NOT from '@prisma/client' directly
```
