# Phase log — Phase 04

**Started:** 2026-07-26
**Status:** IN PROGRESS — external comparison evidence blocked
**Product code changed:** yes — runtime health and measured login optimization

## Completed

- Added and probed a minimal unauthenticated no-store health endpoint.
- Moved the health rewrite into Next configuration so local and Vercel routing
  share the same contract.
- Migrated the security middleware to the Next 16 Proxy convention with all
  CSRF behavior retained.
- Re-enabled TypeScript validation inside production builds.
- Profiled the login route before optimization and identified the shared UI
  barrel as the largest measured unused-JavaScript source.
- Added narrow shared-UI subpath exports and migrated only the login imports.
- Remeasured three Lighthouse runs and the bundle aggregate.
- Added an app-specific bundle regression command and machine-readable packet.
- Explicitly accepted the Prisma wildcard warning with bounded rationale.

## Errors and root causes

- A sandboxed production build failed because `next/font/google` needs network
  access. Network-enabled builds pass. No vetted local Poppins/Cairo assets are
  committed, so this remains an explicit blocker.
- The first `/health` runtime probe returned 404 because the rewrite existed
  only in `vercel.json`; `next start` did not apply it. Moving the rewrite into
  `next.config.js` fixed local and hosted Next routing.
- Local Node 26 is unlike Vercel Node 24. These results support directional
  before/after conclusions only, not a local/preview parity claim.
- Authenticated P0/API/database sampling lacks a fixed dataset and approved
  role. No tenant data was queried and no budgets were invented.

## Verification so far

- Health and Proxy focused tests: 2 suites / 9 tests passed.
- Runtime configuration tests: 3/3 passed.
- Client Dashboard and shared UI typechecks passed.
- Production build passed with Proxy and enforced TypeScript validation.
- `pnpm --filter client-dashboard perf:bundle` passed at 5491/5600 KB.
- Local health returned 200 and a two-field no-store payload.
- Before/after Lighthouse packet recorded under `evidence/`.

## Blockers

1. Explicit authorization for a same-commit Vercel preview.
2. A fixed authenticated pilot dataset and non-sensitive test role.
3. Node 24 local/preview comparable samples.
4. Vetted local Poppins/Cairo assets plus English/Arabic visual verification.
5. Further measured work to bring LCP/TBT within product targets.

## Resume

Do not mark Phase 04 complete or start Phase 05. Resume with authorized preview
and fixed-dataset measurements, then run all focused gates.
