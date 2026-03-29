---
generated: YYYY-MM-DD
update_trigger: prisma-model-change, enum-change
---

# Database Schema Snapshot

> Update after every `prisma migrate dev`. Copy key model shapes here.

---

## Core Models

### User

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  name           String?
  organizationId String
  deletedAt      DateTime?
  createdAt      DateTime @default(now())
}
```

### Organization

```prisma
model Organization {
  id        String    @id @default(cuid())
  name      String
  deletedAt DateTime?
  createdAt DateTime  @default(now())
}
```

---

## Enums

_(Add enums here as they are defined)_

---

## Gotchas

- Always filter `deletedAt: null` (soft deletes everywhere)
- Prisma accessor names follow camelCase of the model name
- Import enums from `@project/db`, not `@prisma/client`
