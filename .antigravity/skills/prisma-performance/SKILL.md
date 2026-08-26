---
name: prisma-performance
description: Specialized workflows and patterns for prisma-performance.
---

# SKILL: Advanced Prisma Performance & Auditing

## Purpose

Maximize database performance and maintain audit trails using Prisma and PostgreSQL for the GateFlow v9.0 "Command" redesign.

## Core Principles

1.  **Selective Fetching**: Always use `select` or `include` carefully; never fetch entire objects if only 2 fields are needed.
2.  **Indxing Strategy**: Every `WHERE` clause must be supported by an index in the schema.
3.  **Auditing Middleware**: Automatically record `createdAt`, `updatedAt`, and `deletedAt` for soft-deletion.

## Implementation Rules

- **Pagination**: Use **Cursor-based** pagination for infinite lists (scans, alerts).
- **Multi-tenancy**: Every query _must_ include `organizationId`.
- **Aggregations**: Use `groupBy` for dashboard statistics rather than fetching all rows and calculating in JS.

## Anti-Patterns

- `n+1` queries (use `include` or `tx`).
- Fetching large BLOBs directly in a list query.
- Ignoring slow query logs in local development.

## Code Examples

### Cursor Pagination (Server Side)

```typescript
export const getScanLogs = async (cursor?: string, orgId: string) => {
  return await prisma.scan.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { organizationId: orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true, visitorName: true, status: true },
  });
};
```

### Soft-Delete Implementation

```typescript
// prisma/schema.prisma
model Scan {
  id String @id @default(cuid())
  deletedAt DateTime?
}

// In query
const scans = await prisma.scan.findMany({ where: { deletedAt: null } });
```
