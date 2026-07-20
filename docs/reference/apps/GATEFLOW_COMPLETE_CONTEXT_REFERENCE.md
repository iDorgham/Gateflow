# GateFlow Complete Context Reference

Generated on 2026-04-30T13:09:06.951Z

## FILES AND STRUCTURE

This file is the filesystem map for planning agents. It answers "where should this change live?" before implementation starts.

## Coverage Scope

- Monorepo topography for `apps/`, `packages/`, and planning docs.
- Ownership boundaries (which app/package owns what).
- Critical path map for UI, API routes, shared contracts, and DB schema.
- Known structural anomalies that can affect automated tooling.

## 1) Workspace Topology

- Root model: Turborepo + pnpm workspaces.
- Runtime apps are in `apps/`.
- Shared code and contracts are in `packages/`.
- Planning lifecycle is in `docs/plan/`.
- Process and automation docs are in `docs/development/` and `docs/guides/`.

## 2) Apps Directory (Primary Product Surfaces)

- `apps/client-dashboard`
  - Largest operational app (UI + API surface).
  - Core folder roots:
    - `src/app/[locale]/...` (pages/routes)
    - `src/app/api/...` (route handlers)
    - `src/components/...` (feature UI)
    - `src/lib/...` (domain/service utilities)
- `apps/admin-dashboard`
  - Platform/governance console with dedicated API routes.
  - Core folder roots:
    - `src/app/[locale]/(dashboard)/...`
    - `src/app/api/...`
    - `src/components/...`
    - `src/lib/...`
- `apps/marketing`
  - Public marketing site + attribution/event APIs.
  - Core folder roots:
    - `app/[locale]/...`
    - `app/api/...`
    - `locales/...`
- `apps/resident-portal`
  - Resident-facing web portal.
  - Core folder roots:
    - `src/app/(portal)/...`
    - `src/app/api/resident/...`
    - `src/components/...`
- `apps/scanner-app`
  - Expo/mobile scanner app (native/mobile-first structure; not App Router pages).
- `apps/resident-mobile`
  - Mobile app surface (Expo structure).
- `apps/design-system`
  - Design-system app scaffold surface.

## 3) Packages Directory (Shared Foundation)

- `packages/db`
  - Prisma schema, migrations, seeds, DB utilities.
  - Source of truth: `packages/db/prisma/schema.prisma`
- `packages/types`
  - Shared cross-app type contracts.
- `packages/ui`
  - Shared component library and tokenized UI primitives.
- `packages/i18n`
  - Localization foundations.
- `packages/api-client`
  - Shared API client logic/patterns.
- `packages/config`
  - Shared build/config conventions.
- `packages/stripe`
  - Billing integration helpers.
- `packages/utils`
  - Utility helpers (cross-cutting).

## 4) Planning and Execution Folders

- `docs/plan/Active`
- `docs/plan/Ready`
- `docs/plan/Complete`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

Canonical lifecycle and shape docs:

- `docs/development/PLAN_LIFECYCLE.md`
- `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`
- `docs/reference/apps/PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md`

## 5) Structure Ownership Rules

- UI pages should live in app-local route trees (not shared packages).
- API route handlers remain app-local in `app/api`.
- Shared validation/contracts/types belong in `packages/types` or shared package modules.
- DB schema changes belong in `packages/db/prisma/`.
- Reusable visual primitives belong in `packages/ui`.

## 6) Critical Path Map (Where to Look First)

- Route/page issues:
  - `apps/*/src/app/**/page.tsx`
  - `apps/marketing/app/**/page.tsx`
- API behavior:
  - `apps/*/src/app/api/**/route.ts`
  - `apps/marketing/app/api/**/route.ts`
- DB model/relations:
  - `packages/db/prisma/schema.prisma`
- Shared design primitives:
  - `packages/ui/src/components/ui/*`
  - `packages/ui/src/tokens.ts`
- Cross-app contracts:
  - `packages/types/src/*`

## 7) Known Structural Anomalies

- There is a directory with trailing-space naming under apps listing: `apps/resident mobile `.
- Standard active app path is `apps/resident-mobile`.
- Automated scripts should avoid assumptions based solely on human-readable app names; always use exact filesystem paths.

## 8) Fast Scan Commands

Use these to regenerate structure context quickly:

- List apps:
  - `ls apps`
- List packages:
  - `ls packages`
- Page files:
  - `rg --files apps -g "**/app/**/page.tsx"`
- API route handlers:
  - `rg --files apps -g "**/app/api/**/route.ts"`
- Prisma models:
  - `rg "^model\\s+\\w+" packages/db/prisma/schema.prisma`

## 9) Planning Notes for AI Tools

- Always decide ownership first (app-local vs shared package).
- When touching API + DB + UI in one initiative, split work into phased changes per layer.
- Never treat one app's `src/lib` as globally reusable by default; promote only intentionally into shared packages.

---

## DATABASE BACKEND AND TECH

This file consolidates the DB model map, backend runtime architecture, and technology baseline for AI planning.

## Coverage Scope

- Source-of-truth schema location and model inventory.
- Backend architecture patterns across app route handlers.
- Technology stack baseline and constraints for implementation decisions.

## 1) Database Source of Truth

- Prisma schema: `packages/db/prisma/schema.prisma`
- Migration history: `packages/db/prisma/migrations/*`
- Seed and DB utility logic: `packages/db/src/*`, `packages/db/prisma/seed.ts`

## 2) Prisma Model Inventory (Current)

Models currently defined in schema include:

- Organization and branding/content:
  - `Organization`, `OrganizationBranding`, `StyleSnapshot`, `ThemeVariable`
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

---

## API GATEWAY AND CONTRACTS

This file maps GateFlow's effective API gateway architecture and route contract landscape.

## Coverage Scope

- API route ownership and gateway model.
- Live route counts and domain group distribution.
- Contract and safety invariants expected across handlers.

## 1) Gateway Architecture (Current Reality)

GateFlow currently uses a distributed gateway model:

- No single standalone gateway service in a separate repo/package.
- Each Next.js app exposes route handlers under `app/api/**/route.ts`.
- Governance is shared through common invariants (tenant scope, soft-delete, auth, security rules), not a single edge gateway process.

Primary API-producing apps:

- `client-dashboard`
- `admin-dashboard`
- `marketing`
- `resident-portal`

## 2) Live API Route Counts (Current Snapshot)

- `client-dashboard`: 124 route files
- `admin-dashboard`: 61 route files
- `marketing`: 4 route files
- `resident-portal`: 2 route files

## 3) Domain Group Distribution (Top-Level API Segment)

### Client Dashboard API groups

- `analytics` (20)
- `resident` (12)
- `contacts` (7)
- `projects` (6)
- `ai` (6)
- `workspace` (5)
- `webhooks` (5)
- plus operational groups (`gates`, `scans`, `qrcodes`, `auth`, `tags`, `tasks`, `team`, `watchlist`, etc.)

### Admin Dashboard API groups

- `admin` (17)
- `cms` (13)
- `support` (5)
- `organizations` (3)
- plus `crm`, `intelligence`, `monitoring`, `auth`, `analytics`, `audit`, `branding`, `tasks`

### Marketing API groups

- `contact` (1)
- `marketing` (1)
- `revalidate` (1)

### Resident Portal API groups

- `resident` (2)

## 4) HTTP Method Surface (Route Handler Pattern)

Route handlers expose method exports:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

Method handlers are declared with exported async functions in each `route.ts`.

## 5) Contract and Security Invariants

All API work should preserve:

- Tenant isolation using `organizationId` scoping for tenant data operations.
- Soft-delete safety (`deletedAt: null`) where applicable.
- Auth and role checks appropriate to route sensitivity.
- Validation at request boundaries (payload/path/query).
- Stable response envelopes for client consumption.
- Explicit error status and failure-path consistency.

## 6) API Domain Ownership

- `client-dashboard` API: property operations, scans/QR, residents, analytics, workspace, AI actions.
- `admin-dashboard` API: platform governance, organization admin, CMS, support/intelligence.
- `marketing` API: lead capture and attribution/event ingestion.
- `resident-portal` API: resident-facing notification/push actions.

## 7) Fast Regeneration Commands

- Full API route inventory:
  - `rg --files apps -g "**/app/api/**/route.ts"`
- Route handler methods:
  - `rg "export\\s+async\\s+function\\s+(GET|POST|PUT|PATCH|DELETE)" apps --glob "**/app/api/**/route.ts"`
- Per-app API routes:
  - `rg --files apps/client-dashboard -g "**/app/api/**/route.ts"`
  - `rg --files apps/admin-dashboard -g "**/app/api/**/route.ts"`
  - `rg --files apps/marketing -g "**/app/api/**/route.ts"`
  - `rg --files apps/resident-portal -g "**/app/api/**/route.ts"`

## 8) Planning Notes for AI Tools

- Plan API changes by domain group (for example, `analytics`, `resident`, `admin`, `cms`) to reduce cross-domain regressions.
- If UI and API both change, enforce contract-first sequencing in phased plans.
- Explicitly include auth + tenant checks in each API phase acceptance criteria.

---

## ADMIN DASHBOARD

Comprehensive reference for `apps/admin-dashboard` including delivered scope, structure, menu model, and API inventory.

## Coverage Status

- Pages/routes: covered (global and org-scoped route surfaces).
- Menu/navigation: covered.
- API routes: covered (exhaustive inventory).
- UI/UX modules: covered at component-domain level.
- Function-level implementation details: summarized by service modules, not per-function listing.
- DB model ownership: covered by admin feature domains.

## App Purpose

- Platform-level command center for GateFlow operators.
- Provides global and organization-scoped control for operations, governance, analytics, security, CRM, CMS, and intelligence modules.

## What Has Been Completed

From current code and changelog:

- Admin dashboard redesign/refinement phases were executed.
- Admin AI assistant and AI SDK migration work have been integrated.
- Traffic emulation tooling and emulation history streams are implemented.
- Style hub + AI-assisted style editing routes are present.
- CMS page management/public publish/scaffold and blog generation routes are implemented.
- Organization/user/authorization key/finance/health API surfaces are in place.

## Application Structure

## Main Route Tree (`src/app/[locale]`)

- Authentication:
  - `/login`
- Dashboard root and redirect:
  - `/(dashboard)`
  - `/(dashboard)/redirect`
- Core platform:
  - `/organizations`
  - `/users`
  - `/admins`
  - `/projects`
  - `/gates`
  - `/analytics`
  - `/scans`
  - `/audit-logs`
  - `/authorization-keys`
  - `/finance`
  - `/intelligence`
- Monitoring:
  - `/monitoring`
  - `/monitoring/hub`
  - `/monitoring/seeding`
  - `/monitoring/emulation`
- CRM and CMS:
  - `/crm`
  - `/crm/deals`
  - `/cms/pages`
  - `/cms/blog`
- Settings:
  - `/settings`
  - `/settings/api`
  - `/settings/app-urls`
  - `/settings/auth`
  - `/settings/authentication`
  - `/settings/audit-logs`
  - `/settings/compliance`
  - `/settings/database`
  - `/settings/email`
  - `/settings/infrastructure`
  - `/settings/localization`
  - `/settings/rate-limiting`
  - `/settings/security`
  - `/settings/security-policies`
  - `/settings/style-hub`
- Organization-scoped mirrors:
  - `/organizations/[orgId]/*` across analytics, users, projects, gates, scans, monitoring, intelligence, cms, finance, audit logs, tasks.

## Menu and Navigation Architecture

Primary nav source: `apps/admin-dashboard/src/components/Sidebar.tsx`.

### Sidebar Group Model (Current)

- Core Platform:
  - Overview
  - Organizations
  - Users
  - Projects
  - Gates
  - Intelligence Hub
- Ops & Analytics:
  - Performance
  - Scan Traffic
  - Ops Control
  - Audit Trail
- Sales & CRM:
  - Lead CRM
  - Deal Pipeline
- Content & CMS:
  - Landing Pages
  - Blog Studio
- Governance:
  - Emulation
  - Auth Keys
  - Settings
  - Admins

### Routing Behavior in Sidebar

- Supports global-only pages (never org-scoped).
- Automatically scopes non-global links when an org is selected.
- Falls back to organizations list if scoped pages require org context.

## UI/UX Architecture (Component Domains)

`apps/admin-dashboard/src/components` module families:

- Shell/navigation:
  - `Sidebar.tsx`, `admin-shell.tsx`, `admin-side-panel.tsx`, `GlobalSearch.tsx`.
- Organization/user management:
  - `organizations/*`, `users/*`, role and detail sheets.
- Monitoring/ops:
  - `monitoring/*`, `ops/*`, health/status and audit visualization surfaces.
- Governance/security/settings:
  - `settings/*`, `theming/StyleEditor.tsx`, `branding/BrandingStyles.tsx`.
- Intelligence and AI:
  - `admin-ai-assistant.tsx`, `intelligence/*`, `tasks/*`, bot manager/task hub.
- CRM/CMS:
  - `crm/*`, `cms/*` including page builder, blog editor, scaffolder wizard.

## API Surface (Complete Current Inventory)

All handlers under `apps/admin-dashboard/src/app/api`:

- `/api/admin/ai/assistant`
- `/api/admin/analytics`
- `/api/admin/audit-logs/export`
- `/api/admin/authorization-keys`
- `/api/admin/authorization-keys/[id]`
- `/api/admin/emulate-traffic`
- `/api/admin/emulation-history`
- `/api/admin/emulation-history/stream`
- `/api/admin/finance`
- `/api/admin/health`
- `/api/admin/login`
- `/api/admin/organizations`
- `/api/admin/organizations/[id]`
- `/api/admin/reset-tenant`
- `/api/admin/seed-hierarchy`
- `/api/admin/users`
- `/api/admin/users/[id]`
- `/api/auth/login`
- `/api/branding/[orgId]`
- `/api/cms/generate-blog`
- `/api/cms/generate-section`
- `/api/cms/pages/[id]/publish`
- `/api/cms/pages/[slug]`
- `/api/cms/pages/public/[slug]`
- `/api/cms/pages/scaffold`
- `/api/crm/generate-draft`
- `/api/crm/score-lead`
- `/api/intelligence/chat`
- `/api/intelligence/sync`
- `/api/organizations/[orgId]/cms/pages`
- `/api/organizations/[orgId]/style/ai-edit`
- `/api/organizations/[orgId]/style/save`
- `/api/tasks/generate`

## API Domains (Planning-Friendly Grouping)

- Platform governance: `admin/organizations*`, `admin/users*`, `admin/authorization-keys*`, `admin/reset-tenant`
- Monitoring and operations: `admin/health`, `admin/analytics`, `admin/finance`, `admin/emulate-traffic`, `admin/emulation-history*`, `admin/seed-hierarchy`
- AI and intelligence: `admin/ai/assistant`, `intelligence/chat`, `intelligence/sync`, `tasks/generate`
- CMS/content: `cms/*`, `organizations/[orgId]/cms/pages`
- Design/theming/branding: `organizations/[orgId]/style/*`, `branding/[orgId]`
- CRM: `crm/generate-draft`, `crm/score-lead`
- Auth: `auth/login`, `admin/login`

## Function and Service Layer

Primary service/helper modules in `apps/admin-dashboard/src/lib`:

- `admin-auth.ts` - admin session and guard logic.
- `branding-css-generator.ts` - style token/css generation.
- `bot-reactor.ts`, `task-bot-reactor.ts` - automation/task reaction logic.
- `notifications.ts` - admin notification workflows.
- `i18n/*` - localization runtime/configuration helpers.

## DB Model Coverage by Admin Domain

Admin dashboard primarily governs these schema domains:

- Platform governance:
  - `Organization`, `User`, `Role`, `AdminAuthorizationKey`, `AuditLog`.
- Monitoring and operations:
  - `ScanLog`, `Gate`, `EventLog`, `Incident`, `WebhookDelivery`.
- Design/content systems:
  - `OrganizationBranding`, `ThemeVariable`, `StyleSnapshot`,
  - `LandingPage`, `LandingPageSection`, `BlogPost`, `BlogCategory`.
- AI/intelligence/tasking:
  - `AiTask`, `AiActionLog`, `AiAutomation`, `AiGeneratedAsset`,
  - `Task`, `TaskBoard`, `TaskBotRule`, `Notification`,
  - `KnowledgeSource`, `KnowledgeItem`.
- CRM/commercial oversight:
  - `Lead`, `Deal`, plus finance/plan-relevant organization fields.

## Planning Notes for AI Tools

- Use `Sidebar.tsx` as the authoritative IA/menu definition.
- Keep distinction between global pages and org-scoped pages when proposing route changes.
- Treat admin API inventory as operational control plane contract.
- For style/CMS/intelligence changes, plan around existing API namespaces to avoid fragmentation.

---

## CLIENT DASHBOARD

Comprehensive reference for `apps/client-dashboard` including structure, completed scope, menu model, and API inventory.

## Coverage Status

- Pages/routes: covered (major route tree).
- Menu/navigation: covered.
- API routes: covered (exhaustive inventory).
- UI/UX modules: covered at component-domain level.
- Function-level implementation details: summarized by service module; not a per-function signature dump.
- DB model mapping: covered by feature domain.

## App Purpose

- Primary tenant-facing operations dashboard for organizations using GateFlow.
- Covers operational monitoring, access control, residents/units/contacts, project management, analytics, AI assistance, and workspace governance.

## What Has Been Completed

From repository structure and changelog:

- Multi-tenant isolation hardening and verification work shipped.
- Maintenance hub initiative delivered in phased rollout.
- Projects CRM and related entities/flows were implemented across planning phases.
- Analytics dashboard expansion (multiple endpoint families and exports) is in place.
- AI assistant and AI action/reports surfaces are implemented.
- Workspace billing, API keys, integrations, and webhook management are present.

## Application Structure

## Main Route Tree (`src/app/[locale]`)

- Authentication/public:
  - `/`
  - `/login`
  - `/join`
  - `/no-unit-linked`
- Dashboard root:
  - `/dashboard`
  - `/dashboard/profile`
  - `/dashboard/onboarding`
- Org-scoped workspace:
  - `/dashboard/organizations/[orgId]`
  - `/dashboard/organizations/[orgId]/analytics`
  - `/dashboard/organizations/[orgId]/scans`
  - `/dashboard/organizations/[orgId]/qrcodes`
  - `/dashboard/organizations/[orgId]/qrcodes/create`
  - `/dashboard/organizations/[orgId]/qrcodes/bulk`
  - `/dashboard/organizations/[orgId]/projects`
  - `/dashboard/organizations/[orgId]/projects/[projectId]`
  - `/dashboard/organizations/[orgId]/projects/[projectId]/crm`
  - `/dashboard/organizations/[orgId]/gates`
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
  - `/dashboard/organizations/[orgId]/settings/*` (workspace/team/residents/rbac/projects/notifications/integrations/gates/billing/api/danger)

## Menu and Navigation Architecture

Primary nav logic is implemented in:

- `src/components/dashboard/sidebar.tsx`
- `src/lib/navigation-builder.ts`

### Sidebar Group Model (Current)

- Main:
  - Overview
  - AI assistant
  - Projects
  - Analytics
- Residents:
  - Contacts
  - Units
- Access:
  - QR Codes
  - Access Logs
  - Gates
  - Gate Assignments
- Security:
  - Watchlist
  - Incidents

### Dynamic Navigation Behaviors

- Permission-aware item visibility.
- Feature-driven module grouping (`OrganizationFeatures` + capability registry).
- Organization-scoped URL injection.
- Terminology override support for labels like Units/Contacts.

## UI/UX Architecture (Component Domains)

`apps/client-dashboard/src/components` currently includes high-density module families:

- Dashboard shell/navigation:
  - `dashboard/sidebar.tsx`, `dashboard/shell.tsx`, `dashboard/dashboard-layout.tsx`, `dashboard/header-user-menu.tsx`, `dashboard/global-search.tsx`.
- Analytics experience:
  - `dashboard/analytics/*` chart cards, KPI cards, filter bars, export controls.
- Residents and CRM:
  - `dashboard/residents/*`, `crm/*`, resident table customization/view management.
- Access operations:
  - `dashboard/qrcodes/*`, `dashboard/scans/*`, `settings/gates/*`, assignment components.
- Team/security:
  - `dashboard/team/*`, watchlist/incidents/team communication surfaces.
- Workspace settings:
  - `settings/*` (team, residents, projects, notifications, integrations, API, danger).
- AI experiences:
  - `dashboard/ai/*`, `dashboard/gateai/*`, assistant renderers and action UI.

## API Surface (Complete Current Inventory)

All handlers under `apps/client-dashboard/src/app/api`:

- `/api/admin/emulate-traffic`
- `/api/ai/actions/[id]/feedback`
- `/api/ai/actions/execute`
- `/api/ai/actions/log`
- `/api/ai/assistant`
- `/api/ai/chat`
- `/api/ai/reports/generate`
- `/api/analytics/campaign-first-scan`
- `/api/analytics/campaigns`
- `/api/analytics/export`
- `/api/analytics/export-pdf`
- `/api/analytics/export/marketing`
- `/api/analytics/funnel`
- `/api/analytics/heatmap`
- `/api/analytics/incidents`
- `/api/analytics/new-vs-returning`
- `/api/analytics/operators`
- `/api/analytics/peak-days`
- `/api/analytics/quota`
- `/api/analytics/scan-outcome`
- `/api/analytics/summary`
- `/api/analytics/top-gates`
- `/api/analytics/top-units`
- `/api/analytics/unit-types`
- `/api/analytics/utm-matrix`
- `/api/analytics/visitor-type`
- `/api/analytics/visits-over-time`
- `/api/api-keys`
- `/api/api-keys/[id]`
- `/api/artifacts`
- `/api/artifacts/[id]`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/refresh`
- `/api/chat`
- `/api/contacts`
- `/api/contacts/[id]`
- `/api/contacts/[id]/invite`
- `/api/contacts/[id]/tags`
- `/api/contacts/[id]/tags/[tagId]`
- `/api/contacts/bulk-delete`
- `/api/contacts/tags/bulk`
- `/api/cron/ai-tasks`
- `/api/crm/contacts`
- `/api/crm/contacts/[id]`
- `/api/crm/units`
- `/api/crm/units/[id]`
- `/api/danger/delete-workspace`
- `/api/danger/export`
- `/api/danger/purge-scans`
- `/api/events/stream`
- `/api/gateai/automations`
- `/api/gateai/tags`
- `/api/gates`
- `/api/gates/assigned`
- `/api/gates/assignments`
- `/api/incidents`
- `/api/integrations`
- `/api/maintenance/work-orders`
- `/api/maintenance/work-orders/[id]`
- `/api/marketplace/book`
- `/api/marketplace/services`
- `/api/marketing/utm-track`
- `/api/notification-prefs`
- `/api/notifications/expired-qrs`
- `/api/onboarding/complete`
- `/api/override/log`
- `/api/perimeter/webhook`
- `/api/project/switch`
- `/api/projects`
- `/api/projects/[id]`
- `/api/projects/[id]/aggregates`
- `/api/projects/[id]/logs`
- `/api/projects/[id]/team`
- `/api/projects/wizard`
- `/api/qr/bulk-create`
- `/api/qr/send-email`
- `/api/qrcodes`
- `/api/qrcodes/bulk-delete`
- `/api/qrcodes/export`
- `/api/qrcodes/validate`
- `/api/resident/arrived`
- `/api/resident/express-invite`
- `/api/resident/history`
- `/api/resident/maintenance`
- `/api/resident/me`
- `/api/resident/push/send`
- `/api/resident/push-token`
- `/api/resident/quota`
- `/api/resident/units`
- `/api/resident/visitors`
- `/api/resident/visitors/[id]`
- `/api/resident/visitors/approve`
- `/api/scanner-rules`
- `/api/scans/[scanId]/deny`
- `/api/scans/bulk`
- `/api/scans/export`
- `/api/scans/my-recent`
- `/api/search`
- `/api/setup/reset-admin`
- `/api/tags`
- `/api/tags/[id]`
- `/api/tasks`
- `/api/tasks/[id]`
- `/api/team/members`
- `/api/team/messages`
- `/api/team/roles`
- `/api/units`
- `/api/units/[id]`
- `/api/units/bulk-delete`
- `/api/users`
- `/api/users/me/preferences`
- `/api/watchlist`
- `/api/watchlist/[id]`
- `/api/webhooks`
- `/api/webhooks/[id]`
- `/api/webhooks/[id]/test`
- `/api/webhooks/stripe`
- `/api/webhooks/whatsapp`
- `/api/workspace/billing/checkout`
- `/api/workspace/billing/portal`
- `/api/workspace/export`
- `/api/workspace/restore`
- `/api/workspace/settings`

## API Domains (Planning-Friendly Grouping)

- Auth/session: `auth/*`
- AI and assistant: `ai/*`, `chat`, `gateai/*`
- Analytics/reporting/export: `analytics/*`
- CRM/residents/units/contacts: `crm/*`, `resident/*`, `contacts/*`, `units/*`
- Access operations: `qrcodes/*`, `scans/*`, `gates/*`, `watchlist/*`, `incidents`, `scanner-rules`
- Workspace governance: `workspace/*`, `api-keys/*`, `integrations`, `webhooks/*`
- Billing and marketplaces: `workspace/billing/*`, `marketplace/*`
- Operations/danger/admin tooling: `danger/*`, `admin/emulate-traffic`, `setup/*`, `onboarding/*`

## Function and Service Layer

Primary function-bearing modules in `apps/client-dashboard/src/lib`:

- Auth/session/security:
  - `auth.ts`, `require-auth.ts`, `dashboard-auth.ts`, `auth-cookies.ts`, `csrf.ts`, `api-key-auth.ts`, `super-admin.ts`.
- Analytics:
  - `analytics/*` query building, filter logic, URL/state models, PDF export helpers, cache helpers.
- AI:
  - `ai/ai-action-service.ts`, `ai/ai-task-service.ts`, `ai/context-providers.ts`, `ai/export-service.ts`, `ai/tools/*`.
- Realtime/events:
  - `realtime/emit-event.ts`, `realtime/use-realtime-events.ts`.
- Domain services:
  - `maintenance/work-order-service.ts`, `webhook-delivery.ts`, `crm-webhooks.ts`, `marketing-tracking.ts`, `gate-assignment.ts`, `watchlist.ts`, `location.ts`.
- Utilities and validations:
  - `utils.ts`, `logger.ts`, `validations/*`, domain hooks and typed helpers.

## DB Model Coverage by Feature Domain

Key schema domains used by client-dashboard features:

- Access and security: `Gate`, `GateAssignment`, `QRCode`, `ScanLog`, `WatchlistEntry`, `Incident`, `ScanAttachment`.
- Residents/CRM: `Contact`, `Unit`, `ContactUnit`, `VisitorQR`, `AccessRule`, `ResidentLimit`.
- Workspace and identity: `Organization`, `User`, `Role`, `Invitation`, `RefreshToken`, `ApiKey`, `Webhook`, `WebhookDelivery`.
- AI/tasks/automation: `AiTask`, `AiActionLog`, `AiAutomation`, `AiGeneratedAsset`, `Task`, `TaskBoard`, `TaskBotRule`, `Notification`.
- Billing/commerce and adjacent domains: `Merchant`, `Service`, `ServiceBooking`.
- Operational telemetry: `EventLog`, `AuditLog`.

## Planning Notes for AI Tools

- Use navigation-builder and sidebar files as source of truth for menu changes.
- Respect permission gates and feature-driven visibility when proposing IA updates.
- Treat API list above as current contract inventory when planning backend refactors.
- Keep multi-tenant and soft-delete safety constraints in all future API/data changes.

---

## MARKETING APP

Comprehensive reference for `apps/marketing` covering structure, implemented work, navigation/menu model, and API surfaces.

## Coverage Status

- Pages/routes: covered.
- Menu/navigation: covered.
- API routes: covered (exhaustive).
- UI component inventory: now covered at module level (`components/**`).
- Function-level implementation details: summarized by module, not line-by-line per function.
- DB model interaction map: covered at domain level.

## App Purpose

- Public acquisition and conversion surface for GateFlow.
- Supports bilingual EN/AR experience with RTL-aware UI.
- Connects brand storytelling to measurable attribution and lead flows.

## What Has Been Completed

Based on app code and changelog history:

- Marketing growth engine work merged (Q3 initiative stream).
- Mega menu navigation architecture implemented.
- SEO metadata normalization and title templating strategy implemented.
- Token alignment and RTL layout refinements shipped in multiple phases.
- Performance-focused tracking optimizations (including Partytown work) documented in changelog.
- Resource/legal/help pages and blog surfaces are established.

## Application Structure

## Core Paths

- `apps/marketing/app` - App Router pages and route handlers.
- `apps/marketing/components` - navigation and marketing UI sections.
- `apps/marketing/lib` - content and intent/attribution support logic.
- `apps/marketing/docs` - app-level docs.

### UI/UX Module Inventory

- `components/nav.tsx` - desktop/mobile navigation + mega menu UX.
- `components/footer.tsx`, `components/theme-toggle.tsx`, `components/language-switcher.tsx`.
- Section system in `components/sections/*`:
  - hero, social proof, trust bar, stats, features, how-it-works,
  - solution/legal layouts, comparison, CTA blocks, screenshots, testimonials.
- Conversion/engagement components:
  - `contact-form.tsx`, `chat-widget.tsx`, `intent-link.tsx`, `intent-landing-tracker.tsx`,
  - `cookie-consent.tsx`, `cookie-banner.tsx`.
- Content components:
  - `blog-card.tsx`, `pricing-card.tsx`, `feature-card.tsx`, `json-ld.tsx`.

## Current Page Surface (`app/[locale]`)

- Home and core marketing:
  - `/`
  - `/features`
  - `/pricing`
  - `/contact`
  - `/company`
  - `/resources`
- Solutions:
  - `/solutions`
  - `/solutions/compounds`
  - `/solutions/events`
  - `/solutions/schools`
  - `/solutions/clubs`
- Content/legal:
  - `/blog`
  - `/blog/[slug]`
  - `/legal/[doc]`
  - `/legal/privacy`
  - `/legal/terms`
  - `/legal/cookies`
  - `/legal/security`
  - `/help`
- Routing and utility:
  - `/[slug]`
  - `/s/[shortId]`
  - `/login`
  - `/forbidden`
  - `/unauthorized`
  - `/resources/playbooks/[vertical]`

## Menu and Navigation Architecture

Defined in `apps/marketing/components/nav.tsx`:

- Top-level menu:
  - Home
  - Solutions (mega menu)
  - Pricing
  - Resources (mega menu)
- Mega menu features:
  - solution cards with icon + description,
  - quick links,
  - featured content/spotlight panel,
  - mobile navigation fallbacks.
- Action controls:
  - locale switcher,
  - theme toggle,
  - sign-in CTA,
  - contact/get-started CTA.

## API Surface (Complete Current Inventory)

All handlers under `apps/marketing/app/api`:

- `/api/contact`
- `/api/marketing/intent-event`
- `/api/revalidate`

## API Intent by Domain

- `contact`: lead/contact intake.
- `marketing/intent-event`: intent/campaign event tracking.
- `revalidate`: incremental content revalidation triggers.

## Function/Service Layer

Core service modules in `apps/marketing/lib`:

- `cms.ts` - content retrieval/integration logic.
- `blog.ts`, `blog-data.ts` - blog content handling.
- `marketing-intent.ts` - attribution/intent flow logic.
- `metadata-title.ts` - SEO metadata title strategy.
- `actions/invitation.ts` - invitation-related server actions.
- `i18n/get-translation.ts` - locale content lookup.
- `utils.ts` - shared app utilities.

## DB Touchpoints (Domain-Level)

Marketing app DB concerns are mostly read/content and attribution/event bridging. Relevant schema domains include:

- `LandingPage`, `LandingPageSection` (CMS landing content).
- `BlogPost`, `BlogCategory` (blog engine).
- `ShortLinkClick`, `QrShortLink`, `QRCode` (campaign and link attribution bridge).
- Lead/contact side effects integrate with downstream client/admin CRM domains.

## Implemented Marketing + Attribution Capabilities

From code/docs/changelog references:

- UTM and intent tracking surfaces are integrated (`intent-event`, UTM-related libs/workflows).
- CRM/lead flow support is represented in marketing and downstream dashboard integrations.
- SEO-focused metadata and structured content routing are already in place.
- Marketing content engine and playbook-resource routing are established for vertical narratives.

## Dependencies and Shared Contracts

- Shared UI primitives/tokens via `@gate-access/ui`.
- Shared i18n resources via `@gate-access/i18n`.
- Workspace-level architecture and quality gates from root scripts and CI workflows.

## Planning Notes for AI Tools

- Treat `components/nav.tsx` as the primary source for navigation IA decisions.
- Treat `app/[locale]/**` as the page map source of truth.
- Treat API routes above as the only current marketing backend surface.
- For future work, preserve:
  - AR/EN parity,
  - token-based styling,
  - attribution continuity from public touchpoints to downstream app analytics.

---

## SCANNER APP

Comprehensive reference for `apps/scanner-app` including implemented scope, UI structure, function/services, and data contract touchpoints.

## Coverage Status

- Pages/routes: covered (single-app shell model).
- Menu/tabs/navigation: covered.
- API routes inside scanner app: not applicable (none present).
- UI component inventory: covered.
- Function/service modules: covered.
- DB model mapping: covered at domain level via upstream APIs.

## App Purpose

- Field-facing mobile scanner for gate operators.
- Optimized for fast scan response, offline continuity, and secure replay-safe sync.
- Designed to preserve access decisions under weak/no network conditions.

## What Has Been Completed

- Multi-tab operator workflow (Scanner, Today, Log, Chat, Settings).
- Offline queue flow and sync behavior with queue diagnostics.
- QR verification/security support modules and tests.
- Supervisor override + secure PIN flow.
- ID capture and maintenance-reporting modal flows.
- Auth client and scan history support logic.

## Application Structure

## Core Surface

- Entry shell: `App.tsx`
- UI components: `src/components/*`
- Service and domain logic: `src/lib/*`
- Device hooks: `src/hooks/*`
- Tests/mocks: `src/lib/*.test.ts`, `__mocks__/*`, `jest.setup.ts`

## UI/UX Architecture

Component inventory in `src/components`:

- Operational tabs:
  - `TodayVisitsTab.tsx`
  - `HistoryTab.tsx`
  - `ChatTab.tsx`
  - `SettingsTab.tsx`
- Scan lifecycle and feedback:
  - `ScanResultOverlay.tsx`
  - `QueueStatusBadge.tsx`
  - `QueueStatus.tsx`
  - `DiagnosticsOverlay.tsx`
- Control/safety flows:
  - `SupervisorOverride.tsx`
  - `SupervisorOverrideModal.tsx`
  - `GateSelector.tsx`
  - `IDCaptureModal.tsx`
  - `PassCancelDialog.tsx`
  - `MaintenanceReportModal.tsx`

## Navigation / Menu Model

Current UX is tab-driven inside the app shell (not route-driven App Router):

- Scanner
- Today
- Log
- Chat
- Settings

## API Surface

- No local `app/api` route handlers exist in `apps/scanner-app`.
- Scanner app communicates with backend APIs through client/service modules.

## Function and Service Layer

Primary modules in `src/lib`:

- Scan and verification:
  - `scanner.ts`
  - `qr-verify.ts`
  - `scan-history.ts`
- Offline sync and resilience:
  - `offline-queue.ts`
  - `maintenance-queue.ts`
- Security and auth:
  - `auth-client.ts`
  - `security/secure-pin.ts`
- User/device preferences:
  - `preferences.ts`
- Shared exports and utility entrypoint:
  - `index.ts`

Supporting hook:

- `hooks/use-biometry.ts`

## Data and DB Domain Mapping (via backend contracts)

Scanner operations map to these primary backend schema domains:

- Access control: `QRCode`, `ScanLog`, `Gate`, `GateAssignment`.
- Security workflows: `Incident`, `ScanAttachment`, `WatchlistEntry`.
- Audit/telemetry: `EventLog`, `AuditLog`, `ShiftLog`.
- User/org context: `User`, `Organization`.

## Testing and Quality Signals

Current test-bearing modules:

- `lib/scanner.test.ts`
- `lib/offline-queue.test.ts`
- `lib/qr-verify.test.ts`
- `lib/auth-client.test.ts`

Jest/runtime support:

- `jest.setup.ts`
- `__mocks__/async-storage.ts`
- `__mocks__/expo-network.ts`
- `__mocks__/expo-crypto.ts`
- `__mocks__/expo-secure-store.ts`

## Planning Notes for AI Tools

- Treat scanner as an offline-first state machine, not only a UI client.
- Preserve scan dedup and replay safety semantics when changing queue logic.
- Keep security paths (QR verify, supervisor override, auth-client) isolated and test-backed.
- Ensure mobile changes maintain low-latency UX under unstable connectivity.

---

## RESIDENT PORTAL

Comprehensive reference for `apps/resident-portal` including delivered scope, page structure, UI/UX modules, APIs, and service/data domains.

## Coverage Status

- Pages/routes: covered.
- Navigation/menu: covered.
- API routes: covered (exhaustive current inventory).
- UI/UX component inventory: covered.
- Function/service modules: covered.
- DB model mapping: covered at feature-domain level.

## App Purpose

- Resident-facing web portal for managing guest access and resident actions.
- Complements mobile flows with desktop/web-friendly management and visibility.
- Supports portal shell navigation, visitor workflows, open QR workflows, maintenance, history, and profile/notification controls.

## What Has Been Completed

- Portal shell + route group architecture implemented.
- Visitor flows (list/new/detail) implemented.
- Open QR flow implemented (`open-qr/new`).
- History and maintenance sections implemented.
- Profile + notification settings surfaces implemented.
- PWA/offline support components and sync helpers are present.
- Resident push registration and notifications API routes are implemented.

## Application Structure

## Main Route Tree

- Public:
  - `/login`
  - `/no-unit-linked`
- Portal shell group:
  - `/(portal)`
  - `/(portal)/visitors`
  - `/(portal)/visitors/new`
  - `/(portal)/visitors/[id]`
  - `/(portal)/open-qr/new`
  - `/(portal)/history`
  - `/(portal)/maintenance`
  - `/(portal)/profile`
  - `/(portal)/settings/notifications`
- Supporting route-level UX states:
  - loading/error components under portal routes.

## UI/UX Architecture

Primary component domains:

- Layout/navigation:
  - `components/layout/portal-shell.tsx`
  - `components/layout/sidebar.tsx`
  - `components/layout/bottom-nav.tsx`
  - `components/layout/page-header.tsx`
  - `components/layout/quick-create-fab.tsx`
  - `components/layout/nav-items.ts`
- Visitor/access flows:
  - `components/visitors/*`
  - `components/visitor-form.tsx`
  - `components/visitor-qr-card.tsx`
  - `components/open-qr-form.tsx`
  - `components/open-qr-card.tsx`
  - `components/access-rule-selector.tsx`
- History and maintenance:
  - `components/history/history-content.tsx`
  - `components/maintenance/*`
- Profile/settings/common:
  - `components/profile/notification-settings.tsx`
  - `components/quota-progress-circle.tsx`
  - `components/common/*` (loading skeleton, pull-to-refresh, offline banner)
- PWA/offline UX:
  - `components/pwa/pwa-bootstrap.tsx`
  - `components/pwa/offline-qr-cache-client.tsx`

## Navigation / Menu Model

Portal uses a shell-based navigation model with desktop/mobile variants:

- Sidebar + page header for wider layouts.
- Bottom navigation + quick-create FAB for compact/mobile behavior.
- Navigation definition source: `components/layout/nav-items.ts`.

## API Surface (Complete Current Inventory)

All handlers under `apps/resident-portal/src/app/api`:

- `/api/resident/notifications`
- `/api/resident/push/register`

## Function and Service Layer

Primary modules in `src/lib`:

- Auth/session:
  - `auth.ts`
  - `auth-cookies.ts`
- Offline/PWA behavior:
  - `offline-cache.ts`
  - `pending-sync.ts`
  - `sw-register.ts`
- Push notifications:
  - `push-notifications.ts`

Supporting hook:

- `hooks/use-breakpoint.ts`

## DB Model Coverage by Feature Domain

Resident portal primarily interacts with:

- Resident and visitor identity:
  - `User`, `Unit`, `Contact`, `ContactUnit`, `ResidentLimit`.
- Access credentials:
  - `QRCode`, `VisitorQR`, `AccessRule`, `ScanLog`.
- Notifications and communication:
  - `Notification`, `OrganizationCommunicationConfig`, `CommunicationLog`.
- Maintenance flow:
  - `WorkOrder`, `Vendor`.
- Context and tenancy:
  - `Organization`, `Project`.

## Planning Notes for AI Tools

- Treat resident portal as a shell app with adaptive layout and PWA support.
- Keep parity between portal flows and mobile-resident/scanner ecosystem contracts.
- Preserve resident-oriented simplicity while maintaining shared security invariants (tenant scope, signed QR lifecycle).
- Any visitor/open-QR changes should be planned against shared QR/scan data contracts to avoid cross-app drift.

---

## DESIGN SYSTEM

This document captures the current state of the GateFlow design system and what has already been implemented, so it can be used as planning context in AI tools.

## Coverage Status

- Design foundation and token architecture: covered.
- Shared component library: covered.
- Navigation/shell design patterns across apps: covered.
- API linkage: covered where DS intersects style/CMS endpoints.
- DB linkage: covered at model family level.
- Per-component prop/function internals: summarized, not exhaustively documented one-by-one.

## Scope and Current Reality

- Primary implementation lives in `packages/ui`.
- Token foundations live in `packages/ui/src/tokens.ts` and `packages/ui/src/globals.css`.
- A standalone `apps/design-system` workspace exists, but currently contains build artifacts only (`.next`, `.turbo`, `node_modules`, `public`) and no active source documentation/code.
- Practical design-system usage is distributed across app shells (`apps/client-dashboard`, `apps/admin-dashboard`, `apps/marketing`) using shared UI primitives and token contracts.

## What Has Been Completed

### Foundation

- ADS-aligned semantic token model is implemented (background, text, border, icon, surface families).
- Shared spacing, typography, border radius, and screen breakpoint tokens are in place.
- RTL/LTR support patterns are implemented and used across app navigation and layout components.
- Dark mode support is integrated via tokenized CSS variable approach.

### Shared Component Layer (`@gate-access/ui`)

- Centralized export surface exists in `packages/ui/src/index.ts`.
- Current exported component families include:
  - `ui`: button, input, card, badge, table, dialog, label, checkbox, select, dropdown-menu, avatar, avatar-tag, separator, skeleton, switch, radio-group, popover, command, multi-select, icon, loading-spinner, empty-state, toast, textarea, tabs, sheet, scroll-area, collapsible, form, tooltip, dynamic-table, pagination, date-picker.
  - `auth`: login-shell, squares-background.
  - `layout`: breadcrumbs, page-header, side-navigation, page-container.
  - `shared/panels/tables`: atlassian-navigation, maintenance-status-badge, `EditPanel`, `AdvancedTable`.
- Utility contract is standardized with `cn` in `packages/ui/src/lib/utils`.

### Multi-Platform Token Strategy

- Web tokens are exposed as CSS variable references through `tokens`.
- React Native-compatible token maps are shipped via `nativeTokens` and `nativeTokensRealEstate`.
- Design token contract already includes semantic and density-ready primitives for dashboards.

## Design System Architecture

## 1) Package Boundaries

- `@gate-access/ui` is the design-system runtime package.
- `@gate-access/types` supplies shared type contracts used by DS-backed UI.
- App-level components compose DS primitives instead of rebuilding base controls.

## 2) Token Model

- Core groups:
  - Color (base + semantic + ADS semantic aliases).
  - Spacing (`space-050` ... `space-600`).
  - Typography (families + weights).
  - Radius (`xsmall`...`circle`, `sm`, `lg`, `full`).
  - Responsive screens (`xs`, `sm`, `md`, `lg`).

## 3) Consumption Model

- Tailwind themes consume tokenized values.
- Apps use shared DS components and utility classes.
- Navigation and shell components in client/admin/marketing consume DS tokens heavily.

## DB Models Related to Design/Theming/CMS

Design-system-adjacent schema domains (source: `packages/db/prisma/schema.prisma`):

- Theming/branding:
  - `OrganizationBranding`
  - `StyleSnapshot`
  - `ThemeVariable`
- CMS/content:
  - `LandingPage`
  - `LandingPageSection`
  - `BlogPost`
  - `BlogCategory`
- AI-generated design/content assets:
  - `AiGeneratedAsset`
  - `AiActionLog` (for generation history/workflow linkage)

## Menu / Navigation Components Already Built

- Client dashboard structured side navigation and grouped modules in:
  - `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
  - `apps/client-dashboard/src/lib/navigation-builder.ts`
- Admin grouped side navigation in:
  - `apps/admin-dashboard/src/components/Sidebar.tsx`
- Marketing top navigation and mega menu in:
  - `apps/marketing/components/nav.tsx`

## APIs Related to Design System

Design system itself is package-based and does not expose direct route handlers. DS-driven workflows are surfaced through app APIs, especially style/theming/content APIs in admin:

- `apps/admin-dashboard/src/app/api/organizations/[orgId]/style/ai-edit/route.ts`
- `apps/admin-dashboard/src/app/api/organizations/[orgId]/style/save/route.ts`
- `apps/admin-dashboard/src/app/api/branding/[orgId]/route.ts`
- `apps/admin-dashboard/src/app/api/cms/*` routes (design/content composition support)

## Known Gaps / Context for Future Planning

- `apps/design-system` is not currently an actively developed source app; planning should treat `packages/ui` as the source of truth.
- Design documentation is present but fragmented across app README files and implementation-level files; this file is now the consolidation anchor.
- Any future DS app revival should define:
  - canonical visual catalog/storybook strategy,
  - token governance workflow,
  - visual regression baseline.

## Canonical Source Files for AI Planning

- `packages/ui/src/index.ts`
- `packages/ui/src/tokens.ts`
- `packages/ui/src/globals.css`
- `packages/ui/src/components/**/*`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/lib/navigation-builder.ts`
- `apps/admin-dashboard/src/components/Sidebar.tsx`
- `apps/marketing/components/nav.tsx`
- `CHANGELOG.md` (historical completion context)

---

## UI UX AND DESIGN

Comprehensive cross-repo reference for UI/UX and design decisions.  
Use this as context for AI planning, feature design, refactors, and consistency checks.

## Coverage Status

- Design foundations and tokens: covered.
- UI architecture and component system: covered.
- UX patterns (dashboard, forms, tables, analytics, mobile): covered.
- Navigation and IA patterns: covered.
- Accessibility and RTL: covered.
- Implementation rules and anti-patterns: covered.

## 1) Design System Foundation

Primary sources of truth:

- `packages/ui/src/tokens.ts`
- `packages/ui/src/globals.css`
- `packages/ui/src/components/*`
- `docs/guides/UI_DESIGN_GUIDE.md`

### Core Principles

- Semantic tokens over raw colors.
- Shared primitives via `@gate-access/ui`, not app-local reinvention.
- Mobile-first responsive behavior with high-density desktop support.
- AR/EN + RTL parity as default requirement.
- Accessible interactions and contrast-safe text/background pairing.

## 2) Token Architecture

Token contracts are defined in `packages/ui/src/tokens.ts`.

### Color System

- Base semantic set: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.
- ADS semantic families (`ds` namespace):
  - `ds.background.*`
  - `ds.text.*`
  - `ds.border.*`
  - `ds.icon.*`
  - `ds.surface.*`
  - `ds.sidebar.*`

### Spacing / Typography / Radius

- Spacing scale includes `space-050` through `space-600`.
- Typography families and weights are tokenized.
- Radius uses compact defaults with semantic aliases (`xsmall`, `small`, `medium`, `large`, `circle`, `sm`, `lg`).

### Breakpoints

- Token breakpoints currently include: `xs`, `sm`, `md`, `lg`.
- Tailwind default breakpoints remain active in app styling patterns.

### Platform Parity

- Web consumes CSS-variable-backed tokens.
- Native consumes `nativeTokens` / `nativeTokensRealEstate`.

## 3) Light / Dark Theme System

Implemented in `packages/ui/src/globals.css`:

- `:root` defines light theme semantic variables.
- `.dark` defines dark theme semantic variables.
- Shared mapping to shadcn-compatible CSS vars (`--background`, `--foreground`, etc.).
- DS surface and shadow tokens define elevation behavior.

### Theme Characteristics

- Light mode emphasizes neutral, high-legibility surfaces.
- Dark mode uses deep-neutral backgrounds and brand-accent highlights.
- Borders and text subtlety are tuned for dense dashboard readability.

## 4) UI Component Architecture

`@gate-access/ui` is the reusable component runtime.

### Core Primitive Families

- Inputs and controls: button, input, textarea, select, checkbox, switch, radio-group, form.
- Structure: card, table, tabs, sheet, dialog, popover, tooltip, collapsible, scroll-area.
- Feedback/state: badge, skeleton, loading-spinner, empty-state, toast.
- Advanced/reusable: dynamic-table, pagination, date-picker, multi-select, command.

### App Shell and Shared Layout

- Side navigation and nav groups are standardized via UI package layout components.
- Common shells are implemented in apps using shared primitives + token classes.

## 5) Information Architecture and Navigation Patterns

### Dashboard IA Model

Common pattern across client/admin:

- Persistent sidebar with grouped modules.
- Main content zones for lists, detail, analytics, and settings.
- Secondary panel overlays or sheets for contextual actions.

### Marketing IA Model

- Top-level nav + mega menu.
- Content-led page hierarchy (solutions, resources, legal, blog, pricing).
- Conversion CTAs integrated at section and navigation levels.

### Resident/Scanner IA Model

- Resident portal uses shell + responsive nav modes.
- Scanner app uses tab-driven operational UX for field speed.

## 6) UX Patterns by Domain

### Data-Dense Dashboards

- KPI cards + chart rows + table drill-down.
- Clear filter bars and visible active filters.
- Export/report actions near analytics sections.

### CRUD and Configuration

- List + sheet/modal editing pattern.
- Inline status chips and deterministic action affordances.
- Guard rails for destructive actions (danger zones, confirmations).

### AI-Assisted Workflows

- Assistant side panels or dedicated AI pages.
- Renderers for charts, reports, schedules, confirmations.
- Human-in-the-loop approval patterns for sensitive actions.

### Mobile and Offline

- Scanner UX optimized for one-hand, low-latency flows.
- Queue visibility and sync-state transparency.
- Minimal interaction depth in mission-critical actions.

## 7) RTL and Internationalization Design

### Requirements

- All user-visible content supports EN/AR localization.
- Directional UI must respect locale direction.

### UI Behavior

- Prefer logical alignment and spacing (`start`/`end` semantics).
- Directional icons (chevrons/arrows) should mirror correctly.
- Navigation, tables, and form affordances must be tested in RTL mode.

## 8) Accessibility Standards

Baseline expectations:

- WCAG AA contrast compliance for text/surface pairs.
- Keyboard-accessible interactive components.
- Visible focus states via semantic border/ring tokens.
- Meaningful labels and semantic heading hierarchy.
- Touch target sizing appropriate for mobile controls.

## 9) Cross-App Visual Consistency Rules

- Use `@gate-access/ui` first; extend before creating app-local primitives.
- Reuse token classes (`bg-*`, `text-*`, `border-*`) instead of hardcoded color values.
- Keep spacing on the token scale; avoid arbitrary one-off spacing values.
- Maintain consistent card radius, border treatment, and elevation semantics.

## 10) Implementation Rules for Designers and AI

### Do

- Use semantic tokens.
- Keep components composable and purpose-specific.
- Preserve existing navigation group logic when expanding menus.
- Validate designs in both light/dark and EN/AR modes.

### Avoid

- Hardcoded hex/rgb color values in app code.
- Duplicated primitives when UI package already has a matching component.
- Mixed visual language across dashboards for similar features.
- RTL regressions caused by left/right hardcoding.

## 11) Design-Related API and Data Touchpoints

Design/content/theming functionality intersects with backend via:

- Style/branding APIs in admin dashboard (`organizations/[orgId]/style/*`, `branding/[orgId]`).
- CMS APIs (`cms/pages*`, `cms/generate-*`, blog generation).

Relevant schema domains:

- `OrganizationBranding`
- `StyleSnapshot`
- `ThemeVariable`
- `LandingPage`
- `LandingPageSection`
- `BlogPost`
- `BlogCategory`
- `AiGeneratedAsset`

## 12) File Map for Deep Design Work

- Design guide: `docs/guides/UI_DESIGN_GUIDE.md`
- Tokens: `packages/ui/src/tokens.ts`
- Theme variables: `packages/ui/src/globals.css`
- Shared components: `packages/ui/src/components/*`
- Client navigation: `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- Admin navigation: `apps/admin-dashboard/src/components/Sidebar.tsx`
- Marketing navigation: `apps/marketing/components/nav.tsx`

## 13) Planning Notes for AI Tools

- Treat this file as the UX/design baseline contract.
- Pair this with app-specific references for route/API/function detail.
- When proposing UI changes, always include:
  - affected component families,
  - token usage implications,
  - RTL/accessibility checks,
  - light/dark validation expectations.

---

## PLANNING AND PLAN LIFECYCLE

Use this document as the canonical planning context pack for AI-assisted execution in GateFlow.

## Coverage Status

- Covers planning lifecycle states, movement rules, and folder structure.
- Covers planning commands (`pnpm plan:*`, `/plan`, `/dev`, `/guide`) and when to use each.
- Covers planning-agent/skill orchestration patterns as encoded in workflow docs.
- Includes the **current live plan inventory** from `docs/plan/Active`, `docs/plan/Ready`, and `docs/plan/Complete`.
- Includes practical checklists, anti-patterns, and context-loading strategy for reliable phase execution.

## 1) Planning System at a Glance

GateFlow planning is a lifecycle-driven system with explicit plan states and deterministic transitions.

- Plan root: `docs/plan/`
- Lifecycle folders: `Draft/` -> `Ready/` -> `Active/` -> `Complete/`
- Backlog source: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
- Canonical lifecycle doc: `docs/development/PLAN_LIFECYCLE.md`
- Canonical folder-shape doc: `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`

Primary goal: plans are executable artifacts, not notes. A plan must be structured to run phase-by-phase with verifiable acceptance criteria.

## 2) Lifecycle States and Transitions

### States

- `Draft`: plan is being authored/refined.
- `Ready`: approved and queued for implementation.
- `Active`: currently being executed.
- `Complete`: shipped or archived.

### Transitions

- `Draft -> Ready`: via `pnpm plan:ready <slug>` (or `/plan ready <slug>` in slash-command workflow).
- `Ready -> Active`: via `pnpm plan:start <slug>` or implicitly when `/dev` begins execution for a Ready plan.
- `Active -> Complete`: via `pnpm plan:done <slug>` or implicitly when final phase is completed by the phase runner.
- Manual override: `pnpm plan:move <slug> <from> <to>` equivalent through `ralph-plan.js move`.

### Operational Rules

- Move the **entire plan folder** as a unit (never move only files).
- Keep plan-local assets together during transitions:
  - `PLAN_<slug>.md`
  - `TASKS_<slug>.md`
  - `CONTEXT_<slug>.md`
  - `context/`
  - `phase_logs/`
  - `phases/`
  - `assets/`
- Legacy flat prompt files may exist in old plans, but new plans should use `phases/NN_<phase-title>/`.

## 3) Canonical Plan Folder Structure

Expected shape for modern plans:

- `PLAN_<slug>.md`: master scope, phase table, dependencies.
- `TASKS_<slug>.md`: execution checklist.
- `PLAN_FEEDBACK.md`: plan-level improvement and tooling notes.
- `CONTEXT_<slug>.md`: frozen high-value context snapshot.
- `SESSION_MEMORY.md`: cross-session continuity.
- `context/`: focused references (`api.md`, `database.md`, `contracts.md`, `design.md`, `structure.md`, `documentation.md`).
- `phase_logs/`: per-phase log files (`PHASE_LOG_phase_NN.md`).
- `phases/NN_<title>/`: phase prompt(s) and optional `files/` scaffolds.
- `assets/`: ADRs and architecture notes.

For exact structure and responsibilities, use:

- `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`

## 4) Planning Commands (CLI + Slash)

### A. Core pnpm lifecycle commands

- `pnpm plan:new <slug> [--phases N] [--title "..."]`
  - Creates plan in Draft, seeds PLAN + prompts.
- `pnpm plan:ready <slug>`
  - Moves `Draft -> Ready`.
- `pnpm plan:start <slug>`
  - Moves plan to Active and triggers docs hook (`on-plan-start`).
- `pnpm plan:run <slug> <phase|--next|--all>`
  - Executes phase prompt(s) through configured tool mapping.
- `pnpm plan:done <slug>`
  - Moves plan to Complete, triggers docs hook (`on-plan-done`), attempts PR creation.
- `pnpm plan:status`
  - Prints grouped status and progress bars across states.
- `pnpm plan:pr <slug>`
  - Manually generate PR body/title from plan completion state.

### B. Slash planning workflow

- `/draft <slug>`: quick draft capture.
- `/prompt <slug>`: create planning handoff prompt.
- `/plan <slug>`: build full phased plan package.
- `/plan ready <slug>`: promote for execution.
- `/dev`: execute one phase end-to-end.
- `/dev ralph`: recursive/autopilot multi-phase run.
- `/guide`: route to proper command based on intent.

## 5) `/dev` Execution Model (Phase Engine)

`/dev` is the core implementation executor and contains the strongest planning/runtime contract.

- Resolves plan by state order: `Active`, then `Ready`, then `Draft`, then `Complete`.
- If target plan is in Ready, moves it to Active before implementation.
- Resolves phase prompt (preferred modern structure first, legacy fallback second).
- Supports phase split parts (`part_a`, `part_b`, etc.) and sequential execution.
- Updates plan progress and task status after phase completion.
- Moves plan to Complete when final phase finishes.

### Mandatory execution discipline in `/dev` documentation

- Progressive context loading (L0..L6) to control token budget.
- Session continuity via `SESSION_MEMORY.md` at start and end.
- Mandatory phase logging under `phase_logs/`.
- Verification gates before completion claims.
- TDD and debugging discipline for behavior-changing or failing work.

## 6) Planning Agents, Skills, and Roles

Planning in this workspace is not a single-agent behavior; it is role-driven orchestration.

### Planning-role model

- Primary role per phase should be explicit (examples: backend, frontend, security).
- Preferred tool per phase should be declared in phase prompts.
- Skill and subagent usage should be explicit, not implicit.

### Skill/agent orchestration expectations (as documented in workflow files)

- Planning and execution should invoke the appropriate planning/execution skills first.
- Security-sensitive work should include security-oriented role/validation layers.
- Multi-domain phases should split responsibilities rather than overloading one prompt.
- Post-phase verification is non-optional before phase closeout.

### Guide-level orchestration

`/guide` maps user intent to the correct command family:

- Planning requests -> `/plan`
- Phase prompt extraction -> `/prompt`
- Implementation -> `/develop` or `/dev`
- Validation -> `/test` and preflight flow
- Git handoff -> `/github`

## 7) Plan Prompt Design (What Makes a Phase Runnable)

A good phase prompt should contain:

- Primary role
- Preferred tool(s)
- Context constraints (tenancy, soft-delete, security invariants)
- Clear "in scope" vs "out of scope"
- Ordered implementation steps
- Acceptance criteria with explicit checks

Recommended prompt quality traits:

- One concern per phase (or deliberate part split)
- Minimal ambiguity in deliverables
- Explicit verification commands
- Explicit artifact updates (`TASKS`, `phase log`, `SESSION_MEMORY`)

## 8) Plan Structure Quality Gates

A plan is considered execution-ready when all are true:

- `PLAN_<slug>.md` has complete phase table and realistic dependencies.
- Every phase has a runnable prompt file.
- `TASKS_<slug>.md` matches phase granularity.
- `CONTEXT_<slug>.md` is present when DB/contracts/env are relevant.
- `phase_logs/README.md` and logging convention are in place.
- Lifecycle location is correct (`Ready` for queued work, `Active` for in-flight).

## 9) Live Inventory: Done, Ready, Active

Snapshot based on current `docs/plan` directory contents.

### Draft (2)

- `design-system-redesign`
- `security_hotfix_v1`

### Active (0)

- _(empty — no plans currently in `docs/plan/Active`)_

### Ready (3)

- `org_types_dashboard`
- `resident_portal_responsive`
- `scanner_onboarding_session`

### Complete (47 entries)

- `PLAN_projects_crm_ui.md` (legacy/special artifact under Complete root)
- `admin_dashboard_completion_v6`
- `admin_dashboard_redesign`
- `admin_dashboard_v6`
- `admin_emulation_hub`
- `advanced_seeding_emulation_v3`
- `ai_assistant_v2`
- `ai_sdk_v6_migration`
- `analytics_dashboard`
- `analytics_pdf_export`
- `analytics_rebuild`
- `atlassian_ui_remake`
- `autonomous_ops_intelligence`
- `client_dashboard_ui_refine`
- `client_dashboard_v10_redesign`
- `core_security_v6`
- `crm_followups`
- `dashboard_polish`
- `docs_v2_refresh`
- `docs_workspace_template_cursor_bootstrap`
- `domain_migration_2026`
- `gateai`
- `gateai_hub_v2`
- `gateflow_design_system`
- `gateflow_v9_autonomy`
- `github_security_hardening`
- `maintenance_management`
- `marketing_growth_engine_q3_2026`
- `marketing_suite`
- `marketing_website`
- `pagespeed_100`
- `platform_evolution`
- `project_dashboard`
- `projects_crm`
- `projects_crm_ui`
- `qr_create_wizard`
- `ralph_plan_status_fix`
- `real_estate_palette`
- `realtime_updates`
- `resident_mobile`
- `resident_mobile_one_tap`
- `resident_portal`
- `residents_analytics`
- `security_isolation_fix`
- `settings_v6`
- `team_page`
- `token_system_v2`
- `watchlist_ui`

## 10) Backlog vs Lifecycle Reality

`ALL_TASKS_BACKLOG.md` is a strategic tracking view, while `docs/plan/{Active,Ready,Complete}` is the operational source of truth for state.

- Use lifecycle folders to determine current executable status.
- Use backlog for initiative-level narrative and roadmap reporting.
- If mismatch appears, reconcile backlog entries to folder reality.

## 11) Planning Workflow (Recommended End-to-End)

1. Capture intent in `IDEA_<slug>.md` if needed.
2. Build Draft plan package with clear phases and prompts.
3. Validate structure and acceptance criteria.
4. Promote to Ready.
5. Start execution (`/dev` or `pnpm plan:run ...`) and transition to Active.
6. For each phase:
   - Implement
   - Verify
   - Update tasks/logs/session memory
7. Complete final phase and transition to Complete.
8. Run docs/status sync and PR flow.

## 12) Anti-Patterns to Avoid

- Writing plan docs without executable phase prompts.
- Mixing lifecycle states manually without moving full folder.
- Marking phase complete without passing acceptance checks.
- Skipping phase logs or session memory updates.
- Putting all implementation into a single mega-phase.
- Leaving DB/API/security constraints implicit.

## 13) Practical Checklists

### Before moving plan to Ready

- [ ] Phase breakdown is realistic.
- [ ] Every phase has prompt(s).
- [ ] Tasks file is aligned with prompts.
- [ ] Context and constraints are explicit.

### Before starting phase execution

- [ ] Plan is in `Ready` or `Active`.
- [ ] Target phase and dependencies are clear.
- [ ] Verification commands are known.

### Before closing phase

- [ ] Acceptance criteria are green.
- [ ] `TASKS_<slug>.md` updated.
- [ ] `phase_logs/PHASE_LOG_phase_NN.md` updated.
- [ ] `SESSION_MEMORY.md` updated.

### Before marking plan Complete

- [ ] All phases marked complete.
- [ ] No unresolved blockers in logs/tasks.
- [ ] Final verification completed.
- [ ] Docs/backlog sync executed as needed.

## 14) Key Source Files for Planning Agents

Load these first when planning/executing:

- `docs/development/PLAN_LIFECYCLE.md`
- `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`
- `docs/development/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
- `docs/development/plan-guides/PLANNING_ENHANCEMENTS.md`
- `scripts/plan/ralph-plan.js`
- `scripts/plan/ralph-run.js`
- `docs/plan/README.md`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

## 15) Quick Command Cookbook

- Create new plan:
  - `pnpm plan:new my_feature --phases 5 --title "My Feature"`
- Promote to ready:
  - `pnpm plan:ready my_feature`
- Start execution:
  - `pnpm plan:start my_feature`
- Run next phase:
  - `pnpm plan:run my_feature --next`
- Run specific phase:
  - `pnpm plan:run my_feature 2`
- Run all phases:
  - `pnpm plan:run my_feature --all`
- Mark done:
  - `pnpm plan:done my_feature`
- Show status:
  - `pnpm plan:status`

---

If you use this file as context for another AI tool, pair it with:

- `WORKSPACE_AI_ENVIRONMENT_REFERENCE.md` (tooling/agents/commands surface)
- `MEMORY_AND_LEARNED_DATA_REFERENCE.md` (preferences, incidents, limits)
- One app-specific reference file for feature/domain constraints.

---

## MEMORY AND LEARNED DATA

This document consolidates memory-related sources in the repository so AI tools can load one entry point for learned preferences, historical outcomes, and operational memory.

## Coverage Status

- User/workspace learned preferences: covered.
- CLI usage memory and limits memory: covered.
- Decision and pattern memory files: indexed.
- Incident memory and postmortem logs: covered.
- One-man profile/settings memory: indexed.

## 1) Primary Memory Sources (Load First)

For most AI planning/execution sessions, load these first:

- `AGENTS.md`
- `docs/development/learning/GUIDE_PREFERENCES.md`
- `docs/development/learning/CLI_TOOL_MEMORY.md`
- `docs/development/learning/CLI_LIMITS_TRACKING.md`
- `docs/development/learning/CLI_USAGE_AND_RESULTS.md`
- `docs/development/learning/incidents.md`

## 2) Learned User Preferences (Current)

From `AGENTS.md`:

- Keep workspace docs organized with clear separation (Workspace / AI tools / Apps).
- Treat `docs/workspace` as home for workspace-facing docs and mirrors.
- Do not edit attached plan files directly during execution; update task status instead.
- Enforce changelog structure in CI (`pnpm docs:changelog:check`) and formatting (`pnpm docs:changelog:format`).
- Keep `ai:sync` and `ai:check` only in `docs/workspace/template-project/package.json` (not root `package.json`).
- Avoid mixing transient hook/sync state with feature commits.
- Prefer multi-tool guidance (Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, Kilo CLI).
- Prefer phased plan-first execution workflow.

## 3) Learned Workspace Facts (Current)

Also from `AGENTS.md`:

- AI folder sync uses enabled tools config and supports CI full-sync behavior.
- Prisma `directUrl` uses `DIRECT_DATABASE_URL`; runtime/migration URLs can differ and must remain aligned.
- `pnpm preflight` should be used exactly as defined in root scripts.
- Plan moves across lifecycle folders should be reflected in backlog index updates.
- `token()` values are CSS variable references; React Native should use resolved/native token exports.

## 4) CLI Memory and Learning Data

Memory files under `docs/development/learning/`:

- `CLI_USAGE_AND_RESULTS.md`  
  Historical task outcomes by CLI (success/partial/fail), used to improve tool choice.
- `CLI_LIMITS_TRACKING.md`  
  Quota-awareness memory; includes 80% threshold behavior for paid tools.
- `CLI_TOOL_MEMORY.md`  
  Tool-choice memory scoreboard/patterns for task-type recommendations.
- `CLI_TEAMS.md`  
  Team-based CLI orchestration memory (`seo`, `refactor`, `audit`) and role splits.
- `GUIDE_PREFERENCES.md`  
  How `/guide` should adapt output style and recommendations.

## 5) Incident and Reliability Memory

- `docs/development/learning/incidents.md`  
  Incident/postmortem memory with root cause and prevention notes.

Use this as historical guardrail before touching:

- multi-tenant isolation,
- security-sensitive APIs,
- docs/planning lifecycle flows.

## 6) Additional Learning/Memory Files

Present in `docs/development/learning/`:

- `decisions.md`
- `patterns.md`
- `SKILL_DISCOVERY_REPORT.md`
- `ONE_MAN_MEMORY.md`
- `ONE_MAN_PROFILES.md`
- `ONE_MAN_CODE_SETTINGS.md`
- `pagespeed_results.md`

Use these when the task overlaps with:

- historical decision rationale,
- recurring implementation patterns,
- one-man orchestrator profiles/settings,
- performance regressions and benchmarks.

## 7) Memory Directory Map

### Main learning store

- `docs/development/learning/*.md`

### Architecture memory seed

- `docs/development/memory/architecture.md` (template/scaffold; partially filled)

### Tool/workspace memory references

- `docs/reference/workspace/GATEFLOW_CONFIG.md`
- `docs/workspace/WORKSPACE_GUIDE.md`
- `docs/guides/TOOL_AND_CLI_REFERENCE.md`

## 8) How AI Tools Should Use Memory

Recommended memory load order for strong context:

1. `AGENTS.md`
2. `GUIDE_PREFERENCES.md`
3. `CLI_TOOL_MEMORY.md` + `CLI_LIMITS_TRACKING.md`
4. `CLI_USAGE_AND_RESULTS.md`
5. `incidents.md`
6. Then task-specific app/reference docs.

## 9) Memory Maintenance Rules

When new learnings happen:

- Add CLI outcomes to `CLI_USAGE_AND_RESULTS.md`.
- Update `CLI_TOOL_MEMORY.md` if repeated patterns emerge.
- Record notable failures/regressions in `incidents.md`.
- Keep preferences in `GUIDE_PREFERENCES.md` aligned with current user style.

## 10) Quick Scan Commands (Memory Files)

From repo root:

```bash
ls -la docs/development/learning
rg --files docs/development/learning
rg --files docs/development/memory
```

To inspect key memory quickly:

```bash
rg "Learned User Preferences|Learned Workspace Facts" AGENTS.md
rg "80%|quota|Current status" docs/development/learning/CLI_LIMITS_TRACKING.md
rg "Outcome|success|partial|fail" docs/development/learning/CLI_USAGE_AND_RESULTS.md
```

---

## WORKSPACE AI ENVIRONMENT

This file is the operational reference for the GateFlow AI workspace environment:

- agents,
- subagents,
- skills,
- commands and subcommands,
- templates,
- sync and automation (`ralph`, AI tool sync),
- directory scanning commands across `.antigravity`, `.cursor`, `.agents`, `.claude`, `.gemini`, `.kiro`, `.opencode`, `.qwen`.

## Coverage Status

- Workspace AI directory map: covered.
- Commands + usage: covered.
- Ralph + automation + sync: covered.
- Scan commands for all requested folders: covered.
- Subagents/skills/templates references: covered.

## 1) AI Workspace Directory Map

Current repo-level AI directories:

- `.antigravity` (primary shared AI source)
- `.cursor` (Cursor-specific commands/rules/skills/subagents/templates)
- `.claude` (Claude Code config and symlinked command surface)
- `.gemini`
- `.kiro`
- `.kilocode`
- `.opencode`
- `.qwen`
- `.agents` (symlink to `.antigravity`)
- `.ai-memory` (present)

Important notes:

- `.agents` is a symlink to `.antigravity`.
- `.ai` directory is currently **not present** in this workspace.

## 2) Command Surfaces (What Exists)

### Cursor command files

From `.cursor/commands`:

- `dev.md`
- `guide.md`
- `ship.md`
- `docs.md`
- `ralph.md`
- `version.md`
- `man.md`
- `organize.md`
- `prompt.md`
- `draft.md`
- `clis-team.md`

### Antigravity workflow files

From `.antigravity/workflows`:

- `dev.md`
- `guide.md`
- `ship.md`
- `docs.md`
- `ralph.md`
- `version.md`
- `man.md`
- `organize.md`
- `prompt.md`
- `draft.md`
- `clis-team.md`
- `brainstorm.md`
- `creative.md`
- `deploy.md`

### Claude command surface

- `.claude/commands` points to `.antigravity/workflows` (shared command definitions).

## 3) Core Commands and How to Use Them

## Ralph and workspace control

- `pnpm ralph`  
  Show full workspace dashboard (git, plans, hooks, quality snapshot, next action).

- `pnpm ralph:short`  
  Compact dashboard view.

## Plan lifecycle commands

- `pnpm plan:new <slug> [--phases N]`  
  Create a new phased plan scaffold.

- `pnpm plan:ready <slug>`  
  Move approved plan to execution-ready state.

- `pnpm plan:start <slug>`  
  Move plan to active state and begin execution flow.

- `pnpm plan:run <slug> <phase>`  
  Execute a specific phase.

- `pnpm plan:done <slug>`  
  Complete plan and trigger docs/release updates.

- `pnpm plan:status`  
  Show current plan status across lifecycle folders.

## Documentation and release

- `pnpm docs:changelog`  
  Update changelog entries.

- `pnpm docs:changelog:check`  
  Validate changelog structure.

- `pnpm docs:changelog:format`  
  Normalize changelog formatting.

- `pnpm docs:release`  
  Run release-oriented docs/version flow.

- `pnpm docs:index`  
  Regenerate docs index.

- `pnpm docs:organize`  
  Organize/clean docs structure.

## Quality and automation checks

- `pnpm preflight`  
  Full lint + typecheck + tests (+ changelog check in this repo).

- `pnpm check:env`
- `pnpm check:secrets`
- `pnpm check:bundle`
- `pnpm check:imports`
- `pnpm check:db-drift`
- `pnpm check:security`
- `pnpm check:pre-deploy`

## AI sync

- `pnpm sync`  
  Run AI-tool sync script (`scripts/ai-sync/sync-ai-tools.sh`).

- `pnpm sync:watch`  
  Watch mode for sync operations.

## 4) Slash Commands and Subcommands (Workspace Usage)

Primary slash command family (as documented in workspace guides):

- `/idea [slug]`
- `/draft [slug]`
- `/prompt [slug]`
- `/plan [slug]`
- `/dev [slug|phase]`
- `/ship [slug]`
- `/guide`
- `/man`
- `/docs`
- `/version`
- `/clis team <seo|refactor|audit>`

### Practical examples

- `/guide`  
  Ask what to do next now (state-aware recommendation).

- `/dev 2`  
  Execute phase 2 of the active plan.

- `/ship my_feature_slug`  
  Execute remaining phases and finalize.

- `/clis team refactor`  
  Run predefined multi-CLI refactor team workflow.

## 5) Agents, Subagents, Skills, Templates

### Where they live

- Agents:
  - `.antigravity/agents`
  - `.cursor/agents`
  - `.claude/agents`
- Subagents:
  - `.antigravity/subagents`
  - `.cursor/subagents`
  - `.claude/subagents`
- Skills:
  - `.antigravity/skills`
  - `.cursor/skills`
  - `.claude/skills`
  - plus tool-specific skill mirrors in `.gemini`, `.opencode`, `.qwen`, etc.
- Templates:
  - `.antigravity/templates`
  - `.cursor/templates`

### How to inspect quickly

- `ls -la .antigravity/agents .antigravity/subagents .antigravity/skills .antigravity/templates`
- `ls -la .cursor/agents .cursor/subagents .cursor/skills .cursor/templates`
- `ls -la .claude/agents .claude/subagents .claude/skills`

## 6) Scan Commands for Requested Directories

Use these from repo root.

### Fast structure scan

```bash
ls -la .antigravity .cursor .agents .claude .gemini .kiro .opencode .qwen .kilocode .ai-memory
```

### Recursive file inventory (safe and fast)

```bash
rg --files .antigravity
rg --files .cursor
rg --files .claude
rg --files .gemini
rg --files .kiro
rg --files .opencode
rg --files .qwen
rg --files .kilocode
rg --files .ai-memory
```

### Focused scans by artifact type

```bash
rg --files .antigravity | rg "commands|workflows|skills|subagents|templates|rules|contracts"
rg --files .cursor | rg "commands|skills|subagents|templates|rules|agents"
rg --files .claude | rg "commands|skills|subagents|agents|settings"
```

### Check for optional `.ai` folder

```bash
ls -la .ai
```

If it does not exist, keep using `.antigravity` + `.cursor` + `.claude` as primary config sources.

## 7) Ralph + AI Sync Operational Flow

Recommended sequence before/after significant AI workflow changes:

1. `pnpm ralph` (state check)
2. Apply command/rule/skill/template changes
3. `pnpm sync` (propagate to AI tool folders)
4. `pnpm docs:index` (refresh docs index if docs changed)
5. `pnpm preflight` (validate workspace health)

## 8) Canonical Docs for This Environment

- `docs/workspace/WORKSPACE_GUIDE.md`
- `docs/guides/AUTOMATION_GUIDE.md`
- `docs/guides/TOOL_AND_CLI_REFERENCE.md`
- `docs/reference/workspace/GATEFLOW_CONFIG.md`
- `docs/guides/ANTIGRAVITY_SKILLS.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## 9) Planning Notes for AI Tools

- Use `.antigravity` as canonical shared AI workflow source.
- Treat `.cursor` and `.claude` as tool-specific adapters/mirrors.
- Use `pnpm sync` after changing shared AI artifacts.
- Use `pnpm ralph` to pick next action and avoid drift in plan execution.

---

## AI CONTEXT BLOCK

Use this as a low-token copy/paste context block for external AI tools.

## Copy-Paste Block

```text
PROJECT: GateFlow monorepo (Turborepo + pnpm)
PRIMARY CONTEXT ROOT: docs/reference/apps

LOAD ORDER (strict, stop when enough context):
1) GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md
2) PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md
3) FILES_AND_STRUCTURE_REFERENCE.md
4) DATABASE_BACKEND_AND_TECH_REFERENCE.md
5) API_GATEWAY_AND_CONTRACTS_REFERENCE.md
6) FUNCTIONS_AND_SERVICES_INDEX_REFERENCE.md
7) PAGES_AND_ROUTES_INDEX_REFERENCE.md
8) UI_UX_AND_DESIGN_REFERENCE.md
9) WORKSPACE_AI_ENVIRONMENT_REFERENCE.md
10) MEMORY_AND_LEARNED_DATA_REFERENCE.md

APP-SPECIFIC CONTEXT (load only relevant app):
- DESIGN_SYSTEM_REFERENCE.md
- MARKETING_APP_REFERENCE.md
- CLIENT_DASHBOARD_REFERENCE.md
- ADMIN_DASHBOARD_REFERENCE.md
- SCANNER_APP_REFERENCE.md
- RESIDENT_PORTAL_REFERENCE.md

SYMBOL-LEVEL CONTEXT (only if function-level impact needed):
- symbols/README.md
- symbols/CLIENT_DASHBOARD_SYMBOLS_REFERENCE.md
- symbols/ADMIN_DASHBOARD_SYMBOLS_REFERENCE.md
- symbols/MARKETING_SYMBOLS_REFERENCE.md
- symbols/RESIDENT_PORTAL_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_DB_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_TYPES_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_UI_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_API_CLIENT_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_UTILS_SYMBOLS_REFERENCE.md

SYSTEM INVARIANTS (must preserve):
- Multi-tenancy: scope tenant data by organizationId.
- Soft deletes: respect deletedAt filtering when applicable.
- Security: no secrets in repo, enforce auth/RBAC boundaries.
- QR/security contracts: signed QR payload and scan integrity flows.
- Package manager: pnpm only.

PLANNING EXECUTION RULES:
- Use phased plans (Draft -> Ready -> Active -> Complete).
- Prefer one concern per phase (DB/API/UI split for risky work).
- Include acceptance criteria and verification commands per phase.
- Update tasks/phase logs/session memory when executing phases.

TASK ROUTING:
- Architecture/cross-cutting: GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md
- Plan orchestration: PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md
- Backend/API changes: DATABASE_BACKEND_AND_TECH_REFERENCE.md + API_GATEWAY_AND_CONTRACTS_REFERENCE.md
- UI/page changes: PAGES_AND_ROUTES_INDEX_REFERENCE.md + UI_UX_AND_DESIGN_REFERENCE.md
- Function-level impact: relevant symbols/*_SYMBOLS_REFERENCE.md
```

## Ultra-Short Variant (Minimal Tokens)

```text
GateFlow context root: docs/reference/apps
Load: COMPLETE_CONTEXT -> PLANNING -> STRUCTURE -> DB/BACKEND/TECH -> API -> FUNCTIONS -> PAGES -> UI_UX -> AI_ENV -> MEMORY
Then load target app doc (CLIENT/ADMIN/MARKETING/SCANNER/RESIDENT/DESIGN).
For symbol-level edits, load symbols/README.md + relevant *_SYMBOLS_REFERENCE.md.
Preserve invariants: organizationId, deletedAt, auth/RBAC, signed QR/security contracts, pnpm-only.
```

---

## FUNCTIONS AND SERVICES INDEX

This file defines where functional logic lives and how to inventory it quickly.

## Coverage Scope

- Function/service-layer ownership by app/package.
- API method handler inventory method.
- Practical extraction workflow for near-exhaustive function indexing.

## 1) Functional Ownership Model

### App-local service layers

- `apps/client-dashboard/src/lib/**`
- `apps/admin-dashboard/src/lib/**`
- `apps/marketing/lib/**`
- `apps/resident-portal/src/lib/**` (where present)

These own feature-domain logic closest to each app.

### API function handlers

- `apps/*/src/app/api/**/route.ts`
- `apps/marketing/app/api/**/route.ts`

Core exported functions are HTTP method handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

### Shared service/function layers

- `packages/db/src/**` (DB access, seed utilities, tenant helpers)
- `packages/types/src/**` (cross-app contract types)
- `packages/ui/src/**` (shared UI behavior and design primitives)
- `packages/utils/src/**` (shared utility helpers)
- `packages/api-client/src/**` (API consumption helpers)

## 2) API Method Handler Density (Observed)

Route handlers across dashboard/marketing/resident-portal expose a large set of exported async method functions.

High-density method zones include:

- `client-dashboard`:
  - analytics handlers
  - resident handlers
  - contacts/projects/workspace handlers
  - gates/scans/qrcodes handlers
- `admin-dashboard`:
  - admin governance handlers
  - cms handlers
  - support handlers

## 3) Function Index Extraction Commands

Use this sequence to generate exhaustive function maps per app/package.

- Exported functions (generic):
  - `rg "^export\\s+(async\\s+)?function\\s+\\w+" apps packages`
- Exported const functions:
  - `rg "^export\\s+const\\s+\\w+\\s*=\\s*(async\\s*)?\\(" apps packages`
- API HTTP handlers:
  - `rg "export\\s+async\\s+function\\s+(GET|POST|PUT|PATCH|DELETE)" apps --glob "**/app/api/**/route.ts"`
- Named service utilities by folder:
  - `rg "^export" apps/client-dashboard/src/lib apps/admin-dashboard/src/lib packages/db/src packages/utils/src`

## 4) Function Indexing Strategy for Planning Agents

When an AI tool needs "all functions touching feature X":

1. Start from route family and entry page.
2. Identify called modules under app `src/lib`.
3. Resolve shared dependencies in `packages/db`, `packages/types`, `packages/ui`, `packages/utils`.
4. Build an impact set (readers, writers, validators, side-effects).

## 5) Practical Function Map Template

Use this template for per-feature function index blocks:

- Entry file:
  - path
  - exported handlers/functions
- Called service modules:
  - path
  - exported API
- Shared dependencies:
  - package paths
  - contract/type dependencies
- Side effects:
  - DB writes
  - external API/webhook calls
  - background scheduling/notifications

## 6) Planning Notes for AI Tools

- Do not assume route handler file equals full business logic; always trace into app `lib` and shared packages.
- For high-risk changes, require function-level impact list before edits.
- Include test/update tasks for each touched function cluster in plan phases.

---

## PAGES AND ROUTES INDEX

This file is the route/page inventory anchor for planning and UI impact analysis.

## Coverage Scope

- Live counts for page routes per app.
- Route-tree conventions and high-impact route families.
- Regeneration commands for full route extraction.

## 1) Live Page Counts (Current Snapshot)

- `admin-dashboard`: 61 `page.tsx` routes
- `client-dashboard`: 44 `page.tsx` routes
- `marketing`: 28 `page.tsx` routes
- `resident-portal`: 11 `page.tsx` routes

Notes:

- Dashboard apps are locale-scoped (`[locale]` route root).
- `resident-portal` mixes `(portal)` grouped routes plus explicit login/status pages.
- Mobile apps (`scanner-app`, `resident-mobile`) use mobile app navigation (not Next.js `page.tsx` structure).

## 2) Route Topologies by App

### Client Dashboard

- Base pattern: `src/app/[locale]/dashboard/organizations/[orgId]/...`
- High-density route families:
  - `analytics`
  - `gateai` / `ai`
  - `residents` (contacts, units)
  - `settings` (team, integrations, billing, notifications, API)
  - `workspace` (API keys, webhooks)
  - `qrcodes` / scans / maintenance / team

### Admin Dashboard

- Base pattern: `src/app/[locale]/(dashboard)/...`
- High-density route families:
  - `organizations/[orgId]/*` (monitoring, tasks, scans, CMS, intelligence, finance)
  - `settings/*` (security/compliance/auth/database/localization/style)
  - global operations (`monitoring`, `analytics`, `crm`, `projects`, `gates`, `audit-logs`)

### Marketing

- Base pattern: `app/[locale]/...`
- Core page families:
  - core website pages (`page`, `features`, `pricing`, `contact`, `company`)
  - SEO/resource routes (`resources`, `resources/playbooks/[vertical]`)
  - solution verticals (`solutions/*`)
  - legal pages and short-link resolver routes

### Resident Portal

- Portal pattern: `src/app/(portal)/...`
- Core page families:
  - dashboard home
  - visitor flows (list, detail, create/open-qr)
  - auth and account-state pages (`login`, `no-unit-linked`)

## 3) Route Ownership Guidance

- Route UI logic stays in app-local page/components modules.
- Shared UI primitives should be imported from `packages/ui`.
- Route-level data fetching and auth checks should remain close to route boundaries.

## 4) Full Route Extraction Commands

- All page routes:
  - `rg --files apps -g "**/app/**/page.tsx"`
- Per app:
  - `rg --files apps/client-dashboard -g "**/app/**/page.tsx"`
  - `rg --files apps/admin-dashboard -g "**/app/**/page.tsx"`
  - `rg --files apps/marketing -g "**/app/**/page.tsx"`
  - `rg --files apps/resident-portal -g "**/app/**/page.tsx"`

## 5) Planning Notes for AI Tools

- For large UX changes, use route-family batching rather than global edits.
- Treat `[locale]` and `[orgId]` as first-class context variables in plan prompts.
- For dashboard changes, always include navigation and settings route impact checks.

---

## OTHER REPO DEVELOPMENTS

This document captures important developments in the repo outside the four requested focus areas (design system, marketing app, client dashboard, admin dashboard). It is intended as planning context for AI tools.

## Scope

Included here:

- workspace-wide automation and governance,
- shared packages and platform architecture,
- mobile and resident surfaces,
- security and performance initiatives,
- CI/CD and deployment evolution.

Not duplicated here:

- app-specific details already covered in dedicated app reference docs.

## Workspace and Platform Evolution

Major cross-repo progress from `CHANGELOG.md` and workspace docs:

- Platform evolution initiatives are documented in `docs/plan/Complete/platform_evolution`.
- Plan lifecycle automation is mature (`plan:new` to `plan:done` workflow ecosystem).
- Changelog/plan/documentation automation has been expanded and normalized.
- Routing stabilization and theme/locale synchronization work has been applied across dashboards.

## Automation and Developer Infrastructure

Implemented and documented in changelog/script ecosystem:

- Ralph automation system with many scripts, quality checks, and hooks.
- Pre-commit/commit/push safeguards:
  - conventional commit enforcement,
  - lint-staged enforcement,
  - secret scanning,
  - branch validation.
- Docs and release automation:
  - changelog lifecycle,
  - release tagging,
  - docs indexing/consistency checks.
- CI hardening:
  - cache/action updates,
  - stale action remediation,
  - workflow stability improvements.

## Shared Packages and Core Architecture

Monorepo package layer (from root architecture docs and package trees):

- `packages/db`: Prisma schema, migrations, client generation and data access.
- `packages/types`: shared type contracts for cross-app consistency.
- `packages/ui`: shared UI component + token system.
- `packages/i18n`: localization resources and EN/AR support.
- `packages/api-client`: shared API communication utilities.
- `packages/config`: centralized lint/type config standards.

## Mobile and Resident Product Surfaces

Non-dashboard app areas with major progress signals:

- `apps/scanner-app`:
  - offline and field-operation related foundations continue to evolve,
  - biometric and shift-log foundational work is referenced in changelog.
- `apps/resident-mobile`:
  - one-tap invite initiative completed,
  - express invite flow enhancements shipped.
- `apps/resident-portal`:
  - responsive layout and portal improvements are referenced in changelog.

## Security and Data Integrity Developments

Cross-cutting progress areas:

- Multi-tenant isolation hardening and verification phases completed.
- Organization scoping and security controls strengthened across key domains.
- QR security invariants reinforced with HMAC-SHA256 signing patterns.
- CodeQL/security pipeline issues resolved over multiple updates.
- Migration and DB drift reliability work completed in CI and runtime contexts.

## AI and Intelligence Layer Developments

Repo-wide AI-related progress:

- AI SDK migration efforts (including v6 streams) across assistants.
- Admin and client AI assistant surfaces expanded and refined.
- UI message and assistant rendering improvements were delivered in multiple phases.
- AI-oriented task generation and report routes exist in app API surfaces.

## Performance and Reliability Work

Notable non-app-specific progress:

- Lighthouse/performance initiatives established and iterated.
- Build and type-check stability fixes were repeatedly applied across apps.
- Dependency alignment and override fixes reduced transitive instability.
- CI workflows improved for faster and more predictable verification.

## Current Planning Inputs (Recommended Source Set)

For future AI planning context, include:

- `CHANGELOG.md`
- `README.md`
- `docs/reference/architecture/ARCHITECTURE.md`
- `docs/reference/architecture/PROJECT_STRUCTURE.md`
- `docs/reference/product/PRD.md`
- `docs/reference/product/UPCOMING.md`
- `docs/plan/Complete/platform_evolution/*`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

## Practical Guidance for AI Planning Tools

- Use app reference docs for domain specifics and route/menu/API contracts.
- Use this file for cross-cutting constraints, shared infra, and repo trajectory.
- Preserve these invariants in all plans:
  - multi-tenant safety and soft-delete discipline,
  - AR/EN + RTL parity,
  - tokenized design consistency,
  - QR signing and secure auth/token handling.

---
