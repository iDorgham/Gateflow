# Implementation Plan: Scanner App — Biometric Identity Verification

**Slug:** `scanner_biometric_auth`  
**Application:** `apps/scanner-app`  
**Status:** 📝 Draft (Ready for Review)  
**Target Date:** Q3 2026  
**Champion:** Scanner App Security Team

---

## 1. Executive Summary & Goals

The **Scanner App Biometric Identity Verification** initiative introduces hardware-backed biometric verification (`FaceID`, `TouchID`, Android `BiometricPrompt`) into `apps/scanner-app` using `expo-local-authentication`.

This ensures physical guards are cryptographically verified upon duty shift start, app wake-from-inactivity, and high-security QR scans. It includes an in-memory 5-minute queue grace period to prevent vehicle bottlenecking and a 4-digit PBKDF2 device PIN fallback with brute-force lockout.

---

## 2. Invariants & Guardrails

- **Fail-Closed Security**: Inability to pass biometric or fallback PIN verification blocks scanning access immediately.
- **100% Offline Resilience**: All authentication logic runs on-device using `expo-local-authentication` without requiring cloud connectivity.
- **ADS Token Adherence**: 100% semantic design tokens from `@gate-access/ui/tokens` (`nativeTokensNewEra`). Zero hardcoded hex colors or plain styles.
- **Tenant Scope**: High-security gate policies are isolated by `organizationId`.

---

## 3. Phased Implementation Roadmap

### Phase 1: Biometric Hardware Detection & Service Primitives

- **Primary Role**: SECURITY / MOBILE
- **Tool**: Cursor IDE + Claude CLI
- **Deliverables**:
  - `apps/scanner-app/src/lib/security/biometrics.ts` providing `checkBiometricAvailability()`, `getBiometricType()`, and `authenticateGuardBiometrics()`.
  - Comprehensive unit test suite `biometrics.test.ts`.

### Phase 2: Guard Duty Shift & Inactivity Lock Biometric Checkpoint

- **Primary Role**: FRONTEND / MOBILE
- **Tool**: Cursor IDE
- **Deliverables**:
  - Biometric gate during shift start onboarding in `OnboardingWizard.tsx`.
  - Inactivity wake listener (>2 min background sleep triggers re-auth).
  - In-memory 5-minute rolling grace period manager.

### Phase 3: Per-Gate High-Security Scan Enforcement

- **Primary Role**: FRONTEND / MOBILE
- **Tool**: Cursor IDE
- **Deliverables**:
  - Per-gate security policy hook: `requiresBiometricAuth(gateId)`.
  - Biometric challenge prior to high-security scan confirmation.
  - Recording `biometricVerified: true` in local scan log and server sync payload.

### Phase 4: Fallback PIN Verification & Anti-Brute-Force Lockout

- **Primary Role**: SECURITY / MOBILE
- **Tool**: Cursor IDE + Qwen CLI
- **Deliverables**:
  - Seamless "Use PIN" fallback modal when biometrics fail or hardware is missing.
  - Verification against PBKDF2 salt-hashed master PIN (`secure-pin.ts`).
  - 3-attempt lockout with 60-second cooldown timer.

### Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

- **Primary Role**: QA / DESIGN / MOBILE
- **Tool**: Cursor IDE + Opencode CLI
- **Deliverables**:
  - Full Arabic and English localization for all biometric dialogs and status messages.
  - ADS token audit (`nativeTokensNewEra`).
  - 100% green Jest test suites and TypeScript typecheck (`tsc --noEmit`).

---

## 4. Acceptance Criteria

- [ ] Biometric hardware detection works on physical devices and degrades gracefully on simulators.
- [ ] Guard shift start and wake-from-inactivity require biometric unlock.
- [ ] 5-minute rolling grace period prevents queue delays during rapid sequential scans.
- [ ] 4-digit PIN fallback operates securely with anti-brute-force lockout.
- [ ] Arabic RTL renders cleanly with natural guardhouse terminology.
- [ ] All automated tests pass with 0 errors.
