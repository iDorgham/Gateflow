# Phase Log — 04 Master Scan Home Screen

**Plan:** `scanner_onboarding_session`
**Branch:** `feat/scanner-phase-03-shift` (continuing — Phase 03 already merged via PR #205)
**App:** `scanner-app`

## What shipped

- `src/lib/duty-timer.ts` — pure `formatElapsedDuration(startIso, nowMs)` → `HH:MM:SS`, clamps future/invalid start times to zero, does not cap hours at 24 (a shift can run past a day boundary).
- `src/lib/duty-stats.ts` — pure `countScansToday(entries, nowMs)` (local-calendar-day filter over scan history) and `getSystemStatus({ online, failedCount })` (offline → danger, failures queued → warning, else success).
- `src/components/common/stats-grid-item.tsx` — ADS stat card (icon chip + value + label), tone-driven color (default/success/warning/danger/info), `satinRaised` shadow standing in for "shadow.card" (no such token exists in `nativeTokensNewEra`; this repo's card elevation convention).
- `src/components/home/shift-info-widget.tsx` — on/off-duty status pill, live-ticking elapsed timer (own 1s `setInterval`, scoped to this component only — no parent re-renders), gate name.
- `src/components/home/master-scan-fab.tsx` — 72px centered FAB, `accessibilityRole="button"` + label, `brandGlow` shadow.
- `src/screens/main/home-screen.tsx` — composes the above; self-loads stats (today's scans from `scan-history`, pending/failed from `offline-queue`, connectivity from `expo-network`) on mount and pull-to-refresh, mirroring `TodayVisitsTab`'s self-contained data-loading pattern.
- `App.tsx` — added `'home'` to the `activeTab` union and made it the default tab (was `'scanner'`); added a Home entry to the bottom nav (first position); Master Scan FAB's `onStartScanning` sets `activeTab('scanner')`, which mounts the existing (unmodified) camera view.

## Commands / evidence

```bash
pnpm --filter scanner-app test
# Test Suites: 11 passed | Tests: 131 passed
pnpm --filter scanner-app lint  # green (expo lint / legacy ESLint config)
npx tsc --noEmit -p tsconfig.json
# 49 pre-existing errors, all in *.test.ts files (@jest/globals / global — same
# gotcha documented in PHASE_LOG_phase_01.md). No errors in new or modified files.
```

`pnpm turbo build --filter=scanner-app` (`expo export`) fails in this environment with
`[BABEL] .../expo/react-native.config.js: Requires Babel "^7.0.0-0", but was loaded
with "8.0.1"` — a pre-existing local toolchain/dependency-resolution issue in
`expo-modules-autolinking`'s native-config loader, unrelated to this phase's source
changes (the stack trace never touches app code; it fails resolving native module
configs before any bundling starts). Not attempted to fix as out of scope for a
FRONTEND-only phase; flagging for a separate dependency-hygiene pass.

## Decisions / scope notes

- **Home is additive, not a replacement for the Scan tab.** The existing camera-first
  `ScannerScreen`/`activeTab === 'scanner'` flow is untouched. Home becomes the new
  default landing tab after unlock; the FAB is a fast path into the same scanner view
  the "Scan" tab already opens. This was the smallest change consistent with "no new
  unsigned QR paths" and "no regression on ... security metrics" — the scan/shift
  logic Phase 03 hardened is not touched by this phase.
- **Camera permission gating unchanged.** `ScannerScreen`'s `!permission` /
  `!permission.granted` early-return screens still gate the _entire_ tab set,
  including Home, exactly as before. Deferring that gate to only the Scan tab/FAB
  is a real UX improvement but is a permission-flow change beyond this phase's
  stated FRONTEND/redesign scope — flagged, not made.
- **"Scans today" counts all local history entries** (pass/deny/offline/rejected),
  not just successful passes — read as "today's scan activity," matching what an
  operator glancing at the dashboard would expect from raw scan volume.
- **No `radius.large` / `shadow.card` tokens exist** in `nativeTokensNewEra` (the
  token set `App.tsx` and sibling screens actually import). Used the same values/
  shadow already established by sibling files: 16–20px radius, `shadows.satinRaised`
  for elevated cards, `shadows.brandGlow` for the FAB (same as `loginButton`).
- Followed the existing relative-import depth convention for `nativeTokensNewEra`
  (`../../../../../packages/ui/src/tokens` from `components/home/`,
  `components/common/`, and `screens/main/` — matches `components/onboarding/`).

## Deferred (per PROMPT scope-out, confirmed unaffected)

- Advanced page transitions — Phase 5.
- Global inactivity timeout / `BiometricGuard` — Phase 5.
- RTL / Arabic pass for the new Home screen — Phase 5.

## Next

- Phase 05 — Polish, Guard, RTL, pilot evidence (last phase of this plan).
- Local commit for this phase's work was intentionally **not** made — `/dev` records
  code + evidence but leaves git delivery to the bounded-loop / `ship-phase` path
  per Workflow v2 governance. Awaiting explicit go-ahead to commit.
