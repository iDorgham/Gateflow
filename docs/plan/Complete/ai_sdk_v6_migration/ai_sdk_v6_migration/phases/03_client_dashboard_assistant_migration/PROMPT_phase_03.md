# Phase 3: Client Dashboard AI Assistant Migration

## Primary Role

FRONTEND / UI

## Tool Selection

- **Tool 1**: Cursor IDE (Client assistant component & interactive tool cards)
- **Tool 2**: Opencode CLI (Component state tests)

## Context

- **Focused App**: `apps/client-dashboard`
- **Scope**: `ai-assistant.tsx`, multi-part message view, tool confirmation cards.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/types`.

## Goal

Upgrade the client dashboard assistant to use the new v6 multi-part rendering architecture and render interactive confirmation cards for guest passes, gate telemetry, and unit search.

## Scope (In)

1. Client Assistant View State:
   - Connects to multi-part message store with `status` tracking (`ready`, `submitted`, `streaming`, `error`).
   - Renders interactive action cards for tool executions with ADS styling.
2. Mutation Cards:
   - "Issue Quick Pass" card with 1-tap confirmation.
   - "Search Residents" preview card.
3. Unit tests:
   - Assistant view state transitions, tool card dispatching.
4. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Client assistant correctly displays multi-part messages and reasoning blocks.
- [ ] Interactive mutation cards successfully execute client-side tools.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
