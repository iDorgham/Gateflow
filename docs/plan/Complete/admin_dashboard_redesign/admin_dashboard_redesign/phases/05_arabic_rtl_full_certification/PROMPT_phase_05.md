# Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

## Primary Role

QA / DESIGN / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (RTL audit & ADS token inspection)
- **Tool 2**: Opencode CLI (Full test suite execution & typecheck)

## Context

- **Focused App**: `apps/admin-dashboard`
- **Scope**: Entire admin interface, Arabic translation coverage, ADS tokens audit, full test suite.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Conduct a full design system token audit, verify 100% Arabic RTL layout perfection, and certify all automated unit tests in `apps/admin-dashboard`.

## Scope (In)

1. ADS Design Tokens Audit:
   - Verify 100% semantic design tokens from `@gate-access/ui/tokens` (`nativeTokensNewEra`).
   - Audit color contrast in light and dark modes (WCAG 2.2 AA compliant).
2. Arabic RTL Localization:
   - Audit all enterprise admin terminology in Arabic.
   - Enforce directional logical CSS properties (`marginStart`, `paddingStart`, `borderStart`).
3. Automated Test Certification:
   - Run full test suite: `pnpm --filter admin-dashboard test` (100% pass).
   - Run `pnpm --filter admin-dashboard exec tsc --noEmit` (0 errors).
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] 100% of UI elements use ADS semantic design tokens.
- [ ] Arabic RTL renders cleanly with natural enterprise admin terminology.
- [ ] Automated tests in `apps/admin-dashboard` pass with 100% green status.
- [ ] Zero TypeScript errors and zero lint warnings.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
