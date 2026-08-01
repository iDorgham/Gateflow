# SESSION MEMORY — scanner_onboarding_session

## Active state

- Focused app: `scanner-app`
- Workflow stage: `checking` (Phase 03 complete)
- Plan path: `docs/plan/Active/scanner_onboarding_session/`
- Branch: `feat/scanner-phase-03-shift` (new branch after PR #204 merged)
- Last phase completed: **03 — Shift management**
- Exact next action: `/github` (new draft PR) then `/dev` Phase 04
- Do not `/certify` until Phase 05 device evidence lands

## Durable decisions

- Keep single-shell `App.tsx` model; onboarding is a step-index navigator (no Expo Router rewrite).
- Auth flow: login → onboarding (if needed) → unlock → scanner.
- Unlock gate runs only when PIN and/or biometry enrolled.
- Empty `EXPO_PUBLIC_QR_SECRET` fails closed unless `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR`.
- Activation-scan onboarding step deferred; camera permission is the Phase 02 gate finish.
- Shift APIs use `/api/scanner/shift/start|end` (TASKS naming); association via `auditTrail.shiftLogId` (no schema migration this phase).
- Cursor is Tool 1 for mobile phases.
- Prefer **new draft PR** after a merge — do not force-push onto merged PR #204.

## Discovered gotchas

- `nativeTokensNewEra` spacing keys are `space-050`…`space-600`.
- Jest tests that touch SecureStore must `jest.mock('expo-secure-store')` explicitly.
- Pre-existing scanner `tsc` errors in Jest test files (`global`, `@jest/globals`).
- `ShiftLog` has no `deletedAt`; `ScanLog` has no `shiftLogId` column yet.

## State handoff

- Phase 03: shift start/end API, validate active-shift gate, client session + scan block
- Not committed (await `/github`)

## Context budget

- Loaded: L0, L1, L2, L3 (phase 03), L5, L6 (phase 01–02 logs)
- Not loaded: L4 full schema dump
