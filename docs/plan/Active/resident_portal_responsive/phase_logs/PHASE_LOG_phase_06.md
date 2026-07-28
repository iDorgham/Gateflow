# PHASE LOG — Phase 06 Auth, session, tenant containment

**Plan:** `resident_portal_responsive`  
**Date:** 2026-07-29  
**Branch:** `feat/resident-portal-phase-06`  
**App:** `apps/resident-portal`

## Goal

Unauthenticated users cannot load portal data pages; authenticated residents use
real JWT `sub` + `orgId`; JWT secret fails closed.

## What changed

- `(portal)/layout.tsx` — `redirect('/login')` when missing `sub` or org for residents
- `src/lib/session-claims.ts` — `resolveOrganizationId` (prefers `orgId`) + `requireSessionIdentity`
- `src/lib/require-portal-session.ts` — RSC helper redirects on UNAUTHORIZED / ORGANIZATION_MISSING
- Data pages — removed `dev-resident-id` / `dev-org-id`; use `requirePortalSession`
- `src/lib/jwt-secret.ts` + `auth.ts` — fail-closed secret (no insecure default)
- API notifications + push register — `resolveOrganizationId`
- Tests — `src/lib/session-claims.test.ts` (node:test); `package.json` `test` script
- `tsconfig.json` — exclude `**/*.test.ts`

## Commands

```bash
pnpm --filter resident-portal test      # 8 pass
pnpm --filter resident-portal typecheck # pass
pnpm --filter resident-portal lint      # pass
```

## Residual / external gates

- Cross-subdomain `gf_access_token` cookie sharing with CD login still unproven
  (document for Phase 10).
- History/maintenance cookie forwarding deferred to Phase 07 (layout now requires
  session for portal routes).

## Next

Phase 07 — API proxy, scannable QR, offline read.
