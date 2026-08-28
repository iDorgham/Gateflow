# TASKS: Scanner App — Onboarding & Session Management

**Slug:** `scanner_onboarding_session`  
**Plan:** `PLAN_scanner_onboarding_session.md`  
**Status:** draft

---

## Phase 1: Biometric Security, Secure PIN Vault & Fail-Closed Invariants

- [x] Implement `BiometricAuthService` wrapping `expo-local-authentication` (`hasHardwareAsync`, `isEnrolledAsync`)
- [x] Implement `SecurePINVault` using `expo-secure-store` with SHA-256 salted hashing and attempt lockout throttling
- [x] Enforce fail-closed check for `EXPO_PUBLIC_QR_SECRET` outside explicit test environments
- [x] Write unit tests for biometric detection, PIN hashing, attempt locking, and fail-closed secret validation
- [x] Create `phase_logs/PHASE_LOG_phase_01.md`

---

## Phase 2: Onboarding Wizard UI & Hardware Permission Workflows

- [x] Build `OnboardingNavigator` slide stack with smooth transitions
- [x] Create Slide 1: Welcome & GateFlow Vision with ADS illustration & typography
- [x] Create Slide 2: Hardware Permissions card (Camera, Haptics, Notifications) with `Linking.openSettings()` fallback
- [x] Create Slide 3: 6-digit PIN setup keypad with 6-dot animated indicator & Biometric toggle
- [x] Create Slide 4: Duty Gate Activation step (scan duty QR or select lane)
- [x] Persist `onboarding_completed` flag in `expo-secure-store`
- [x] Unit tests for onboarding step progression and permission recovery flows
- [x] Create `phase_logs/PHASE_LOG_phase_02.md`

---

## Phase 3: Shift Session Management API, State Hooks & Scan Blocking

- [x] Verify Prisma `ShiftLog` schema and implement `POST /api/scanner/shift/start` with tenant scoping
- [x] Implement `POST /api/scanner/shift/end` with shift duration and scan tally summary
- [x] Build `useShiftSession` hook and `ShiftSessionProvider` managing active shift state
- [x] Implement guard scan-blocking interceptor: block camera scan trigger when `isShiftActive === false`
- [x] Unit tests for shift API routes, session context, and camera blocking logic
- [x] Create `phase_logs/PHASE_LOG_phase_03.md`

---

## Phase 4: ADS Master Scan Home Screen Redesign & Real-Time Telemetry

- [x] Redesign `HomeScreen.tsx` layout using 8pt spatial grid and `@gateflow/ui/tokens` (`nativeTokens`)
- [x] Implement Duty Telemetry Widget (Gate Name, live duty elapsed timer, today's scan counters)
- [x] Implement 72x72px Master Scan Floating Action Button with instant camera trigger (<1s latency)
- [x] Implement Recent Scan Feed list with status badges (Approved, Denied, Flagged)
- [x] Unit tests for Home screen rendering and telemetry widgets
- [x] Create `phase_logs/PHASE_LOG_phase_04.md`

---

## Phase 5: Polish, Biometric Inactivity Guard, Arabic RTL & Full Monorepo Certification

- [x] Implement `BiometricGuard` app state listener prompting for unlock after 5 minutes of background inactivity
- [x] Perform Arabic RTL layout and typography audit across wizard and dashboard screens
- [x] Run full monorepo preflight check (`pnpm preflight`) ensuring 15/15 tasks pass 100% green
- [x] Create `phase_logs/PHASE_LOG_phase_05.md`
- [x] Update backlog and transition plan to Complete
