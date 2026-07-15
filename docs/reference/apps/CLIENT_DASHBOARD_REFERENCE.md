# GateFlow Client Dashboard Reference

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
