# Tasks — GateFlow Readiness and Egypt/MENA Market Leadership

## Phase 0

- [ ] Assign DRI and due date to every P0/P1 audit finding.
- [ ] Freeze production feature releases or publish an explicit exception.
- [ ] Confirm reset-admin endpoint deployment exposure and preserve relevant logs.
- [ ] Record current CI, advisory, environment, and migration evidence.

## Phase 1

- [ ] Remove reset-admin route and rotate exposed credentials/secrets.
- [ ] Make AI cron authentication fail closed and idempotent.
- [ ] Add permission enforcement to workspace deletion.
- [ ] Add route-level regression tests and security review.

## Phase 2

- [ ] Fix guard-script repository root resolution.
- [ ] Add non-zero scan regression checks.
- [ ] Enforce trustworthy CI and deploy gates.
- [ ] Expand secret/dependency governance.

## Release train (spans Phases 1–5)

- [ ] Define SemVer decision table and release-owner/rollback-owner responsibilities.
- [ ] Require clean release commit, changelog validation, approved release candidate, and post-deploy evidence before tagging.
- [ ] Use `pnpm version:bump <major|minor|patch>` only after approval; use `pnpm version:tag` only after all release gates pass.
- [ ] Verify generated GitHub Release, tag, deployment health, and rollback path after release.

## Phase 3

- [ ] Establish baseline Prisma migration and rollback drill.
- [ ] Deliver data inventory, retention, and privacy readiness pack.
- [ ] Expand tenant isolation tests.

## Phase 4

- [ ] Establish bundle/API/database baselines and SLOs.
- [ ] Add observability and alerting.
- [ ] Complete peak-load and offline-sync reliability tests.

## Phase 5 — Dashboard analytics and security intelligence

- [ ] Define a decision map and KPI dictionary for security, gate operations, tenant health, and pilot outcomes.
- [ ] Build tenant-safe aggregation contracts, indexes, filters, drill-downs, and data-quality states.
- [ ] Implement responsive, RTL, accessible high-density charts with table/text fallbacks.
- [ ] Measure dashboard/API/chart performance and add regression coverage.

## Phases 6–7

- [ ] Recruit and scope Egyptian design partners.
- [ ] Ship the compound/contractor/offline differentiation set.
- [ ] Certify first integration partner.
- [ ] Validate GCC expansion readiness before market entry.
