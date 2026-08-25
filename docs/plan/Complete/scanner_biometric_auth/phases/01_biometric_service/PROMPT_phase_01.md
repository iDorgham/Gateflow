# Phase 1: Biometric Hardware Detection & Service Primitives

## Primary Role

SECURITY / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Service implementation & mocks)
- **Tool 2**: Claude CLI (Security review & cryptographic bounds)

## Context

- **Focused App**: `apps/scanner-app`
- **Scope**: `apps/scanner-app/src/lib/security/biometrics.ts` and `biometrics.test.ts`.
- **Packages**: `expo-local-authentication` ~57.0.2.

## Goal

Implement a resilient biometric authentication service that detects hardware capabilities, queries enrollment, and executes `authenticateAsync` with secure prompt options and fallback handling.

## Scope (In)

1. `src/lib/security/biometrics.ts`:
   - `checkBiometricAvailability()`: checks `hasHardwareAsync()` and `isEnrolledAsync()`.
   - `getBiometricType()`: returns `'FACIAL_RECOGNITION' | 'FINGERPRINT' | 'NONE'`.
   - `authenticateGuardBiometrics(options)`: executes biometric verification with prompt messages.
2. Unit tests (`src/lib/security/biometrics.test.ts`):
   - Mocks for hardware available + enrolled.
   - Mocks for hardware unavailable or un-enrolled.
   - Successful auth vs cancelled/failed auth.
3. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Hardware check accurately detects biometric support on device.
- [ ] Authentication wrapper handles success, cancel, and error states cleanly.
- [ ] All unit tests pass via `pnpm --filter scanner-app test`.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
