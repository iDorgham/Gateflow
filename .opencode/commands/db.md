---
description: Database operations - generate, migrate, push, seed
agent: build
---

Run database operations. Ask the user which operation they need:

Options:

1. generate - Regenerate Prisma client (pnpm turbo generate)
2. push - Push schema to database (prisma db push)
3. migrate - Create a migration (prisma migrate dev)
4. studio - Open Prisma Studio (prisma studio)
5. seed - Run database seeders

Run from packages/db directory.
