# Ultra-Detailed Context Reference: Client Dashboard (`apps/client-dashboard`)

> **Comprehensive Technical Specification for AI Assistants & Senior Engineers**  
> **Application**: `apps/client-dashboard`  
> **Production Target**: `https://app.gateflow.site`  
> **Last Verified**: August 28, 2026

---

## 1. Architectural Topology & State Model

The Client Dashboard is an enterprise-grade Next.js 14 App Router application engineered for high-concurrency property operations, real-time perimeter monitoring, and zero-trust multi-tenancy.

### Technology Stack:

- **Framework**: Next.js 14.2.x (App Router, Server Actions, API Route Handlers)
- **State & Data Fetching**: SWR for optimistic client caching, Server-Sent Events (SSE) for live perimeter streams
- **UI & Theming**: Tailwind CSS, Atlassian Design System (ADS) semantic tokens, Lucide React icons, Framer Motion
- **ORM & Data Layer**: Prisma 5.x with PostgreSQL connection pooling and Accelerate
- **Authentication**: NextAuth.js JWT session with cross-subdomain cookie sharing (`.gateflow.site`)

---

## 2. Deep Dive: Perimeter & Gate Patrol Operations

### 2.1 Guard Shift Visual Map (`src/components/dashboard/gates/GuardShiftVisualMap.tsx`)

- **Real-Time Terminal Monitoring**:
  - Displays all physical gate barriers associated with the tenant organization.
  - Shows live terminal occupancy: active guard name, guard avatar, shift duration timer, terminal online/offline heartbeat.
- **Patrol Polyline Overlays**:
  - Fetches active patrol logs via `GET /api/patrols/live`.
  - Connects ordered checkpoint coordinates via SVG/Canvas polyline paths.
  - Dynamically colors completed segments (green) vs pending segments (blue dashed) vs overdue/missed checkpoints (red pulse).
- **Shift Handover Integration**:
  - Embedded trigger launching `ShiftHandoverDrawer.tsx`.
  - Captures handoff notes, terminal equipment checklist (e.g. handheld scanner battery, barrier remote), and relief guard sign-on.

### 2.2 Patrol Route Manager (`src/components/dashboard/gates/PatrolRouteManager.tsx`)

- **Route Sequencing Engine**:
  - Drag-and-drop ordering of physical checkpoints (`PatrolCheckpoint`).
  - Configures expected transition times (e.g. 5 minutes between Checkpoint A and Checkpoint B) with tolerance windows.
- **Cryptographic QR Generator & Print Studio (`PatrolRouteModal.tsx`)**:
  - Generates HMAC-SHA256 signed QR codes for each checkpoint containing: `checkpointId`, `routeId`, `sequenceOrder`, `orgId`, and deterministic cryptographic signature.
  - High-resolution SVG/PNG export formatted for weather-resistant outdoor physical signage printing.

---

## 3. Deep Dive: API Contracts & Endpoints

### 3.1 Patrol Routes API (`POST /api/patrols/routes`)

- **Request Headers**: `Authorization: Bearer <session-token>`
- **Request Body**:
  ```json
  {
    "name": "North Perimeter Night Route",
    "description": "Outer fence checkpoints 1 through 8",
    "projectId": "proj_123456",
    "checkpoints": [
      {
        "name": "North Gate Perimeter Post",
        "latitude": 30.0444,
        "longitude": 31.2357,
        "sequence": 1,
        "toleranceMinutes": 10
      }
    ]
  }
  ```
- **Response**: `201 Created` with serialized `PatrolRoute` including generated HMAC QR tokens.

### 3.2 Checkpoint Scan API (`POST /api/patrols/scan`)

- **Request Body**:
  ```json
  {
    "checkpointId": "chk_98765",
    "routeId": "route_12345",
    "qrToken": "gf:chk:v1:<base64-payload>.<signature>",
    "latitude": 30.0445,
    "longitude": 31.2358
  }
  ```
- **Verification Logic**:
  1. Validates `organizationId` from authenticated claims.
  2. Verifies HMAC-SHA256 signature against server-side secret.
  3. Checks sequence order against active `PatrolLog`.
  4. Records `CheckpointScan` with timestamp and compliance status (`ON_TIME` or `DELAYED`).

---

## 4. Verification & Testing Standards

- All API routes MUST include unit tests covering:
  1. Unauthenticated request rejection (`401 Unauthorized`).
  2. Cross-tenant organization access rejection (`403 Forbidden`).
  3. Valid payload processing and DB record creation (`200 OK` / `201 Created`).
  4. Invalid cryptographic signature rejection (`400 Bad Request`).
