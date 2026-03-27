# PROMPT: Phase 2 — Core API & Work Order Lifecycle

### Primary role

`backend-api.md` (Domain Expert: Next.js App Router, Zod, RBAC)

### Tool Selection

| Tool       | Model                    | Why                                                      |
| :--------- | :----------------------- | :------------------------------------------------------- |
| **Tool 1** | Gemini CLI (Antigravity) | Fast API scaffolding and reasoning for multi-step logic. |
| **Tool 2** | Cursor                   | Reviewing route handlers and Zod schemas.                |

### Skills to load

- [x] `gateflow-api` — Next.js API route patterns, auth, validation.
- [x] `gateflow-security` — RBAC and organization scoping.
- [x] `gateflow-testing` — Unit testing for API routes.

### Context

- **Backlog**: `maintenance_management` Phase 2.
- **Reference**: `packages/db/prisma/schema.prisma` (WorkOrder model), `packages/types/src/base.ts`.
- **Constraint**: All queries must use `organizationId` and check `deletedAt: null`.

### Goal

Implement the CRUD operations for Work Orders with robust validation, status transition guards, and organizational scoping.

### Scope (in)

- **API Routes**:
  - `POST /api/maintenance/work-orders` — Create a work order (Reporter: Current User).
  - `GET /api/maintenance/work-orders` — List work orders (Filtered by organization + role).
  - `GET /api/maintenance/work-orders/[id]` — Detailed view.
  - `PATCH /api/maintenance/work-orders/[id]` — Update status, priority, or assignee.
- **Validation (Zod)**:
  - Strict schemas for creation and updates.
  - `MaintenanceStatus` transition logic (e.g., cannot go from CLOSED to OPEN directly).
- **Logic**:
  - Auto-assign `organizationId` from session.
  - Basic RBAC:
    - **Admins/Staff**: Full access to all work orders in org.
    - **Residents**: Can only create work orders linked to their Unit and view their own reports.
- **Testing**:
  - Basic unit tests for route handlers using `vitest` or `jest`.

### Steps

1. Scaffolding: Create `apps/client-dashboard/src/app/api/maintenance/work-orders/route.ts` and `[id]/route.ts`.
2. Validation: Define Zod schemas in `packages/types/src/maintenance.ts` (if not done) or `packages/api-client/src/maintenance.ts`.
3. Implementation:
   - `GET`: Implement filtering by status, priority, and category.
   - `POST`: Handle reporter identification and asset linking (Gate/Unit/Project).
   - `PATCH`: Implement specific status update guards.
4. Testing: Add a basic integration test case in `apps/client-dashboard/src/app/api/maintenance/work-orders/route.test.ts`.
5. Preflight: Run `pnpm preflight` to ensure everything is green.

### Acceptance criteria

- [ ] API successfully handles Work Order creation with asset validation.
- [ ] List endpoint filters work as expected (status, priority).
- [ ] Status transitions are guarded by logic (not just random PATCH).
- [ ] `organizationId` isolation is strictly enforced.
- [ ] `pnpm preflight` passes.
- [ ] Conv commit: `feat(api): implement maintenance work order crud and lifecycle logic`
