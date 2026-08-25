# PLAN: Maintenance Management & Dispatch Hub

- **Initiative:** `maintenance_management`
- **Application:** Cross-Platform (`packages/db`, `apps/client-dashboard`, `apps/scanner-app`, `apps/resident-mobile`)
- **Status:** ✅ Complete — all phases 1–5 complete (verified)
- **Priority:** P1 — Facility Operations & Asset Maintenance
- **Branch:** `feat/maintenance-management-hub`

---

## Executive Summary

Comprehensive enterprise work order lifecycle management, technician dispatch, physical asset maintenance history (gates, units, common areas), automated vendor QR gate access passes, and resident/guard issue reporting.

---

## Ordered Implementation Phases

### Phase 1: Work Order State Machine, Schema & REST APIs

- **Role:** BACKEND-DATABASE / BACKEND-API
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Define work order state transitions (`OPEN` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `PENDING_PARTS` $\to$ `RESOLVED` $\to$ `CLOSED`).
  - Implement SLA calculation logic per priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
  - Create validated payload handlers for work order creation, assignment, and status updates.
- **Acceptance Criteria:**
  - State machine transitions enforce valid forward progression.
  - SLA breach detector accurately calculates remaining resolution windows.
  - 100% unit test coverage for state machine and validation schemas.

### Phase 2: Client Dashboard Dispatch Kanban & Asset Service History

- **Role:** FRONTEND / FULLSTACK
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build high-density `/maintenance` hub in `apps/client-dashboard`.
  - Implement interactive Kanban board with drag-and-drop / column status groups.
  - Implement Asset History Drawer showing maintenance logs for specific gates/units.
- **Acceptance Criteria:**
  - Kanban board filters by priority, category, and assigned technician.
  - Asset history drawer renders all past tickets associated with targeted gate or unit.
  - Unit tests verify Kanban column grouping and filter operations.

### Phase 3: Automated Vendor Access QR Pass Generation

- **Role:** BACKEND-API / SECURITY
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Link technician/contractor assignment with temporary QR pass issuance.
  - Set gate zone allowances and time-bounded validity matching scheduled work order window.
  - Provide QR pass payload generation with HMAC-SHA256 signature verification.
- **Acceptance Criteria:**
  - Work order assignment generates signed vendor access payload.
  - Scanner verification approves vendor pass only within allowed gate zones and active time window.
  - Unit tests verify cryptographic pass signature and zone constraints.

### Phase 4: Resident Mobile & Portal Maintenance Submission Flow

- **Role:** FRONTEND / MOBILE
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build "Report Maintenance Issue" form in resident apps (unit, common area, category, photo attachments).
  - Add real-time status tracker timeline for submitted work orders.
  - Implement push notification triggers upon status updates.
- **Acceptance Criteria:**
  - Resident can submit unit repair requests with category and priority.
  - Real-time tracker reflects current work order status.
  - Unit tests verify submission payload validation and status mapping.

### Phase 5: Guard Hardware Reporting, Arabic RTL Audit & Full Certification

- **Role:** QA / DESIGN / MOBILE
- **Preferred Tool:** Opencode CLI
- **Scope:**
  - Add guard quick-report action in Scanner App for damaged gate arms or hardware issues.
  - Complete Arabic RTL localization audit across all maintenance interfaces.
  - Execute full automated test suite and typecheck verification.
- **Acceptance Criteria:**
  - Scanner quick-report creates `URGENT` gate maintenance ticket.
  - Arabic RTL strings and layouts 100% natural and compliant.
  - Full test suite passing across all affected workspaces.

---

## Reference Documents

- `docs/plan/Draft/maintenance_management/DRAFT_maintenance_management.md`
- `docs/development/initiatives/IDEA_maintenance_management.md`
