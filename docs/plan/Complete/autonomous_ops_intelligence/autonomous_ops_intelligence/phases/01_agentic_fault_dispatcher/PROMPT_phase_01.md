# Phase 1: Agentic Fault Detector & Autonomous Work Order Dispatcher

## Primary Role

BACKEND-API / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (Anomaly detector & autonomous dispatch engine)
- **Tool 2**: Opencode CLI (Agentic rule unit tests)

## Context

- **Focused App**: `apps/client-dashboard`
- **Scope**: Gate scan telemetry anomaly analysis, fault evaluation, and autonomous work order creation.
- **Packages**: `@gate-access/types`, `@gate-access/db`.

## Goal

Build an event-driven anomaly detector that evaluates gate scanning failures and automatically dispatches `URGENT` work orders attributed to `GATEAI_AGENTIC_SYSTEM`.

## Scope (In)

1. Telemetry Anomaly Evaluator:
   - Evaluates consecutive scan errors, camera timeouts, and barrier loop sensor disconnects.
   - Thresholds: $\ge 5$ consecutive failures within a 2-minute window triggers anomaly state.
2. Autonomous Dispatch Engine:
   - Selects approved vendor based on gate zone and category.
   - Generates work order with audit attribution to `GATEAI_AGENTIC_SYSTEM`.
3. Unit tests:
   - Anomaly threshold triggering, vendor auto-assignment, and dispatch event creation.
4. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Anomaly rule engine accurately flags error spikes.
- [ ] Autonomous dispatch creates valid work order payload with system actor attribution.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
