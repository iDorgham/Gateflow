# Database, Backend, and Tech Reference (Deep Pass)

This file consolidates the DB model map, backend runtime architecture, and technology baseline for AI planning.

## Coverage Scope

- Source-of-truth schema location and model inventory.
- Backend architecture patterns across app route handlers.
- Technology stack baseline and constraints for implementation decisions.

## 1) Database Source of Truth

- Prisma schema: `packages/db/prisma/schema.prisma`
- Migration history: `packages/db/prisma/migrations/*`
- Prisma seed entry (configured in `packages/db/package.json`): `packages/db/prisma/seed-entry.ts`
- Seed helpers and DB utility logic: `packages/db/src/*`, `packages/db/prisma/seed.ts` (legacy/helper scripts)

## 2) Prisma Model Inventory (Current)

Models currently defined in schema include:

- Organization and branding/content:
  - `Organization`, `OrganizationBranding`, `BrandingSnapshot`
  - `LandingPage`, `LandingPageSection`, `BlogPost`, `BlogCategory`
- User/auth and governance:
  - `User`, `Role`, `Invitation`, `RefreshToken`, `ApiKey`, `AdminAuthorizationKey`, `AuditLog`
- Operations and access:
  - `Gate`, `GateAssignment`, `ShiftLog`, `QRCode`, `ScanLog`, `ScanAttachment`, `VisitorQR`
  - `WatchlistEntry`, `Incident`, `AccessRule`, `ResidentLimit`
- CRM and resident domain:
  - `Contact`, `Unit`, `ContactUnit`, `ContactTag`, `Tag`
  - `Lead`, `Deal`, `Project`, `Vendor`
- AI/tasking/content intelligence:
  - `AiTask`, `AiActionLog`, `AiUsageLog`, `AiGeneratedAsset`, `AiAutomation`, `AiContentTag`
  - `KnowledgeSource`, `KnowledgeItem`
- Integrations and comms:
  - `Webhook`, `WebhookDelivery`, `QrShortLink`, `ShortLinkClick`
  - `OrganizationCommunicationConfig`, `CommunicationLog`, `Notification`, `ChatMessage`
- Marketplace/work management:
  - `Merchant`, `Service`, `ServiceBooking`, `WorkOrder`
- Platform/events:
  - `TaskBoard`, `Task`, `TaskBotRule`, `EventLog`, `SupportTicket`, `SupportMessage`

## 3) Mandatory Data Invariants

- Multi-tenant scoping with `organizationId`.
- Soft-delete filtering with `deletedAt: null` where applicable.
- Security-first behavior for token/secret-sensitive records.
- QR and scan-domain integrity guarantees (signed payloads, dedup logic).

## 4) Backend Runtime Shape

Backend logic is primarily app-local in Next.js route handlers:

- `apps/*/src/app/api/**/route.ts`
- (marketing variant) `apps/marketing/app/api/**/route.ts`

Common runtime patterns:

- Request-bound auth validation.
- Data access through shared DB package/client utilities.
- Domain service helpers in `src/lib/**`.
- Structured response + explicit HTTP status branching.

## 5) Backend Ownership by Surface

- Client dashboard backend:
  - Resident flows, scans/QR, analytics, tasks, webhooks, workspace, AI operations.
- Admin dashboard backend:
  - Organization administration, CMS, intelligence, monitoring, support, audit.
- Marketing backend:
  - Contact/lead capture, attribution events, revalidation triggers.
- Resident portal backend:
  - Resident notifications and push registration.

## 6) Tech Stack Baseline

- Monorepo/build:
  - `pnpm`, Turborepo
- Frontend:
  - Next.js App Router, React, Tailwind, shared UI package
- Backend:
  - Next.js route handlers, Node runtime patterns
- Database:
  - PostgreSQL + Prisma
- Shared contracts:
  - TypeScript types in `packages/types`
- Mobile:
  - Expo/React Native apps for scanner/resident-mobile

## 7) Regeneration Commands

- Schema models:
  - `rg "^model\\s+\\w+" packages/db/prisma/schema.prisma`
- API handlers:
  - `rg --files apps -g "**/app/api/**/route.ts"`
- Migrations:
  - `rg --files packages/db/prisma/migrations -g "*.sql"`

## 8) Planning Notes for AI Tools

- Always treat DB and API changes as coupled unless proven otherwise.
- Use phased plans for schema -> API -> UI sequencing.
- Include explicit tenant/safety criteria in every backend-related phase.
