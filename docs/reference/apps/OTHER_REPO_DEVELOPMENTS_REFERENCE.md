# Other Repository Developments Reference

This document captures important developments in the repo outside the four requested focus areas (design system, marketing app, client dashboard, admin dashboard). It is intended as planning context for AI tools.

## Scope

Included here:

- workspace-wide automation and governance,
- shared packages and platform architecture,
- mobile and resident surfaces,
- security and performance initiatives,
- CI/CD and deployment evolution.

Not duplicated here:

- app-specific details already covered in dedicated app reference docs.

## Workspace and Platform Evolution

Major cross-repo progress from `CHANGELOG.md` and workspace docs:

- Platform evolution initiatives are actively staged in `docs/plan/Active/platform_evolution`.
- Plan lifecycle automation is mature (`plan:new` to `plan:done` workflow ecosystem).
- Changelog/plan/documentation automation has been expanded and normalized.
- Routing stabilization and theme/locale synchronization work has been applied across dashboards.

## Automation and Developer Infrastructure

Implemented and documented in changelog/script ecosystem:

- Ralph automation system with many scripts, quality checks, and hooks.
- Pre-commit/commit/push safeguards:
  - conventional commit enforcement,
  - lint-staged enforcement,
  - secret scanning,
  - branch validation.
- Docs and release automation:
  - changelog lifecycle,
  - release tagging,
  - docs indexing/consistency checks.
- CI hardening:
  - cache/action updates,
  - stale action remediation,
  - workflow stability improvements.

## Shared Packages and Core Architecture

Monorepo package layer (from root architecture docs and package trees):

- `packages/db`: Prisma schema, migrations, client generation and data access.
- `packages/types`: shared type contracts for cross-app consistency.
- `packages/ui`: shared UI component + token system.
- `packages/i18n`: localization resources and EN/AR support.
- `packages/api-client`: shared API communication utilities.
- `packages/config`: centralized lint/type config standards.

## Mobile and Resident Product Surfaces

Non-dashboard app areas with major progress signals:

- `apps/scanner-app`:
  - offline and field-operation related foundations continue to evolve,
  - biometric and shift-log foundational work is referenced in changelog.
- `apps/resident-mobile`:
  - one-tap invite initiative completed,
  - express invite flow enhancements shipped.
- `apps/resident-portal`:
  - responsive layout and portal improvements are referenced in changelog.

## Security and Data Integrity Developments

Cross-cutting progress areas:

- Multi-tenant isolation hardening and verification phases completed.
- Organization scoping and security controls strengthened across key domains.
- QR security invariants reinforced with HMAC-SHA256 signing patterns.
- CodeQL/security pipeline issues resolved over multiple updates.
- Migration and DB drift reliability work completed in CI and runtime contexts.

## AI and Intelligence Layer Developments

Repo-wide AI-related progress:

- AI SDK migration efforts (including v6 streams) across assistants.
- Admin and client AI assistant surfaces expanded and refined.
- UI message and assistant rendering improvements were delivered in multiple phases.
- AI-oriented task generation and report routes exist in app API surfaces.

## Performance and Reliability Work

Notable non-app-specific progress:

- Lighthouse/performance initiatives established and iterated.
- Build and type-check stability fixes were repeatedly applied across apps.
- Dependency alignment and override fixes reduced transitive instability.
- CI workflows improved for faster and more predictable verification.

## Current Planning Inputs (Recommended Source Set)

For future AI planning context, include:

- `CHANGELOG.md`
- `README.md`
- `docs/reference/architecture/ARCHITECTURE.md`
- `docs/reference/architecture/PROJECT_STRUCTURE.md`
- `docs/reference/product/PRD.md`
- `docs/reference/product/UPCOMING.md`
- `docs/plan/Active/platform_evolution/*`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

## Practical Guidance for AI Planning Tools

- Use app reference docs for domain specifics and route/menu/API contracts.
- Use this file for cross-cutting constraints, shared infra, and repo trajectory.
- Preserve these invariants in all plans:
  - multi-tenant safety and soft-delete discipline,
  - AR/EN + RTL parity,
  - tokenized design consistency,
  - QR signing and secure auth/token handling.
