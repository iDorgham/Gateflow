# GateFlow Architecture Guide (Docs v2)

**Version:** 1.0  
**Aligned with:** `docs/PRD_v6.0.md`  

---

## 1. Monorepo Overview

GateFlow is a **Turborepo monorepo** with 6 apps and 6 shared packages:

- **Apps (`apps/`):**
  - `marketing/` — Public marketing site (Next.js 14).
  - `client-dashboard/` — Tenant portal for organizations (Next.js 14).
  - `admin-dashboard/` — Platform admin console (Next.js 14).
  - `scanner-app/` — Expo mobile scanner for gates (SDK 54).
  - `resident-portal/` — Web portal for residents (Next.js 14).
  - `resident-mobile/` — Expo app for residents (planned).
- **Packages (`packages/`):**
  - `db/` — Prisma schema, client, migrations, seeds.
  - `types/` — Shared TypeScript types and enums.
  - `ui/` — Shared UI components (shadcn-style).
  - `config/` — Shared ESLint/TS/Tailwind presets.
  - `api-client/` — Shared HTTP utilities with JWT auth.
  - `i18n/` — Arabic/English i18n resources.

Core infra:

- **Database:** PostgreSQL 15+ via Prisma 5.
- **Backend runtime:** Next.js App Router (serverless / edge, as configured per app).
- **Mobile:** Expo/React Native 54 with SecureStore for tokens.

---

## 2. High-Level System Diagram

Conceptual data flow:

```text
Residents / Tenants / Admins
        │ Web (Next.js) / Mobile (Expo)
        ▼
 Client Dashboard / Resident Portal / Admin Dashboard / Scanner App
        │
        ▼
      API Layer (Next.js app router routes under apps/client-dashboard)
        │
        ▼
 PostgreSQL (Prisma via @gate-access/db) + Redis (rate limiting/cache)
```

Key relationships:

- All **web APIs** live under `apps/client-dashboard/src/app/api/**` and expose:
  - Auth (login/refresh/logout).
  - QR management and validation.
  - Scan logging and exports.
  - Gates, projects, webhooks, API keys.
  - Resident APIs (`/api/resident/*`).
- **Scanner app** talks only to the client-dashboard API (`EXPO_PUBLIC_API_URL`).
- **Resident portal / mobile** use the same backend, with `RESIDENT` JWT role and unit linking.

---

## 3. Data Model & Multi-Tenancy

The Prisma schema (see `packages/db/prisma/schema.prisma`) defines:

| Model           | Purpose                                    |
|----------------|--------------------------------------------|
| `Organization` | Tenant root (multi-tenancy boundary).      |
| `Project`      | Grouping within an organization.           |
| `User`         | Authenticated users (admins, residents).   |
| `Gate`         | Physical gate (entry/exit point).          |
| `QRCode`       | Access codes (single, recurring, visitor). |
| `ScanLog`      | Immutable(‑ish) log of scan events.        |
| `Webhook`      | Outbound notification endpoints.           |
| `ApiKey`       | Programmatic access keys.                  |
| `Unit`         | Residential unit linked to a user.         |
| `VisitorQR`    | Visitor passes created by residents.       |
| `AccessRule`   | Time-based access rules.                   |
| `ResidentLimit`| Quota configuration per unit type.         |
| `Role`         | RBAC roles with JSON permissions.          |

**Multi-tenancy rules** (enforced by contracts and rules):

- Every tenant query **must** include `organizationId`.
- All mutable models use `deletedAt` soft deletes; queries filter `deletedAt: null`.
- No direct DB access from mobile apps; all flows go through the API layer.

---

## 4. Core Flows

### 4.1 QR Lifecycle (Tenant-Generated)

1. Tenant admin creates QR in **client-dashboard**:
   - Single, recurring, permanent, or bulk CSV.
   - Payload is signed with HMAC-SHA256 using `QR_SIGNING_SECRET`.
2. QR is distributed via:
   - On-screen display.
   - Email.
   - Short link (`/s/[shortId]`) for marketing flows.
3. **Scanner app**:
   - Validates QR offline using shared secret.
   - Queues scans offline with AES-256 encryption.
   - Syncs via bulk endpoint when back online.
4. Backend:
   - Logs `ScanLog` entries with status, gate, qrCode, user (if known), and context.
   - Triggers webhooks and analytics exports where configured.

### 4.2 Resident Visitor Flow

1. Resident logs into **resident portal or mobile** (`RESIDENT` role).
2. Resident creates a `VisitorQR`:
   - Linked to their `Unit`.
   - With an `AccessRule` (one-time, date-range, recurring, permanent).
   - Quota enforcement via `ResidentLimit` (per unit type).
3. Resident shares the QR link:
   - Direct link or via WhatsApp/Email/SMS (resident mobile enhancement).
4. Visitor arrives at gate:
   - Scanner validates QR (type `VISITOR` or `OPEN`).
   - Scan log is recorded; events may notify resident (scan + arrival notifications).

### 4.3 Scanner & Gate Rules (v6)

GateFlow v6 adds:

- **Gate–account assignment:** Users can be restricted to specific gates.
- **Location rule:** Optional enforcement that scans must occur near the configured gate coordinates.
- **Visitor identity levels:** ID capture and OCR tiers for high‑security tenants.
- **Watchlists & guard shifts/incidents:** Operational tooling for security teams.

These are described in detail in `PRD_v6.0.md` Sections 13–14.

---

## 5. App Responsibilities

| App                | Role                                                                      |
|--------------------|---------------------------------------------------------------------------|
| `marketing`        | Public site, marketing pages, lead capture.                              |
| `client-dashboard` | Tenant admin UX, QR management, analytics, APIs, resident/unit admin.    |
| `admin-dashboard`  | Platform-level org/user management, system-wide analytics (v6+).         |
| `scanner-app`      | Gate operator UX, offline scanning, overrides, incidents.                |
| `resident-portal`  | Web UX for residents, visitor management, history.                       |
| `resident-mobile`  | Mobile UX for residents (sharing passes, notifications, navigation).     |

Shared packages encapsulate cross-cutting concerns (DB, types, UI, config, i18n, API client).

---

## 6. Observability & Integrations (High Level)

- **Rate limiting & cache:** Upstash Redis.
- **Webhooks:** Configurable per tenant for scan/QR events.
- **Analytics:** Exposed via dashboards + exports; marketing suite (pixels, UTM, CRM webhooks) extends this.
- **Logging & metrics:** Structured logging with correlation IDs; external providers (e.g., Datadog/Logtail) are configured at infra level.

For deeper details on security and performance, see:

- `docs/guides/SECURITY_OVERVIEW.md`
- Archived audits in `docs/archive/plan-legacy/operations/SECURITY_PERFORMANCE_AUDIT.md`.

