# Phase 2: Onboarding Wizard UI & Hardware Permission Workflows

---

## Phase 2: Onboarding Wizard UI & Hardware Permission Workflows

### Primary role

FRONTEND / MOBILE

### Preferred tool

- [x] Cursor IDE — UI/visual iteration
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: `apps/scanner-app` (Expo SDK 57 / React Native)
- **Design Standard**: `@gateflow/ui/tokens` (`nativeTokens`). Zero hardcoded hex codes. 8pt spatial grid.
- **Refs**: [`docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md)

### Goal

Implement a polished 4-step first-mile onboarding wizard guiding guards through Vision, Permissions, PIN & Biometric setup, and Duty Gate Activation.

### Scope (in)

- `OnboardingNavigator` slide sequence with step indicators.
- Slide 1: Welcome & GateFlow Vision (vector illustration + typography tokens).
- Slide 2: Hardware Permissions card (Camera, Haptics, Notifications with `Linking.openSettings()` fallback).
- Slide 3: 6-digit PIN setup screen with animated 6-dot indicator & Biometric enrollment toggle.
- Slide 4: Duty Gate Activation step.
- Persist `onboarding_completed` flag in SecureStore.
- Unit tests for slide transitions and permission recovery.

### Scope (out)

- Shift API integration (Phase 3).
- Master scan home screen redesign (Phase 4).

### Steps (ordered)

1. Create `src/screens/onboarding/OnboardingScreen.tsx` with multi-slide stack.
2. Build `src/components/onboarding/StepIndicator.tsx` using ADS space tokens.
3. Implement `src/components/onboarding/PermissionsSlide.tsx` with camera and notification status detection.
4. Implement `src/components/onboarding/PinSetupSlide.tsx` with 6-dot animated keypad.
5. Persist completion flag upon finishing Slide 4.
6. Write unit tests in `src/screens/onboarding/OnboardingScreen.test.tsx`.
7. Run `pnpm --filter scanner-app test`.
8. Create `docs/plan/Draft/scanner_onboarding_session/phase_logs/PHASE_LOG_phase_02.md`.
9. Commit: `git commit -m "feat(scanner-app): implement onboarding wizard and permission flow"`

### Acceptance criteria

- [ ] Onboarding wizard displays smoothly on first run.
- [ ] Camera permission refusal opens clear settings deep-link modal.
- [ ] 6-digit PIN setup persists encrypted hash to SecureStore.
- [ ] Completed onboarding transitions guard to main app shell.
- [ ] 100% compliant with `@gateflow/ui/tokens` (`nativeTokens`).
