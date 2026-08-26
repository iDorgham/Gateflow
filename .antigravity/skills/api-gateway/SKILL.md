---
name: api-gateway
description: Specialized workflows and patterns for api-gateway.
---

# SKILL: API Gateway Pattern & Middleware

## Purpose

Enforce a unified security and routing layer for GateFlow v9.0 APIs, handling authentication, rate limiting, and request normalization.

## Core Principles

1.  **Auth First**: No request passes to services without a valid JWT/Session check (except public routes).
2.  **Request Decoration**: Injects `organizationId` and `userId` into context to enforce multi-tenancy.
3.  **Rate Limiting**: Throttling based on user ID or IP to prevent abuse.

## Implementation Rules

- **Middleware**: Use Next.js `middleware.ts` for global checks.
- **Correlation IDs**: Assign unique IDs to every request for debugging.
- **Data Protection**: Middleware must strip sensitive fields from incoming payloads.

## Anti-Patterns

- Checking auth manually in every API route (use middleware).
- Exposing internal server errors to the client (use generic 500s).
- Relying on client-provided IDs for multi-tenancy.

## Code Examples

### Next.js Middleware Auth Logic

```typescript
export async function middleware(req: NextRequest) {
  const session = await getSession(req);
  if (!session && !PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.next();
  response.headers.set('x-correlation-id', crypto.randomUUID());
  return response;
}
```

### Request Context Injection

```typescript
const withAuth = (handler) => async (req, ctx) => {
  const session = await getSession(req);
  const context = { ...ctx, orgId: session.organizationId, userId: session.id };
  return handler(req, context);
};
```
