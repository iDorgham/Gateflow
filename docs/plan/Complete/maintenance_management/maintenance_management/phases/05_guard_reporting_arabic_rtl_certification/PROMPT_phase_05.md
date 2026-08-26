# Phase 5: Guard Hardware Reporting, Arabic RTL Audit & Full Certification

## Primary Role

QA / DESIGN / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Scanner quick-report drawer & RTL inspection)
- **Tool 2**: Opencode CLI (Full test suite execution & typecheck)

## Context

- **Focused Apps**: `apps/scanner-app`, `apps/client-dashboard`, `apps/resident-mobile`
- **Scope**: Guard quick reporting, Arabic RTL layout verification, full test suites.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Implement quick gate hardware reporting for security guards in the Scanner App, verify 100% Arabic RTL design perfection, and certify all test suites across the maintenance domain.

## Scope (In)

1. Guard Hardware Quick-Report:
   - Quick-action button in Scanner App header for reporting broken barrier arms, loop detectors, or gate lighting failures.
   - Automatically attaches current active gate ID and creates `URGENT` work order.
2. Arabic RTL Localization Audit:
   - Verify Arabic maintenance vocabulary across all dashboards and mobile views.
   - Audit directional layout mirroring and contrast ratios (WCAG 2.2 AA).
3. Automated Test Certification:
   - Execute all unit and integration test suites across client dashboard, scanner app, and core packages.
   - Verify 0 TypeScript errors and 0 lint warnings.
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] Guard quick-report generates urgent gate maintenance work order.
- [ ] Arabic RTL renders cleanly with natural enterprise facility management terms.
- [ ] All automated test suites pass with 100% green status.
- [ ] Zero TypeScript errors and zero lint warnings.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
