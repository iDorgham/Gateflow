# GateFlow Architecture Expert

## Purpose
Expert knowledge of GateFlow's monorepo architecture, tech stack, and development patterns.

## When to Use
- Working on any GateFlow codebase modifications
- Understanding component relationships
- Making architectural decisions
- Debugging cross-app issues

## Core Knowledge

### Monorepo Structure
- **Build System**: Turborepo 2.x with pnpm 8.x workspaces
- **6 Applications**: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000), resident-portal (3004), resident-mobile (8082)
- **6 Shared Packages**: @gate-access/db, @gate-access/types, @gate-access/ui, @gate-access/config, @gate-access/api-client, @gate-access/i18n

### Tech Stack Rules
1. **Frontend**: Next.js 14 App Router only (no Pages Router)
2. **Mobile**: Expo SDK 54 with React Native
3. **Database**: PostgreSQL 15+ with Prisma 5.x ORM
4. **Package Manager**: ALWAYS use `pnpm` - NEVER npm or yarn
5. **TypeScript**: Strict mode enabled, ES2020 target
6. **Styling**: Tailwind CSS 3.4+ with custom design tokens

### Critical Conventions
1. **Multi-tenancy**: Every DB query MUST scope by `organizationId`
2. **Soft Deletes**: Always filter `deletedAt: null` - never hard delete
3. **IDs**: Use `cuid()` for all model IDs
4. **Imports**: Use workspace packages (`@gate-access/*`) not relative paths across apps
5. **Prisma**: Schema at `packages/db/prisma/schema.prisma` - run `prisma generate` after changes

### Development Commands
```bash
# Install dependencies
pnpm install

# Start all apps
pnpm turbo dev

# Start single app
pnpm turbo dev --filter=client-dashboard

# Build all
pnpm turbo build

# Database operations (from packages/db)
cd packages/db
npx prisma generate
npx prisma migrate dev
npx prisma db push
npx prisma studio
```

### Port Assignments
- Marketing: 3000
- Client Dashboard: 3001
- Admin Dashboard: 3002
- Resident Portal: 3004
- Scanner App: 8081 (Metro)
- Resident Mobile: 8082 (Metro)

## Key Files to Reference
- `CLAUDE.md` - Full AI assistant guide
- `docs/PROJECT_STRUCTURE.md` - Detailed architecture
- `docs/DEVELOPMENT_GUIDE.md` - Setup instructions
- `packages/db/prisma/schema.prisma` - Database schema
- `turbo.json` - Build pipeline configuration

## Common Patterns

### Adding a New Feature
1. Check if it needs shared types → add to `packages/types`
2. Check if it needs UI components → add to `packages/ui`
3. Update Prisma schema if DB changes needed
4. Run `prisma generate` and create migration
5. Implement in relevant app(s)
6. Update documentation

### Cross-App Communication
- Use shared types from `@gate-access/types`
- Use API client from `@gate-access/api-client`
- Never import directly between apps
- Use environment variables for URLs

### Testing Strategy
- Jest + ts-jest for unit tests
- Test files: `*.test.ts` or `*.test.tsx`
- Run: `pnpm turbo test`
- Coverage target: 80%+

## Anti-Patterns to Avoid
❌ Using npm or yarn instead of pnpm
❌ Hard deletes (always soft delete with deletedAt)
❌ Queries without organizationId scoping
❌ Relative imports across app boundaries
❌ Direct database access (always use Prisma)
❌ Storing secrets in code (use environment variables)
