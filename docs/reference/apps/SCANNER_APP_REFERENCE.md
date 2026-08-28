# GateFlow Scanner App Reference

Comprehensive reference for `apps/scanner-app` including implemented scope, UI structure, function/services, and data contract touchpoints.

## Coverage Status

- Pages/routes: covered (single-app shell model with Onboarding & Duty Home).
- Menu/tabs/navigation: covered (`OnboardingNavigator`, `HomeScreen`, `ScannerScreen`, bottom tab bar).
- API routes inside scanner app: not applicable (none present; consumes backend REST API).
- UI component inventory: covered.
- Function/service modules: covered.
- DB model mapping: covered at domain level via upstream APIs (`ShiftLog`, `ScanLog`, `PatrolLog`, `CheckpointScan`).
- Pilot Certification: **CERTIFIED** 🟢 (`scanner-app-certification-2026-08-28`).

## App Purpose

- Field-facing mobile scanner for gate operators and compound security guards.
- Optimized for sub-second scan response, offline continuity, and secure replay-safe sync.
- Operates reliably under weak, intermittent, or zero compound cellular coverage.
- Enforces shift-gated operations and fail-closed biometric/PIN authentication.

## What Has Been Completed

- **First-Mile Onboarding Wizard (`OnboardingNavigator`):**
  - Step 1: Vision & zero-trust platform introduction.
  - Step 2: Hardware permissions (Camera & Haptics) with `Linking.openSettings()` deep-linking recovery.
  - Step 3: Security setup with custom numeric keypad (`PinKeypad`), animated dots (`PinDots`), and biometric enrollment.
  - Step 4: Duty gate selection and initial shift activation.
- **Biometric Security & Secure PIN Vault:**
  - `checkBiometricAvailability()` detecting FaceID, TouchID, and Fingerprint via `expo-local-authentication`.
  - Fail-closed fallback to mandatory 6-digit PIN stored securely in `expo-secure-store`.
  - `LockoutManager` anti-brute-force rate limiting (3 failed attempts $\rightarrow$ 60s lockout).
  - Constant-time XOR comparison avoiding timing attack vulnerabilities.
- **Duty Session & Shift Management:**
  - `ShiftSession` manager with SecureStore persistence and durable tombstone protection (`SHIFT_TOMBSTONE_KEY`).
  - Scan-blocking invariant: camera barcode scans are hard-blocked when `canScanWithShift(session, gateId) === false`.
  - Automatic session synchronization with backend `POST /api/scanner/shift/start` and `POST /api/scanner/shift/end`.
- **ADS Master Scan Home Screen Redesign:**
  - Built with 8pt spatial grid and `@gateflow/ui/tokens` (`nativeTokens`).
  - Central 72x72px `MasterScanFab` (`nativeTokens.colors.primary` / `brandGlow`) for <1s camera launch.
  - `ShiftInfoWidget` with isolated live-ticking duty timer and semantic status pills.
  - High-density telemetry cards for "Scans today", "Pending sync", and system connectivity.
- **Offline Queue & Reconnection Sync:**
  - AES-CBC v3 payload encryption for stored scans; automatic drainage via `POST /scans/bulk` upon reconnection.
- **QR Cryptographic Verification:**
  - Client HMAC-SHA256 signature checking, nonce consumption, and DB ID synchronization.
- **Perimeter Guard Patrol Scanning:**
  - Checkpoint QR scanning with HMAC signature verification and out-of-order tolerance.
- **BiometricGuard & Inactivity Session Control:**
  - Non-intrusive pan-gesture observation with 5-minute auto-lock while preserving active guard duty shifts.
- **Supervisor Override + Secure PIN Flow:**
  - Emergency bypass for authorized security leads.

## Application Structure

### Core Surfaces & Navigation

- Entry shell: `App.tsx`
- Navigation Flow:
  - `OnboardingNavigator` (`PermissionsScreen`, `SecuritySetupScreen`, `GateActivationScreen`)
  - `HomeScreen` (Command center dashboard with `ShiftInfoWidget`, `MasterScanFab`, stats grid)
  - `ScannerScreen` (Camera viewfinder, targeting reticle, status badges)
- UI components: `src/components/*`
- Service and domain logic: `src/lib/*`
- Device hooks: `src/hooks/*`
- Tests/mocks: `src/lib/*.test.ts`, `__mocks__/*`, `jest.setup.ts` (26 test suites, 209 unit tests passing)

### UI/UX Architecture & Components

Component inventory in `src/components`:

- **Home & Telemetry (`src/components/home/`):**
  - `master-scan-fab.tsx` — 72x72px floating camera trigger.
  - `shift-info-widget.tsx` — Live-ticking shift duration card.
- **Security & PIN Setup (`src/components/security/`):**
  - `biometric-guard.tsx` — 5-minute background inactivity lock.
  - `pin-keypad.tsx` — Custom numeric keypad with haptic triggers.
- **Common & Widgets (`src/components/common/`):**
  - `stats-grid-item.tsx` — Operational stat display card.
  - `duty-error-boundary.tsx` — Component-level crash resilience.
  - `fade-in.tsx` — Smooth staggered entry animations.
- **Operational tabs & Viewports (`src/components/views/`):**
  - `camera-scanner-view.tsx` — Camera viewport with `canScan` gating.
  - `scanner-top-bar.tsx` — Gate info and network indicators.
  - `scanner-tab-bar.tsx` — Operator bottom navigation.
  - `result-overlay.tsx` — Access granted / denied feedback modal.
- **Supervisor & Incident Tools:**
  - `supervisor-override.tsx` — Lead guard bypass dialog.
  - `id-capture-modal.tsx` — National ID photo capture.
  - `maintenance-report-modal.tsx` — Facility incident logging.

## Function and Service Layer

Primary modules in `src/lib`:

- **Security & Cryptography (`src/lib/security/`):**
  - `biometrics.ts` — Hardware detection and biometric prompts.
  - `secure-pin.ts` — SHA-256 salted PIN vault in SecureStore.
  - `lockout-manager.ts` — Brute-force throttling state.
  - `qr-secret.ts` — Fail-closed secret resolution.
  - `biometrics-i18n.ts` — English/Arabic biometric dialog strings.
- **Shift & Duty Operations:**
  - `shift-session.ts` — Shift lifecycle, mutation queue, and tombstone tracking.
  - `duty-timer.ts` — Duration formatting utilities.
  - `duty-stats.ts` — Daily scan count aggregations.
- **Scan & Verification:**
  - `scanner.ts` — Server validation and offline queue dispatch.
  - `qr-verify.ts` — Local cryptographic verification.
  - `scan-history.ts` — Local storage history cache.
- **Offline Sync & Resilience:**
  - `offline-queue.ts` — AES-CBC encrypted AsyncStorage queue.
  - `inactivity.ts` — Inactivity timeout calculations.

Supporting hooks:

- `hooks/use-shift-session.ts`
- `hooks/use-biometry.ts`
- `hooks/use-inactivity-timer.ts`

## Data and DB Domain Mapping

Scanner operations map to these primary backend schema domains:

- `ShiftLog`: Guard shift start/end timestamps, duty gate assignment, total scan tallies.
- `ScanLog`: Pass validation logs, visitor National ID verification, timestamp, and device metadata.
- `PatrolLog` & `CheckpointScan`: Perimeter patrol checkpoint scan events and sequence verification.
- `Gate`: Physical gate lanes, terminal configurations, and device pairing.
