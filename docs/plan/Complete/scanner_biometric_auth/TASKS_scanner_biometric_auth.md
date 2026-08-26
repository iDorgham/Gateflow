# Tasks: `scanner_biometric_auth`

- **Initiative:** `scanner_biometric_auth`
- **Application:** `apps/scanner-app`
- **Status:** 📝 Draft

---

## Phase 1: Biometric Hardware Detection & Service Primitives

- [x] Implement `src/lib/security/biometrics.ts` with `expo-local-authentication`
- [x] Implement `checkBiometricAvailability()`, `getBiometricType()`, and `authenticateGuardBiometrics()`
- [x] Add unit test suite `biometrics.test.ts` covering mocked hardware availability, enrollment, and cancellation
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Guard Duty Shift & Inactivity Lock Biometric Checkpoint

- [x] Integrate biometric verification into `OnboardingWizard.tsx` at shift start
- [x] Implement background wake listener with 2-minute inactivity threshold
- [x] Implement in-memory 5-minute rolling grace period manager
- [x] Write unit tests for inactivity timer and grace period state
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Per-Gate High-Security Scan Enforcement

- [x] Implement per-gate security policy hook: `requiresBiometricAuth(gateId)`
- [x] Add biometric confirmation gate before high-security QR scans
- [x] Stamp `biometricVerified: true` in local scan log and sync payload
- [x] Write unit tests for gate policy check and scan log metadata
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`

## Phase 4: Fallback PIN Verification & Anti-Brute-Force Lockout

- [x] Implement fallback PIN prompt modal when biometrics fail or are unavailable
- [x] Connect with PBKDF2 hash verification in `secure-pin.ts`
- [x] Implement 3-attempt lockout with 60-second cooldown timer
- [x] Write unit tests for PIN fallback and anti-brute-force lockout
- [x] Write `phase_logs/PHASE_LOG_phase_04.md`

## Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

- [x] Add localized Arabic and English biometric prompts and status strings
- [x] Audit all biometric UI elements for ADS semantic tokens (`nativeTokensNewEra`)
- [x] Run full test suite: `pnpm --filter scanner-app test` (100% pass)
- [x] Verify zero TypeScript errors (`tsc --noEmit`) and zero ESLint warnings
- [x] Write `phase_logs/PHASE_LOG_phase_05.md`
