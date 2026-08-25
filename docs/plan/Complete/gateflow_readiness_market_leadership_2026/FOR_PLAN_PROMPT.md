# Plan Handoff Prompt — GateFlow Readiness and Egypt/MENA Market Leadership

## Mission

Create an executable, risk-first phased implementation plan that makes GateFlow safe and repeatably deployable before the next feature phase, then establishes an Egypt-first product and partner path toward broader MENA access-security leadership. Treat the deep-audit P0/P1 findings as release blockers, not backlog candidates.

## In scope

- Remove the reset-admin bootstrap attack path; rotate affected credentials/secrets and document exposure response.
- Make cron authentication fail closed; require idempotency, authorization, and regression coverage.
- Protect workspace deletion and every high-risk route with explicit permission policy, tenant scope, validation, rate limiting/audit decisions as applicable.
- Repair CI scripts that resolve `scripts/` rather than repository root and therefore scan zero files/builds.
- Resolve critical/high dependency advisories through a tested upgrade plan.
- Establish semantic versioning, release-candidate, changelog, annotated-tag, GitHub Release, rollback, and post-release verification rules. Do not create a release tag merely because a plan phase completed.
- Establish Prisma migration, backup/restore, data retention, privacy readiness, tenant-isolation, performance, observability, and release-evidence controls.
- Improve operational dashboards with decision-first charts, tenant-safe aggregation, RTL/accessibility, mobile responsiveness, data-quality states, drill-down paths, and performance budgets.
- Define/validate the Egypt paid-pilot wedge and GCC expansion gates; do not make unverified market or compliance claims.

## Out of scope

- Feature expansion unrelated to readiness, the pilot wedge, or required platform reliability.
- Production schema changes before a staging restore/migration/rollback drill.
- International rollout before Egypt pilots, partner support, country-specific legal review, and enterprise readiness gates.

## Users and constraints

- Users: security/facility operators, guards, residents, visitors, contractors, Egyptian integrators, and GateFlow operations/admin teams.
- Apps likely touched: `apps/client-dashboard`, `apps/admin-dashboard`, `apps/scanner-app`, `apps/resident-mobile`, `apps/resident-portal`, `apps/marketing`.
- Packages likely touched: `packages/db`, `packages/types`, `packages/api-client`, `packages/ui`, `packages/config`.
- Required invariants: pnpm only; `organizationId` on tenant data; `deletedAt: null`; QR HMAC signing; no secrets in Git; `DIRECT_DATABASE_URL` for Prisma migration work; Arabic/English and offline scanner behavior where user-facing flows change.

## Definition of done

- P0/P1 acceptance tests pass and regression tests are added before behavior changes.
- CI has trustworthy non-zero scans/build measurements, pre-deploy gates, and dependency/secret policies.
- Migration and backup/restore runbooks are verified in staging.
- Performance SLOs and observability baseline exist for QR validation, scans, offline sync, webhooks, exports, and critical dashboard APIs.
- Every phase has a DRI, files to inspect, explicit acceptance criteria, validation commands, rollback plan, phase log, and session-memory handoff.
- `pnpm preflight`, security, migration, bundle, environment, secret, and deploy checks are executed only after their reliability is established; failures remain blockers.
- Version/tag decisions follow SemVer, approved changelog, clean release commit, and post-deployment verification. Each chart has a named decision, data owner, time grain/timezone, access policy, empty/error state, and non-chart fallback.

## Suggested phases

1. Release hold and evidence baseline.
2. P0 security remediation.
3. CI, dependency, quality, and deploy gate repair.
4. Database migration, privacy, and tenant-isolation foundation.
5. Reliability, performance, and observability.
6. Dashboard analytics and security intelligence.
7. Egypt pilot wedge and integration enablement.
8. GCC/MENA expansion readiness.

## References

- `DRAFT_gateflow_readiness_market_leadership_2026.md`
- `README.md`
- `TASKS.md`
- `../../../audits/GATEFLOW_DEEP_AUDIT_2026-07-16.md`
- `docs/guides/SECURITY_OVERVIEW.md`
- `docs/development/PLAN_LIFECYCLE.md`

```text
/plan gateflow_readiness_market_leadership_2026
```
