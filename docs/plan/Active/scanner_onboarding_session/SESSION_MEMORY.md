# SESSION MEMORY — scanner_onboarding_session

## Active state

- Focused app: `scanner-app`
- Workflow stage: `checking` (Phase 01 complete)
- Plan path: `docs/plan/Active/scanner_onboarding_session/`
- Branch: `feat/scanner_onboarding_session`
- Last phase completed: **01 — Security wiring & QR fail-closed**
- Exact next action: `/dev` Phase 02 (onboarding wizard)
- Do not `/certify` until Phase 05 device evidence lands

## Durable decisions

- Keep single-shell `App.tsx` model; extract modules when wiring (no Expo Router rewrite).
- Unlock gate runs only when PIN and/or biometry enrolled; first-run skips until Phase 02 wizard.
- Empty `EXPO_PUBLIC_QR_SECRET` fails closed unless `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR`.
- Cursor is Tool 1 for mobile phases; obey CLI 80% limit before paid CLIs.
- Pilot owned steps: Security scans the QR; Offline scan sync.

## Discovered gotchas

- `nativeTokensNewEra` spacing keys are `space-050`…`space-600` (not base `spacing.sm`).
- App imports tokens via relative `../../packages/ui/src/tokens`.
- Pre-existing scanner `tsc` errors in Jest test files (`global`, `@jest/globals`).

## State handoff

- Modified: `App.tsx`, `DeviceUnlockScreen.tsx`, `qr-secret.ts`, `device-unlock.ts` (+ tests)
- Tests: 81 passed / 6 suites
- Lint: green
- Not committed (await `/github` or explicit commit)

## Context budget

- Loaded: L0, L1, L2, L3 (phase 01), L5
- Not loaded: L4 schema (no DB changes this phase)
