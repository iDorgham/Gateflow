# PLAN: Admin Emulation Hub & Advanced Seeding (v4)

## Overview

Develop a high-density "Admin Emulation Hub" in the Admin Dashboard, mirroring and extending the functional breadth of the **Advanced Seeding & Emulation (v3)** engine. This provides platform administrators with a centralized "Ops Center" for large-scale organizational seeding, traffic simulation, and platform-wide monitoring.

## Vision

- **V3 Parity**: Full support for Red Sea data library, unit ID formats, Gaussian rush-hour traffic, and relational QR-scan chains.
- **Seeding Control**: Bulk seed entire tenants (Orgs -> Projects -> Units -> Residents) with ADS-compliant wizards.
- **Emulation Monitoring**: Real-time visibility into simulation execution across the platform via `AiActionLog`.
- **Operational Safety**: Multi-layer authorization (`ADMIN_ACCESS_KEY`) and transaction-safe "Wipe & Re-Seed" capabilities.

## Phases & Deliverables

### Phase 1: Advanced Seeding Integration (Backend & API)

- **Goal**: Expose the full v3 seeding library (Phases 1–6) via authenticated Admin-APIs.
- **Deliverables**:
  - `admin-api`: `POST /api/admin/seed-hierarchy` – Integrates `seedUnitHierarchyForProject` from `advanced-seed-service.ts`.
  - `admin-api`: `GET /api/admin/emulation-history` – High-density retrieval of `AiActionLog` entries filtered for emulation activities.
- **Parity Check**: Must support `UnitHierarchyRangeConfig` (phases, buildings, floors) and `Scenario` parameters.

### Phase 2: Seeding & Hierarchy Control (UI)

- **Goal**: Dedicated Admin interface for configuring large-scale tenant structures.
- **Deliverables**:
  - `apps/admin-dashboard`: `/monitoring/seeding/page.tsx` – A dedicated "Seeding Control" page.
  - **Feature**: Range-based hierarchy configuration (mirroring v3 Phase 4 UI), unit ID format selection (Phase 2), and contact density controls (Phase 3).
  - Integration with `POST /api/admin/seed-hierarchy`.

### Phase 3: Traffic Emulation & Monitoring Hub (UI)

- **Goal**: Implement the "Command Center" for traffic simulation and active run monitoring.
- **Deliverables**:
  - `apps/admin-dashboard`: `/monitoring/emulation/page.tsx` – Finalized multi-step Traffic Wizard (integrating v3 Phase 5/6).
  - `apps/admin-dashboard`: `/monitoring/hub/page.tsx` – Real-time history table with status badges (`SUCCESS`, `FAILED`, `RUNNING`) and log auditing.
- **UI Details**: Fly-out drawer to view JSON metadata and relational chain results.

### Phase 4: Platform-Wide Operations & Stress Testing

- **Goal**: Enable "Global Stress" mode and automated tenant environment management.
- **Deliverables**:
  - **Global Mode**: API support for simultaneous traffic across multiple Organizations.
  - **Environment Reset**: `POST /api/admin/reset-tenant` – Safe soft-delete of all project data followed by a "Clean Re-Seed".
  - **Polish**: Final RTL/Arabic audit and ADS token compliance check.

## Architecture & Integration

- **Frontend**: Next.js 15 (App Router), ADS Compact Patterns (`@gate-access/ui`).
- **Backend**: Serverless API routes with strict `isAdminAuthorized` guards.
- **Database**: Prisma + `advanced-seed-service.ts` orchestration.

## Risks & Mitigations

- **Database Performance**: Large-scale seeding can lock tables. Mitigation: Use batch inserts (`createMany`) and chunking (500 rows/batch).
- **Security**: Prevent seeding into production orgs. Mitigation: Add an `isTestTenant` check or mandatory ID confirmation via UI.
