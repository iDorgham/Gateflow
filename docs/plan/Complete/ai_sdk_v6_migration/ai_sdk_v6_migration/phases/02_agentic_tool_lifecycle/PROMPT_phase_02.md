# Phase 2: Agentic Tool Invocation & Confirmation State Machine

## Primary Role

FULLSTACK / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (Tool lifecycle state machine & permission guard)
- **Tool 2**: Opencode CLI (State transition tests)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/admin-dashboard`
- **Scope**: Tool execution state machine, permission validation, mutation confirmations.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Implement a robust client-side tool execution state machine that handles interactive mutation confirmations, executes client actions, and enforces tenant scoping.

## Scope (In)

1. Tool execution lifecycle state machine:
   - Manages tool call states: `requires-action` $\to$ `executing` $\to$ `completed` | `rejected`.
   - Binds tool execution handlers (e.g. `issueGuestPass`, `dispatchWorkOrder`, `lockdownGate`).
2. Security & Tenant Scoping:
   - Validates `organizationId` presence and RBAC permissions before executing dangerous tool calls.
3. Unit tests:
   - Tool call resolution, rejection flows, permission enforcement.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Tool state machine accurately transitions across all lifecycles.
- [ ] Unauthorized tool executions are blocked and flagged.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
