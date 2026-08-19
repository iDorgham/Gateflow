# TASKS: Scanner App — Onboarding & Session Management

**Slug:** `scanner_onboarding_session`  
**Plan:** `PLAN_scanner_onboarding_session.md`  
**Audit:** `docs/audits/scanner-app/AUDIT_2026-07-30.md`

## Phase 1: Security wiring & QR fail-closed

### Done (foundation)

- [x] Add `expo-local-authentication` to `scanner-app`
- [x] Create `SecurePINStorage` — `src/lib/security/secure-pin.ts`
- [x] Implement `useBiometry` — `src/hooks/use-biometry.ts`
- [x] Prisma `ShiftLog` + migration `20260402124145_shift_log`

### Remaining

- [x] Wire post-login device unlock (PIN and/or biometrics) before scanner shell
- [x] Fail closed when `EXPO_PUBLIC_QR_SECRET` is empty outside explicit dev mode
- [x] Unit tests for fail-closed QR secret + unlock gate helpers
- [x] `phase_logs/PHASE_LOG_phase_01.md` updated

## Phase 2: Onboarding Wizard (UI/UX)

- [x] Create `OnboardingNavigator` (stack with slides)
- [x] Welcome slide: ADS typography + illustration
- [x] Security slide: PIN entry (4 or 6) + bio toggle (uses Phase 01 storage)
- [x] Permissions slide: Camera (+ notifications if product-required)
- [x] `StepIndicator` using ADS space tokens
- [x] Persist onboarding-complete flag (SecureStore)
- [x] `phase_logs/PHASE_LOG_phase_02.md` updated

## Phase 3: Shift Management System

- [x] API: `POST /api/scanner/shift/start` (org + gate scoped; auth required)
- [x] API: `POST /api/scanner/shift/end`
- [x] Hook: `useShiftSession` (persisted local state)
- [x] Logic: block camera scan path if shift not active
- [x] Link scans to active `ShiftLog` id where API allows
- [x] Tests: API org isolation + client block behavior
- [x] `phase_logs/PHASE_LOG_phase_03.md` updated

## Phase 4: Master Scan Home Screen

- [x] Duty home layout (8pt grid, `nativeTokens`)
- [x] Shift time active widget (live timer)
- [x] Master Scan FAB (primary action)
- [x] Stats: today's scans / queue status / system status
- [x] `phase_logs/PHASE_LOG_phase_04.md` updated

## Phase 5: Polish, Guard, RTL, pilot evidence

- [x] Global `BiometricGuard` with inactivity timeout
- [x] Motion polish (built-in `Animated` API — `react-native-reanimated` not a
      `scanner-app` dependency; see phase log) on wizard/home transitions
- [x] RTL / Arabic pass for wizard + home (logical layout) — audited, no
      hardcoded left/right found; visual on-device confirmation still pending
- [x] Error boundaries + loading states for duty widgets
- [ ] Device evidence: Security scans the QR → update pilot gate to `passed`
      **(blocked — Xcode 26.1.1 / Swift 6.2.1 on Sequoia 15.7.1
      MacBookPro14,3; SDK 57 needs Xcode 26.4+ / Swift 6.3 / Tahoe 26.2+)**
- [ ] Device evidence: offline enqueue + sync → update pilot gate to `passed`
      **(blocked — same OS/Xcode floor; see SESSION_MEMORY)**
- [ ] Refresh `docs/audits/scanner-app/` packet artifacts as needed (depends
      on the two device-evidence items above)
- [x] `phase_logs/PHASE_LOG_phase_05.md` updated
