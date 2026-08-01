# SESSION MEMORY — scanner_onboarding_session

## Active state

- Focused app: `scanner-app`
- Workflow stage: `checking` (app-level pilot-readiness stage; unchanged by phase work — see gotcha below)
- Plan path: `docs/plan/Active/scanner_onboarding_session/`
- Branch: `feat/scanner-phase-03-shift`
- Last phase completed: **04 — Master Scan Home Screen** (code + tests + lint + typecheck green; NOT committed)
- Exact next action: review/commit Phase 04 work (awaiting explicit go-ahead), then `/dev` Phase 05
- Do not `/certify` until Phase 05 device evidence lands

## Durable decisions

- Keep single-shell `App.tsx` model; onboarding is a step-index navigator (no Expo Router rewrite).
- Auth flow: login → onboarding (if needed) → unlock → scanner shell (tabs: **Home** [new, default], Scan, Today, Log, Chat, Settings).
- Unlock gate runs only when PIN and/or biometry enrolled.
- Empty `EXPO_PUBLIC_QR_SECRET` fails closed unless `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR`.
- Shift APIs use `/api/scanner/shift/start|end|active` (TASKS naming); association via `auditTrail.shiftLogId` (no schema migration this phase).
- Cursor is Tool 1 for mobile phases (this session executed directly instead — no Cursor session available).
- Prefer **new draft PR** after a merge — do not force-push onto merged PR #205 (already merged 2026-08-01, into `master`).
- **Phase 04**: Home screen is additive, not a replacement for the Scan tab — FAB routes into the existing (untouched) camera flow. Camera-permission gating still wraps the whole tab set (pre-existing, not changed this phase).

## Discovered gotchas

- `nativeTokensNewEra` spacing keys are `space-050`…`space-600`; there is **no** `radius.large` or `shadow.card` token — use hardcoded 16–20px radius + `shadows.satinRaised`/`shadows.brandGlow`, matching sibling files.
- Jest tests that touch SecureStore must `jest.mock('expo-secure-store')` explicitly.
- Pre-existing scanner `tsc` errors in Jest test files (`global`, `@jest/globals`) — 49 as of Phase 04, all pre-existing, none in new/modified files.
- `ShiftLog` has no `deletedAt`; `ScanLog` has no `shiftLogId` column yet.
- **workflow-v2 `stage` is per-app, not per-phase.** `NEXT_STAGE` only allows `checking → pilot-ready`; it does not cycle back to `developing` for each new TASKS phase. Phase progress lives in `TASKS_*.md` / `phase_logs/` / `state.json`'s `apps.scanner-app.selection.phase`, not in `stage`. Don't try to `workflow-v2 transition` between phases within the same plan.
- `jest.config.js`'s `testMatch` is `**/*.test.ts` only — **no `.tsx` component tests run** (no `react-test-renderer`/`@testing-library/react-native` installed either). Component files (widgets/screens) are untested at the unit level by design in this app; extract any non-trivial logic (timers, aggregation, formatting) into plain `.ts` modules and test those instead (see `duty-timer.ts` / `duty-stats.ts`).
- `pnpm turbo build --filter=scanner-app` (`expo export`) currently fails in this environment on a `@babel/core` 7-vs-8 version mismatch inside `expo-modules-autolinking`'s native-config resolution — pre-existing toolchain issue, not caused by app source; lint/typecheck/test are the reliable green signals here.
- Local-day boundary tests must build fixtures with the local `Date` constructor (`new Date(y,m,d,h,mi,s)`), not fixed UTC ISO strings — otherwise the test is timezone-fragile (caught during Phase 04 TDD).

## State handoff

- Phase 04: home dashboard (shift widget, stats grid, master scan FAB), wired as a new default tab in `App.tsx`; existing scanner/shift/security flows untouched.
- Files added: `src/lib/duty-timer.{ts,test.ts}`, `src/lib/duty-stats.{ts,test.ts}`, `src/components/common/stats-grid-item.tsx`, `src/components/home/{shift-info-widget,master-scan-fab}.tsx`, `src/screens/main/home-screen.tsx`. File modified: `App.tsx` (activeTab union + Home render branch + bottom nav entry).
- Test/lint/typecheck all green; `expo export` build blocked by a pre-existing environment issue (see gotchas).
- **Not committed** — `/dev` governance leaves git delivery to the bounded-loop/`ship-phase` path; needs explicit authorization before `git commit`/push.

## Context budget

- Loaded: L0, L1, L2, L3 (phase 04), L5, L6 (phase 01–03 logs)
- Not loaded: L4 full schema dump (not needed — no DB/API changes this phase)
