# Phase 4: Master Scan Home Screen (ADS High Density)

## Primary role

FRONTEND

## Preferred tool

- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [x] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Focused app / scope:** `scanner-app` only
- **Depends on:** Phase 03 shift session (show active shift widget)
- **Packages:** `@gate-access/ui/tokens` (`nativeTokens` — not raw `token()` CSS vars)
- **Rules:** pnpm only; ADS only; 8pt grid; logical layout; no new unsigned QR paths
- **Refs:** `PLAN_scanner_onboarding_session.md`, `TASKS_*.md`,
  `docs/audits/scanner-app/AUDIT_2026-07-30.md`

## Goal

> Redesign the Scanner Home Screen with a high-density, ADS-compliant
> dashboard and a master floating action button for scanning.

## Scope (in)

- Mobile Dashboard Redesign using ADS `compact` density tokens.
- **Master Scan FAB**: Middle-aligned, 72px, high-contrast action.
- Live Shift Widget: Displays active time, current Location (Gate), and status.
- Stats Grid: Scans today, Pending alerts, and System health (ADS `shadow.card`).
- Tab navigation refresh to match native app feel.

## Scope (out)

- Advanced page transitions (Phase 5).
- Global inactivity timeout logic (Phase 5).

## Steps (ordered)

1. Redesign `apps/scanner-app/src/screens/main/home-screen.tsx` (ADS `ds-surface`).
2. Build `apps/scanner-app/src/components/home/master-scan-fab.tsx` (centered
   at bottom, above tab bar).
3. Implement `apps/scanner-app/src/components/home/shift-info-widget.tsx` (Live
   timer component).
4. Create `apps/scanner-app/src/components/common/stats-grid-item.tsx` (using
   ADS `radius.large` and semantic borders).
5. Ensure 100% adherence to 8pt grid with logical spacing.
6. Run `pnpm turbo lint --filter=scanner-app`
7. Run `pnpm turbo typecheck --filter=scanner-app`
8. Run `pnpm turbo test --filter=scanner-app`
9. Commit: `git commit -m "feat(scanner): high-density home dashboard with
ADS-compliant master scan action"`

## Acceptance criteria

- [ ] All components use `ds-*` tokens and `space` scale correctly.
- [ ] Master Scan FAB is accessible and does not overlap with critical content.
- [ ] Live timer correctly reflects `ShiftLog.startTime`.
- [ ] High-density cards perform well (no z-index flicker).
- [ ] All tests pass (`pnpm turbo test --filter=scanner-app`)
- [ ] Build green (`pnpm turbo build --filter=scanner-app`)
- [ ] No regression on performance or security metrics.
