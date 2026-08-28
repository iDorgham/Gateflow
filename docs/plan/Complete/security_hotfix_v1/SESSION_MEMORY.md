# Session Memory — security_hotfix_v1

> Load first in every `/dev` session for this plan.

## Active State

- **Phase:** All 3 phases completed 🟢
- **Branch:** current workspace branch
- **Last commit:** n/a
- **Next action:** Plan complete — promote to `Complete/security_hotfix_v1`

## Cross-Session Decisions

| Phase      | Decision                                                              | Why                                                                 | Still valid? |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------ |
| Plan setup | Keep exactly 3 phases aligned with hotfix scope                       | Fast, isolated security release                                     | Yes          |
| Plan setup | Use canonical `phases/NN_`\* prompt layout                            | `/dev` resolves modern prompt layout first                          | Yes          |
| Phase 01   | Enforce max 500 in `BulkScanRequestSchema`                            | Reject unbounded memory/DB payloads at validation layer             | Yes          |
| Phase 01   | Return 201 Created on bulk sync success                               | Strict HTTP REST semantic compliance                                | Yes          |
| Phase 01   | Add `skipDuplicates: true` on `createMany`                            | Idempotency resilience for concurrent syncs                         | Yes          |
| Phase 02   | Use native Node.js crypto in `packages/types` & `packages/db`         | Eliminate `crypto-js` dependencies and improve performance/security | Yes          |
| Phase 02   | Maintain `iv:tag:encrypted` layout in `packages/db/src/lib/crypto.ts` | Complete backward compatibility with CRM/DB PII encryption          | Yes          |
| Phase 03   | Centralize baseline headers in `packages/config/security-headers.js`  | Single source of truth for HSTS, CSP, X-Frame-Options, nosniff      | Yes          |

## Discovered Gotchas

- `client-dashboard` test script runs both Jest and `node --test scripts/*.test.mjs`. To run focused jest test files without triggering node runner, use `pnpm --filter=client-dashboard exec jest <path>`.

## State Handoff

- **Files created/updated in Phase 3:**
  - `packages/config/security-headers.js` (verified CSP, HSTS, X-Frame-Options, Referrer-Policy, nosniff)
  - `apps/client-dashboard/next.config.js` (headers applied)
  - `apps/admin-dashboard/next.config.js` (headers applied)
  - `apps/resident-portal/next.config.js` (headers applied)
  - `apps/marketing/next.config.js` (headers applied)
  - `phase_logs/PHASE_LOG_phase_03.md`
- **Tests:** 100% passing across `@gate-access/types` (44/44), `client-dashboard` (656/656), `scripts/check/__tests__/api-security-guards.test.js` (7/7).
- **Blockers:** none
- **Resume from:** Plan complete. All acceptance criteria satisfied.
