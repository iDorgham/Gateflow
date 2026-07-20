# GateFlow Deep Audit

**Date:** 2026-07-16  
**Scope:** repository architecture, delivery health, application security, data isolation, dependency hygiene, performance readiness, tests, CI, and operational tooling.  
**Method:** source review of the GateFlow monorepo, static security checks, project-owned health checks, CI/workflow review, and a live npm advisory lookup. This is a source-level audit; it is not a penetration test and does not establish production configuration or live-database status.

## Executive summary

GateFlow has a strong product and engineering base: a pnpm/Turborepo monorepo, clear package boundaries, multiple delivery surfaces, JWT/cookie authentication, CSRF middleware, QR signing, tenant-aware database helpers, shared UI and types, and meaningful CI automation. The repository is feature-rich and visibly beyond prototype stage.

However, it is **not ready to be treated as production-secure until P0/P1 findings are resolved**. A publicly callable one-time setup route contains a predictable fallback secret and resets an administrator to a known password. A scheduled task endpoint fails open if its secret is absent. A workspace deletion route permits any authenticated session to delete its organization without a role/permission check. In addition, dependency exposure is material (16 high-or-critical npm advisories), and several health checks are currently ineffective because their scripts resolve the wrong root directory and scan zero source files.

**Overall assessment:** feature maturity is high; release readiness is conditional. Fix P0 items immediately, repair assurance tooling, then take a controlled dependency upgrade and performance baseline.

## Audit scorecard

| Area                               | Status             | Assessment                                                                                                                                                                |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product and feature progress       | Good               | Six application surfaces plus a design-system app, 2,799 source files, 192 API routes, and 82 test files were detected.                                                   |
| Monorepo architecture              | Good               | pnpm workspaces, Turborepo, shared database/types/UI/config packages, and no direct app-to-app import policy are sound foundations.                                       |
| Authentication and session hygiene | Needs attention    | JWT verification, httpOnly cookies, Argon2id, token rotation, and CSRF middleware exist; high-risk routes do not apply the same fail-closed policy.                       |
| Tenant isolation                   | Needs verification | Tenant-aware patterns and tests exist, but the route surface is too large for pattern-only assurance; add automated route and isolation coverage.                         |
| Dependency security                | High risk          | Live audit returned 16 high-or-critical advisories, including multiple Next.js issues and a critical `shell-quote` advisory.                                              |
| CI and quality gates               | Needs attention    | CI has lint, typecheck, test, secret scan, performance, and documentation jobs, but some local guard scripts scan zero files due to a root-path bug.                      |
| Performance readiness              | Needs baseline     | Budget tooling exists, but it cannot find builds for the same root-path reason. Large dynamic route surface also merits measured API and bundle profiling.                |
| Observability and operations       | Partial            | Health endpoint and audit logging are present; centralized structured logs, error tracking, tracing, and SLO-driven alerting were not demonstrated in the reviewed paths. |

## Strengths and progress

### What is already working well

- **Clear platform topology.** Apps cover client/admin dashboards, marketing, resident portal, scanner, resident mobile, and a design-system surface. Shared packages reduce duplication and create a path to governed reuse.
- **Security primitives are present.** Client auth uses signed access tokens, password hashing uses Argon2id, auth cookies are httpOnly, CSRF uses a double-submit cookie pattern, and scanner/mobile clients use SecureStore.
- **Security-aware domain design.** QR payload handling, API-key utilities, encryption utilities, tenant helpers, audit records, and dedicated security/tenant tests are all present.
- **CI is thoughtfully composed.** The main workflow separates setup, lint, security, typecheck, tests, performance, and a summary gate. Dependabot and CODEOWNERS are also configured.
- **Database intent is sound.** Prisma models use organization identifiers and soft-delete fields broadly; the project guidance explicitly requires organization scoping and `deletedAt: null` filters.
- **Delivery workflow is mature.** Workspace plans, changelog checks, task backlogs, feature templates, preflight tooling, and AI-tool synchronization are strong process assets.

### Product progress observed

- The repository is not a thin demo: 2,799 non-dependency TS/TSX/JS source files and 82 unit/integration test files were found.
- The API surface is extensive (192 source `route.ts` files across client, admin, marketing, and resident portal). It includes access control, QR issuance and validation, scan handling, analytics, projects/units/contacts, billing, webhooks, notifications, maintenance, AI functions, and admin operations.
- The admin service includes protected health, audit-log export, organization management, and operational/emulation functionality.

## Security findings

Severity reflects likely impact and exploitability from the source. Confirm deployment exposure as part of remediation.

### P0 — remove the exposed bootstrap/reset endpoint

**Evidence:** `apps/client-dashboard/src/app/api/setup/reset-admin/route.ts`

- A `GET` endpoint accepts a query-string secret and falls back to the hard-coded value `gateflow-setup-2026` when `SETUP_SECRET` is unset.
- The endpoint resets or creates `admin@selenadev.com` using an embedded Argon2 hash documented as the hash for `password123`.
- It can create global roles, create an organization and project, and reset the administrator password.

**Impact:** Anyone able to reach the endpoint can take over the seeded administrator account whenever the production secret is unset, and query parameters may also be retained in access logs, browser history, and proxies.

**Fix now:** delete the route from production code. If bootstrap is still required, make it a local one-time CLI that requires explicit interactive confirmation, never has defaults, and cannot be built into a deployed application. Rotate the setup secret and the affected admin credentials immediately in every environment where this route may have been deployed.

### P0 — cron endpoint fails open without `CRON_SECRET`

**Evidence:** `apps/client-dashboard/src/app/api/cron/ai-tasks/route.ts`

```ts
if (cronSecret && authHeader !== `Bearer ${cronSecret}`) { ... }
```

If `CRON_SECRET` is missing, the endpoint processes queued AI tasks for any caller. It also returns task titles and IDs and writes task status.

**Impact:** unauthenticated triggering can create a denial-of-service path, disclose task metadata, and execute future task types without authentication.

**Fix now:** fail closed when `CRON_SECRET` is missing, reject non-Bearer authentication in all cases, compare secrets in constant time, constrain the endpoint to its scheduler identity/network when available, and add tests for missing/malformed/wrong credentials.

### P1 — workspace deletion lacks authorization

**Evidence:** `apps/client-dashboard/src/app/api/danger/delete-workspace/route.ts`

The handler verifies `claims.orgId`, but does not require an administrator role or `workspace:manage` permission before soft-deleting the organization. The two text confirmations are safety UX, not authorization.

**Impact:** a low-privilege authenticated user within an organization may be able to schedule deletion of its entire workspace.

**Fix:** use `requireAuth` plus permission enforcement (`workspace:manage` or an explicit tenant-admin role); test each non-admin role receives 403 and audit the authorization decision.

### P1 — dependency vulnerabilities require an upgrade plan

**Evidence:** live `pnpm check:security` lookup on 2026-07-16 returned 16 high-or-critical advisories:

- Multiple high-severity `next` advisories: App Router middleware/proxy bypasses, dynamic-parameter injection bypass, server-component DoS, cache-component connection exhaustion, and WebSocket-upgrade SSRF.
- Critical `shell-quote` newline escaping advisory.
- High `fast-uri` host-confusion/path-traversal advisories.
- High `linkify-it` algorithmic-complexity DoS advisory.
- High `tmp`, `undici`, and `ws` advisories.

The repository declares `next: ^15.5.15` in its web applications. Resolve the advisories with `pnpm audit --fix` only in a dedicated upgrade branch, then lock tested versions and run the full application regression suite. Do not assume a semver range has already selected a fixed lockfile version.

### P1 — migration history is absent

**Evidence:** `packages/db/prisma/migrations/` contains only `migration_lock.toml`; no migration directories with `migration.sql` were found, despite a large Prisma schema.

**Impact:** no auditable, repeatable schema evolution path for production deployments or rollback planning.

**Fix:** establish a baseline migration from the current authoritative production schema, enforce `prisma migrate deploy` in deployment pipelines using `DIRECT_DATABASE_URL`, prohibit `db push` outside local development, and verify backup/restore before the first managed migration.

### P2 — authorization coverage should be systematic

Most admin routes use `isAdminAuthorized`, and the client middleware supplies CSRF protection for state-changing cookie requests. But 192 API routes make manual consistency untenable.

**Fix:** introduce a shared route wrapper/policy matrix that declares authentication, permission, tenant scope, input schema, rate limit, and audit requirement. Add a CI test that enumerates `app/api/**/route.ts` and rejects protected routes lacking declared policy (with a small explicit public-route allowlist).

## Assurance and tooling findings

### P1 — four guard scripts scan the wrong directory

`check-imports.js`, `todos.js`, `check-db-drift.js`, and `check-bundle-size.js` use `path.resolve(__dirname, '..')`. Because their files are under `scripts/check/`, this resolves to `<repo>/scripts`, not the repository root. Their subsequent paths such as `apps/...` therefore target `<repo>/scripts/apps/...`.

Observed effects:

- `pnpm check:imports --summary` reported **0 files** scanned.
- `pnpm check:todos --type FIXME` and `--old 30` reported **0 files** scanned.
- `pnpm check:db-drift --schema` reported `schema.prisma not found` and **0 migrations**.
- `pnpm check:bundle --report` reported no build output even though multiple app `.next` directories exist.

**Fix:** use `path.resolve(__dirname, '..', '..')` or a robust root locator anchored on `package.json`/`pnpm-workspace.yaml`. Add regression tests or a smoke CI assertion that the scripts scan a non-zero expected file count.

### P2 — security scan currently warns but does not fail CI

The dependency scanner returned 16 high-or-critical advisories but exited successfully. This is acceptable only as a temporary visibility stage. After triage, enforce failure for critical advisories and an approved exception list with expiry dates.

### P2 — secret scanner scope is limited

`pnpm check:secrets` reported no secrets in **staged files**, not the working tree/history. That result does not constitute a full-repository secret audit.

**Fix:** scan the full tracked tree in CI and add history scanning before releases. Keep false-positive suppressions minimal and reviewed.

## Performance findings

### Current positives

- Turborepo task caching is configured.
- CI defines a performance job and a bundle budget tool.
- Health checks use `Promise.all` for independent aggregate queries.
- API and server routes generally use dynamic handling intentionally where session/state freshness is needed.

### Risks and improvements

1. **No trustworthy bundle baseline.** The bundle tool currently cannot see existing `.next` output because of the root-path bug. Repair it, rebuild all web apps in a clean CI job, and store an approved baseline.
2. **Very large route surface.** The client API has analytics, exports, AI, webhooks, scans, projects, and admin actions in one Next.js application. Define route-level latency/error budgets and load-test high-volume paths: QR validation, scanner sync, scan ingestion, analytics aggregates, exports, and webhooks.
3. **Dynamic rendering requires measurement.** Dynamic/no-store routes should be reserved for user- or event-specific data. Audit route cache directives and fetch policies after measuring server response time and database query volume.
4. **Database performance is not yet demonstrated.** Confirm compound indexes for each dominant query shape, especially organization + soft-delete + date/status filters. Capture slow-query telemetry in production and test query plans on production-like data.
5. **AI and export operations need isolation.** Place report generation, PDF/export work, and long-running AI jobs on a durable queue with concurrency limits, idempotency keys, timeout/retry policy, and worker-level metrics rather than request-bound execution.
6. **Observability is incomplete.** A protected health route exists, but add structured JSON logging with request IDs, error tracking, distributed traces for webhooks/scans/AI, uptime probes, and alerts tied to SLOs.

## Architecture and maintainability improvements

1. Establish an explicit API policy layer and move repeated route guard code into it.
2. Separate platform-operational routes (health, admin reset, emulation, cron) from customer-facing dashboard APIs; deploy them behind a separate internal boundary if retained.
3. Treat the Prisma schema as a release artifact with migrations, schema review, and database rollback/restore runbooks.
4. Publish a route inventory that identifies owner, auth model, tenant boundary, mutation status, rate-limit tier, and test coverage.
5. Expand tests from 82 files to risk-based coverage: tenant-boundary negative tests, destructive-action permission tests, webhook signature tests, cron auth tests, CSRF bypass tests, and QR replay/expiry tests.
6. Standardize a single logger and remove sensitive values from error output. Do not return upstream/internal error text to users.
7. Maintain a dependency update cadence and lockfile-based security SLA, particularly for Next.js and networking libraries.

## Prioritized remediation plan

### First 24 hours

1. Remove `api/setup/reset-admin`; rotate any related secrets and reset the seeded administrator password.
2. Make cron authentication fail closed and deploy it with a non-empty, rotated secret.
3. Require tenant-admin/workspace-management permission for workspace deletion; add an authorization regression test.
4. Triage the 16 live dependency advisories; upgrade Next.js and the critical `shell-quote` path first.
5. Temporarily block public production deployment if the bootstrap route has ever been deployed and exposure cannot be ruled out.

### First 7 days

1. Repair all four path-broken health scripts and make their CI checks meaningful.
2. Create and validate an initial Prisma migration strategy against a production backup/restoration drill.
3. Add route-policy enforcement plus a public-route allowlist.
4. Make secret scanning cover all tracked files and add pre-release history scanning.
5. Add tests for P0/P1 routes and run them in CI.

### First 30 days

1. Establish bundle/API/database performance baselines and regression budgets.
2. Add centralized error reporting, structured logging, request correlation, traces, dashboards, and alerting.
3. Load-test scanner, QR validation, webhook, analytics, and export paths.
4. Review tenant scoping across all data-access paths and add automated cross-tenant negative tests.
5. Document incident response, credential rotation, data-retention, backup/restore, and production release gates.

## Validation record

| Check                          | Result                          | Notes                                                                                                      |
| ------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Working tree                   | Existing user changes preserved | Audit adds only this report.                                                                               |
| `pnpm check:secrets`           | Pass, limited                   | Scans staged files only.                                                                                   |
| `pnpm check:env`               | Pass                            | Environment manifest validation passed locally.                                                            |
| `pnpm check:security`          | 16 high/critical findings       | Live advisory lookup completed successfully.                                                               |
| `pnpm check:imports --summary` | Not reliable                    | Reported 0 files because of script-root bug.                                                               |
| `pnpm check:todos ...`         | Not reliable                    | Reported 0 files because of script-root bug.                                                               |
| `pnpm check:db-drift --schema` | Not reliable                    | Could not locate schema because of script-root bug; source inspection also found no migration directories. |
| `pnpm check:bundle --report`   | Not reliable                    | Could not locate `.next` builds because of script-root bug.                                                |

## Conclusion

GateFlow has the structure and feature coverage of a serious multi-tenant access platform. Its immediate need is not more breadth; it is **hardening, repeatable release assurance, and measured operations**. Resolve the three code-level access-control issues, repair the guardrails that currently provide false confidence, and complete the dependency/migration remediation before making further major feature investments.
