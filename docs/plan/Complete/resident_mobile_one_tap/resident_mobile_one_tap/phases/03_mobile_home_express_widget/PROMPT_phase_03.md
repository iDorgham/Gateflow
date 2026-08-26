# Phase 3: Resident Mobile Home Tab Express Share Widget

## Primary Role

MOBILE / FRONTEND

## Tool Selection

- **Tool 1**: Cursor IDE (Express widget state & recent guests manager)
- **Tool 2**: Opencode CLI (Widget unit tests)

## Context

- **Focused App**: `apps/resident-mobile`
- **Scope**: Home screen express widget, recent guests caching, pre-composed localized sharing text.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/types`.

## Goal

Build the Home Tab Express Share widget that enables 1-tap pass generation and dispatches native mobile share sheets with pre-formatted localized messages.

## Scope (In)

1. Express Share Widget State:
   - Manages list of "Recent Guests" stored in persistent local device storage.
   - Quick-tap on a recent guest immediately generates and formats their pass.
2. Localized Share Message Formatter:
   - Formats WhatsApp/SMS invite copy in English and Arabic with compound name, unit, and short-link.
3. Unit tests:
   - Recent guest updates, sorting, and message formatting.
4. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Recent guests list maintains top 5 recent visitors.
- [ ] Localized message builder produces clean text for WhatsApp and SMS.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
