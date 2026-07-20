# Phase 2 — Tenant Isolation: Request-local, Complete, Fail-closed

**Role:** Security/database/backend. Read the plan, context, tasks, Prisma schema, tenant module/tests, and all relevant imports.

## Goal and scope

Inventory tenant-owned operations, replace global context with `AsyncLocalStorage` or equivalent, fail closed without context, enforce organization and soft-delete boundaries on reads/writes/transactions, and expose a deliberately privileged client only for reviewed global administration.

## Required tests

- Concurrent two-organization reads and writes cannot bleed.
- Missing context is rejected, not unrestricted.
- Cross-tenant update/delete/upsert fails.
- Soft-deleted rows are excluded by default.
- Explicit privileged paths retain required admin behavior.

## Acceptance and verification

- [ ] Raw Prisma callers are migrated or allowlisted with justification.
- [ ] Tenant and soft-delete controls cover the inventoried surface.
- [ ] Targeted DB/client/admin checks and `pnpm preflight` pass.

```bash
# Prefer an AST inventory when available. Until then, expand ripgrep and document every unreviewed caller before treating inventory as complete.
rg -n "setOrganizationContext|clearOrganizationContext|from ['\"]@gate-access/db['\"]|from ['\"]@gate-access/db/|from ['\"]@prisma/client['\"]|prisma\\.[A-Za-z_][A-Za-z0-9_]*\\(" apps packages
pnpm turbo test --filter=@gate-access/db --filter=client-dashboard --filter=admin-dashboard
pnpm preflight
```

Document the RLS decision and update tasks, memory, and phase 2 log; do not edit the plan.
