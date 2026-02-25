---
inclusion: fileMatch
fileMatchPattern: '**/api/**/*.ts'
---

# API Development Guidelines

## API Route Structure (Next.js 14 App Router)
```typescript
// app/api/[resource]/route.ts
import { validateAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { prisma } from '@gate-access/db';
import { z } from 'zod';

export async function GET(request: Request) {
  // 1. Rate limiting
  await rateLimit(request, { max: 100, window: '1m' });
  
  // 2. Authentication
  const user = await validateAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 3. Authorization
  if (!['ADMIN', 'TENANT_ADMIN'].includes(user.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // 4. Query with multi-tenant scoping
  const data = await prisma.model.findMany({
    where: {
      organizationId: user.orgId,
      deletedAt: null
    }
  });
  
  return Response.json(data);
}

export async function POST(request: Request) {
  await rateLimit(request, { max: 10, window: '1m' });
  
  const user = await validateAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Validate input
  const schema = z.object({
    name: z.string().min(1).max(100),
    // ... other fields
  });
  
  const body = await request.json();
  const input = schema.parse(body);
  
  // Create with org scoping
  const created = await prisma.model.create({
    data: {
      ...input,
      organizationId: user.orgId
    }
  });
  
  return Response.json(created, { status: 201 });
}
```

## Required Checks
1. ✅ Rate limiting applied
2. ✅ JWT token validated
3. ✅ User role checked
4. ✅ Input validated with Zod
5. ✅ Query scoped by organizationId
6. ✅ Soft delete filter applied
7. ✅ Proper error handling
8. ✅ Appropriate status codes

## Error Responses
```typescript
// 400 Bad Request
return Response.json({ error: 'Invalid input', details: zodError }, { status: 400 });

// 401 Unauthorized
return Response.json({ error: 'Unauthorized' }, { status: 401 });

// 403 Forbidden
return Response.json({ error: 'Forbidden' }, { status: 403 });

// 404 Not Found
return Response.json({ error: 'Not found' }, { status: 404 });

// 429 Too Many Requests
return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

// 500 Internal Server Error
return Response.json({ error: 'Internal server error' }, { status: 500 });
```

## CSRF Protection
For POST/PUT/DELETE requests:
```typescript
import { validateCsrfToken } from '@/lib/csrf';

const csrfToken = request.headers.get('x-csrf-token');
if (!validateCsrfToken(csrfToken)) {
  return Response.json({ error: 'Invalid CSRF token' }, { status: 403 });
}
```
