# Phase 1: Work Order State Machine, Schema & REST APIs

## Primary Role

BACKEND-DATABASE / BACKEND-API

## Tool Selection

- **Tool 1**: Cursor IDE (State machine & validation schemas)
- **Tool 2**: Opencode CLI (Unit test suite execution)

## Context

- **Focused Apps/Packages**: `packages/db`, `apps/client-dashboard`
- **Scope**: Work order status lifecycle, priority SLA calculations, and typed REST API handlers.
- **Packages**: `@gate-access/types`, `@gate-access/db`.

## Goal

Implement a robust, multi-tenant work order state machine with forward transition validation, SLA window calculations per priority, and input validation schemas.

## Scope (In)

1. Work Order Lifecycle State Machine:
   - Statuses: `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `PENDING_PARTS`, `RESOLVED`, `CLOSED`, `CANCELLED`.
   - Forward transition guard: Prevents moving backwards or bypassing required intermediary stages without supervisor override.
2. SLA Calculation Engine:
   - Priority resolution targets: `URGENT` (4h), `HIGH` (24h), `MEDIUM` (48h), `LOW` (96h).
   - Remaining SLA timer calculation and breach flag generator.
3. Input Validation Schemas:
   - Work order creation schema (title, description, priority, category, gateId/unitId).
   - Technician assignment schema (technicianId, vendorName, scheduledTimeWindow).
   - Work order resolution schema (resolutionSummary, partsReplaced, cost).
4. Unit tests:
   - Comprehensive test suite covering all valid and illegal state transitions, SLA calculations, and payload schemas.
5. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Valid state transitions succeed; illegal state transitions throw explicit validation errors.
- [ ] SLA calculator accurately flags breaches and computes time remaining.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
