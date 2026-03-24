---
name: db
description: Prisma and PostgreSQL patterns for schema, migrations, and queries. Use when working with database models, migrations, or data access.
---

# Database (Prisma + PostgreSQL)

## GateFlow conventions

- **Multi-tenant:** Every query scoped by `organizationId`
- **Soft deletes:** Filter `deletedAt: null` on all tenant data
- **Schema:** `packages/db/prisma/schema.prisma`

## Commands

```bash
cd packages/db
npx prisma generate
npx prisma migrate dev --name <name>
npx prisma db push       # dev only
npx prisma db seed
npx prisma studio
```

## Query pattern

```ts
await prisma.model.findMany({
  where: {
    organizationId: orgId,
    deletedAt: null,
    // ...filters
  },
});
```

## Migrations

- Create: `prisma migrate dev --create-only --name add_foo`
- Apply: `prisma migrate dev`
- Deploy: `prisma migrate deploy` (production)
