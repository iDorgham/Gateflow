---
name: gateflow-database
description: Prisma schema, migrations, and query patterns for GateFlow. Use when creating/modifying models, writing queries, creating migrations, or debugging data issues.
---

# GateFlow Database

## Stack

- **DB**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Schema**: `packages/db/prisma/schema.prisma`
- **Migrations**: `packages/db/prisma/migrations/`

## Required Patterns

### Multi-tenant (always)

```typescript
where: {
  organizationId: auth.orgId,
  deletedAt: null,
}
```

### Soft delete (always)

```typescript
// Query: filter deleted
where: { deletedAt: null }

// Delete: set deletedAt
await prisma.gate.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

### New model checklist

- `organizationId` + `@@index([organizationId])` for tenant models
- `deletedAt DateTime?` + `@@index([deletedAt])` for mutable models
- `createdAt`, `updatedAt` timestamps
- `@default(cuid())` for ids

## Migration Workflow

```bash
cd packages/db
npx prisma generate              # After schema edit
npx prisma migrate dev --name add_field
npx prisma db push               # Dev only, no migration
npx prisma studio
```

## MCP: Prisma-Local

When **Prisma-Local** MCP is enabled, use its tools for:

- **migrate-dev** — Create and apply migration (LLM provides migration name)
- **migrate-status** — Check migration state
- **Prisma-Studio** — Open Prisma Studio via `prisma studio`

## Core Models

| Model | Purpose |
|-------|---------|
| Organization | Multi-tenant root |
| Project | Sub-grouping |
| User | Auth, RBAC |
| Gate | Access points |
| QRCode | Access codes (HMAC signed) |
| ScanLog | Immutable audit trail (scanUuid dedup) |
| Unit | Residential units (Phase 2) |

## Query Examples

### Find many with org scope

```typescript
const gates = await prisma.gate.findMany({
  where: { organizationId: orgId, deletedAt: null },
  include: { project: true },
  orderBy: { createdAt: 'desc' },
});
```

### Transaction

```typescript
await prisma.$transaction(async (tx) => {
  await tx.qRCode.update({
    where: { id },
    data: { scanCount: { increment: 1 } },
  });
  await tx.scanLog.create({ data: { ... } });
});
```

### Aggregation

```typescript
const stats = await prisma.scanLog.groupBy({
  by: ['status'],
  where: { organizationId: orgId, createdAt: { gte: start, lte: end } },
  _count: true,
});
```

## Performance

- Use `select` for large result sets
- `createMany` for bulk inserts
- Add `@@index` on frequently queried fields
- Connection pool in DATABASE_URL

## Input Validation

Use Zod for API input; Prisma for DB constraints.

**Reference:** `packages/db/prisma/schema.prisma`, `packages/db/prisma/seed.ts`
