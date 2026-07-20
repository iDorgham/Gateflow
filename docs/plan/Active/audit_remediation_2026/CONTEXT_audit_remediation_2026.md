# Context — audit_remediation_2026

## Verified source locations

- Reset route: `apps/client-dashboard/src/app/api/setup/reset-admin/route.ts`
- Tenant context: `packages/db/src/tenant.ts`
- CMS sink: `apps/marketing/app/[locale]/blog/[slug]/page.tsx`
- Branding CSS sink: `apps/admin-dashboard/src/components/branding/BrandingStyles.tsx`
- Scanners: `scripts/check/check-imports.js`, `scripts/check/todos.js`, `scripts/check/scan-secrets.js`
- Orchestration: root `package.json`, `turbo.json`, and CI workflows

## Evidence

- Scanner root used `path.resolve(__dirname, '..')` from `scripts/check`, resolving to `scripts/`.
- Import and TODO checks returned success after scanning zero files.
- Secret `--all` output did not demonstrate trustworthy repository coverage.
- Dependency advisory lookup was unavailable, so dependency status is unknown.
- Preflight passed while excluding client/admin from its typecheck command.
- Route-test file count was materially lower than API-route file count; this is a prioritization signal, not a coverage percentage.

## Must verify during execution

- Whether the reset route was deployed/invoked; whether upstream CMS sanitization exists.
- Tenant-model/operation inventory and legitimate global-admin exceptions.
- Existing external dependency/history-secret CI and hosting support for staged PostgreSQL RLS.

Sensitive rotation/log/incident evidence stays in the approved operational system; record only a non-sensitive receipt here.

## Related plans

- `docs/plan/Draft/security_hotfix_v1/`
- `docs/plan/Draft/gateflow_readiness_market_leadership_2026/`
- Historical: `docs/plan/Complete/github_security_hardening/`, `docs/plan/Complete/security_isolation_fix/`
