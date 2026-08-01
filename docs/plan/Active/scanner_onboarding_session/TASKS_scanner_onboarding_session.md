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

- [ ] Create `OnboardingNavigator` (stack with slides)
- [ ] Welcome slide: ADS typography + illustration
- [ ] Security slide: PIN entry (4 or 6) + bio toggle (uses Phase 01 storage)
- [ ] Permissions slide: Camera (+ notifications if product-required)
- [ ] `StepIndicator` using ADS space tokens
- [ ] Persist onboarding-complete flag (SecureStore)
- [ ] `phase_logs/PHASE_LOG_phase_02.md` updated

## Phase 3: Shift Management System

- [ ] API: `POST /api/scanner/shift/start` (org + gate scoped; auth required)
- [ ] API: `POST /api/scanner/shift/end`
- [ ] Hook: `useShiftSession` (persisted local state)
- [ ] Logic: block camera scan path if shift not active
- [ ] Link scans to active `ShiftLog` id where API allows
- [ ] Tests: API org isolation + client block behavior
- [ ] `phase_logs/PHASE_LOG_phase_03.md` updated

## Phase 4: Master Scan Home Screen

- [ ] Duty home layout (8pt grid, `nativeTokens`)
- [ ] Shift time active widget (live timer)
- [ ] Master Scan FAB (primary action)
- [ ] Stats: today's scans / queue status / system status
- [ ] `phase_logs/PHASE_LOG_phase_04.md` updated

## Phase 5: Polish, Guard, RTL, pilot evidence

- [ ] Global `BiometricGuard` with inactivity timeout
- [ ] Motion polish (Reanimated) on wizard/home transitions
- [ ] RTL / Arabic pass for wizard + home (logical layout)
- [ ] Error boundaries + loading states for duty widgets
- [ ] Device evidence: Security scans the QR → update pilot gate to `passed`
- [ ] Device evidence: offline enqueue + sync → update pilot gate to `passed`
- [ ] Refresh `docs/audits/scanner-app/` packet artifacts as needed
- [ ] `phase_logs/PHASE_LOG_phase_05.md` updated
