# Phase 3: Project & Resource Mapping

## Primary role
BACKEND-API

## Preferred tool
- [ ] Cursor (default)
- [x] Gemini CLI — excellent for Prisma and structural API logic.

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db, api-client
- **Rules**: Multi-tenant isolation (org scoping); soft deletes.
- **Refs**: `packages/db/prisma/schema.prisma` (Organization, Project).

## Goal
Implement the Projects tab for managing multi-project workspaces and mapping resources.

## Scope (in)
- Project list table with stats (Gate/Unit count).
- Create/Edit Project sheet.
- Resource assignment sheet (linking Gates/Units to Projects).
- Backend API routes for Project CRUD with organization scoping.

## Scope (out)
- Bulk import of projects.

## Steps (ordered)
1. Verify `Project` model in Prisma; add any missing metadata fields if required by v6.0.
2. Create API routes in `apps/client-dashboard` for GET (list), POST (create), PATCH (update), and DELETE (soft delete).
3. Ensure all queries include `where: { organizationId }`.
4. Implement the Projects data table in the settings page.
5. Create the "Add Project" sheet with resource selection (Multi-select Gates/Units).
6. Implement logic to reassign resources between projects.
7. Run `pnpm turbo test --filter=client-dashboard` for API routes.
8. After verification: `/github` — commit as `feat(settings): project management and resource mapping (phase 3)`.

## Acceptance criteria
- [ ] Projects are isolated by organization.
- [ ] Soft delete works (record remains in DB with `deletedAt`).
- [ ] Resource counts in the table are accurate.
- [ ] Project editing updates the UI in real-time (React Query cache).
- [ ] API tests pass.
