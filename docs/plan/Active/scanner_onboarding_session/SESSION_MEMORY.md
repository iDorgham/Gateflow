# SESSION MEMORY — scanner_onboarding_session

## Active state

- Focused app: `scanner-app`
- Workflow stage: `checking` (app-level pilot-readiness stage; unchanged by phase work — see gotcha below)
- Plan path: `docs/plan/Active/scanner_onboarding_session/`
- Working tree at `/dev` 2026-08-14: `master` @ `283ed809`, tracking `origin/master`. Unrelated dirty files present (`apps/client-dashboard/.gitignore`, untracked `AGENTS.md`/`CLAUDE.md`, root `package.json` 0.3.3→0.3.4) — **do not mix** with scanner evidence work. Focused-diff `scope-diff scanner-app` is currently invalid because of the parked client-dashboard `.gitignore`.
- Phase 05 **code** shipped: PR [#210](https://github.com/iDorgham/Gateflow/pull/210) merged 2026-08-01T15:15:21Z (`feat/scanner-phase-05-guard`). Local branch of that name is gone.
- Phase 05 **device evidence** is still open. `/dev scanner_onboarding_session` on 2026-08-14 re-checked the blocker and did **not** refresh `PILOT_GATE_*.json`.
- Exact next action: Expo CLI logged in as **dorgham**. In Expo Go, sign in as **dorgham**, then tap **Try again** on `exp://192.168.1.7:8081`. If Metro was started before login, restart it first.
- **Do not `/certify`** — blocked on device evidence for Phase 05's two owned pilot steps (signed-QR scan, offline enqueue+sync).
- Phase 04 is merged: PR [#208](https://github.com/iDorgham/Gateflow/pull/208).
- `/dev` 2026-08-22 checkpoint: branch `feat/scanner-runtime-proof` at
  `bf5ad401`; workflow remains `checking`. Fresh checks confirmed Xcode
  26.1.1 / Swift 6.2.1 and five latest EAS iOS builds all errored. Execution
  stopped before mutation because the dirty scanner runtime slice overlaps the
  phase and includes the explicitly forbidden AppDelegate compatibility
  workaround. Exact next action: establish ownership, restore the AppDelegate
  workaround to the SDK 57 template, then queue a physical-device development
  build with interactive Apple credentials.
- Follow-up 2026-08-22: user authorized restoring the AppDelegate workaround;
  that file now exactly matches `HEAD`. A physical EAS development build could
  not be queued because the locally available Apple ID has no Developer team,
  while the remote credential store lacks the credentials needed for internal
  distribution. Resume with a paid-team Apple account or a valid local
  `credentials.json`; do not store credentials or secrets in this plan.
- No-paid-account path completed 2026-08-22: SDK 57 Expo Go was signed with
  Apple Personal Team `U56S63Y79Q` through `sign.expo.dev` and installed on the
  connected iPhone over USB. Certificate expiry is 2026-08-29. Metro is running
  at `exp://192.168.1.11:8081`; next action is to open that URL in Expo Go and
  capture the two owned P0 flows without PII.

## Durable decisions

- Keep single-shell `App.tsx` model; onboarding is a step-index navigator (no Expo Router rewrite).
- Auth flow: login → onboarding (if needed) → unlock → scanner shell (tabs: **Home** [default], Scan, Today, Log, Chat, Settings) → **BiometricGuard** re-locks to the same unlock screen after 5 min inactivity or backgrounding.
- The unlock gate runs only when the user has enrolled a PIN and/or biometry.
- Empty `EXPO_PUBLIC_QR_SECRET` fails closed unless `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR`.
- Shift APIs use `/api/scanner/shift/start|end|active` (TASKS naming); association via `auditTrail.shiftLogId` (no schema migration this phase).
- **Motion polish uses RN's built-in `Animated` API, not `react-native-reanimated`** — that dependency isn't installed for `scanner-app` (only `resident-mobile` has it); adding a new native module for polish alone wasn't worth the build risk this session. `FadeIn` (`src/components/common/fade-in.tsx`) covers opacity/transform entrance animation.
- **BiometricGuard never handles the PIN/biometric credential itself** — it only detects inactivity/backgrounding and delegates to the existing `DeviceUnlockScreen` (Phase 01) for the actual unlock.
- Prefer a **new draft PR** after a merge — don't push onto an already-merged branch (#205, #208 precedent). Phase 05 code already merged via PR #210; remaining evidence work should be a **new** branch off current `master`, not a revival of `feat/scanner-phase-05-guard`.
- **Native iOS for SDK 57 requires Xcode 26.4+ / Swift 6.3.** Do not patch `SWIFT_VERSION` / `AppDelegate` visibility to paper over 26.1.1. This 2017 Intel Mac cannot satisfy that floor locally.

## Discovered gotchas

- `nativeTokensNewEra` spacing keys are `space-050`…`space-600`; there is **no** `radius.large` or `shadow.card` token — use hardcoded 16–20px radius + `shadows.satinRaised`/`shadows.brandGlow`, matching sibling files.
- Jest tests that touch SecureStore must `jest.mock('expo-secure-store')` explicitly.
- Pre-existing scanner `tsc` errors in Jest test files (`global`, `@jest/globals`) — unrelated to any file touched in Phases 04–05.
- `ShiftLog` has no `deletedAt`; `ScanLog` has no `shiftLogId` column yet.
- **workflow-v2 `stage` is per-app, not per-phase.** `NEXT_STAGE` only allows `checking → pilot-ready`; phase progress lives in `TASKS_*.md` / `phase_logs/` / `state.json`'s `apps.scanner-app.selection.phase`, not in `stage`.
- `jest.config.js`'s `testMatch` is `**/*.test.ts` only — **no `.tsx` component tests run** (no `react-test-renderer`/`@testing-library/react-native` installed). Extract non-trivial logic (timers, aggregation, formatting, lock-timeout math) into plain `.ts` modules and test those instead (`duty-timer.ts`, `duty-stats.ts`, `inactivity.ts`).
- `pnpm --filter scanner-app build` / `expo export` succeeded on 2026-08-10 after the PR #210 Babel pin (`@babel/runtime` `^7.26.0`, root `pnpm.overrides["@babel/core"]` `^7.29.6`) plus a restored `hermes-compiler` module. That path is Metro/Node, not the Xcode native build. Re-verify with a fresh export if evidence work needs a bundle; do not assume the 07-30 `hermes-compiler` gap is still open.
- **Device evidence cannot be produced until a scanner binary actually runs.** 2026-08-10: Xcode 26.1.1 + `expo-modules-core@57.0.10` (`swift_version '6.0'`) failed native `expo run:ios`; Podfile/`AppDelegate` patches were reverted. 2026-08-14 re-check: still Xcode **26.1.1 (17B100)** / Swift **6.2.1**, still `expo-modules-core@57.0.10`. Expo maintainers state SDK 56/57 need **Xcode 26.4+ / Swift 6.3** ([expo#47539](https://github.com/expo/expo/issues/47539)). Do **not** retry `SWIFT_VERSION=5.9` / access-level patches. **OS/hardware floor (2026-08-14):** `sw_vers` → macOS Sequoia **15.7.1** (24G231); `hw.model` → **MacBookPro14,3** (2017 15" Intel). Xcode 26.4 requires Tahoe **26.2+**. That model is not on Apple’s Tahoe compatibility list (Intel Tahoe is 2019 16" MBP / 2020 13" 4-port / 2019 Mac Pro / 2020 iMac). `softwareupdate --list` still _offered_ Tahoe 26.6.1 (~17 GB) plus Sequoia 15.7.9 — do not treat the catalog row as a green light, and disk is only **4.9 GiB** free. No Android SDK at `~/Library/Android/sdk`. No `eas.json`. Booted iPhone 17 Pro simulator had neither Expo Go nor `com.gateflow.scanner`. `pnpm dev:sim` (`expo start --go`) reached "Fetching Expo Go" and hung. Never invent screenshots or mark `PILOT_GATE` passed from unit tests. Practical local path: physical iPhone + Expo Go (`pnpm --filter scanner-app dev`) on the same LAN.
- **Expo Go on a physical iPhone is not the App Store app for this repo.** App Store Expo Go stops at SDK 54; scanner-app is SDK 57. Use [sign.expo.dev](https://sign.expo.dev/) (7-day free cert) or `eas go`. 2026-08-14 Expo Go attempt: Metro listens `*:8081`, dashboard `*:3001`, both reachable on localhost, both **timeout on `192.168.1.7`** — Application Firewall is on. Phone cannot load the bundle or hit the API until Node is allowed incoming. Disk now ~13 GiB free.
- Local-day boundary tests must build fixtures with the local `Date` constructor (`new Date(y,m,d,h,mi,s)`), not fixed UTC ISO strings.

## State handoff

- Phase 04: home dashboard — shipped and merged (PR [#208](https://github.com/iDorgham/Gateflow/pull/208)).
- Phase 05 code: shipped and merged (PR [#210](https://github.com/iDorgham/Gateflow/pull/210)).
- Phase 05 remaining: owned pilot steps still `partial` in `docs/audits/scanner-app/PILOT_GATE_2026-07-30.json`. `/dev` 2026-08-14 did not change product code or the gate file.
- Resume-from: after SDK 57 Expo Go is on the iPhone **and** Node is allowed through the firewall, connect to `exp://192.168.1.7:8081`, login `admin@school.demo`, start Gate 1, capture the two owned proofs. Do not attempt `expo run:ios` on 26.1.1.
- 2026-08-22 resume guard: do not continue from the current uncommitted
  `AppDelegate.swift` access-level/binding edits. They reproduce the failed
  workaround documented above. Resolve ownership before restoring them, and do
  not refresh `PILOT_GATE_OWNED` until a signed physical-device build captures
  both owned P0 flows.
- The AppDelegate guard is now resolved: `AppDelegate.swift` is clean against
  `HEAD`. The active blocker is Apple signing authority, not source code. No EAS
  physical build was queued on 2026-08-22.
- The free Expo Go route supersedes the paid EAS-build blocker for this pilot
  session. Installation is complete, but no runtime access-decision evidence
  has been captured yet; keep both owned pilot steps partial until the app is
  opened from Metro and the live flows are proven.

## Context budget

- Loaded: L0, L1, L2, L3 (phase 05), L5, L6 (phase 05 log)
- Not loaded: L4 schema dump (no DB/API changes this session)
- 2026-08-22 `/dev`: loaded L0, L1, L2, L3 (Phase 05), L5, and L6; L4
  remained unloaded because no DB/API/schema work was needed. Phase 05 log was
  updated with the blocked checkpoint.
