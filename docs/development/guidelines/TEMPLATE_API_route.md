# API Route Template — GateFlow Contract

Use when adding a new API route. Ensures auth, org scope, Zod validation, and soft-delete compliance.

**Output:** `apps/client-dashboard/src/app/api/<resource>/route.ts` or `[resource]/[id]/route.ts`

---

## GET (list)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.<Model>.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, /* ... */ },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('GET /api/<resource> error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
```

---

## POST (create)

```typescript
import { z } from 'zod';

const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  // ... fields with validation
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const validation = CreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const item = await prisma.<Model>.create({
      data: {
        ...validation.data,
        organizationId: claims.orgId,
      },
      select: { id: true, name: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/<resource> error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Checklist

- [ ] Auth: `getSessionClaims()` or `requireAuth(request)` for Bearer
- [ ] Org scope: `organizationId: claims.orgId` in create/where
- [ ] Soft delete: `deletedAt: null` in where
- [ ] Zod validation for POST/PATCH/PUT body
- [ ] Rate limit if user-facing (optional)
- [ ] Add `*.test.ts` next to route
- [ ] `export const dynamic = 'force-dynamic'` if needed
