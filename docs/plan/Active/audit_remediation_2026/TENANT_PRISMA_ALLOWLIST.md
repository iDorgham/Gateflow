# Tenant Prisma allowlist — Phase 2

**Date:** 2026-07-20  
**Inventory method:** `rg` over `apps/` + `packages/` for `@gate-access/db` / `@prisma/client` imports (~261 files import `prisma`).

## Client contract (`@gate-access/db`)

| Export                                            | Role                                                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `db`                                              | Fail-closed, ALS-scoped tenant client (`packages/db/src/tenant.ts`)                                 |
| `privilegedDb`                                    | Alias of raw Prisma — explicit global/admin use                                                     |
| `prisma`                                          | **Same object as `privilegedDb`** — legacy import name; treated as privileged until callers migrate |
| `runWithOrganization*` / `setOrganizationContext` | Request-local ALS context                                                                           |
| `runPrivileged*`                                  | Privileged ALS mode (does **not** unlock `db`; use `privilegedDb`)                                  |

## RLS decision

**PostgreSQL RLS is deferred.** Enforcement is application-level via `db` + ALS + explicit `organizationId` on privileged paths.

| Item      | Decision                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Owner     | Platform / security (GateFlow)                                                                                                                         |
| Reason    | Hosting/ops readiness for staged RLS not verified this phase; app-level ALS + scoped client closes the P0 fail-open context bug without a DB migration |
| Expiry    | Revisit by Phase 4 completion or 2026-09-30, whichever first                                                                                           |
| Follow-up | Spike RLS on Neon/Postgres + Prisma `db` dual-control; track in Phase 4 API certification                                                              |

## Allowlisted raw / privileged `prisma` usage

Justification classes (all remaining `prisma` imports fall into one):

### A — Platform / cross-tenant admin (`apps/admin-dashboard/**`)

Cross-org CRM, CMS, finance, support, bots, emulate-traffic, reset-tenant, authorization keys.  
**Justification:** Super-admin surfaces; must remain privileged. Prefer `privilegedDb` rename in a later cleanup; keep explicit org filters on org-scoped admin routes.

### B — Public / marketing read paths (`apps/marketing/**`)

Published CMS pages, blog, short links, invitations.  
**Justification:** Not session-tenant; filters are publish-state / slug / signature, not ALS org context.

### C — Auth / session / bootstrap (`*login*`, `*logout*`, refresh tokens, onboarding join)

**Justification:** Resolve user/org before tenant context exists; privileged by necessity.

### D — Fire-and-forget / `$transaction` helpers without ALS

e.g. validate route webhook `.then()`, Expo push helpers, `prisma.$transaction` interactive clients.  
**Justification:** ALS may be cleared after response; transaction `tx` is not wrapped. Must pass **explicit** `organizationId` (and soft-delete) in `where`/`data`.

### E — Package internals / seeds / scripts (`packages/db/**`, prisma utilities)

**Justification:** Migrations, seeds, board ensure helpers — privileged tooling.

### F — Client dashboard & resident portal (bulk of ~261 files)

**Justification (dated deferral):** Existing routes largely apply manual `organizationId` filters. Migrating every caller to `db` in one phase risks regressions.  
**Owner:** Phase 4 API certification  
**Expiry:** Before declaring audit remediation complete  
**Follow-up:** Route-by-route migrate high-risk writes to `db` + `runWithOrganizationAsync`; add lint rule discouraging new bare `prisma` in tenant routes.

## Migrated this phase (must use `db` + ALS)

| Path                                                          | Notes                                                                                                                        |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` | `setOrganizationContext` + `db` for QR/contact/gate/incident; transaction uses privileged `prisma` with explicit org filters |

## Soft-delete / model coverage

Tenant models and soft-delete models are listed in `packages/db/src/tenant.ts` (`TENANT_MODELS`, `SOFT_DELETE_MODELS`).  
`scanLog` is scoped via `gate.organizationId`.  
`$transaction` / `$queryRaw` remain unwrapped — privileged-only.
