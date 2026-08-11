# Phase Log — 05 Polish, BiometricGuard, RTL, pilot evidence

**Plan:** `scanner_onboarding_session`
**Branch:** `feat/scanner-phase-05-guard`, cut from `master` after Phase 04's
PR [#208](https://github.com/iDorgham/Gateflow/pull/208) merged. PR
[#210](https://github.com/iDorgham/Gateflow/pull/210), open/draft.
**App:** `scanner-app`

## Scope split (agreed with user before starting)

Two of this phase's steps — "scan a signed QR on-device" and "offline
enqueue + sync on-device" — require real camera and network hardware and
dated screenshot evidence. This session has no physical device and the iOS
Simulator's camera is a placeholder (not a real QR reader), so producing
that evidence here would mean fabricating it — explicitly forbidden by this
phase's own stop conditions ("Never invent device evidence... Do not
fabricate screenshots or mark pilot passed from unit tests alone"). User
confirmed: **code-only this session, device evidence captured later.**
`docs/audits/scanner-app/PILOT_GATE_*.json` was **not touched** — both owned
steps remain in their current (blocked) state.

## What shipped

- `src/lib/inactivity.ts` — pure `shouldLock(lastActivityMs, nowMs, timeoutMs)`.
- `src/hooks/use-inactivity-timer.ts` — polls foreground inactivity every 1s
  and separately measures backgrounded duration across an `AppState`
  background→active transition (a suspended app gets no timer ticks while
  backgrounded, so that duration has to be measured at the edges).
- `src/components/security/biometric-guard.tsx` — wraps the unlocked scanner
  shell; observes touches via `PanResponder` with
  `onStartShouldSetPanResponderCapture` returning `false` (records activity,
  never consumes the touch — camera/taps/scrolls are untouched). Calls
  `onLock` after `DEFAULT_INACTIVITY_TIMEOUT_MS` (5 min) idle or backgrounded.
  Delegates all actual unlocking to the existing `DeviceUnlockScreen`
  (Phase 01) — the guard never reads, stores, or logs the PIN/biometric
  credential itself.
- `App.tsx` — added `'locked'` to `AppPhase`; merged its render branch with
  `'unlock'` (both show `DeviceUnlockScreen`, both resolve via the same
  `handleUnlocked`); wrapped the `'scanner'` branch in `<BiometricGuard>`.
  Shift session (`useShiftSession`) stays mounted/hydrated across a
  lock/unlock cycle — locking blocks UI access, not the duty session; on
  unlock, `ScannerScreen` remounts fresh (activeTab resets to Home), matching
  the existing post-onboarding-unlock behavior.
- `src/components/common/fade-in.tsx` — mount-in fade+rise using React
  Native's built-in `Animated` API (`useNativeDriver: true`, only
  opacity/transform animated).
- `src/components/common/duty-error-boundary.tsx` — class-component error
  boundary (hooks have no `componentDidCatch` equivalent) with a retry
  button; wraps `ShiftInfoWidget` and the stats grid independently on Home
  so one broken widget doesn't take the other down.
- `home-screen.tsx` — added `initialLoading` state (spinner instead of a
  0-then-populate flash on first stats load); wrapped the shift widget and
  stats grid each in `FadeIn` + `DutyErrorBoundary`.
- `onboarding-navigator.tsx` — step content wrapped in `<FadeIn key={step}>`
  so each wizard step transition fades in.

## Commands / evidence

```bash
npx tsc --noEmit -p tsconfig.json
# Only pre-existing src/lib/debug-test.ts (@jest/globals) error remains — zero
# errors in any file touched this phase.
pnpm --filter scanner-app lint    # green (one unescaped-apostrophe fix applied)
pnpm --filter scanner-app test
# Test Suites: 12 passed | Tests: 136 passed (5 new: inactivity.test.ts)
```

## Decisions / scope notes

- **Reanimated → `Animated` substitution.** `react-native-reanimated` is
  installed in the workspace but only as a dependency of `resident-mobile`,
  not `scanner-app`. Adding it here means a new native module + babel-plugin
  wiring with no way to verify on a real/simulated device this session — too
  much build risk for "polish." RN's built-in `Animated` API with
  `useNativeDriver: true` delivers the same fade/rise motion for this scope
  (opacity + transform only) without a new dependency. Documented per this
  plan's established "naming alias" precedent (Phase 03).
- **RTL audit result: no code changes needed.** Audited every wizard file
  (`welcome-screen`, `security-setup-screen`, `permissions-screen`,
  `onboarding-navigator`, `StepIndicator`) and every Phase 04 home file for
  `left`/`right`/`marginLeft`/`marginRight`/`paddingLeft`/`paddingRight`.
  None found — all directional layout already uses `flexDirection: 'row'`
  (RN auto-mirrors this under `I18nManager.isRTL`) or direction-agnostic
  `textAlign: 'center'`. Visual confirmation on a simulator/device with the
  system language set to Arabic is still open — it's screenshot evidence,
  deferred with the device-evidence items above.
- **BiometricGuard timeout: 5 minutes (`DEFAULT_INACTIVITY_TIMEOUT_MS`).**
  Not specified in the PROMPT; chosen as a reasonable default balancing
  re-lock security against interrupting an on-duty guard mid-shift. Exported
  as a named constant so it's a one-line change if ops wants a different
  value.
- **Lock does not end the shift or clear `useShiftSession` state** —
  re-locking is a UI access gate, not a duty/session boundary. Only sign-out
  (`handleLogout`, unchanged) ends the shift.
- Followed the same relative-import depth convention as Phase 04 for
  `nativeTokensNewEra` in the two new `components/common/` files.

## Explicitly deferred (do not treat as done)

- Device run: live scan of a signed QR + evidence capture.
- Device run: offline enqueue + reconnect sync + evidence capture.
- `docs/audits/scanner-app/PILOT_GATE_*.json` — **untouched**, both owned
  steps stay in their pre-phase-05 status.
- Visual RTL check (system language = Arabic) via simulator/device screenshot.

## Next

- Capture the two device-evidence items on a real device (or a simulator
  session someone drives live), store under
  `docs/audits/scanner-app/evidence/<date>/`, then refresh
  `PILOT_GATE_*.json` for the two owned steps.
- Once evidence lands, this is the **last phase** of `scanner_onboarding_session`
  — move `Active/scanner_onboarding_session/` → `Complete/` and the user can
  run `/check` → `/pilot` → `/certify` (not run automatically per this
  phase's own stop condition).

- Committed and pushed on PR #210. A CodeRabbit review (triggered manually
  after an initial rate-limit) flagged a real critical bug — `onLock`'s
  identity churned every `App` render, so any unrelated re-render silently
  reset the inactivity clock via the effect's dependency array — fixed with
  a latest-ref pattern in `use-inactivity-timer.ts` plus `useCallback` on
  `handleInactivityLock` in `App.tsx`, placed before the component's first
  conditional return. CodeRabbit's beta autofix landed the same fix
  independently across two separate autofix runs (PR #211, then PR #212
  on top of it) but reproduced the rules-of-hooks violation both times;
  each was reconciled by hand to keep the corrected placement. PR #212's
  autofix additionally included a real fix for the pre-existing
  `@babel/core` 7-vs-8 mismatch that has blocked `expo export` since
  Phase 04 — `apps/scanner-app/package.json`'s `@babel/runtime` reverted
  to `^7.26.0`, root `pnpm.overrides["@babel/core"]` narrowed from
  `>=7.29.6` to `^7.29.6`, plus a full `pnpm-lock.yaml` relock. Verified
  with `pnpm install` + the full monorepo preflight (changelog/ADS/
  bootstrap-routes checks, `turbo lint` 25/25, `turbo typecheck` 22/22,
  `turbo test` 13/13 — zero failures across all 18 workspace packages)
  before pushing. `expo export` for `scanner-app` is genuinely further
  along now — Metro bundles all 2546 modules instead of failing at
  config-load time — but still fails, on a different, previously-masked
  issue (`Cannot find module 'hermes-compiler/package.json'` during
  Hermes bytecode compilation). Not a regression from this change; a
  separate pre-existing environment gap this fix simply unblocked the
  path to. Two documentation nits in this file and `SESSION_MEMORY.md`
  were also fixed.

## 2026-08-10 device-evidence attempt (still blocked, new root cause found)

A live session attempted the two device-evidence items on the iOS Simulator
with Mac-camera passthrough (this session had simulator tooling the earlier
headless-CLI sessions didn't). Got as far as: local Postgres seeded org
(`Gateway Academy`, `gate-school-1`), `client-dashboard` dev server up,
`admin@school.demo`/`password123` confirmed (argon2, `scans:view`, no gate
assignment restriction), and a real HMAC-signed test QR generated via
`/qr/create-test`. Never reached the actual scan — **`scanner-app` cannot
currently be built on this Mac at all**, unrelated to camera/device
availability:

- This Mac has only **Xcode 26.1.1** installed (no older fallback).
  `expo-modules-core@57.0.10` (part of the Expo SDK 57 bump merged to
  `master` via PR #245) declares `swift_version '6.0'`, and Xcode 26.1.1's
  Swift 6 strict-concurrency checker rejects the library's own
  `EventEmitter.swift` despite its `nonisolated(unsafe)` workaround.
- Tried a scoped `Podfile` `post_install` patch forcing `SWIFT_VERSION=5.9`
  on any pod target requesting 6.0 (~13 min `pod install` + ~1hr build to
  fail). That surfaced a second, unrelated error: `AppDelegate.swift`'s
  plain `import Expo` became ambiguous against the generated
  `ExpoModulesProvider.swift`'s `internal import Expo`. Fixed that
  (`internal import Expo`), which surfaced a third: `public class
AppDelegate: ExpoAppDelegate` — can't subclass an now-internal type as
  `public`. Fixed that (dropped `public`), which surfaced a fourth:
  `bindReactNativeFactory` (from the prebuilt React-Core binary framework)
  became unresolvable — likely an ABI-visibility break from changing the
  app target's own access level against a prebuilt binary framework built
  under different assumptions.
- Four builds, four different Swift 6 errors, none of them fabricatable or
  quick-fixable. Per user decision, all patches were **reverted**
  (`Podfile` and `AppDelegate.swift` are back to their pre-session state,
  confirmed via `git diff` — clean) rather than continuing to drill through
  an unknown-depth chain of toolchain-compatibility errors.
- **Root cause is now specific, not generic**: this isn't "no physical
  device" anymore, it's "Expo SDK 57 + Xcode 26.1.1 don't compile together
  on this machine yet." Unblocking needs one of: an older Xcode installed
  alongside 26.1.1 (this Mac has none), an upstream `expo-modules-core`
  patch targeting Xcode 26's Swift compiler, or running this on a machine
  with a Cocoapods/Expo-SDK-57-compatible Xcode already installed. Retrying
  the exact same patch path without one of those changing is not expected
  to succeed differently.
- Also worth knowing for the next attempt: this Mac's disk filled to
  **1.2GB free mid-session** (CocoaPods needs several GB scratch space) —
  clear `~/Library/Developer/Xcode/DerivedData` and
  `~/Library/Caches/CocoaPods` first. The Mac also went to sleep mid-build
  once, silently pausing an in-progress `xcodebuild` for hours and killing
  the session's simulator boot / dev server / MCP connections — run
  `caffeinate -dis` for the duration of any future attempt.

Since P0 was blocked, this session instead cleared two P1 gaps from
`AUDIT_2026-08-10.md`:

- Rewrote `apps/scanner-app/README.md` — was describing a stack this app
  never had (SQLite/Prisma, `expo-barcode-scanner`, Nativewind, Expo SDK
  54, only 5 tabs). Now reflects the real stack (SecureStore, HMAC
  verified server-side via `expo-camera`, `nativeTokens`/StyleSheet, Expo
  SDK 57, the 6-tab shell including Home, and the `expo run:ios`/`android`
  native-prebuild workflow instead of Expo Go commands).
- Deleted 5 dead components that were never imported anywhere
  (`DiagnosticsOverlay`, `PassCancelDialog`, `ScanResultOverlay`,
  `QueueStatusBadge`, `SupervisorOverrideModal` — 722 lines, no tests
  referenced them).
- Split `App.tsx` (2118 lines → 198) into
  `src/screens/login/login-screen.tsx`, `src/screens/scanner/scanner-screen.tsx`
  (1258 lines — the state machine + camera/scan logic + bottom nav, still
  the largest single screen but now an isolated, coherent unit),
  `src/components/scanner/{viewfinder,decision-dialog,result-overlay,feedback-styles}`,
  and `src/lib/haptics.ts`. Pure extraction, no behavior changes — verified
  via `tsc --noEmit` (same pre-existing error count as before the split,
  all in files this session didn't touch or in a Swift-6-adjacent
  `@types/react-native` `absoluteFillObject` gap that predates this
  session), `pnpm --filter scanner-app lint` (0 errors, same pre-existing
  warnings only, zero in any new file), and
  `pnpm --filter scanner-app test` (12 suites / 136 tests — identical
  count to pre-split).
