# TASKS: Admin Emulation Hub & Advanced Seeding

---

## Phase 1: Advanced Seeding Integration (Backend)

- [x] Implement `POST /api/admin/seed-hierarchy`: Expose v3 hierarchy builders (`seedUnitHierarchyForProject`) via Admin API.
- [x] Implement `GET /api/admin/emulation-history`: Fetch last 50 `AiActionLog` entries filtered for emulation activities.
- [x] Update `runEmulation` to optionally support `ranges?: UnitHierarchyRangeConfig` (seed hierarchy before traffic).
- [x] Multi-layer admin authorization verification (`isAdminAuthorized`).

## Phase 2: Seeding & Hierarchy Control (UI)

- [x] Create `/monitoring/seeding` page: A dedicated interface for structural data generation.
- [x] Implement Step 1: Range-based hierarchy (Phases, Buildings, Floors) – Mirror v3 Phase 4.
- [x] Implement Step 2: Unit ID Format selection (e.g., `A-101`, `B-202`) – Mirror v3 Phase 2.
- [x] Implement Step 3: Contact Density & Nationality weights – Mirror v3 Phase 3.
- [x] Integration: Connect the Seeding Wizard to the Backend API from Phase 1.

## Phase 3: Traffic Control & Monitoring Hub (UI) - COMPLETE

- [x] Finalize `/monitoring/emulation` page: Multi-step Traffic Wizard (mirror v3 Phase 8 but for Admin).
- [x] Implement Step 1: Scenario (`Luxury Compound`, `Nightclub`, etc.) & Rush Periods.
- [x] Implement Step 2: Traffic volume (Up to 10,000 scans) and Scan Window selection.
- [x] Create `MonitoringHub` Overview: High-density history table with status badges and timestamps.
- [x] Implement `RunDetailDrawer`: Side drawer to view JSON metadata and relational chain results (`ScanLog` IDs).

## Phase 4: Platform-Wide Operations & Stress Testing - COMPLETE

- [x] Implement "Global Mode": Ability to trigger emulation across multiple active Organizations in a single request.
- [x] Create `RESET_TENANT` logic: Clean-wipe utility for soft-deleting all project data before a fresh re-seed.
- [x] Performance audit: Optimize batch inserts (`Prisma.createMany`) to 500 rows per batch.
- [x] Final RTL/Arabic and ADS token audit for all new operational pages.
