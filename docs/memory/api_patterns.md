---
name: API Patterns
description: Auth patterns, org scoping, route conventions
type: project
---

# API Patterns

## Auth

```typescript
const session = await requireAuth(); // throws on failure
const orgId = session.user.organizationId; // always use this
```

## Org Scoping

```typescript
where: { organizationId: session.user.organizationId, deletedAt: null }
```

## Response Pattern

```typescript
return Response.json({ data: result }); // success
return Response.json({ error: 'msg' }, { status: 400 }); // error
```
