---
name: API Patterns
description: Auth patterns, org scoping, route conventions, common patterns
type: project
---

# API Patterns

## Auth

- Get session: `const session = await requireAuth()` (throws on failure)
- Check org: `session.user.organizationId`
- Never trust client-supplied org ID — always use session value

## Org Scoping

```typescript
// Always scope to organizationId
await prisma.thing.findMany({
  where: {
    organizationId: session.user.organizationId,
    deletedAt: null,
  },
});
```

## Soft Deletes

```typescript
// Always filter deletedAt: null
where: {
  deletedAt: null;
}

// Soft delete (never hard delete)
await prisma.thing.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

## Response Envelope

```typescript
// Success
return Response.json({ data: result });

// Error
return Response.json({ error: 'message' }, { status: 400 });
```

## Route File Pattern

```typescript
export async function GET(req: Request) {
  const session = await requireAuth();
  // ... scoped query
  return Response.json({ data: result });
}
```

## How to apply

Use this instead of re-reading route files. Copy patterns directly.
