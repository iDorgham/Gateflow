# High-risk route inventory — Phase 4

**Date:** 2026-07-21  
**Branch:** `fix/audit-remediation-phase-4`

Prioritized mutation / admin / cron / webhook / danger / AI surfaces. Full ~189-route crawl is out of scope; this inventory drives certification.

## Controls baseline

| Control                                       | Location                                                             |
| --------------------------------------------- | -------------------------------------------------------------------- |
| Admin session + Bearer key                    | `apps/admin-dashboard/src/lib/admin-auth.ts`, `require-admin-api.ts` |
| Admin middleware (all `/api/*` except public) | `apps/admin-dashboard/src/middleware.ts`                             |
| Client session + RBAC                         | `getSessionClaims` + `hasPermission` / `withApiGuards`               |
| Tenant Prisma                                 | `packages/db/src/tenant.ts` (fail-closed)                            |
| Rate limit                                    | `apps/client-dashboard/src/lib/rate-limit.ts`                        |
| Security headers (HSTS+CSP)                   | `packages/config/security-headers.js`                                |

## P0 closed this phase

| Route                                               | Fix                                                 |
| --------------------------------------------------- | --------------------------------------------------- |
| `/api/cms/generate-section\|generate-image\|blog/*` | `requireAdminApi` + middleware                      |
| `/api/cms/menus`, `/api/cms/landing-pages/[id]`     | `requireAdminApi`                                   |
| `/api/crm/companies\|contacts\|deals`               | `requireAdminApi` + orgId required where needed     |
| `/api/support/tickets`, `/api/team/roles`           | `requireAdminApi`                                   |
| `/api/cron/ai-tasks`                                | Fail-closed without `CRON_SECRET`                   |
| `/api/danger/delete-workspace\|export`              | `workspace:manage` + rate limit via `withApiGuards` |
| `/api/admin/login`                                  | Per-IP rate limit (429)                             |

## Residual (dated / owned)

| Item                                               | Owner    | Expiry     | Notes                                                            |
| -------------------------------------------------- | -------- | ---------- | ---------------------------------------------------------------- |
| Jest `--forceExit` (client-dashboard, scanner-app) | platform | 2026-09-30 | Open handles remain; budget in `scripts/check/test-budgets.json` |
| Skipped validate suite (max 1)                     | platform | 2026-09-30 | Fixture rewrite                                                  |
| PG RLS                                             | platform | 2026-09-30 | App-level ALS tenancy; revisit                                   |
| Phase 1 credential rotation receipt                | ops      | ASAP       | Non-code                                                         |
| Broader rate limits on all bulk/AI routes          | platform | 2026-09-30 | Pattern exists; expand incrementally                             |

## Test coverage added

- `apps/admin-dashboard/.../cms/generate-section/route.test.ts`
- `apps/admin-dashboard/.../crm/companies/route.test.ts`
- `apps/client-dashboard/.../cron/ai-tasks/route.test.ts`
- `apps/client-dashboard/.../danger/delete-workspace/route.test.ts`
