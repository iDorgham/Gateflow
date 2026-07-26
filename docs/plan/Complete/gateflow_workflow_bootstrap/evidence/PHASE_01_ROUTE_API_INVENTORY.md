# Phase 01: Route & API Inventory Matrix

**App:** `apps/client-dashboard`  
**Date:** 2026-07-26  
**Status:** Locked

---

## 1. Pilot-Critical Routes (Residential Access Journey)

| Route Path                  | Type     | Purpose                               | Security / Isolation Guard                           | Status |
| --------------------------- | -------- | ------------------------------------- | ---------------------------------------------------- | ------ |
| `/api/crm/contacts`         | API      | Contact management (residents/guests) | Tenant-scoped (`organizationId`) + `deletedAt: null` | Locked |
| `/api/crm/contacts/[id]`    | API      | Contact detail & updates              | Tenant-scoped (`organizationId`) + `deletedAt: null` | Locked |
| `/api/contacts/[id]/invite` | API      | Issue resident invitation             | Tenant-scoped + rate-limited                         | Locked |
| `/api/qr/send-email`        | API      | Send QR credential via SMTP           | Tenant-scoped + rate-limited (5/min per org)         | Locked |
| `/api/qrcodes`              | API      | QR code generation & listing          | Tenant-scoped (`organizationId`)                     | Locked |
| `/api/resident/arrived`     | API      | Guest arrival notification            | Purpose-bound capability token validation            | Locked |
| `/s/[shortId]`              | Page/API | Public QR landing page                | Scoped short-link lookup                             | Locked |
| `/api/scans/bulk`           | API      | Sync scan logs from edge scanner      | Secret-authenticated + tenant validation             | Locked |
| `/api/scans/[scanId]/deny`  | API      | Manual scan denial override           | Operator-authenticated (`organizationId`)            | Locked |
| `/api/gates`                | API      | Gate assignment & configuration       | Tenant-scoped (`organizationId`)                     | Locked |

---

## 2. Standard Dashboard UI & API Endpoints

### UI Routes (`src/app/[locale]/`)

- `/` — Localized root landing redirect
- `/login` — NextAuth authentication page
- `/no-unit-linked` — Resident error state
- `/dashboard` — Operational overview page
- `/dashboard/onboarding` — Multi-step organization onboarding wizard
- `/dashboard/profile` — User profile settings
- `/dashboard/organizations/[orgId]/scans` — Access event log table & drawer
- `/dashboard/organizations/[orgId]/residents` — Resident contacts management
- `/dashboard/organizations/[orgId]/analytics` — Visual analytics & PDF export
- `/dashboard/organizations/[orgId]/maintenance` — Autonomous work-orders
- `/dashboard/organizations/[orgId]/ai` — GateAI hub
- `/dashboard/organizations/[orgId]/team/watchlist` — Security watchlist UI
- `/dashboard/organizations/[orgId]/team/incidents` — Incident log UI

### Administrative & Analytics API Endpoints

- `/api/analytics/*` (18 endpoints) — Dashboard telemetry, heatmaps, PDF exports
- `/api/danger/purge-scans` — Guarded scan purge (401 unauthenticated, 403 non-admin)
- `/api/webhooks/whatsapp` — HMAC-verified webhook handler with replay protection
- `/api/cron/ai-tasks` — Automated AI task queue processor

---

## 3. Verification

- All 43 routes cataloged and cross-referenced with Next.js App Router structure.
- Pre-flight security scan: **0 secrets, 0 circular imports**.
- Jest tests: **75/75 passed** (422 tests).
