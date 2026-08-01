# Phase Log — 05 Polish, BiometricGuard, RTL, pilot evidence

**Plan:** `scanner_onboarding_session`
**Branch:** `feat/scanner-phase-04-home` (continuing — Phase 04 is PR #208, open)
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
- Not committed — awaiting explicit go-ahead, same as Phase 04.
