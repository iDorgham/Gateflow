# Phase 2: Guard Duty Shift & Inactivity Lock Biometric Checkpoint

## Primary Role

FRONTEND / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Duty lifecycle & timer integration)
- **Tool 2**: Qwen CLI (State transitions & timers)

## Context

- **Focused App**: `apps/scanner-app`
- **Scope**: `OnboardingWizard.tsx`, `useDutyTimer.ts`, `inactivity-lock.ts`.
- **Packages**: `expo-local-authentication`, `react-native` (`AppState`).

## Goal

Enforce biometric identity verification at shift start check-in and upon waking the scanner app from background inactivity, backed by an in-memory 5-minute rolling grace period.

## Scope (In)

1. Shift Start Biometric Check:
   - Prompt guard for biometric verification when launching the onboarding wizard or confirming shift start.
2. Inactivity Lock:
   - Listen to `AppState` background/active transitions.
   - If app was backgrounded for >2 minutes, lock viewport until biometric re-verification succeeds.
3. Grace Period Manager:
   - Maintain in-memory timestamp valid for 5 minutes after any successful verification or QR scan.
4. Unit tests:
   - Inactivity duration calculations and threshold tests.
   - Grace period expiration tests.
5. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Shift start prompts biometric auth before opening camera feed.
- [ ] Returning from background after >2 minutes prompts biometric unlock.
- [ ] Grace period avoids redundant prompts within 5-minute window.
- [ ] Unit tests pass cleanly.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
