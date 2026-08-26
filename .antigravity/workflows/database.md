---
name: database
description: Plan or audit Prisma/PostgreSQL models and migration safety.
---

# /database [model|migration|audit]

Require ownership, relations, constraints, indexes, lifecycle, applicable soft
delete, tenant proof, migration, backfill, rollback, and compatibility evidence.
Use `DIRECT_DATABASE_URL` only for separately authorized CLI migrations. This
command never runs a remote migration.
