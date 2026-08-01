# SESSION MEMORY — scanner_onboarding_session

## Active state

- Focused app: `scanner-app`
- Workflow stage: `checking` (app-level pilot-readiness stage; unchanged by phase work — see gotcha below)
- Plan path: `docs/plan/Active/scanner_onboarding_session/`
- Branch: `feat/scanner-phase-05-guard` (PR [#210](https://github.com/iDorgham/Gateflow/pull/210))
- Last phase completed (code): **05 — Polish, BiometricGuard, RTL, error boundaries** (device-evidence steps explicitly deferred — see below). Committed.
- Exact next action: capture the two device-evidence items before `/check` → `/pilot`
- **Do not `/certify`** — blocked on device evidence for Phase 05's two owned pilot steps (signed-QR scan, offline enqueue+sync). `docs/audits/scanner-app/PILOT_GATE_*.json` has not been touched by Phase 05.
- Phase 04 (`feat/scanner-phase-04-home`) is done: PR [#208](https://github.com/iDorgham/Gateflow/pull/208) merged into `master` 2026-08-01T11:43:43Z (includes a CodeRabbit autofix, `fb982b3c`, that added error handling to `home-screen.tsx`'s `loadStats` — already reconciled into this branch's version of that file).

## Durable decisions

- Keep single-shell `App.tsx` model; onboarding is a step-index navigator (no Expo Router rewrite).
- Auth flow: login → onboarding (if needed) → unlock → scanner shell (tabs: **Home** [default], Scan, Today, Log, Chat, Settings) → **BiometricGuard** re-locks to the same unlock screen after 5 min inactivity or backgrounding.
- The unlock gate runs only when the user has enrolled a PIN and/or biometry.
- Empty `EXPO_PUBLIC_QR_SECRET` fails closed unless `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR`.
- Shift APIs use `/api/scanner/shift/start|end|active` (TASKS naming); association via `auditTrail.shiftLogId` (no schema migration this phase).
- **Motion polish uses RN's built-in `Animated` API, not `react-native-reanimated`** — that dependency isn't installed for `scanner-app` (only `resident-mobile` has it); adding a new native module for polish alone wasn't worth the build risk this session. `FadeIn` (`src/components/common/fade-in.tsx`) covers opacity/transform entrance animation.
- **BiometricGuard never handles the PIN/biometric credential itself** — it only detects inactivity/backgrounding and delegates to the existing `DeviceUnlockScreen` (Phase 01) for the actual unlock.
- Prefer a **new draft PR** after a merge — don't push onto an already-merged branch (#205, #208 precedent). Phase 05 continues on **`feat/scanner-phase-05-guard`**, a fresh branch cut from `master` after #208 merged.

## Discovered gotchas

- `nativeTokensNewEra` spacing keys are `space-050`…`space-600`; there is **no** `radius.large` or `shadow.card` token — use hardcoded 16–20px radius + `shadows.satinRaised`/`shadows.brandGlow`, matching sibling files.
- Jest tests that touch SecureStore must `jest.mock('expo-secure-store')` explicitly.
- Pre-existing scanner `tsc` errors in Jest test files (`global`, `@jest/globals`) — unrelated to any file touched in Phases 04–05.
- `ShiftLog` has no `deletedAt`; `ScanLog` has no `shiftLogId` column yet.
- **workflow-v2 `stage` is per-app, not per-phase.** `NEXT_STAGE` only allows `checking → pilot-ready`; phase progress lives in `TASKS_*.md` / `phase_logs/` / `state.json`'s `apps.scanner-app.selection.phase`, not in `stage`.
- `jest.config.js`'s `testMatch` is `**/*.test.ts` only — **no `.tsx` component tests run** (no `react-test-renderer`/`@testing-library/react-native` installed). Extract non-trivial logic (timers, aggregation, formatting, lock-timeout math) into plain `.ts` modules and test those instead (`duty-timer.ts`, `duty-stats.ts`, `inactivity.ts`).
- `pnpm turbo build --filter=scanner-app` (`expo export`) fails in this environment on a `@babel/core` 7-vs-8 mismatch inside `expo-modules-autolinking` — pre-existing toolchain issue, not caused by app source. `pnpm preflight` (full monorepo lint/typecheck/test/security/changelog checks) DOES pass and runs automatically as a pre-push hook.
- **Device evidence cannot be produced from this (headless CLI) session.** No physical device; the iOS Simulator's camera is a placeholder, not a real QR reader, and there's no reliable way to toggle simulator network state via the available tools. Any phase requiring "device run" evidence needs a human (or a live-driven simulator/device session) — flag this early rather than attempting to synthesize it.
- Local-day boundary tests must build fixtures with the local `Date` constructor (`new Date(y,m,d,h,mi,s)`), not fixed UTC ISO strings.

## State handoff

- Phase 04: home dashboard — shipped and merged (PR [#208](https://github.com/iDorgham/Gateflow/pull/208), CI was 19/20 green, `cubic` skipping/not-required).
- Phase 05: `BiometricGuard` + inactivity timer, motion polish (`Animated`, not Reanimated), RTL audit (no fixes needed), error boundaries + initial-loading state on Home — all shipped, tests/lint/typecheck green, **committed** (PR [#210](https://github.com/iDorgham/Gateflow/pull/210)). Device-evidence steps and `PILOT_GATE_*.json` refresh explicitly NOT done — need a real device.
- Files added this phase: `src/lib/inactivity.{ts,test.ts}`, `src/hooks/use-inactivity-timer.ts`, `src/components/security/biometric-guard.tsx`, `src/components/common/fade-in.tsx`, `src/components/common/duty-error-boundary.tsx`. Files modified: `App.tsx` (locked phase + guard wiring), `home-screen.tsx` (fade-in/error-boundary/initial-loading, reconciled with the CodeRabbit `catch`-block fix from `fb982b3c`), `onboarding-navigator.tsx` (step fade).
- Committed in PR [#210](https://github.com/iDorgham/Gateflow/pull/210).

## Context budget

- Loaded: L0, L1, L2, L3 (phase 05), L5, L6 (phase 01–04 logs)
- Not loaded: L4 full schema dump (not needed — no DB/API changes this phase)
