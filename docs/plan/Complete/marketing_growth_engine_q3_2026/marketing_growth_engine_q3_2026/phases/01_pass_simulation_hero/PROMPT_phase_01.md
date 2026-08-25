# Phase 1: Interactive Pass Simulation & Hero Redesign

## Primary Role

FRONTEND / DESIGN

## Tool Selection

- **Tool 1**: Cursor IDE (Component creation & interactive animation)
- **Tool 2**: Opencode CLI (Unit testing & verification)

## Context

- **Focused App**: `apps/marketing`
- **Scope**: Homepage hero section, interactive QR pass generator widget.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Build an interactive live pass generator widget in the marketing hero section that lets prospective buyers customize a visitor pass, view real-time QR generation, and simulate a gate scan on their phone.

## Scope (In)

1. Live Pass Generator Widget:
   - Inputs for visitor name, destination unit, valid date, and access type (Single Entry / Multi Entry).
   - Real-time animated pass preview card with scannable QR code.
2. Mobile Scan Simulation Drawer:
   - Interactive modal showing how a security guard's scanner immediately validates the generated pass.
3. Unit tests:
   - State management, input validation, and rendering tests.
4. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Interactive pass generator functions smoothly without layout shift.
- [ ] QR code updates dynamically on user input.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
