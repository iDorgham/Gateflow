# PROMPT: Phase 1 — Nested Organizational Hierarchy

**Primary Goal**: Move Users, Projects, and Gates from global scope to Organization scope in both DB and Admin UI.

## Context

Ensure all work adheres to the core multi-tenancy and soft-delete invariants defined in the workspace.

## Objectives

1.  **Backend Refactor**:
    - Update the `User` model (if necessary) to have an `organizationId` link.
    - Update `Project` and `Gate` models to strictly belong to an `Organization`.
    - Run a migration to handle existing data if applicable.
2.  **Routing & Shell**:
    - In `apps/admin-dashboard`, restructure routes to use `/org/[orgId]` as a workspace prefix.
    - Refactor existing global pages (Users, Projects, Gates) to live under this context.
3.  **Sidebar & Navigation**:
    - Create a "Context Switcher" (Organization search/select) in the Admin sidebar.
    - Only show sidebar content related to the active organization.
    - Remove global management links from the top-level navigation.
4.  **UI/UX**:
    - Ensure consistent breadcrumb navigation showing the active organization name.

## Acceptance Criteria

- `pnpm turbo lint/typecheck` passes across the monorepo.
- Accessing a global `/users` route redirects or is removed.
- Users can only see data for the organization they are active in.
- The "Context Switcher" follows the Atlassian Design System (ADS) styling established in `packages/ui`.
