# Tasks: `maintenance_management`

- **Initiative:** `maintenance_management`
- **Application:** Cross-Platform (`packages/db`, `apps/client-dashboard`, `apps/scanner-app`, `apps/resident-mobile`)
- **Status:** ✅ Complete — all phases 1–5 complete (verified)

---

## Phase 1: Work Order State Machine, Schema & REST APIs

- [x] Define work order status lifecycle and transition rules (`OPEN` $\to$ `CLOSED`)
- [x] Implement SLA calculation engine based on priority levels
- [x] Implement validation schemas for ticket creation, technician assignment, and resolution
- [x] Write unit tests for state machine, SLA calculators, and payload validation
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Client Dashboard Dispatch Kanban & Asset Service History

- [x] Build `/maintenance` hub layout in `apps/client-dashboard`
- [x] Implement Kanban column board with drag-and-drop status management
- [x] Create Asset Maintenance History drawer linking tickets to specific Gates and Units
- [x] Write unit tests for Kanban column grouping and filter operations
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Automated Vendor Access QR Pass Generation

- [x] Implement automated temporary visitor/vendor QR pass generator on technician assignment
- [x] Bind vendor passes to allowed gate zones and scheduled time windows
- [x] Implement cryptographic HMAC-SHA256 signature verification for vendor passes
- [x] Write unit tests for pass generation and scanner access validation
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`

## Phase 4: Resident Mobile & Portal Maintenance Submission Flow

- [x] Create "Request Maintenance" form in resident portal and mobile app
- [x] Implement live work order tracking timeline for residents
- [x] Add category selection, description, and photo attachment state handling
- [x] Write unit tests for resident ticket submission and timeline status mapping
- [x] Write `phase_logs/PHASE_LOG_phase_04.md`

## Phase 5: Guard Hardware Reporting, Arabic RTL Audit & Full Certification

- [x] Implement guard quick-report drawer in scanner app for gate hardware damage
- [x] Conduct comprehensive Arabic RTL localization audit across all maintenance UI
- [x] Run full automated test suite across affected workspaces (`packages/db`, `client-dashboard`, `scanner-app`)
- [x] Verify zero TypeScript errors and zero lint warnings
- [x] Write `phase_logs/PHASE_LOG_phase_05.md`
