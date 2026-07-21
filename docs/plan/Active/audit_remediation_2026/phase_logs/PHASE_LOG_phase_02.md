# Phase 2 log — Tenant isolation

**Date:** 2026-07-20  
**Branch:** `fix/audit-remediation-phase-2`

## Changes

- Rewrote `packages/db/src/tenant.ts` to request-local **AsyncLocalStorage** context:
  - Fail-closed `TenantContextError` when org context is missing for tenant models
  - Soft-delete default `deletedAt: null` on reads for soft-delete models
  - Org injection / cross-tenant create rejection; org on update/upsert where
  - `scanLog` scoped via `gate.organizationId`
  - Exports: `db`, `privilegedDb`, `createTenantScopedClient`, `runWithOrganization*`, `runPrivileged*`
- Package `db` export now comes from tenant module (not unscoped `client.db`); `prisma` documented as privileged/legacy.
- Expanded `packages/db/src/tenant.test.ts` (concurrent ALS, missing context, soft-delete, cross-tenant create/update, privileged paths).
- Migrated critical path `apps/client-dashboard/.../qrcodes/validate/route.ts` to use `db` + ALS for tenant reads/writes; `$transaction` / fire-and-forget keep privileged `prisma` with **explicit** `organizationId`.
- Documented inventory + allowlist + RLS decision: `TENANT_PRISMA_ALLOWLIST.md`.

## RLS decision

PostgreSQL RLS **deferred**. App-level ALS + scoped `db` is the enforcement layer for this phase.  
Owner: platform/security · Revisit by Phase 4 or **2026-09-30**. Details in allowlist file.

## Verification

```bash
pnpm exec bun test src/tenant.test.ts   # 15 pass (packages/db)
pnpm turbo test --filter=@gate-access/db --filter=client-dashboard --filter=admin-dashboard  # pass
pnpm preflight                          # pass (2026-07-20; excludes admin/client typecheck)
```

## Residual risks

- ~261 files still import privileged `prisma` (allowlisted classes A–F); bulk migrate deferred to Phase 4 with dated expiry.
- `$transaction` interactive clients are not auto-wrapped — callers must filter org explicitly.
- `setOrganizationContext` (enterWith) remains on validate for request binding; prefer `runWithOrganizationAsync` for new code.
- Phase 1 credential-rotation receipt still pending (ops).

## Rollback

Do not revert to fail-open global tenant context. Forward-fix only: keep ALS fail-closed `db` and privileged `prisma`/`privilegedDb` split.
