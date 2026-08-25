# Phase 5: GateAI Arrival Pre-Clearance, Arabic RTL Audit & Full Certification

## Primary Role

QA / MOBILE / DESIGN

## Tool Selection

- **Tool 1**: Cursor IDE (Arrival delegator & RTL audit)
- **Tool 2**: Opencode CLI (Full test suite execution)

## Context

- **Focused Apps**: `apps/resident-mobile`, `apps/marketing`, `apps/scanner-app`
- **Scope**: GateAI arrival delegator, Arabic RTL strings, full test suites.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Implement GateAI arrival pre-clearance rules, certify 100% Arabic RTL design quality across mobile sharing workflows, and run full test suites.

## Scope (In)

1. GateAI Arrival Delegator:
   - Evaluates arrival event and emits resident push notification ("Your guest [Name] just arrived at North Gate").
2. Arabic RTL Localization Audit:
   - Review SMS/WhatsApp sharing strings, mobile widgets, and guest landing page.
3. Automated Test Certification:
   - Run full unit tests across all affected workspaces.
   - Verify 0 TypeScript errors and 0 lint warnings.
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] Arrival delegator formats accurate resident arrival alerts.
- [ ] Arabic RTL localization is 100% compliant and natural.
- [ ] All automated test suites pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
