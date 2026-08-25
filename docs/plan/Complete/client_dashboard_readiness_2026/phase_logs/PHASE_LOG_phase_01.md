# Phase log — Phase 01

**Date:** 2026-07-25
**Status:** COMPLETE
**Product code changed:** yes — focused test-first security containment

## Work completed

- Reconciled single-writer ownership across the three overlapping plans.
- Verified exact source/build parity: 44 pages (43 production-intended plus one
  test fixture), 123 API routes, and 170 exported handlers.
- Mapped all nine pilot outcomes and identified two contract gaps.
- Reproduced and manually dispositioned all 72 current tenant-scan findings.
- Confirmed GF-CD-SEC-001 and GF-CD-SEC-002.
- Added red tests proving both findings, then contained scan denial and both
  contact create/update relation paths.
- Method-level review confirmed GF-CD-SEC-003 through GF-CD-SEC-008.
- Activated API CSRF enforcement with a same-origin compatibility bridge and
  focused matcher/behavior tests.
- Disabled the orphan unauthenticated resident push primitive with HTTP 410.
- Scoped AI feedback by tenant/user and made it single-write.
- Replaced caller-controlled AI execution with stored-intent validation,
  permission mapping, tenant-owned targets, and compare-and-set action claims.
- Replaced raw resident-arrival QR authority with a short-lived HMAC capability,
  a fresh-scan requirement, request throttling, and atomic notification claim.
- Added signed webhook event IDs and ±5-minute freshness for Perimeter and
  WhatsApp. Provider/org/event replay is serialized with a PostgreSQL advisory
  transaction lock, and the durable AuditLog marker commits or rolls back with
  business writes.
- Reconciled the final method-level API register: 170 rows, 170 unique keys,
  zero `needs-review`, nine contained finding rows, and five explicit
  lower-severity gaps assigned to Phase 02/P2.

## Errors and root causes

- Audit count was 73; current scan is 72. Root cause is source/input-set drift;
  no candidate was discarded.
- Org-less claims are accepted by the scan-denial tenant check.
- Contact ownership is checked, but ownership of caller-supplied related units
  is not checked before relation insertion.
- API CSRF logic exists but the middleware matcher excludes API paths.
- Push and AI action methods have missing authenticity/tenant ownership.
- Signed webhook timestamps are authenticated but not freshness-checked.
- A pre-processing replay marker would suppress legitimate retries after
  downstream failure. The marker now follows successful work within the same
  transaction; external emit/push work happens only after commit.
- The remembered `pnpm scope:diff-check` and `pnpm diff:check` shorthands do not
  exist in the root package. The authoritative equivalents are
  `node scripts/workflow-v2/support-cli.js scope-diff client-dashboard --json`
  and `git diff --check`; both passed.

## Commands/evidence

- `pnpm workflow:v2 status --json`
- `pnpm workflow:v2 transition developing`
- Workflow single-writer lock acquired for this phase
- Static source/build-manifest inventory
- Deterministic tenant scan plus manual source review
- `evidence/PHASE_01_ROUTE_API_INVENTORY.md`
- `evidence/PHASE_01_SECURITY_CLASSIFICATION.md`
- `evidence/PHASE_01_PILOT_AND_OWNERSHIP.md`
- `evidence/PHASE_01_API_CONTROL_MATRIX.md`
- `node scripts/audit/client-dashboard-api-control-matrix.mjs --write`
- Targeted red run: three suites reproduced the three vulnerable paths
- Targeted green run: 3 suites, 17 tests passed

## Verification

- Lint passed with the existing 282-warning baseline.
- Typecheck passed.
- Full tests passed: 59 suites, 331 tests; 1 suite and 25 tests skipped.
- Build passed after network access allowed Google Font fetches.
- Known debt remains: Jest `--forceExit`, Next middleware deprecation, and
  Prisma CommonJS wildcard warning.
- Latest batch: 2 focused suites/8 tests passed; full run passed 61 suites and
  339 tests, with 1 suite/25 tests skipped. Lint, typecheck, and build passed.
- AI batch: 2 focused suites/5 tests passed; full run passed 63 suites and 344
  tests, with 1 suite/25 tests skipped. Lint warnings fell from 282 to 278;
  typecheck and build passed.
- Arrival batch: red tests first, then 2 focused suites/16 tests passed. Full
  run passed 64 suites and 353 tests, with 1 suite/25 tests skipped. Lint passed
  at the 278-warning baseline after removing a touched-file warning; typecheck
  and build passed. The build needed network access for configured Google Fonts
  and retains the known middleware and Prisma CommonJS warnings.
- Webhook batch: red tests reproduced stale acceptance and the missing replay
  primitive. Three focused suites/15 tests passed, covering timestamp skew,
  event-ID tampering, durable duplicates, and failure-without-marker behavior.
  Full run passed 66 suites and 363 tests, with 1 suite/25 tests skipped. Lint
  returned to 278 warnings, typecheck passed, and the network-enabled production
  build passed with the known middleware and Prisma warnings.

## Phase decision

Phase 01 acceptance is green. Continue with Phase 02 security/data invariants;
the plan remains in Draft because `/dev` lifecycle automation only promotes
plans from Ready to Active.
