# GateFlow Client Dashboard Reference

Comprehensive reference for `apps/client-dashboard` including structure, completed scope, menu model, and API inventory.

## Coverage Status

- Pages/routes: covered (major route tree).
- Menu/navigation: covered.
- API routes: covered (exhaustive inventory including shift and patrol endpoints).
- UI/UX modules: covered at component-domain level.
- Function-level implementation details: summarized by service module.
- DB model mapping: covered by feature domain.
- Test Coverage: **117 Test Suites Passed (696 Unit Tests)**.

## App Purpose

- Primary tenant-facing operations dashboard for organizations using GateFlow.
- Covers operational monitoring, access control, residents/units/contacts, project management, analytics, AI assistance, guard shift visualization, perimeter patrol telemetry, and workspace governance.

## What Has Been Completed

- **Perimeter Guard Patrol Checkpoints & Live Telemetry (`guard_patrol_checkpoints`):**
  - Interactive route builder (`PatrolRouteManager.tsx`, `PatrolRouteModal.tsx`) with cryptographic HMAC QR printing.
  - Live polyline map monitoring on `GuardShiftVisualMap.tsx` tracking guard progression through checkpoints.
  - Backend API suite: `POST /api/patrols/routes`, `POST /api/patrols/scan`, and `GET /api/patrols/live`.
  - Supervisor compliance reporting (`PatrolComplianceSummary.tsx`) tracking on-time vs delayed checkpoints.
- **Guard Shift Visual Map & Situational Telemetry (`guard_shift_visual_map`):**
  - Real-time gate terminal occupancy, active shift duration counters, terminal health indicators, and shift handover controls (`ShiftHandoverDrawer.tsx`).
  - Shift management API suite: `POST /api/scanner/shift/start`, `POST /api/scanner/shift/end`, `GET /api/scanner/shift/active`, and `GET /api/scanner/shift/live`.
- **Multi-Tenant Isolation & Security Hardening:**
  - Strict tenant scoping (`organizationId`) across all 95+ REST endpoints.
  - Native AES-256-GCM cryptographic encryption and HMAC-SHA256 signature verification.
- **Projects CRM & Resident Lifecycle:**
  - Units, contacts, user preferences, and export rate limiting with tamper-evident `AuditLog` records.
- **Analytics & Operational Intelligence:**
  - PDF export client, multi-dimensional time series, and anomaly detection.
- **GateAI Autonomous Operations:**
  - Vercel AI SDK v6 multi-part UIMessage architecture with interactive tool confirmation lifecycle.

## Application Structure

### Main Route Tree (`src/app/[locale]`)

- **Authentication/public:**
  - `/`
  - `/login`
  - `/join`
  - `/no-unit-linked`
- **Dashboard root:**
  - `/dashboard`
  - `/dashboard/profile`
  - `/dashboard/onboarding`
- **Org-scoped workspace:**
  - `/dashboard/organizations/[orgId]`
  - `/dashboard/organizations/[orgId]/analytics`
  - `/dashboard/organizations/[orgId]/scans`
  - `/dashboard/organizations/[orgId]/qrcodes`
  - `/dashboard/organizations/[orgId]/qrcodes/create`
  - `/dashboard/organizations/[orgId]/qrcodes/bulk`
  - `/dashboard/organizations/[orgId]/projects`
  - `/dashboard/organizations/[orgId]/projects/[projectId]`
  - `/dashboard/organizations/[orgId]/projects/[projectId]/crm`
  - `/dashboard/organizations/[orgId]/gates` (Includes GuardShiftVisualMap & PatrolRouteManager)
  - `/dashboard/organizations/[orgId]/team`
  - `/dashboard/organizations/[orgId]/team/watchlist`
  - `/dashboard/organizations/[orgId]/team/incidents`
  - `/dashboard/organizations/[orgId]/team/gate-assignments`
  - `/dashboard/organizations/[orgId]/residents/contacts`
  - `/dashboard/organizations/[orgId]/residents/units`
  - `/dashboard/organizations/[orgId]/maintenance`
  - `/dashboard/organizations/[orgId]/emulation`
  - `/dashboard/organizations/[orgId]/ai`
  - `/dashboard/organizations/[orgId]/ai-hub`
  - `/dashboard/organizations/[orgId]/gateai`
  - `/dashboard/organizations/[orgId]/workspace/settings`
  - `/dashboard/organizations/[orgId]/workspace/billing`
  - `/dashboard/organizations/[orgId]/workspace/webhooks`
  - `/dashboard/organizations/[orgId]/workspace/api-keys`
  - `/dashboard/organizations/[orgId]/settings/*`

## Key Component Inventory (`src/components/dashboard/`)

- **Perimeter & Gate Operations (`gates/`):**
  - `GuardShiftVisualMap.tsx` — Live map with terminal occupancy, guard status, and patrol polylines.
  - `PatrolRouteManager.tsx` — Patrol route editor, checkpoint ordering, and schedule configuration.
  - `PatrolRouteModal.tsx` — Checkpoint details and HMAC QR generation/print dialog.
  - `PatrolComplianceSummary.tsx` — Real-time supervisor patrol compliance dashboard.
  - `ShiftHandoverDrawer.tsx` — Guard shift end, note logging, and relief guard handover.
- **CRM & Access Control (`crm/`, `qrcodes/`, `scans/`):**
  - `ContactTable.tsx`, `UnitTable.tsx` — Dense data grids with search, saved views, and CSV export.
  - `QRCodeTable.tsx`, `QRCodeCreateWizard.tsx` — Cryptographic QR pass generation.
  - `ScanLogTable.tsx` — Real-time access logs with status filter badges.
- **AI & Autonomous Ops (`ai/`):**
  - `AssistantChat.tsx`, `ToolLifecycleModal.tsx`, `PerimeterMapState.tsx`.

## Exhaustive API Route Inventory (`src/app/api/`)

- **Patrol Routes & Checkpoints:**
  - `POST /api/patrols/routes` — Create/update patrol route and sequence checkpoints.
  - `POST /api/patrols/scan` — Validate guard checkpoint scan with HMAC crypto.
  - `GET /api/patrols/live` — Real-time patrol compliance aggregation.
- **Scanner Shift Operations:**
  - `POST /api/scanner/shift/start` — Start/resume guard shift session.
  - `POST /api/scanner/shift/end` — End active shift and summarize metrics.
  - `GET /api/scanner/shift/active` — Check active shift status.
  - `GET /api/scanner/shift/live` — Live multi-terminal shift telemetry stream.
- **Access & Scan Operations:**
  - `POST /api/scans` / `POST /api/scans/bulk` — Scan validation and bulk offline sync.
  - `GET /api/scans/stream` — Real-time Server-Sent Events (SSE) scan stream.
  - `POST /api/qrcodes` / `GET /api/qrcodes` — Pass generation and listing.
- **CRM, Residents & Units:**
  - `GET/POST /api/projects`, `GET/POST /api/units`, `GET/POST /api/contacts`.
  - `POST /api/resident/express-invite`, `GET /api/resident/me`.
- **Security & Governance:**
  - `GET /api/security/audit-export`, `GET /api/api-keys`, `GET /api/webhooks`.
