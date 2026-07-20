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
- Added CI guard: `scripts/check/check-bootstrap-routes.js` + `pnpm check:bootstrap-routes` in `preflight`.

## Verification

```bash
node scripts/check/check-bootstrap-routes.js   # clean
pnpm turbo test --filter=client-dashboard --filter=marketing --filter=admin-dashboard --filter=@gate-access/types  # pass
pnpm preflight                                   # pass
```

Forbidden string scan: no `gateflow-setup-2026` or `api/setup/reset-admin` under `apps/`. Dev-only `password123` remains in local prisma/seed utilities (not deployable HTTP surface).

## Operational follow-up (non-code)

- **Credential rotation:** Rotate `SETUP_SECRET` (if ever set in env), seeded admin password, and any JWT/session secrets for environments where reset-admin may have been deployed. Record receipt in approved ops system (not in repo).

## Notes

- No local-only interactive bootstrap CLI added — route removal accepted; use existing `packages/db` seed/prisma scripts with `SEED_PASSWORD` for dev.
- Phase 2+: tenant isolation per plan.
