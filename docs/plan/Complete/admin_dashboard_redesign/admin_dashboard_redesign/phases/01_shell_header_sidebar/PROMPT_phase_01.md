# Phase 1: Global Shell & Header/Sidebar Modernization

## Primary Role

FRONTEND / DESIGN

## Tool Selection

- **Tool 1**: Cursor IDE (Layout shell & navigation polish)
- **Tool 2**: Opencode CLI (Unit testing & verification)

## Context

- **Focused App**: `apps/admin-dashboard`
- **Scope**: Layout shell, global header toolbar, collapsible sidebar navigation.
- **Packages**: `@gate-access/ui`, `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Modernize the admin dashboard layout shell to achieve 100% parity with the Client Dashboard V10 design system, including a refined header toolbar and streamlined sidebar navigation.

## Scope (In)

1. Dashboard Shell Layout:
   - Consistent responsive container with dark/light mode surface tokens (`bg-surface`, `border-subtle`).
2. Global Header Toolbar:
   - Remove redundant "Super Admin" badge.
   - Add contextual Help Center / Docs icon.
   - Refine notification center dropdown and locale switcher.
3. Sidebar Navigation:
   - Clean, high-density nav hierarchy.
   - Move Sign Out to the sidebar footer.
4. Unit tests:
   - Active route highlighting, sidebar collapse toggle state, and layout rendering.
5. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Header and sidebar match Client Dashboard V10 visual standards.
- [ ] Active route indicator highlights correctly.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
