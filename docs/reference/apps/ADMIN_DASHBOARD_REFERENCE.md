# GateFlow Admin Dashboard Reference

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
