# SESSION MEMORY — scanner_onboarding_session

## Active state

- Focused app: `scanner-app`
- Workflow stage: `checking` (Phase 02 complete)
- Plan path: `docs/plan/Active/scanner_onboarding_session/`
- Branch: `feat/scanner_onboarding_session` (draft PR #204 open)
- Last phase completed: **02 — Onboarding wizard UI**
- Exact next action: `/github` then `/dev` Phase 03
- Do not `/certify` until Phase 05 device evidence lands

## Durable decisions

- Keep single-shell `App.tsx` model; onboarding is a step-index navigator (no Expo Router rewrite).
- Auth flow: login → onboarding (if needed) → unlock → scanner.
- Unlock gate runs only when PIN and/or biometry enrolled.
- Empty `EXPO_PUBLIC_QR_SECRET` fails closed unless `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR`.
- Activation-scan onboarding step deferred; camera permission is the Phase 02 gate finish.
- Cursor is Tool 1 for mobile phases.

## Discovered gotchas

- `nativeTokensNewEra` spacing keys are `space-050`…`space-600`.
- Jest tests that touch SecureStore must `jest.mock('expo-secure-store')` explicitly.
- Pre-existing scanner `tsc` errors in Jest test files (`global`, `@jest/globals`).

## State handoff

- Phase 02 files: onboarding flag, navigator, slides, StepIndicator, App wiring
- Tests: 84 passed / 7 suites
- Lint: green
- Not committed (await `/github`)

## Context budget

- Loaded: L0, L1, L2, L3 (phase 02), L5, L6 (phase 01 log)
- Not loaded: L4 schema
