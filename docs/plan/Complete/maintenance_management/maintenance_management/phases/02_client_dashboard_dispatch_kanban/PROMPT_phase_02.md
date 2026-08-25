# Phase 2: Client Dashboard Dispatch Kanban & Asset Service History

## Primary Role

FRONTEND / FULLSTACK

## Tool Selection

- **Tool 1**: Cursor IDE (Kanban board & asset drawer)
- **Tool 2**: Opencode CLI (Kanban unit tests)

## Context

- **Focused App**: `apps/client-dashboard`
- **Scope**: `/maintenance` route, Kanban column components, priority filter pills, and asset history slide-over.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Build a high-density, interactive Maintenance & Dispatch Hub in `apps/client-dashboard` with Kanban status grouping and deep physical asset repair history.

## Scope (In)

1. `/maintenance` Page Shell:
   - Header with status summary badges (Active, In Progress, SLA At Risk, Resolved Today).
   - Priority and category filter toolbars with multi-select capability.
2. Kanban Board:
   - 5 column layout: `Open`, `Assigned`, `In Progress`, `Pending Parts`, `Resolved`.
   - Work order cards showing priority pills, SLA timer progress bar, assigned technician avatar, and asset tag (e.g. `Gate North-01`).
3. Physical Asset History Drawer:
   - Slide-over panel displaying all historical work orders and maintenance records for a selected Gate, Unit, or Common Area.
4. Unit tests:
   - Kanban state grouping, column item counts, and filter aggregations.
5. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Kanban board correctly groups work orders by status and renders SLA indicators.
- [ ] Asset history drawer displays contextual historical records.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
