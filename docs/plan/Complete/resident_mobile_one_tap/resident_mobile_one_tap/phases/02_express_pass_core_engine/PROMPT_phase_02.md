# Phase 2: Express Link Core Engine & Anonymous-to-Identified Resolver

## Primary Role

BACKEND-API / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Express pass creation service & redemption resolver)
- **Tool 2**: Opencode CLI (State transition unit tests)

## Context

- **Focused Apps**: `apps/resident-mobile`, `apps/marketing`
- **Scope**: Express pass lifecycle, silent creation, anonymous-to-identified redemption.
- **Packages**: `@gate-access/types`, `@gate-access/db`.

## Goal

Implement the core express pass engine that allows instant silent link generation and binds the guest's name/phone upon their first arrival or redemption.

## Scope (In)

1. Silent Pass Creation:
   - Issues an unassigned express pass in $< 50$ms for the resident's active unit.
2. Anonymous-to-Identified Redemption:
   - When visitor opens link and inputs their name, pass transitions from `UNASSIGNED` $\to$ `CLAIMED` without re-signing the master token.
3. Unit tests:
   - Silent pass creation, state machine transitions, and identity claiming.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Silent pass creation generates valid signed payload with null visitor name.
- [ ] Claiming pass populates visitor name and locks subsequent modifications.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
