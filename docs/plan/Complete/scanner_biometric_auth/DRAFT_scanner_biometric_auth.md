# Draft — `scanner_biometric_auth`

**Slug:** `scanner_biometric_auth`  
**Last updated:** 2026-08-24  
**Champion:** Scanner App Security Team  
**Initiative Link:** `docs/development/initiatives/IDEA_scanner_biometric_auth.md`  
**Target:** Q3 2026

> Refined planning notes for Guard Biometric Identity Verification in `apps/scanner-app`. When this feels complete, run **`/prompt scanner_biometric_auth`** then **`/plan scanner_biometric_auth`**.

---

## Changelog

- **2026-08-24 (Continue Mode)**: Refined goals, non-goals, security invariants, error states, and detailed phase-by-phase deliverables.
- **2026-08-24 (Initial)**: Drafted initial requirements from `IDEA_scanner_biometric_auth.md` and `device-unlock.ts`.

---

## 1. Executive Summary & Goals

### Problem Statement

In gated communities and corporate facilities, guards routinely hand off physical scanner devices or step away from gates. Without continuous hardware-backed authentication:

1. Unauthorized personnel can perform scans on an unlocked device.
2. Device handovers between shift guards lack cryptographic accountability.
3. High-security enterprise gates require verifiable multi-factor proof for audit compliance.

### Strategic Goals

- Provide **hardware-backed biometric verification (FaceID, TouchID, Android BiometricPrompt)** using `expo-local-authentication`.
- Enforce biometric verification at **Shift Start**, **Inactivity Resume**, and **High-Security Scan Triggering**.
- Implement an in-memory **Grace Period (e.g. 5 minutes)** to ensure vehicle queue throughput is never compromised.
- Provide a robust **4-digit Device PIN fallback** (`apps/scanner-app/src/lib/security/secure-pin.ts`) for environments where biometric hardware is missing, un-enrolled, or fails due to harsh sunlight/gloves.
- Record `biometricVerified: boolean` in local audit trails and synchronized scan logs.

### Non-Goals

- Cloud biometric matching (all biometric validation is strictly local on-device).
- Biometric verification for resident apps (scope is strictly the Scanner App guard experience).
- Retinal or voice recognition hardware.

---

## 2. Target Users & Personas

- **Compound Security Guard**: Needs instant, frictionless FaceID / fingerprint scanning (<1.5s) that doesn't slow down peak-hour vehicle queues.
- **Security Supervisor / Property Manager**: Configures whether biometric verification is strictly required for specific gates and reviews biometric audit stamps in the Client Dashboard.
- **Compliance Auditor**: Inspects scan logs to verify zero unauthorized device usage.

---

## 3. Technical Architecture & Invariants

```
┌──────────────────────────────────────────────────────────┐
│                   Scanner App Device                     │
│                                                          │
│  [Onboarding / Shift Start]   [Scan Trigger / Inactivity]│
│               │                              │           │
│               ▼                              ▼           │
│       ┌───────────────────────────────────────────┐      │
│       │       Biometric Verification Gate         │      │
│       │   (FaceID / TouchID / Android Biometrics) │      │
│       └─────────────────────┬─────────────────────┘      │
│                             │                            │
│              ┌──────────────┴──────────────┐             │
│              ▼                             ▼             │
│       [Success: Grace Period]      [Failure / Missing]   │
│              │                             │             │
│              ▼                             ▼             │
│      [Unlock Scanner View]         [Fallback Device PIN] │
│              │                             │             │
│              ▼                             ▼             │
│   [Scan with Bio Stamp]            [3 Fails -> Lockout]  │
└──────────────────────────────────────────────────────────┘
```

- **Module**: `apps/scanner-app/src/lib/security/biometrics.ts`
- **Dependencies**: `expo-local-authentication` ~57.0.2, `expo-secure-store`, `@gate-access/ui/tokens`.
- **Fail-Closed Invariant**: If biometric auth fails and the fallback PIN is incorrect or locked out, access to the scanner viewport is strictly blocked.
- **Offline Invariant**: 100% of biometric evaluation runs on-device without network calls.

---

## 4. Suggested 5-Phase Plan Sketch

### Phase 1: Biometric Hardware Service & Detection

- Implement `biometrics.ts`:
  - `checkBiometricAvailability()`: calls `hasHardwareAsync()` and `isEnrolledAsync()`.
  - `getBiometricType()`: returns `'FACIAL_RECOGNITION' | 'FINGERPRINT' | 'NONE'`.
  - `authenticateGuardBiometrics()`: calls `authenticateAsync()` with localized prompts and security options (`disableDeviceFallback: true` to prioritize app-managed PIN fallback).
- Comprehensive unit tests mocking `expo-local-authentication`.

### Phase 2: Guard Duty Session & Inactivity Lock Checkpoint

- Integrate biometric verification into `apps/scanner-app/src/components/onboarding/OnboardingWizard.tsx`.
- Connect with `useDutyTimer` and app state listener (`AppState.addEventListener`):
  - When app transitions from background to foreground after inactivity (>2 minutes), require quick biometric unlock.
- Session grace timer management (in-memory token valid for 5 minutes).

### Phase 3: Per-Gate High-Security Scan Enforcement

- Add gate-level security policy check: `requiresBiometricAuth(gateId)`.
- If required and grace period expired, prompt biometric verify before scanning QR payload.
- Stamp `biometricVerified: true` in local scan log payload and audit trail.

### Phase 4: Fallback PIN & Anti-Brute-Force Lockout

- Seamlessly offer "Use PIN" when biometrics fail or hardware is unavailable.
- Verify against PBKDF2 salt-hashed PIN (`secure-pin.ts`).
- Enforce 3-attempt lockout with 60-second cooldown timer.

### Phase 5: Arabic RTL Polish, ADS Tokens & Certification

- Localized Arabic & English prompts:
  - AR: "يرجى تأكيد الهوية باستخدام بصمة الوجه أو الإصبع لبدء المناوبة"
  - EN: "Please authenticate with Face ID or Fingerprint to begin guard shift"
- Zero hardcoded colors; 100% ADS semantic tokens (`nativeTokensNewEra`).
- Full Jest test suite in `apps/scanner-app` and TypeScript verification (`tsc --noEmit`).

---

## 5. Open Questions & Resolutions

1. **Grace Period Duration**: Set to **5 minutes** by default, reset upon every successful QR scan.
2. **Offline Fallback**: When biometrics fail, fallback to the 4-digit guard master PIN configured during device onboarding.
3. **Audit Trail**: Recorded in `ScanLog.auditNotes.biometricVerified` without breaking database schema backward compatibility.
