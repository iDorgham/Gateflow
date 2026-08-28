# Draft — `scanner_onboarding_session`

**Slug:** `scanner_onboarding_session`  
**Last updated:** 2026-08-28  
**Champion:** Scanner App & Security Team  
**Initiative Link:** [`docs/development/initiatives/IDEA_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/development/initiatives/IDEA_scanner_onboarding_session.md)  
**Target:** Q3/Q4 2026  
**App:** `apps/scanner-app`, `packages/db`, `packages/types`, `packages/ui`

> Refined planning notes for Scanner App Guard Onboarding, Biometric & PIN Security, Shift Clock-In Lifecycle, and ADS Mobile Home Screen. When this feels complete, run **`/prompt scanner_onboarding_session`** then **`/plan scanner_onboarding_session`**.

---

## Changelog

- **2026-08-28 (Refined Draft)**: Initialized comprehensive draft from `IDEA_scanner_onboarding_session.md` incorporating guard bio-auth, fail-closed sensor fallbacks, shift clock-in lifecycle, `@gateflow/ui/tokens` ADS styling, and home screen master scan action.

---

## 1. Executive Summary & Goals

### Problem Statement

The Scanner App (`apps/scanner-app`) currently starts directly on a scan screen without a structured "first-mile" experience for newly deployed perimeter security personnel. In enterprise gate security, guards must complete mandatory hardware permission grants (Camera, Haptics), establish secure device lock credentials (Biometrics + PIN fallback), and explicitly clock in to an active gate shift before gate validations can occur. Without an active shift session, scan events lack guard identity and gate lane attribution.

### Strategic Goals

- **Zero Unattributed Scans**: 100% of gate entry validations linked to an active, authenticated guard shift session.
- **Fail-Closed Biometric Auth**: Multi-tier biometric verification (`FaceID`/`TouchID`/`Fingerprint`) via `expo-local-authentication` with robust fallback to a salted, hash-verified 6-digit PIN in `expo-secure-store`. If biometric hardware is unsupported or un-enrolled, the system fails closed to required PIN authentication.
- **Guided First-Mile Onboarding**: A 4-step wizard guiding newly assigned guards through Vision $\rightarrow$ Permissions $\rightarrow$ Security (PIN & Bio) $\rightarrow$ Duty Gate Activation.
- **ADS Design Excellence**: All mobile components styled strictly with `@gateflow/ui/tokens` (and `nativeTokens`), adhering to 8pt spatial grid, high-contrast dark mode support, and full Arabic RTL layout.
- **Operational Master Action**: Redesigned home dashboard featuring a prominent 72x72px central scan action button (<1s cold-to-camera latency) and real-time shift status telemetry widget.

### Non-Goals

- Resident mobile onboarding (handled in `resident-mobile`).
- Enterprise MDM (Mobile Device Management) remote wipe protocols.
- Automated payroll calculations (Shift logs provide raw timestamps and gate IDs; external payroll is out of scope).

---

## 2. Target Users & Personas

- **Perimeter Security Guard**: First-line personnel deployed at physical gates/checkpoints needing fast, one-handed operation, clear feedback, high-contrast night visibility, and rapid clock-in/scan workflows.
- **Security Shift Supervisor**: Oversees active gate terminals, reviews live shift status, verifies clock-in latency, and investigates shift discrepancies.
- **System Administrator**: Provisions guard accounts and configures terminal gate assignments across multi-tenant properties.

---

## 3. Technical Architecture & Invariants

```
+-----------------------------------------------------------------------------------+
|                                Scanner Mobile App                                 |
|                                                                                   |
|  +-----------------------+     +------------------------+     +----------------+  |
|  |  Onboarding Wizard    | --> |  Secure Auth Storage   | --> |  Shift Session |  |
|  |  - Welcome & Vision   |     |  - expo-secure-store   |     |  - useShift    |  |
|  |  - Camera/Notif Perms |     |  - Local Auth (Bio)    |     |  - Clock In/Out|  |
|  |  - PIN (6-digit salt) |     |  - Fail-closed fallback|     |  - Gate Sync   |  |
|  +-----------------------+     +------------------------+     +----------------+  |
|                                                                        |          |
|                                                                        v          |
|  +-----------------------------------------------------------------------------+  |
|  |                ADS Home Screen (Master Scan Floating Action)                |  |
|  |  - Shift Telemetry Card (Gate ID, Duty Timer, Scan Count)                   |  |
|  |  - 72x72px Rapid Scan FAB (@gateflow/ui/tokens)                            |  |
|  |  - Recent Scan Feed & Offline Queue Status                                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v HTTPS / Sync
+-----------------------------------------------------------------------------------+
|                            GateFlow Backend / Prisma                              |
|  - POST /api/shifts/clock-in  (Tenant & Gate validation)                          |
|  - POST /api/shifts/clock-out (Shift completion & summary)                        |
|  - POST /api/scans/verify     (Requires active ShiftSession header/body)          |
|  - Model: ShiftLog, ShiftStatus enum                                              |
+-----------------------------------------------------------------------------------+
```

### Technical Constraints & Invariants

- **Fail-Closed Biometrics**: If `LocalAuthentication.hasHardwareAsync()` or `isEnrolledAsync()` returns false, the application MUST require PIN setup and verification. Biometric bypass is strictly prohibited.
- **PIN Cryptography**: Passcodes (6 digits) must be salted and hashed locally before storage in `expo-secure-store`. Max 5 failed attempts trigger a 5-minute lockout timer.
- **Design Tokens**: All layout spacing, typography, borders, and colors must resolve through `@gateflow/ui/tokens` (`nativeTokens` for React Native `StyleSheet`). No hardcoded hex strings (`#ffffff`, `#000000`) or raw magic numbers.
- **Multi-Tenancy**: All shift API requests must authenticate tenant identity (`organizationId`) and ensure gate terminals belong strictly to the claimed organization.
- **RTL & Internationalization**: Full bi-directional text direction support (Arabic RTL / English LTR) with mirrored icons for directional components.
- **Offline Resilience**: Clock-in and scan transactions must queue locally in `@react-native-async-storage/async-storage` when offline and re-sync automatically upon connectivity restoration.

---

## 4. In Scope vs Out of Scope

### In Scope

1. **Security & Local Auth Layer**:
   - `expo-local-authentication` wrapper with hardware detection (`hasHardwareAsync`, `supportedAuthenticationTypesAsync`).
   - `expo-secure-store` passcode vault with SHA-256 salt hashing and attempt throttling.
   - Background re-lock listener (prompts for biometric/PIN after 5 minutes of app backgrounding).
2. **First-Mile Onboarding Wizard**:
   - Step 1: Welcome slide with Atlassian-style illustrated vector art.
   - Step 2: System Permissions step (Camera & Notification context cards with direct settings deep-link if denied).
   - Step 3: Security credential setup (6-digit PIN creation & Biometric toggle).
   - Step 4: Duty terminal assignment / Gate QR scan to finalize setup.
3. **Shift Session Lifecycle (`useShiftSession`)**:
   - Clock-in modal / drawer with gate selector.
   - Active shift context provider broadcasting shift ID, gate name, start timestamp, and scan tally.
   - Clock-out flow with shift summary dialog.
4. **ADS Home Screen Redesign**:
   - Top Header: Guard profile, active gate badge, shift timer.
   - Center: Real-time operational metrics (Total scans, Approved, Denied, Flagged).
   - Master Scan Action: 72x72px floating action button in brand primary token (`nativeTokens.colors.blue700` / high-contrast glow).
   - Bottom: Recent scan feed with status badges.
5. **Backend Shift Endpoints & Validation**:
   - Shift check-in / check-out API integration with tenant validation.

### Out of Scope

- Facial recognition scanning for visitor identities (QR HMAC is primary entry credential).
- Advanced guard tracking via real-time GPS breadcrumbs (Shift gate assignment is static/NFC/QR-based).
- MDM device locking.

---

## 5. Suggested Phased Roadmap

### Phase 1 — Foundation: Biometric Security, Secure Store & Shift State (Security & Core)

- Implement `biometric-auth.ts` service wrapping `expo-local-authentication` with fail-closed PIN fallback logic.
- Implement `secure-pin-vault.ts` using `expo-secure-store` with salted hashing and rate-limited attempt tracking.
- Build `useShiftSession` React hook and Context Provider for active duty state management.
- Unit tests for biometric detection, PIN hashing, attempt locking, and session lifecycle.

### Phase 2 — Onboarding Wizard UI & Permission Workflows (Mobile UI & ADS)

- Implement multi-step onboarding wizard screens using `@gateflow/ui/tokens` (`nativeTokens`):
  - Welcome & GateFlow Vision step.
  - Permissions explainer cards (Camera, Haptics, Notifications) with status detection.
  - PIN setup & confirmation screen with 6-dot animated keypad.
  - Gate pairing step (Duty QR scan or dropdown).
- Support full Arabic RTL and Dark Mode styling.

### Phase 3 — Backend Shift Integration & Scanner Home Screen Redesign (API & Integration)

- Shift session clock-in and clock-out integration with tenant isolation.
- Redesign `HomeScreen.tsx` in `apps/scanner-app`:
  - Duty Telemetry Widget (Gate Name, Elapsed Shift Time, Scan Stats).
  - 72x72px Master Scan Action Button with instant camera trigger.
  - Auto re-lock screen on app foreground after 5-minute inactivity.
- Full verification, unit tests, and preflight green check.

---

## 6. Risks & Mitigation Strategies

| Risk                                     | Mitigation                                                                                        |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **No Biometric Hardware Available**      | Fail closed to mandatory 6-digit PIN. Never allow unauthenticated app access.                     |
| **Camera Permission Permanently Denied** | Display clean ADS modal with deep link to iOS/Android App Settings (`Linking.openSettings()`).    |
| **Flaky Gate Network during Clock-In**   | Store shift clock-in event locally with optimistic active state and sync via offline retry queue. |
| **Brute Force PIN Attacks**              | Exponential backoff lockout (30s after 3 attempts, 5m after 5 attempts) recorded in SecureStore.  |

---

## 7. Open Questions for Plan Generation

- [x] **Passcode length**: Standardize on 6 digits for enterprise-grade entropy.
- [x] **Inactivity Timeout**: 5 minutes of app backgrounding triggers biometric/PIN unlock prompt.
- [x] **Design Tokens**: Strict usage of `@gateflow/ui/tokens` (`nativeTokens`).
