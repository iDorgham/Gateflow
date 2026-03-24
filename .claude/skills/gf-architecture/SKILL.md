---
name: gateflow-architecture
description: Monorepo structure, tech stack, and development patterns for GateFlow. Use when making codebase changes, architectural decisions, or debugging cross-app issues.
---

# GateFlow Architecture

## Monorepo Structure

| Layer | Details |
|-------|---------|
| Build | Turborepo 2.x, pnpm 8.x workspaces |
| Apps | client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000), resident-portal (3004), resident-mobile (8082) |
| Packages | @gate-access/db, @gate-access/types, @gate-access/ui, @gate-access/config, @gate-access/api-client, @gate-access/i18n |

## Tech Stack

- **Frontend**: Next.js 14 App Router only
- **Mobile**: Expo SDK 54 with React Native
- **Database**: PostgreSQL 15+, Prisma 5.x
- **Package manager**: pnpm only — never npm or yarn
- **TypeScript**: Strict, ES2020
- **Styling**: Tailwind CSS 3.4+ with design tokens

## Critical Conventions

1. **Multi-tenancy**: Every DB query MUST scope by `organizationId`
2. **Soft deletes**: Filter `deletedAt: null`; never hard delete
3. **IDs**: Use `cuid()` for all model IDs
4. **Imports**: Use workspace packages (`@gate-access/*`) not relative paths across apps
5. **Prisma**: Schema at `packages/db/prisma/schema.prisma` — run `prisma generate` after changes

## Commands

```bash
pnpm install
pnpm turbo dev
pnpm turbo dev --filter=client-dashboard
pnpm turbo build
cd packages/db && npx prisma generate
cd packages/db && npx prisma migrate dev
```

## Adding a New Feature

1. Types → `packages/types`
2. UI components → `packages/ui` if shared
3. Prisma schema → migrate → `prisma generate`
4. Implement in app(s)
5. Update docs

## Cross-App Communication

- Shared types: `@gate-access/types`
- API client: `@gate-access/api-client`
- Never import directly between apps

## Anti-Patterns

- ❌ npm or yarn
- ❌ Hard deletes
- ❌ Queries without organizationId
- ❌ Relative imports across apps
- ❌ Storing secrets in code

**Reference:** `CLAUDE.md`, `docs/PROJECT_STRUCTURE.md`
