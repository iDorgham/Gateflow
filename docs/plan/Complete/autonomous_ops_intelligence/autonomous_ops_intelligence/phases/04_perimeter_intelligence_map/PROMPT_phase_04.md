# Phase 4: Client Dashboard Perimeter Intelligence Map & Anomaly Feed

## Primary Role

FRONTEND / FULLSTACK

## Tool Selection

- **Tool 1**: Cursor IDE (Perimeter map component & live anomaly feed)
- **Tool 2**: Opencode CLI (Feed state & map rendering tests)

## Context

- **Focused App**: `apps/client-dashboard`
- **Scope**: `/perimeter-intelligence` page, interactive gate map, real-time alert ticker, agentic action history.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Build a high-density, real-time Perimeter Intelligence Map in `apps/client-dashboard` displaying live gate camera feeds, tailgating alerts, and autonomous agentic maintenance events.

## Scope (In)

1. `/perimeter-intelligence` Page Shell:
   - Header with operational status indicators (Total Gates, Active Cameras, Incident Rate, Agentic AI Actions).
2. Perimeter Map & Live Camera Hub:
   - Interactive compound gate topology map with status pins (Green = Nominal, Amber = Anomaly, Red = Incident).
3. Real-Time Anomaly & Actions Feed:
   - Live stream of detected events with severity pills, gate names, and quick action drawers.
4. Unit tests:
   - Map state aggregation, feed sorting, and filter operations.
5. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] Perimeter map renders gate status accurately.
- [ ] Anomaly feed displays real-time events with filtering and drill-down.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
