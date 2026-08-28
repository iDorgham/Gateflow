# Phase 2: Migrate CryptoJS to Native AES-256-GCM

---

## Phase 2: Migrate CryptoJS to Native AES-256-GCM

### Primary role

SECURITY

### Preferred tool

- [x] Claude CLI
- [ ] Gemini CLI
- [ ] Opencode CLI
- [ ] Kilo CLI
- [ ] Qwen CLI
- [ ] Cursor CLI
- [ ] Kiro CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard, admin-dashboard, scanner-app, marketing
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `packages/db/src/lib/crypto.ts` (existing `encryptField` / `decryptField`)

### Goal

Replace `crypto-js` usage with native Node.js `crypto` utilities by extending the existing `packages/db/src/lib/crypto.ts` helpers and standardizing encrypted field handling across consumers.

### Scope (in)

- Extend/consolidate `packages/db/src/lib/crypto.ts` (`encryptField`, `decryptField`, AES-256-GCM, 12-byte IV, auth tag).
- Preserve existing payload layout `iv:tag:encrypted` (hex segments); document in module comments; do not introduce a competing `IV:ENC:TAG` format unless migrating with a compatibility shim.
- Replace `crypto-js` imports in:
  - `apps/scanner-app/src/lib/security/secure-pin.ts`
  - any other active encryption paths discovered during scan
- Remove `crypto-js` dependency usage from workspace where applicable.
- Delete `packages/types/test_qr.js`.
- Add `.gitignore` protection for similar temporary artifacts if needed.
- Add/update crypto roundtrip tests.

### Scope (out)

- No non-security behavior refactors.
- No algorithm change beyond approved AES-256-GCM migration.
- No new `packages/utils/src/crypto.ts` module.

### Steps (ordered)

1. Review and extend `packages/db/src/lib/crypto.ts`; confirm `iv:tag:encrypted` roundtrip behavior.
2. Update scanner and related consumers to import from `@gate-access/db` (or existing package export path).
3. Search and remove remaining `crypto-js` imports (`rg "crypto-js" apps packages`).
4. Remove dependency entries where needed.
5. Delete `packages/types/test_qr.js`.
6. Add/update tests for encrypt/decrypt roundtrip and malformed payload handling.
7. Run `pnpm preflight`.
8. Update `TASKS_security_hotfix_v1.md`, `phase_logs/PHASE_LOG_phase_02.md`, and `SESSION_MEMORY.md`.

### Acceptance criteria

- [ ] `encryptField` / `decryptField` consolidated in `packages/db/src/lib/crypto.ts` using native Node crypto.
- [ ] Payload format remains `iv:tag:encrypted` (documented); no silent format drift.
- [ ] AES-256-GCM path validated with tests.
- [ ] No remaining active `crypto-js` source imports.
- [ ] `packages/types/test_qr.js` deleted.
- [ ] `pnpm preflight` passes; if preflight fails, stop and remediate before marking phase complete.
- [ ] Phase log updated with pass/fail criteria (include preflight failure remediation notes when applicable).
