# Phase 2: Vertical Solutions Landing Pages & ROI Calculator

## Primary Role

FRONTEND / SEO

## Tool Selection

- **Tool 1**: Cursor IDE (Vertical page templates & calculators)
- **Tool 2**: Opencode CLI (Calculations unit tests)

## Context

- **Focused App**: `apps/marketing`
- **Scope**: `/solutions/compounds`, `/solutions/commercial`, `/solutions/events`, ROI calculator component.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Implement dedicated vertical landing pages for residential compounds, commercial office parks, and temporary events, complete with an interactive gate ROI and operational cost reduction calculator.

## Scope (In)

1. Vertical Route Templates:
   - Dedicated pages tailored for Compounds, Commercial, and Events with custom value props and screenshots.
2. Interactive Gate ROI Calculator:
   - Dynamic inputs (Number of gates, monthly visitor volume, current guard count).
   - Real-time calculation of estimated annual savings and queue wait time reduction.
3. Unit tests:
   - ROI mathematical formulas and route component rendering.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] All 3 vertical routes render cleanly with localized metadata.
- [ ] ROI calculator accurately computes savings and time reductions.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
