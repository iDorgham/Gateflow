# Pro Prompt Template — Phase 1: Security & Signing Foundation

This phase implements the cryptographic foundation for the "One-Tap" invitation experience.

---

## Phase 1: Security & Signing Foundation

### Primary role

ARCHITECTURE | SECURITY | BACKEND-Database

### Preferred tool

- [x] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (api), resident-mobile
- **Packages**: db, types
- **Rules**: pnpm only; multi-tenant (`organizationId`); HMAC-SHA256 signature
- **Refs**: `CLAUDE.md`, `packages/db/src/tenant.ts`, `docs/development/initiatives/IDEA_resident_mobile_one_tap.md`

### Goal

Implement a resilient, shared utility for HMAC-SHA256 signing of invitations to be used across the monorepo.

### Scope (in)

- Create `packages/db/src/security.ts` with explicit `createSecureInviteSignature` and `verifySecureInviteSignature` functions.
- Use `crypto.createHmac` for signing.
- Add unit tests in `packages/db/src/security.test.ts`.
- Ensure signatures are URL-safe.

### Scope (out)

- API route implementation (Phase 2).
- UI/Mobile modifications (Phase 3).

### Steps (ordered)

1. Create `packages/db/src/security.ts` with:
   - `createSecureInviteSignature(payload: string, secret: string): string`
   - `verifySecureInviteSignature(payload: string, signature: string, secret: string): boolean`
2. Create `packages/db/src/security.test.ts` focusing on:
   - Signature correctness.
   - Tamper-proofing (altering payload fails verification).
   - Secret-proofing (altering secret fails verification).
3. Export new security functions from `packages/db/src/index.ts`.
4. Run `pnpm turbo lint --filter=@gate-access/db`, `pnpm turbo typecheck --filter=@gate-access/db`, and `pnpm turbo test --filter=@gate-access/db`.
5. After phase passes: git commit -m "feat(security): implement hmac-sha256 signature utility for invites"

### Acceptance criteria

- [ ] HMAC-SHA256 utility exists and is exported.
- [ ] Signatures are cryptographically secure and URL-safe.
- [ ] Unit tests pass with 100% coverage for the security module.
- [ ] `pnpm turbo lint --filter=@gate-access/db` passes.
- [ ] `pnpm turbo typecheck --filter=@gate-access/db` passes.
- [ ] `pnpm turbo test --filter=@gate-access/db` passes.

### Files likely touched

- `packages/db/src/security.ts`
- `packages/db/src/security.test.ts`
- `packages/db/src/index.ts`

### Adversarial Review (Mandatory for High-Risk)

**Trigger**: This phase involves Security Invariants.

1. **Invoke Adversary**: Use a second model (Gemini/Opencode) as an "Adversary."
2. **Challenge**: "Analyze the code for edge cases, race conditions, or security bypasses. Attempt to break my implementation."
3. **Loop**: Self-correct before git commit.
4. **Verification**: State total corrected flaws in walkthrough.
