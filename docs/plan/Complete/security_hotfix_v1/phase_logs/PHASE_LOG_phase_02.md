# Phase Log: Phase 02 — Migrate CryptoJS to Native AES-256-GCM

**Plan:** `security_hotfix_v1`  
**Date:** 2026-08-28  
**Status:** Completed 🟢

---

## 1. Objectives

- Replace `crypto-js` usage across the monorepo with native Node.js `crypto` utilities (`createCipheriv`, `createDecipheriv`, `createHmac`, `createHash`, `timingSafeEqual`).
- Consolidate and document the standard `iv:tag:encrypted` (hex segments) field-level encryption format in `packages/db/src/lib/crypto.ts`.
- Eliminate `crypto-js` dependencies and imports from `packages/types`, `packages/db`, and `apps/client-dashboard`.
- Remove temporary test artifacts (`packages/types/test_qr.js`) and ensure `.gitignore` excludes them.
- Validate cryptographic operations with full test coverage (signing, verification, encryption, decryption, tamper resistance).

---

## 2. Changes Made

1. **`packages/db/src/lib/crypto.ts`**:
   - Documented the exact `iv:tag:encrypted` payload format (12-byte IV / 24 hex, 16-byte tag / 32 hex, ciphertext hex).
   - Cleaned up type handling in `decryptField` using native Buffer methods.
   - Added unit test suite `packages/db/src/lib/crypto.test.ts` covering roundtrip, null/empty handling, and tamper detection.

2. **`packages/db/src/lib/relational-chain-seed.ts`**:
   - Replaced `CryptoJS.SHA256` with native Node.js `createHash('sha256')`.

3. **`packages/types/src/qr-signing.ts`**:
   - Replaced `CryptoJS.HmacSHA256` with native `createHmac('sha256', secret)`.
   - Replaced `CryptoJS.enc.Base64` with native `Buffer.from(..., 'utf8').toString('base64url')` and `Buffer.from(..., 'base64url').toString('utf8')`.
   - Replaced custom constant-time loop with native `timingSafeEqual`.
   - Added unit test suite `packages/types/src/qr-signing.test.ts` (100% pass).

4. **Dependency Cleanup**:
   - Removed `crypto-js` and `@types/crypto-js` from `packages/types/package.json`.
   - Removed `crypto-js` and `@types/crypto-js` from `packages/db/package.json`.
   - Removed `crypto-js` and `@types/crypto-js` from `apps/client-dashboard/package.json`.

5. **Artifacts & Git Hygiene**:
   - Confirmed `packages/types/test_qr.js` is absent.
   - Verified `.gitignore` contains `test_qr.js` and `test_qr.ts`.

---

## 3. Verification

- **Types Test Suite**:
  - `pnpm --filter=@gate-access/types test` (5/5 suites, 44/44 tests passing)
- **Typecheck**:
  - `pnpm --filter=@gate-access/types typecheck` (Passed, 0 errors)
  - `pnpm --filter=@gate-access/db typecheck` (Passed, 0 errors)
  - `pnpm --filter=client-dashboard typecheck` (Passed, 0 errors)

---

## 4. Next Action

Proceed to Phase 3: Enforce HTTP Security Headers in Next.js Apps (`/dev security_hotfix_v1 3`).
