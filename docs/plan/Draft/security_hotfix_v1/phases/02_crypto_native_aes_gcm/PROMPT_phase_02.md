# Phase 02: Migrate CryptoJS to Native AES-256-GCM

## Primary role

SECURITY + PLATFORM

## Preferred tool

- Tool 1: Claude CLI
- Tool 2: Cursor

## Goal

Replace `crypto-js` usage with native Node.js `crypto` utilities and standardize encrypted field handling.

## Scope (in)

- Create `packages/utils/src/crypto.ts` with:
  - `encryptField()`
  - `decryptField()`
- Use `aes-256-gcm`, 12-byte IV, auth tag handling.
- Persist encoded form as `IV:ENC:TAG`.
- Replace `crypto-js` imports in:
  - `apps/scanner-app/src/lib/security/secure-pin.ts`
  - any other active encryption paths discovered during scan
- Remove `crypto-js` dependency usage from workspace where applicable.
- Delete `packages/types/test_qr.js`.
- Add `.gitignore` protection for similar temporary artifacts if needed.
- Add/update crypto roundtrip tests.

## Scope (out)

- No non-security behavior refactors.
- No algorithm change beyond approved AES-256-GCM migration.

## Steps

1. Implement native crypto helpers in `packages/utils/src/crypto.ts`.
2. Update scanner and related consumers to use new helper.
3. Search and remove remaining `crypto-js` imports.
4. Remove dependency entries where needed.
5. Delete `packages/types/test_qr.js`.
6. Add/update tests for encrypt/decrypt roundtrip and malformed payload handling.
7. Run verification:
   - `rg "crypto-js" apps packages`
   - `pnpm preflight`
8. Update:
   - `TASKS_security_hotfix_v1.md`
   - `phase_logs/PHASE_LOG_phase_02.md`
   - `SESSION_MEMORY.md`

## Acceptance criteria

- [ ] `encryptField` / `decryptField` implemented with native Node crypto.
- [ ] AES-256-GCM path validated with tests.
- [ ] No remaining active `crypto-js` source imports.
- [ ] `packages/types/test_qr.js` deleted.
- [ ] `pnpm preflight` passes.
