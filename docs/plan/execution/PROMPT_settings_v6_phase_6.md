# Phase 6: Gates & Scanners

## Primary role
BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard, scanner-app
- **Packages**: db, types
- **Rules**: Multi-tenant scoping.
- **Refs**: `docs/guides/SCANNER_OPERATIONS.md`.

## Goal
Implement Gate management and global scanner rule configuration.

## Scope (in)
- Gates table with project filtering and location metadata.
- Add/Edit Gate sheet (Name, Project, GPS Radius, Allowed Operators).
- Gate Groups for bulk operations.
- Scanner Rules forms (Offline Mode, Vibration, Sound, Global Overrides).

## Scope (out)
- Live scanner heartbeats (Phase 12).

## Steps (ordered)
1. Implement the Gates data table with project badges.
2. Create the Gate Edit sheet with input for GPS coordinates and radius.
3. Build the Gate Grouping logic and UI.
4. Implement the Scanner Rules tab with toggles for app-level behavior.
5. Create API routes for scanning rule synchronization.
6. Verify that gate rules are correctly scoped to projects and organizations.
7. Run `pnpm turbo typecheck --filter=client-dashboard`.
8. After verification: `/github` — commit as `feat(settings): gate management and scanner configuration (phase 6)`.

## Acceptance criteria
- [ ] Gates can be created and mapped to specific projects.
- [ ] GPS radius validation is correctly handled.
- [ ] Scanner rules (offline, alert types) persist accurately.
- [ ] UI correctly distinguishes between global rules and per-gate rules.
- [ ] Typecheck passes.
