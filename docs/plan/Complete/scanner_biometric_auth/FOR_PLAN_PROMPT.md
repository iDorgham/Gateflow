# Handoff for `/plan scanner_biometric_auth`

## Mission

Deliver hardware-backed biometric verification (FaceID, TouchID, and Android BiometricPrompt) in `apps/scanner-app` using `expo-local-authentication`. Enforce biometric gates on guard duty shift starts, app wake-from-inactivity, and high-security QR scans with an in-memory 5-minute queue grace period and a robust 4-digit master PIN fallback.

---

## In Scope / Out of Scope

### In Scope

- **Hardware Integration**: `expo-local-authentication` (`hasHardwareAsync`, `isEnrolledAsync`, `authenticateAsync`).
- **Security Checkpoints**:
  1. Guard Shift Onboarding / Activation in `OnboardingWizard.tsx`.
  2. App Wake-from-Inactivity Re-auth (>2 min background timer).
  3. High-Security Gate Scan Triggering (gate-level policy).
- **Grace Period**: 5-minute rolling in-memory timer to avoid friction during vehicle queue bursts.
- **Fail-Safe Fallback**: Seamless fallback to 4-digit PBKDF2 device PIN (`secure-pin.ts`) with 3-attempt lockout.
- **Audit Logging**: Record `biometricVerified: true` in local scan logs and server payloads.
- **Localization**: Localized Arabic (`ar`) and English (`en`) security prompts and status badges.
- **Testing**: 100% test coverage with Jest for all biometric hooks, state machines, and fallback flows.

### Out of Scope

- Biometrics for resident apps or cloud-side biometric matching.
- Retinal or voice recognition.

---

## Users & Constraints

- **Primary Persona**: Security guards operating in outdoor/gatehouse environments.
- **Target App**: `apps/scanner-app` (Expo SDK 57, React Native 0.81.5).
- **Invariants**:
  - **Fail-Closed**: If biometrics and PIN fail, scanning is completely blocked.
  - **Offline-First**: 100% on-device local authentication without cloud dependency.
  - **ADS Token Standards**: 100% semantic tokens from `@gate-access/ui/tokens` (`nativeTokensNewEra`).

---

## Definition of Done

1. `src/lib/security/biometrics.ts` provides clean, tested biometric verification primitives.
2. Duty shift check-in and wake-from-sleep trigger biometric prompt with seamless PIN fallback.
3. 5-minute queue grace period prevents redundant prompts during rapid successive scans.
4. All unit tests pass cleanly (`pnpm --filter scanner-app test`).
5. Zero TypeScript errors (`tsc --noEmit`) and zero ESLint warnings.
6. Phase logs written under `phase_logs/` for each completed phase.

---

## Suggested Phase Breakdown

1. **Phase 1**: Biometric Hardware Detection & Service Primitives (`src/lib/security/biometrics.ts`)
2. **Phase 2**: Guard Duty Shift & Inactivity Lock Biometric Checkpoint
3. **Phase 3**: Per-Gate High-Security Scan Enforcement & 5-Minute Queue Grace Timer
4. **Phase 4**: Fallback PIN Verification & Anti-Brute-Force Lockout
5. **Phase 5**: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

---

## References

- `docs/plan/Draft/scanner_biometric_auth/DRAFT_scanner_biometric_auth.md`
- `docs/development/initiatives/IDEA_scanner_biometric_auth.md`
- `apps/scanner-app/src/lib/security/device-unlock.ts`
- `apps/scanner-app/src/lib/security/secure-pin.ts`

---

## Next Step

```text
/plan scanner_biometric_auth
```
