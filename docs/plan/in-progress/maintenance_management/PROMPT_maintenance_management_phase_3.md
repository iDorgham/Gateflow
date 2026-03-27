# PROMPT: Phase 3 — Maintenance Hub UI (Client Management)

### Primary role

`frontend.md` (Senior UI/UX & React Expert)

### Tool Selection

| Tool       | Model                    | Why                                                     |
| :--------- | :----------------------- | :------------------------------------------------------ |
| **Tool 1** | Cursor                   | Building complex React components and hooks.            |
| **Tool 2** | Gemini CLI (Antigravity) | Scaffolding page layouts and generating initial styles. |

### Skills to load

- [ ] `gf-design-guide` — ADS tokens, spacing, typography.
- [ ] `gf-shadcn-composable-patterns` — For complex sheets and dialogs.
- [ ] `gateflow-api` — For integrating with the new maintenance endpoints.

### Context

- **Initiative**: `maintenance_management` Phase 3.
- **Reference**: `PLAN_maintenance_management.md`, `packages/api-client/src/maintenance.ts`.
- **API**: Working implementation of `/api/maintenance/work-orders`.

### Goal

Build a high-density management portal for work orders that allows managers to efficiently track, filter, and update facility maintenance tasks.

### Scope (in)

- **Pages**:
  - `apps/client-dashboard/src/app/(dashboard)/maintenance/page.tsx`: Main Hub.
- **Components**:
  - `MaintenanceTable`: Searchable, filterable list of work orders using `DynamicTable`.
  - `MaintenanceStatusBadge`: Colorful status indicators mapped to ADS semantic tokens.
  - `MaintenanceFilters`: Quick-filter bar for Status, Priority, and Asset (Gate/Unit).
  - `CreateWorkOrderDialog`: Form to quickly report new issues.
- **Sheet**:
  - `MaintenanceDetailSheet`: Side panel that opens on row click to show history and allow status/assignee updates.

### Steps

1. **Scaffolding**: Create the `/maintenance` route and the basic page layout.
2. **Data Fetching**: Implement a `useMaintenance` hook or use `react-query` with the existing `maintenanceApi` client.
3. **Table UI**: Build the `MaintenanceTable` with sortable columns and status badges.
4. **Filtering**: Add the filter bar to refine the list by Status/Priority.
5. **Mutation**: Implement the "Assign" and "Change Status" actions within the `MaintenanceDetailSheet`.
6. **Polishing**: Ensure RTL support for Arabic labels and ADS typography.

### Acceptance criteria

- [ ] Maintenance table correctly displays real data from the API.
- [ ] Filters (Status/Priority) correctly update the table results.
- [ ] Side panel (Sheet) allows updating work order status with valid transition logic.
- [ ] "New Work Order" dialog successfully creates a task and refreshes the table.
- [ ] Design adheres to ADS (Atlassian Design System) standards.
- [ ] conv commit: `feat(ui): implement maintenance hub dashboard with filtered management table`
