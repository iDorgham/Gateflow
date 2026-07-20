# PLAN: 2026 Security and Engineering Audit Remediation

**Slug:** `audit_remediation_2026`

**Status:** Active

**Created:** 2026-07-20

**Target:** Immediate P0 containment, followed by P1/P2 hardening

## Outcome

Remove verified critical attack surfaces, make tenant isolation request-safe and fail-closed, restore trustworthy repository checks, and establish measurable API security coverage.

## Audit baseline

- A deployable setup route can reset/create a tenant administrator using a fallback secret and known password hash.
- CMS HTML reaches `dangerouslySetInnerHTML` without a verified sanitization boundary; branding emits generated CSS.
- `packages/db/src/tenant.ts` uses process-global mutable tenant context, fails open, and protects only part of Prisma.
- Three repository scanners resolve `scripts/` as root and can return false-green zero-file results.
- Standard preflight excludes client/admin dashboards from type checking.
- Dependency advisory status was unavailable; API-route security test coverage is uneven.

See `CONTEXT_audit_remediation_2026.md` for evidence and source paths.

## Hard invariants

- Tenant-owned operations require `organizationId`; missing context fails closed.
- Soft-deletable reads include `deletedAt: null` unless an explicit privileged path opts out.
- Tenant context is request-local; privileged cross-tenant access is explicit and auditable.
- No production bootstrap credentials, fallback secrets, or known passwords.
- Untrusted HTML/CSS is allowlist-validated before browser sinks.
- Repository-wide checks fail on unexpected zero-file or unavailable execution.
- pnpm only; run root `pnpm preflight` without unsupported arguments.
- During implementation, update tasks/logs/session memory, not this plan.

## Non-goals

- Product features, broad UI redesign, blind dependency upgrades, or wholesale auth replacement.
- Modifying older Draft initiatives without explicit overlap reconciliation.

## Phases

| #   | Phase                                                  | Tool   | Status |
| --- | ------------------------------------------------------ | ------ | ------ |
| 1   | P0 containment: bootstrap route and browser injection  | claude | [x]    |
| 2   | Tenant isolation: request-local, complete, fail-closed | claude | [x]    |
| 3   | Trustworthy CI and repository scanners                 | gemini | [x]    |
| 4   | API hardening, coverage, and certification             | claude | [ ]    |

Dependencies: Phase 1 precedes Phases 2–3; Phase 4 follows Phases 2–3.

## Overlap reconciliation

- `security_hotfix_v1` is an older narrow Draft.
- `gateflow_readiness_market_leadership_2026` is broader and overlaps several audit items.
- Before implementation, assign one execution owner for every duplicate; historical Complete plans are evidence, not proof current controls work.

## Verification and release

- Each phase runs targeted lint, typecheck, tests, and `pnpm preflight`.
- Security changes require negative, cross-tenant, and regression tests.
- Phase 1 ships as containment without waiting for later phases.
- Use one reviewable commit per phase; never roll back to fail-open tenancy or raw HTML rendering.

## Definition of done

- All tasks are complete or have an approved owner, reason, and expiry.
- No P0/P1 finding remains reproducible.
- Concurrent tenant read/write isolation tests pass.
- Scanners report meaningful coverage; full typecheck and preflight pass.
- Backlog and lifecycle folder agree.
