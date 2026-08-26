# Phase 4: Super Admin Intelligence & Emulation Hub

## Primary Role

BACKEND-API / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (Emulation banner & telemetry cards)
- **Tool 2**: Opencode CLI (Security context unit tests)

## Context

- **Focused App**: `apps/admin-dashboard`
- **Scope**: Organization emulation banner, GateAI system prompts editor, platform telemetry.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Implement a top-level organization impersonation banner with one-click exit, GateAI system prompts editor, and platform health telemetry monitors.

## Scope (In)

1. Impersonation / Emulation Warning Banner:
   - High-visibility amber banner fixed at top when viewing as a specific client organization.
   - Displays active target organization name, super admin operator identity, and "Exit Emulation" button.
2. Intelligence Hub Views:
   - System prompt template manager for GateAI models.
   - Platform operational health cards (Scanner latency, Redis queue depth, API error rate).
3. Unit tests:
   - Emulation state transitions, banner visibility logic, and telemetry metrics aggregation.
4. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] Emulation banner displays reliably during active impersonation sessions.
- [ ] Intelligence hub loads telemetry metrics cleanly.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
