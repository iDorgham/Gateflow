# Tasks — security_hotfix_v1

## Phase 1: Enforce auth and tenant scoping for scans bulk API

- [ ] Add auth guard to `apps/client-dashboard/src/app/api/scans/bulk/route.ts`
- [ ] Enforce allowed roles: `scanner_app` or `property_manager`
- [ ] Scope all writes using session `organizationId`
- [ ] Validate payload shape and max size (`<= 500`)
- [ ] Use `createMany({ skipDuplicates: true })` safely
- [ ] Return explicit `401`, `400`, `201` status handling
- [ ] Add or update tests for auth failure and tenant scope behavior
- [ ] Update `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Migrate CryptoJS to native AES-256-GCM

- [ ] Create `packages/utils/src/crypto.ts` with `encryptField` and `decryptField`
- [ ] Use AES-256-GCM with 12-byte IV and auth tag (`IV:ENC:TAG`)
- [ ] Replace `crypto-js` usage in scanner security and related encryption paths
- [ ] Remove `crypto-js` dependency from workspace where present
- [ ] Delete `packages/types/test_qr.js`
- [ ] Ensure `.gitignore` excludes future test artifact recreation
- [ ] Add or update tests for encryption/decryption roundtrip
- [ ] Update `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Enforce HTTP security headers in Next.js apps

- [ ] Add `async headers()` in each target `next.config.js`
- [ ] Apply HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP
- [ ] Tune CSP for required analytics/domains without unsafe broad allowances
- [ ] Validate headers in local runtime (`curl -I`)
- [ ] Update `phase_logs/PHASE_LOG_phase_03.md`

## Final

- [ ] `pnpm preflight` passes after all phases
- [ ] No `crypto-js` imports remain in app/package source
- [ ] Plan logs and session memory are up to date
