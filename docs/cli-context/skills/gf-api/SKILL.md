---
name: gateflow-api
description: Next.js App Router API routes and patterns for GateFlow. Use when adding or modifying API endpoints, handling auth, validation, or rate limiting.
---

# GateFlow API Routes

**Template:** `.cursor/templates/TEMPLATE_API_route.md` for full scaffold (GET/POST with auth, Zod, org scope).
**Contracts:** `.cursor/contracts/CONTRACTS.md` — invariants.

## Route Location

- `apps/client-dashboard/src/app/api/**/route.ts`
- Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE` handlers

## Required Pattern (Every Protected Route)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { prisma } from '@gate-access/db';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { orgId, role } = auth;

  // Optional: rate limit
  // await rateLimit(request, { max: 10, window: '1m' });

  const data = await prisma.model.findMany({
    where: { organizationId: orgId, deletedAt: null },
  });

  return NextResponse.json(data);
}
```

## Auth Check

```typescript
const auth = await requireAuth(request);
if (auth instanceof NextResponse) return auth;
// auth: { sub, email, role, orgId }
```

## Role Check

```typescript
if (auth.role !== 'TENANT_ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## Input Validation (Zod)

```typescript
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().min(1).max(100),
  projectId: z.string().cuid().optional(),
});

const body = await request.json();
const parsed = bodySchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { error: 'Validation failed', details: parsed.error.flatten() },
    { status: 400 }
  );
}
const { name, projectId } = parsed.data;
```

## Rate Limiting

```typescript
import { rateLimit } from '@/lib/rate-limit';

await rateLimit(request, { max: 10, window: '1m' });
```

## CSRF (State-Changing Requests)

For POST/PUT/DELETE from web forms, include CSRF token. See `@/lib/csrf`.

## Error Responses

```typescript
return NextResponse.json(
  { success: false, message: 'Resource not found' },
  { status: 404 }
);
```

## Streaming/Export

```typescript
return new Response(csvString, {
  headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="export.csv"`,
  },
});
```

## Checklist

- [ ] requireAuth
- [ ] organizationId scope
- [ ] deletedAt: null filter
- [ ] Zod validation for body/query
- [ ] Rate limit if user-facing
- [ ] Proper status codes (400, 401, 403, 404)

**Reference:** `apps/client-dashboard/src/app/api/`, `.kiro/steering/api-development.md`
