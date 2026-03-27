# PLAN: Maintenance Management (Maintenance Hub)

Initiative: `maintenance_management`  
Goal: Centralized maintenance operations for Gates, Units, and Projects.

## 🗺️ Phases

### [x] **Phase 1: Foundation (Schema & Domain Models)**

- **Scope**: Evolve Prisma schema to include `WorkOrder` and maintenance enums.
- **Deliverables**: Updated `schema.prisma`, extracted base types in `packages/types/src/base.ts`.
- **Acceptance**: `pnpm db:generate` succeeds; types are exported; no circular dependencies.
- **Status**: ✅ Completed

### [x] **Phase 2: Core API & Work Order Lifecycle**

- **Goal**: Implement the business logic for creating, assigning, and resolving requests.
- **Primary role**: `backend-api.md`
- **Preferred tool**: `Claude CLI`
- **Deliverables**:
  - [x] API Routes: `apps/client-dashboard/src/app/api/maintenance/` handlers.
  - [x] Zod validation and status transition logic.
  - [x] Organization-scoping and asset linking.
  - [x] Unit testing for API routes.
- **Status**: ✅ Completed

### Phase 3: Maintenance Hub UI (Client Management)

- **Goal**: A high-density dashboard for managers to track facility health.
- **Primary role**: `frontend.md`
- **Preferred tool**: `Cursor IDE`
- **Deliverables**:
  - [ ] `MaintenanceTable`: Virtualized list with status filters (using `DynamicTable`).
  - [ ] `MaintenanceSheet`: Side panel for viewing and updating work order status/priority.
  - [ ] `AssetMaintenanceLog`: Shared component to show service history on Gate/Unit detail pages.
  - [ ] Palette: Use "Real Estate" theme tokens for maintenance status colors (e.g., `warning` for `PENDING_PARTS`).

### Phase 4: Field Reporting (Guard / Scanner App)

- **Goal**: Empower guards to report hardware issues discovered during scans.
- **Primary role**: `mobile.md`
- **Preferred tool**: `Gemini CLI`
- **Deliverables**:
  - [ ] Scanner UI: "Report Hardware Issue" button in Scan Results view.
  - [ ] Payload: Link request to the current `Gate` and latest `ScanLog` (for evidence/attachments).
  - [ ] Offline Sync: Ensure reports can be queued while offline (consistent with `scanUuid` pattern).

### Phase 5: Resident Portal Integration

- **Goal**: Residents report unit-level maintenance (e.g., Plumbing, Electrical).
- **Primary role**: `frontend.md`
- **Preferred tool**: `Cursor IDE`
- **Deliverables**:
  - [ ] `ResidentRequestForm`: Multi-step form for residents with RTL support.
  - [ ] `MyRequests`: View tracking status of open/closed unit orders.
  - [ ] Identity: Auto-link to the resident's `Unit` based on auth context.

### Phase 6: Final Audit & RTL Polish

- **Goal**: Ensure 100/100 performance and perfect MENA localization.
- **Primary role**: `qa.md`
- **Preferred tool**: `Kilo CLI`
- **Deliverables**:
  - [ ] RTL Check: Verify Arabic alignment for maintenance categories and timelines.
  - [ ] Performance Audit: Ensure high-density tables maintain 100/100 PageSpeed.
  - [ ] Backlog Closure: Move initiative to `done/`.

---

## 🛠️ Security & Multi-Tenancy

- All `WorkOrder` queries MUST include `organizationId` scope.
- Technician role (RBAC) must be restricted to viewing assigned orders only (if configured).
- All attachments (photos) must use signed URLs / organization-scoped storage.
