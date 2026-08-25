# Phase 4: Admin Dashboard AI Assistant & Super-Admin Emulation Tools

## Primary Role

FRONTEND / FULLSTACK

## Tool Selection

- **Tool 1**: Cursor IDE (Admin assistant component & super-admin tool calling)
- **Tool 2**: Opencode CLI (Admin assistant tests)

## Context

- **Focused App**: `apps/admin-dashboard`
- **Scope**: `admin-ai-assistant.tsx`, super-admin diagnostic tools, compound traffic emulation.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/types`.

## Goal

Migrate the admin dashboard assistant to the v6 agentic multi-part system and equip it with super-admin diagnostic tools and emulation controls.

## Scope (In)

1. Admin Assistant View State:
   - Upgrades `admin-ai-assistant.tsx` to handle multi-part streams and system-level tools.
2. Super-Admin Agentic Tools:
   - "Trigger Compound Traffic Emulation" tool card with configurable scenario parameters.
   - "Security Surface Audit" diagnostic tool card.
3. Unit tests:
   - Admin assistant state, super-admin tool execution verification.
4. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] Admin assistant handles super-admin multi-part streams cleanly.
- [ ] Super-admin tool cards execute and render diagnostics inline.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
