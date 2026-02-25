---
inclusion: always
---

# GateFlow Development Conventions

## Package Manager
- ALWAYS use `pnpm` - NEVER npm or yarn
- Run `pnpm install` after pulling changes
- Use `pnpm turbo` for monorepo commands

## Multi-Tenancy Rules
- Every database query MUST scope by `organizationId`
- Never expose data across organizations
- Test multi-tenant isolation for all features

## Soft Delete Pattern
- ALWAYS filter `deletedAt: null` in queries
- NEVER use hard deletes (prisma.model.delete)
- Use soft delete: `update({ data: { deletedAt: new Date() } })`

## Database Changes
- Schema location: `packages/db/prisma/schema.prisma`
- After schema changes: `cd packages/db && npx prisma generate`
- Create migrations: `npx prisma migrate dev --name descriptive_name`
- All models must have: `id`, `createdAt`, `updatedAt`, `deletedAt`

## Import Conventions
- Use workspace packages: `@gate-access/*` not relative paths
- Never import directly between apps
- Shared code goes in packages/

## Security Requirements
- All API routes must validate JWT tokens
- Apply rate limiting to public endpoints
- Include CSRF protection on state-changing requests
- Never log sensitive data (passwords, tokens, secrets)
- Use environment variables for secrets

## Code Quality
- TypeScript strict mode enabled
- Run `pnpm turbo lint` before committing
- Fix all ESLint errors, not just warnings
- Use Zod for input validation
- Handle errors gracefully with proper status codes

## Testing
- Write tests for business logic
- Test files: `*.test.ts` or `*.test.tsx`
- Run: `pnpm turbo test`
- Mock external dependencies

## Documentation
- Update relevant docs/ files when changing features
- Keep CLAUDE.md updated with new patterns
- Document breaking changes
