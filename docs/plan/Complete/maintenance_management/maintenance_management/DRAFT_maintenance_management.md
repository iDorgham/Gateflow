# Draft — `maintenance_management`

**Slug:** `maintenance_management`  
**Last updated:** 2026-08-24  
**Champion:** Operations & Facility Engineering Team  
**Initiative Link:** `docs/development/initiatives/IDEA_maintenance_management.md`  
**Target:** Q3 2026

> Raw planning notes for Maintenance Management Hub (Work Orders, Technician Assignment, Vendor Access Passes & Resident Reporting). When this feels complete, run **`/prompt maintenance_management`** then **`/plan maintenance_management`**.

---

## 1. What I Want

- **Centralized Maintenance & Work Orders Hub**:
  - Full lifecycle state machine: `OPEN` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `PENDING_PARTS` $\to$ `RESOLVED` $\to$ `CLOSED`.
  - Severity/Priority classification: `LOW`, `MEDIUM`, `HIGH`, `URGENT` (with SLA countdowns, e.g. Urgent < 4h).
  - Categorization: Electrical, Plumbing, HVAC, Gate Hardware, Elevators, Landscaping, General Facility.
- **Context-Aware Physical Asset Linking**:
  - Direct relational linkage to `Gate`, `Unit` (Resident Villa/Apartment), or `Project` (Compound/Commercial Common Area).
  - Searchable service history per asset (e.g. all repairs performed on North Gate 01).
- **Automated Vendor & Technician Gate Access Pass**:
  - When a work order is assigned to an external vendor/contractor, automatically generate a time-bounded Vendor Access QR pass.
  - Scanner app validates vendor pass with work order reference id and allowed gate zones.
- **Cross-App Integration**:
  - **Resident Portal & Resident Mobile**: Residents submit unit repair tickets with photo attachments and receive real-time status updates.
  - **Scanner App (Guards)**: Guards can report broken barrier arms, lighting failures, or gate hardware directly from the scanner menu.
  - **Client Dashboard**: Property managers view Kanban dispatch board, assign technicians, track MTTR (Mean Time to Resolution), and manage contractor logs.
- **Bilingual Arabic & English Parity**:
  - Complete Arabic (`ar-EG`) and English (`en`) localized maintenance terminology and RTL layout.

---

## 2. Constraints & Guardrails

- **Prisma Schema Safety**: Multi-tenant isolation (`organizationId`, `deletedAt: null` where applicable). Add `WorkOrder`, `WorkOrderLog`, and `WorkOrderAttachment` models safely without breaking existing migration chains.
- **ADS Design System**: Use `@gate-access/ui/tokens` (`nativeTokensNewEra`) with strict 8pt spacing.
- **Offline Resilience**: Mobile technician actions queue in local storage and sync when connectivity resumes.

---

## 3. Suggested 5-Phase Plan Sketch

1. **Phase 1: Prisma Schema & Backend REST APIs**:
   - Create `WorkOrder` and `WorkOrderLog` models in `packages/db/prisma/schema.prisma`.
   - Implement typed, tenant-isolated API routes: `GET/POST /api/work-orders`, `GET/PATCH /api/work-orders/[id]`, `POST /api/work-orders/[id]/assign`.
2. **Phase 2: Client Dashboard Maintenance Hub & Kanban Dispatch**:
   - Build `/maintenance` page in `apps/client-dashboard` with Kanban status boards, priority filters, SLA badges, and asset service history drawer.
3. **Phase 3: Automated Vendor Access QR Pass Generation**:
   - Link technician assignments to temporary visitor passes with gate permissions and time bounds.
4. **Phase 4: Resident Mobile & Portal Maintenance Submission Flow**:
   - Add "Request Maintenance" screen in Resident Portal / Mobile with photo upload and tracking status timeline.
5. **Phase 5: Guard Hardware Reporting, Arabic RTL Audit & Full Test Suite**:
   - Enable scanner app guard maintenance report trigger, complete Arabic RTL localization audit, and achieve 100% test coverage.

---

## 4. Open Questions

- [ ] Should residents be allowed to rate/review the completed maintenance work order upon closure?
- [ ] Should emergency work orders (`URGENT`) trigger automatic SMS/WhatsApp alerts to the property maintenance lead?

---

## 5. Changelog

- **2026-08-24**: Initialized draft from `IDEA_maintenance_management.md` with structured work orders, vendor access integration, and cross-app dispatch.
