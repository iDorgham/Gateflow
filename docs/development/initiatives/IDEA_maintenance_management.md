# IDEA: Maintenance Management (Maintenance Hub)

**Slug:** `maintenance_management`  
**Vision:** A centralized system for tracking, scheduling, and resolving maintenance requests for all physical assets in the GateFlow ecosystem, including Gate hardware, Individual Units, and Project common areas.

## Problem Statement

Property managers currently lack a structured way to handle the lifecycle of physical asset repairs. General "Tasks" are too broad, and "Incidents" are often reactive (security-focused). There is no "Service History" for hardware (Gates) or individual Units (Resident complaints).

## Goals & Features

- **Structured Work Orders**: A specialized lifecycle: `OPEN` → `ASSIGNED` → `IN_PROGRESS` → `PENDING_PARTS` → `RESOLVED` → `CLOSED`.
- **Location-Aware Context**: Link every request to a specific `Gate`, `Unit`, or `Project`.
- **Priority & Categorization**:
  - **Priority**: `LOW`, `MEDIUM`, `HIGH`, `URGENT` (Safety/Security Critical).
  - **Categories**: Electrical, Plumbing, HVAC, Hardware (Gate), General.
- **Guard Integration**: Scanner app users can report broken hardware (Gate) that automatically triggers a maintenance request.
- **Resident Portal Integration**: Residents can report unit-level issues and track status via their mobile/web portal.
- **Service History**: A searchable log of all work performed on a specific asset over time.

## Success Metrics

- **MTTR (Mean Time to Resolution)**: Improved through clear technician assignment.
- **Asset Integrity**: 100% of reported gate failures have a corresponding work order.
- **Resolution Rate**: Percentage of requests resolved within their SLA (e.g., Urgent < 4 hours).

## Risks & Constraints

- **Scope Creep**: Overlapping with general ERP/Facility Management software (keep focus on basic property operations).
- **Offline Sync**: Technicians need to update work status in areas with poor connectivity (consistent with GateFlow offline-first mandates).
- **Data Residency**: All maintenance logs must be tied to the `organizationId` scope.

## Technical Alignment

- **Database**: Expand `Task` model or introduce a new `WorkOrder` model.
- **UX**: ADS-compliant "Maintenance Dashboard" in `client-dashboard`.
- **RTL**: Full Arabic/English localized categories and statuses.
