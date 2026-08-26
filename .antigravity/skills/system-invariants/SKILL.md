---
name: system-invariants
description: Specialized workflows and patterns for system-invariants.
---

# SKILL: GateFlow System Invariants & Core Integrity

## Purpose

Define the non-negotiable architectural rules that maintain the security, reliability, and integrity of the GateFlow v9.0 ecosystem.

## Core Principles

1.  **Multi-Tenant Isolation**: No data operation shall ever run without a validated `organizationId` filter.
2.  **Audit Trail Immortality**: All critical actions (Access Granted/Denied, Role Change) must be logged to an append-only table.
3.  **Input Sanitation**: No unvalidated input shall ever enter the database or be rendered in the UI.

## Implementation Rules

- **Invariants**:
  - `OR_CLAUSE`: All DB queries must include `deletedAt: null`.
  - `ORG_CONTEXT`: The `organizationId` must be derived from the session, never the request body.
- **Schema Protection**: Use Prisma field-level restrictions to prevent sensitive column exposure.

## Anti-Patterns

- Using `findFirst` without `where: { organizationId }`.
- Deleting rows manually from the database instead of using the `deletedAt` field.
- Hardcoding environment-specific values in the business logic.

## Code Examples

### Global Soft-Delete Middleware (Prisma)

```typescript
prisma.$use(async (params, next) => {
  if (params.action === 'findMany' || params.action === 'findFirst') {
    if (params.args.where) {
      if (params.args.where.deletedAt === undefined) {
        params.args.where['deletedAt'] = null;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }
  return next(params);
});
```

### Secure Context Extraction

```typescript
export const getContext = async (req: Request) => {
  const session = await getSession(req);
  if (!session?.organizationId) throw new Error('Tenant Context Missing');
  return { orgId: session.organizationId, userId: session.userId };
};
```
