# GateFlow — Enhanced System Plan & Application Specifications

**Version:** v9.0 (Production‑Hardened)  
**Status:** Ready for Execution  
**Target Architecture:** Turborepo + pnpm monorepo, Vercel deployments, Expo native apps  
**Target Domain:** `*.gateflow.site`

---

## 1. Executive Summary

GateFlow is a multi‑tenant physical access and visitor management platform for gated communities, focused on the MENA region. The baseline platform provides a solid foundation: 7 applications, 11 shared packages, 67 Prisma models, 187 API routes, and strong security invariants (HMAC QR, soft deletes, multi‑tenancy). This enhanced blueprint closes the P0/P1 audit findings from the **August 31, 2026 Comprehensive Repository Audit** and expands the product to full‑stack, real‑time, and AI‑driven operations.

Key enhancements in this version:

- **P0 Audit Remediation**: Sliding-window API rate limiting on bulk routes (P0-001), direct `organizationId` denormalization on `ScanLog` (P0-002), and outbound webhook Dead-Letter Queue (P1-001).
- **Real‑time hardware telemetry** via MQTT with admin/ops dashboards.
- **Wallet pass issuance** (Apple PKPass / Google Wallet JWT) for frictionless resident experience.
- **ANPR + on‑device LPR** for vehicle access control.
- **GateAI 2.0** with autonomous ticket triage and dispatch.
- **Cross‑app event bus** to decouple services and enable real‑time updates.
- **Comprehensive integration hub** in client & admin dashboards with encrypted secret storage and live testing.
- **Security & Compliance hardening**: step‑up MFA, rate limiting, IP allow‑lists, Law 151 / PDPL audit export.

---

## 2. Enhanced Deployment Connectivity Audit Plan

### 2.1 Pre‑flight Checklist (CI or Local)

```bash
# Toolchain
node -v                  # ≥20
pnpm -v                  # 8.15.x
pnpm install --frozen-lockfile

# Environment completeness – compare with .env.example
# Required secrets:
#   DATABASE_URL, DIRECT_DATABASE_URL
#   NEXTAUTH_SECRET, NEXTAUTH_URL
#   QR_SIGNING_SECRET (≥32 chars)
#   ENCRYPTION_MASTER_KEY (32‑byte hex)
#   ADMIN_ACCESS_KEY (≥32 chars)
#   UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN
#   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
#   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
#   BLOB_READ_WRITE_TOKEN
#   VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID_* (per app)
#   RESIDENT_API_UPSTREAM (production URL)
#   MQTT_URL, MQTT_USER, MQTT_PASS (for hardware telemetry)
#   OPENAI_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY (for AI)
#   WHATSAPP_CLOUD_API_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN (for messaging)

# Database health
pnpm --filter @gate-access/db prisma validate
pnpm --filter @gate-access/db prisma migrate status

# Monorepo quality gates
pnpm preflight          # typecheck, lint, ADS check, bootstrap‑routes
pnpm check:ads
pnpm check:bootstrap-routes
pnpm check:integrations   # verifies required env vars for enabled features
```

### 2.2 Cross‑App Connectivity Matrix

| From → To                        | Path / Mechanism                                                            | Verification Steps                                              |
| -------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Marketing → Client Dashboard     | `POST /api/contact` + NextAuth redirect                                     | Submit lead form; verify org bootstrap and login redirect       |
| Client → Resident Portal         | Shared JWT cookie (`domain=.gateflow.site`) + `RESIDENT_API_UPSTREAM` proxy | Create invite; open portal link; session persists               |
| Client/Portal → Scanner App      | HMAC‑SHA256 QR payload (same `QR_SIGNING_SECRET`)                           | Create QR in client; scan in scanner emulator; verify signature |
| Scanner App → Barrier HW         | TCP/RS‑485 relay (CCITT‑CRC16) or MQTT command                              | Simulate relay open; check logs                                 |
| Scanner App → Backend            | Offline queue (SQLite) → sync via REST when online                          | Put device in offline mode; scan; reconnect; verify sync        |
| Client → Admin Dashboard         | Admin key header + Stripe webhooks                                          | Create organisation; check admin sees it; simulate Stripe event |
| All Web Apps → Design System     | `@gateflow/ui` + `@gateflow/tokens`                                         | Run `pnpm check:ads` – no hardcoded colours                     |
| Any App → Stripe/SMTP/Redis/Blob | Environment variables + webhook signatures                                  | Send test email; upload blob; trigger webhook                   |
| Admin → Hardware Fleet           | MQTT subscribe / publish                                                    | Publish test telemetry; see it in admin map                     |
| Client → AI (GateAI)             | `@gateflow/ai` + streaming API                                              | Send chat message; verify SSE stream and tool calls             |

---

## 3. Cross‑Application Architecture & Connections

### 3.1 Global Event Bus

Backend services publish domain events to a central bus (Redis Streams or AWS SNS/SQS). Consumers subscribe to relevant events to update their own state or trigger side‑effects.

```ts
interface GateFlowEvent {
  id: string; // UUID
  type: EventType; // e.g. 'qr.created', 'gate.opened', 'visitor.arrived'
  tenantId: string;
  actor?: string; // user id or 'system'
  timestamp: ISO8601;
  payload: Record<string, any>;
}
```

### 3.2 Data Ownership & Access Patterns

- **Organisation** is the tenant boundary (`organizationId` on almost all models).
- **Admin** can access all tenants with elevated permissions.
- **Client** can access only its own org data.
- **Resident** can access only their own unit and associated passes/bookings.
- **Scanner** has a restricted API surface (verify QR, upload scan logs, receive gate commands).

---

## 4. Enhanced Integration Settings

### 4.1 Data Model (`IntegrationCredential`)

```prisma
model IntegrationCredential {
  id            String   @id @default(cuid())
  organizationId String  @map("organization_id")
  type          IntegrationType
  config        Json     // encrypted using ENCRYPTION_MASTER_KEY
  isActive      Boolean  @default(true)
  lastTestedAt  DateTime?
  lastTestStatus IntegrationTestStatus?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([organizationId, type])
  @@map("integration_credentials")
}

enum IntegrationType {
  GTM
  GA4
  META_PIXEL
  HUBSPOT
  WHATSAPP
  TWILIO
  SMTP
  STRIPE
  BLOB
  SENTRY
  POSTHOG
  MQTT
  AI_OPENAI
  AI_ANTHROPIC
  AI_GEMINI
  WEBHOOK_COMPLIANCE
}
```

---

## 5. Application‑Specific Specifications

- **`apps/client-dashboard`**: ANPR integration, GateAI 2.0 autonomous triage, MENA compliance PII purge, live barrier map, sliding-window rate limiting on `/api/qrcodes/validate`, `/api/scans/bulk`, and `/api/qr/bulk-create`.
- **`apps/admin-dashboard`**: Barrier hardware fleet telemetry, global AI token analytics, integration health dashboard, sandbox tenant provisioner.
- **`apps/resident-portal`**: Apple & Google Wallet native passes, amenity bookings, WebRTC gate intercom.
- **`apps/marketing`**: MENA security ROI calculator, 14-day self-service sandbox generator, attribution test harness.
- **`apps/design-system`**: Tailwind v4 migration, WCAG 2.2 AA contrast playground, motion physics inspector.
- **`apps/scanner-app`**: On-device LPR / OCR, BLE proximity access, biometric unlock.
- **`apps/resident-mobile`**: Geofenced auto-key trigger, family household sub-account delegation, wallet pass mirror.

---

## 6. Implementation Roadmap with Audit Dependencies

| Phase                                                 | Deliverables                                                                                                                                                                                 | Primary Apps / Packages                                              | Audit Target / Priority | Expected Duration |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | :---------------------: | :---------------: |
| **Phase 0: Audit Remediation & Foundation Hardening** | P0-001 Redis sliding-window rate limiting, P0-002 `ScanLog.organizationId` denormalization + backfill migration, P1-001 Webhook DLQ with exponential retries, P1-002 soft-delete query audit | All apps, `packages/db`, `packages/api-client`                       | **P0 / P1 Remediation** |      2 weeks      |
| **Phase 1: Wallet Pass & Vehicle ANPR / LPR**         | Apple PKPass / Google Wallet issuance, `VehiclePlate` model + camera ANPR webhook ingestion + on-device LPR                                                                                  | `resident-portal`, `client-dashboard`, `scanner-app`, `packages/db`  |    Feature Expansion    |      6 weeks      |
| **Phase 2: GateAI 2.0, Triage & WebRTC Intercom**     | AI ticket triage & autonomous `WorkOrder` dispatch, WebRTC gate intercom, live barrier map                                                                                                   | `client-dashboard`, `resident-portal`, `scanner-app`, `@gateflow/ai` |     Autonomous Ops      |      8 weeks      |
| **Phase 3: Hardware Fleet Telemetry & BLE**           | Admin global MQTT barrier fleet map, BLE proximity beacon challenge, on-device license plate OCR                                                                                             | `admin-dashboard`, `scanner-app`, `resident-mobile`                  |     Hardware Fleet      |      8 weeks      |
| **Phase 4: Self-Service Sandbox & MENA ROI Engine**   | Interactive MENA Security ROI calculator, 14-day self-service sandbox generator, attribution harness                                                                                         | `marketing`, `admin-dashboard`                                       |      Growth Engine      |      4 weeks      |
| **Phase 5: Design System & Observability**            | Tailwind v4 migration, WCAG 2.2 AA contrast playground, motion physics inspector, visual regression test suite                                                                               | `design-system`, `admin-dashboard`, `@gateflow/ui`                   |       Design & QA       |      4 weeks      |
| **Phase 6: MENA Compliance & Launch**                 | Law 151 / PDPL PDF export, PII auto-purge scheduler, tenant IP allow-listing, Vercel production deployment                                                                                   | `client-dashboard`, `admin-dashboard`                                |   Compliance & Launch   |      4 weeks      |
