# PLAN: Scanner App — Onboarding & Session Management

**Slug:** `scanner_onboarding_session`  
**Status:** draft  
**Created:** 2026-08-28  
**Target:** Q3/Q4 2026  
**Primary App:** `apps/scanner-app`  
**Packages:** `packages/db`, `packages/types`, `packages/ui`  
**Initiative Link:** [`docs/development/initiatives/IDEA_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/development/initiatives/IDEA_scanner_onboarding_session.md)  
**Draft Link:** [`docs/plan/Draft/scanner_onboarding_session/DRAFT_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/DRAFT_scanner_onboarding_session.md)

---

## Overview

Establish an enterprise first-mile onboarding experience, fail-closed biometric and PIN security layer, shift clock-in session management, and ADS home screen master scan action for `apps/scanner-app`. This ensures every physical gate entry scan is performed by an authenticated guard on an active shift duty with sub-second camera readiness and full Arabic RTL support.

---

## Phases

| #   | Phase                                                                                     | Role                 | Tool   | Status |
| :-- | :---------------------------------------------------------------------------------------- | :------------------- | :----- | :----- |
| 1   | **Phase 1: Biometric Security, Secure PIN Vault & Fail-Closed Invariants**                | MOBILE / SECURITY    | Cursor | [x]    |
| 2   | **Phase 2: Onboarding Wizard UI & Hardware Permission Workflows**                         | FRONTEND / MOBILE    | Cursor | [x]    |
| 3   | **Phase 3: Shift Session Management API, State Hooks & Scan Blocking**                    | BACKEND-API / MOBILE | Cursor | [x]    |
| 4   | **Phase 4: ADS Master Scan Home Screen Redesign & Real-Time Telemetry**                   | FRONTEND / MOBILE    | Cursor | [x]    |
| 5   | **Phase 5: Polish, Biometric Inactivity Guard, Arabic RTL & Full Monorepo Certification** | QA / MOBILE          | Cursor | [x]    |

---

## Technical Constraints & Invariants

- **Fail-Closed Biometrics**: Hardware detection using `expo-local-authentication` (`hasHardwareAsync`, `isEnrolledAsync`). When biometrics are missing or un-enrolled, the app fails closed to mandatory 6-digit PIN authentication.
- **PIN Vault & Cryptography**: Passcodes (6 digits) are salted and hashed with SHA-256 before storage in `expo-secure-store`. Max 5 failed attempts trigger exponential lockout throttling (30s after 3 attempts, 5m after 5 attempts).
- **Design Tokens**: 100% adherence to `@gateflow/ui/tokens` (`nativeTokens` for React Native `StyleSheet`). No raw hex color codes or ad-hoc magic numbers.
- **Multi-Tenancy**: All backend shift APIs must validate `organizationId` from authenticated claims and verify gate terminal ownership.
- **Shift Invariant**: Camera scanner activation is blocked if the guard does not have an active shift session.
- **RTL & Internationalization**: Logical layout styling supporting bi-directional text direction (Arabic RTL / English LTR).
- **Offline Sync**: Shift clock-in and scan logs queue in AsyncStorage when offline and automatically sync upon network restoration.

---

## Phased Deliverables

### Phase 1: Biometric Security, Secure PIN Vault & Fail-Closed Invariants

- Core biometric auth service with fail-closed fallback logic.
- SecureStore 6-digit PIN vault with salted hashing and attempt throttling.
- Fail-closed validation for `EXPO_PUBLIC_QR_SECRET`.
- Comprehensive unit tests covering hardware detection, PIN verification, and lockout timers.

### Phase 2: Onboarding Wizard UI & Hardware Permission Workflows

- Multi-step `OnboardingNavigator` (Vision $\rightarrow$ Permissions $\rightarrow$ Security $\rightarrow$ Duty Activation).
- Educational permission explainer cards for Camera, Haptics, and Notifications with settings recovery deep-links.
- 6-dot animated keypad PIN creation & Biometric enrollment screen.
- First-run completion flag persistence in `expo-secure-store`.

### Phase 3: Shift Session Management API, State Hooks & Scan Blocking

- Backend endpoints: `POST /api/scanner/shift/start` and `POST /api/scanner/shift/end` with tenant isolation.
- Mobile `useShiftSession` hook and Context Provider.
- Guard shift-blocking enforcement: camera scan flow is hard-blocked until shift is active.
- Shift log integration with scan event payloads.

### Phase 4: ADS Master Scan Home Screen Redesign & Real-Time Telemetry

- Complete redesign of `HomeScreen.tsx` using 8pt grid and ADS compact density tokens.
- 72x72px central floating action button (`nativeTokens.colors.blue700` / high-contrast glow) for <1s camera launch.
- Duty Telemetry Card: Active gate name, live duty timer, daily scan counter.
- Recent scan event feed with status badges.

### Phase 5: Polish, Biometric Inactivity Guard, Arabic RTL & Full Monorepo Certification

- Global `BiometricGuard` listener prompting for biometric/PIN unlock after 5 minutes of background inactivity.
- Arabic RTL layout verification across all onboarding and home screen components.
- Monorepo preflight check (`pnpm preflight`) passing 100% green across all 15 tasks.
- Certification documentation and phase logs.
