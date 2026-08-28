# Tasks — security_hotfix_v1

## Phase 1: Enforce auth and tenant scoping for scans bulk API

- [x] Add auth guard to `apps/client-dashboard/src/app/api/scans/bulk/route.ts`
- [x] Enforce scans write permission (roles with write access: `Gate Operator`, `Security Manager` per `BUILT_IN_ROLES` in `packages/types/src/user.ts`)
- [x] Scope all writes using session `organizationId`
- [x] Validate payload shape and max size (`<= 500`)
- [x] Use `createMany({ skipDuplicates: true })` safely
- [x] Return explicit `401`, `400`, `201` status handling
- [x] Add or update tests for auth failure and tenant scope behavior
- [x] Update `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Migrate CryptoJS to native AES-256-GCM

- [x] Extend/consolidate `packages/db/src/lib/crypto.ts` (`encryptField` / `decryptField`, AES-256-GCM)
- [x] Preserve existing payload layout `iv:tag:encrypted` (hex segments); do not introduce a competing format without a compatibility shim
- [x] Replace `crypto-js` usage in scanner security and related encryption paths
- [x] Remove `crypto-js` dependency from workspace where present
- [x] Delete `packages/types/test_qr.js`
- [x] Ensure `.gitignore` excludes future test artifact recreation
- [x] Add or update tests for encryption/decryption roundtrip
- [x] Update `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Enforce HTTP security headers in Next.js apps

- [x] Add `async headers()` in each target `next.config.js`
- [x] Apply HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP
- [x] Tune CSP for required analytics/domains without unsafe broad allowances
- [x] Validate headers in local runtime (`curl -I` / test suite)
- [x] Update `phase_logs/PHASE_LOG_phase_03.md`

## Final

- [x] `pnpm preflight` / test suites pass after all phases
- [x] No `crypto-js` imports remain in app/package source
- [x] Plan logs and session memory are up to date
