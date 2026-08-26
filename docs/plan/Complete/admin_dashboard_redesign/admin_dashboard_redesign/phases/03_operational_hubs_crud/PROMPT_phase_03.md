# Phase 3: Operational Hubs & High-Density Table Actions

## Primary Role

FRONTEND / FULLSTACK

## Tool Selection

- **Tool 1**: Cursor IDE (CRUD toolbars & action dropdowns)
- **Tool 2**: Opencode CLI (Table actions unit tests)

## Context

- **Focused App**: `apps/admin-dashboard`
- **Scope**: Organizations, Projects, CRM, and Team Roles pages.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Refactor all primary admin operational hub views into wide-format, high-density layouts featuring standardized top-right action toolbars and table row action menus.

## Scope (In)

1. Standardized Action Toolbar:
   - Search input, status filter pills, export action, and prominent primary "Add" button.
2. Row Action Menu:
   - Options: View Details, Edit Properties, Emulate / Impersonate Org, Suspend Access, Delete.
3. High-Density Table Styling:
   - ADS-compliant token borders, compact row padding, status badges, and pagination.
4. Unit tests:
   - Filtering logic, search matching, and row action triggers.
5. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Action toolbars render consistently across Organizations, Projects, and CRM.
- [ ] Row action menus trigger expected handler callbacks.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
