# Phase 4: ADS Master Scan Home Screen Redesign & Real-Time Telemetry

---

## Phase 4: ADS Master Scan Home Screen Redesign & Real-Time Telemetry

### Primary role

FRONTEND / MOBILE

### Preferred tool

- [x] Cursor IDE — UI/visual layout
- [ ] OpenCode CLI — code generation, refactors
- [ ] Kilo CLI — agentic verification

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: `apps/scanner-app` (Expo SDK 57 / React Native)
- **Design Tokens**: `@gateflow/ui/tokens` (`nativeTokens`). High-contrast dark mode. 8pt spatial grid.
- **Refs**: [`docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/scanner_onboarding_session/PLAN_scanner_onboarding_session.md)

### Goal

Redesign the primary mobile dashboard into an operational command center featuring a 72x72px Master Scan Action button, real-time duty telemetry widget, and recent scan feed.

### Scope (in)

- Complete overhaul of `HomeScreen.tsx` using ADS layout tokens.
- Duty Telemetry Card (Gate name, elapsed shift timer, today's approved/denied scan tallies).
- Central 72x72px Master Scan Floating Action Button (`nativeTokens.colors.blue700` with subtle elevation glow) for <1s camera launch.
- Recent scan event feed with status badges (Approved, Denied, Flagged).
- Offline queue sync badge in header.
- Unit tests for Home dashboard components.

### Scope (out)

- Inactivity timeout guard (Phase 5).
- Arabic RTL deep audit (Phase 5).

### Steps (ordered)

1. Redesign `src/screens/home/HomeScreen.tsx` using ADS 8pt spatial grid.
2. Build `src/components/home/DutyTelemetryCard.tsx` displaying live timer and scan stats.
3. Build `src/components/home/MasterScanFab.tsx` (72x72px circular action).
4. Implement `src/components/home/RecentScansList.tsx` with high-density status rows.
5. Write unit tests in `src/screens/home/HomeScreen.test.tsx`.
6. Run `pnpm --filter scanner-app test`.
7. Create `docs/plan/Draft/scanner_onboarding_session/phase_logs/PHASE_LOG_phase_04.md`.
8. Commit: `git commit -m "feat(scanner-app): redesign home screen with master scan fab and telemetry"`

### Acceptance criteria

- [ ] Master Scan FAB launches camera scanner in <1s.
- [ ] Duty telemetry widget displays accurate live shift duration and scan counts.
- [ ] Zero un-themed raw hex colors (100% `nativeTokens` usage).
- [ ] All unit tests passing green.
