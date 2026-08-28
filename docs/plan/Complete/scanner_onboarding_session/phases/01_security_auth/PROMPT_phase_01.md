# Phase 1: Biometric Security, Secure PIN Vault & Fail-Closed Invariants

---

## Phase 1: Biometric Security, Secure PIN Vault & Fail-Closed Invariants

### Primary role

MOBILE / SECURITY

### Preferred tool

- [x] Cursor IDE — UI/visual iteration & security implementation
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: `apps/scanner-app` (Expo SDK 57 / React Native)
- **Security Invariant**: Fail-closed biometrics. If biometric hardware is un-enrolled or unsupported, the app MUST enforce a 6-digit salted PIN vault in `expo-secure-store`.
- **Refs**: [`docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md)

### Goal

Implement the foundational biometric authentication service with fail-closed PIN fallback and rate-limited PIN vault in `apps/scanner-app`.

### Scope (in)

- `BiometricAuthService` wrapping `expo-local-authentication` (`hasHardwareAsync`, `isEnrolledAsync`, `authenticateAsync`).
- `SecurePINVault` storing salted SHA-256 PIN hashes in `expo-secure-store`.
- Exponential lockout throttling (30s after 3 failed attempts, 5m after 5 attempts).
- Fail-closed validation for `EXPO_PUBLIC_QR_SECRET`.
- Unit tests for biometric detection, PIN hashing, attempt locking, and secret validation.

### Scope (out)

- Onboarding wizard UI screens (Phase 2).
- Shift clock-in API routes (Phase 3).

### Steps (ordered)

1. Implement `src/lib/security/biometric-auth.ts` wrapping `expo-local-authentication`.
2. Implement `src/lib/security/secure-pin-vault.ts` with salt generation, SHA-256 hashing, and lockout timers.
3. Add fail-closed validation for `EXPO_PUBLIC_QR_SECRET` in QR verification service.
4. Write unit tests in `src/lib/security/biometric-auth.test.ts` and `secure-pin-vault.test.ts`.
5. Run `pnpm --filter scanner-app test`.
6. Run `pnpm turbo typecheck --filter=scanner-app`.
7. Create `docs/plan/Draft/scanner_onboarding_session/phase_logs/PHASE_LOG_phase_01.md`.
8. Commit: `git commit -m "feat(scanner-app): implement biometric auth and secure pin vault"`

### Acceptance criteria

- [ ] `BiometricAuthService` detects FaceID, TouchID, and Fingerprint capabilities.
- [ ] When biometrics fail or are missing, PIN fallback is required and enforced.
- [ ] PIN vault correctly hashes and salts passcodes in `expo-secure-store`.
- [ ] 5 failed PIN attempts trigger a 5-minute lockout timer.
- [ ] All unit tests pass with 0 failures.
