# Phase 1: MVP Verification & Polish

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000)
- **Packages**: db, types, ui, api-client, i18n, config
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`); QR HMAC-SHA256
- **Refs**: `CLAUDE.md`, `packages/db/prisma/schema.prisma`, `docs/plan/execution/PLAN_mvp_and_resident.md`

## Goal

Verify MVP build, fix any remaining polish issues, and ensure all critical paths work before staging deployment.

## Scope (in)

- Replace onboarding `window.location.href` with Next.js router (logout flow)
- Verify `pnpm turbo build` passes for all workspaces
- Run `pnpm turbo lint` and `pnpm turbo typecheck`
- Ensure packages/db has valid migrations (run `prisma generate` if needed)

## Scope (out)

- No schema changes
- No new features
- Resident portal integration (Phase 3)

## Steps (ordered)

1. Check onboarding logout: `apps/client-dashboard/src/app/[locale]/dashboard/onboarding/page.tsx` — if `window.location.href = '/logout'` is used, consider `router.push('/logout')` for SPA-style nav. (Note: logout may need full redirect to clear cookies — verify and only change if safe.)
2. Run `pnpm turbo build` from repo root.
3. Run `pnpm turbo lint` and `pnpm turbo typecheck`.
4. Fix any build/lint/type errors.
5. Run `pnpm db:generate` to ensure Prisma client is current.
6. Update ALL_TASKS_BACKLOG.md: mark verified items (CSRF, scan export, override auth) as ✅ if not already.

## Acceptance criteria

- [ ] `pnpm turbo build` passes
- [ ] `pnpm turbo lint` passes
- [ ] `pnpm turbo typecheck` passes
- [ ] Onboarding logout behavior preserved (full redirect to clear auth cookies)
- [ ] Backlog reflects verified MVP items

## Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/onboarding/page.tsx`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
