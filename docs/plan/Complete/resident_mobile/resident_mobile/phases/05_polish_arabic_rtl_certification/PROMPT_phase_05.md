# Phase 5: Polish, Arabic RTL & Certification

## Primary Role

QA / MOBILE / DESIGN

## Tool Selection

- **Tool 1**: Cursor IDE (Visual audit & RTL layout polish)
- **Tool 2**: Claude CLI (Deep architectural & security review)

## Context

- **Focused App**: `apps/resident-mobile`
- **Scope**: Entire `resident-mobile` codebase, Arabic localization, ADS tokens audit, error boundaries, and full test suite.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Conduct a thorough design system audit, ensure full Arabic RTL bi-directional layout compliance, harden error handling, and verify all automated tests pass.

## Scope (In)

1. ADS Design System Audit:
   - Verify zero hardcoded hex colors or plain styles (enforce `nativeTokensNewEra`).
   - Audit 8pt spacing grid consistency across all screens and components.
2. Arabic RTL & i18n Pass:
   - Verify full translation coverage across all tabs, dialogs, and button labels.
   - Enforce logical styling properties (`marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`).
   - Test layout flip in Arabic locale.
3. Resilience & Error Boundaries:
   - Add `ErrorBoundary` components around tabs and dynamic lists.
   - Add loading skeleton screens and pull-to-refresh spinners.
4. Comprehensive Testing & Verification:
   - Run `pnpm --filter resident-mobile test` (100% pass).
   - Run `pnpm --filter resident-mobile exec tsc --noEmit` (0 errors).
   - Run `pnpm --filter resident-mobile lint` (0 errors).
5. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] 100% of UI elements use ADS semantic design tokens.
- [ ] Arabic RTL renders logically without clipped or reversed text.
- [ ] All automated unit and integration tests pass with 0 errors.
- [ ] Zero TypeScript errors and zero lint warnings.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
