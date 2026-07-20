# Phase 1 log — P0 containment

**Date:** 2026-07-20  
**Branch:** `fix/audit-remediation-phase-1`

## Changes

- Removed deployable `apps/client-dashboard/src/app/api/setup/reset-admin/route.ts` (GET bootstrap with default `SETUP_SECRET` fallback and embedded admin hash).
- Added `@gate-access/types` security module:
  - `sanitizeCmsHtml` / `sanitizeBlogHtmlFields` (xss allowlist) at CMS write + marketing render.
  - `filterValidBrandingTokens` / `generateBrandingCss` for branding CSS sinks.
- Wired sanitization: admin CMS blog PATCH, marketing blog render, admin style save + `BrandingStyles`.
- Added regression tests: `packages/types/src/security/security.test.ts`, admin blog PATCH test, branding CSS tests, client-dashboard bootstrap route absence test.
- Added CI guard: `scripts/check/check-bootstrap-routes.js` + `pnpm check:bootstrap-routes` in `preflight` and CI Security Scan.

## Verification

```bash
node scripts/check/check-bootstrap-routes.js   # clean
pnpm turbo test --filter=client-dashboard --filter=marketing --filter=admin-dashboard --filter=@gate-access/types  # pass
pnpm preflight                                   # pass (excludes admin/client dashboard typecheck — see Residual Risks)
```

**Dashboard lint/typecheck (acceptance):** not recorded as green in this phase log. Root `preflight` / CI typecheck intentionally exclude `admin-dashboard` and `client-dashboard` (`--filter=!admin-dashboard --filter=!client-dashboard`). Treat dashboard typecheck as incomplete for phase-1 acceptance until Phase 3 ratchet or explicit local `pnpm turbo typecheck --filter=admin-dashboard --filter=client-dashboard` is logged.

Forbidden string scan: no `gateflow-setup-2026` or `api/setup/reset-admin` under `apps/`. Dev-only `password123` remains in local prisma/seed utilities (not deployable HTTP surface).

## Operational follow-up (non-code)

- **Credential rotation:** **Pending.** Rotate `SETUP_SECRET` (if ever set in env), seeded admin password, and any JWT/session secrets for environments where reset-admin may have been deployed.
- **Receipt:** Record non-sensitive completion evidence in the approved ops system (not in repo).
- **Owner:** Ops / repo owner (pending assignment confirmation).
- **Target expiry:** Complete before Phase 2 merge to production-facing environments (or document dated waiver).

## Notes

- No local-only interactive bootstrap CLI added — route removal accepted; use existing `packages/db` seed/prisma scripts with `SEED_PASSWORD` for dev.
- Phase 2+: tenant isolation per plan.

## Residual Risks

- Dashboard typecheck still excluded from `pnpm preflight` and CI typecheck job; regressions in admin/client types may not fail the phase-1 gate.
- Dependency advisory status / full `check:security:fail` posture remains a Phase 3 concern; not re-certified here beyond bootstrap-route + secrets scans.
- Credential rotation receipt not yet recorded — treat secrets as potentially compromised until receipt exists.
- Intentional `password123` in local seed utilities can confuse naive whole-tree scans; deployable-surface scans remain the source of truth.

## Rollback / Containment

1. **Code rollback:** Do not revert to a revision that restores `api/setup/reset-admin`; use a forward-fix or containment patch that preserves route removal. If a full revert is unavoidable, immediately re-apply the route-removal commit and confirm CI `check:bootstrap-routes` passes on the deployed revision.
2. **Containment if route was ever live:** Immediately rotate `SETUP_SECRET`, admin passwords, and session/JWT secrets; invalidate sessions; confirm CI `check:bootstrap-routes` and `check:secrets` pass on the deployed revision.
3. **Sanitizer rollback:** If CMS/branding sanitization blocks legitimate content, tighten allowlists via `@gate-access/types` security helpers rather than removing sanitization at trust boundaries.
