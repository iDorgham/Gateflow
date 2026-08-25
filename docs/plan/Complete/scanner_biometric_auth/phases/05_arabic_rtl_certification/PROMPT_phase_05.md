# Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

## Primary Role

QA / DESIGN / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Visual audit & RTL layout polish)
- **Tool 2**: Opencode CLI (Test coverage & lint checks)

## Context

- **Focused App**: `apps/scanner-app`
- **Scope**: Entire biometric auth surface, Arabic translations, ADS tokens audit, full Jest test suite.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Perform a comprehensive design system audit, verify complete Arabic RTL localization for all guard biometric prompts and modals, and certify 100% automated test coverage.

## Scope (In)

1. ADS Design System Audit:
   - Verify 100% semantic tokens from `@gate-access/ui/tokens` (`nativeTokensNewEra`).
   - Audit 8pt spacing grid consistency across biometric prompt banners and PIN modals.
2. Arabic RTL & i18n Pass:
   - Verify localized Arabic strings for all biometric dialogs, lockouts, and error states.
   - Enforce directional logical styling properties (`marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`).
3. Comprehensive Verification:
   - Run full Jest suite: `pnpm --filter scanner-app test` (100% pass).
   - Run `pnpm --filter scanner-app exec tsc --noEmit` (0 errors).
   - Run `pnpm --filter scanner-app lint` (0 errors).
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] 100% of UI elements use ADS semantic design tokens.
- [ ] Arabic RTL renders cleanly with natural guardhouse terminology.
- [ ] All automated unit tests in `apps/scanner-app` pass with 0 errors.
- [ ] Zero TypeScript errors and zero lint warnings.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
