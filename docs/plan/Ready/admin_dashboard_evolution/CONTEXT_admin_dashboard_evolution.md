# Context snapshot — `admin_dashboard_evolution`

> Full architecture and skill mappings live in `PLAN_admin_dashboard_evolution.md`. Extend this file when workspace layout, env vars, or route decisions change.

## App Target

`apps/admin-dashboard` (Next.js 14, Port 3002)

## Key repo paths

### App Structure

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/` — All dashboard routes
- `apps/admin-dashboard/src/components/` — All UI components
- `apps/admin-dashboard/src/providers/organization-provider.tsx` — Org context
- `apps/admin-dashboard/src/app/api/` — API routes (admin, auth, branding, cms, crm, notifications, support, tasks)

### Existing Components (Already Built)

- `src/components/Sidebar.tsx` — Current sidebar (to be replaced)
- `src/components/admin-ai-assistant.tsx` — AI assistant panel
- `src/components/cms/PageBuilder.tsx` — Page builder baseline
- `src/components/cms/BlogEditor.tsx` — Blog editor baseline
- `src/components/crm/crm-dashboard.tsx` — CRM dashboard baseline
- `src/components/admin-shell.tsx` — Main shell wrapper

### Existing API Routes

- `src/app/api/cms/blog/` — Blog CRUD API
- `src/app/api/cms/generate-blog/` — AI blog generation
- `src/app/api/cms/generate-section/` — AI section generation
- `src/app/api/cms/pages/` — CMS pages API
- `src/app/api/crm/score-lead/` — CRM lead scoring

### Existing Org-Scoped Dashboard Routes

- `/organizations/[orgId]/crm` — CRM page (exists)
- `/organizations/[orgId]/branding` — Branding page (exists)
- `/organizations/[orgId]/analytics` — Analytics (exists)
- `/organizations/[orgId]/tasks` — Task Hub (exists)
- `/organizations/[orgId]/monitoring` — Monitoring (exists)

### Packages Used

- `@gate-access/ui` — Shared UI components and ADS tokens
- `@gate-access/db` — Prisma schema (Organization, User, Project, Gate, Task, BlogPost, LandingPage, etc.)
- `@gate-access/types` — Shared TypeScript types
- `@gate-access/i18n` — Arabic/English translations

## External Surfaces

- **Admin URL:** `admin.gateflow.site` (production)
- **CMS serves:** `www.gateflow.site` — public marketing/website content managed from Admin
- **Dev port:** 3002

## Design policy

- **Design System:** Atlassian Design System (ADS) tokens — `@atlaskit/tokens`
- **Motion:** Framer Motion for complex animations, CSS transitions for micro-interactions
- **Responsive:** Mobile-first, all views tested at 375px / 768px / 1280px
- **RTL:** All components use logical CSS properties (`margin-inline-start`, `padding-inline-end`)

## Multi-tenant constraints

- Every DB query MUST include `organizationId` scope
- `deletedAt: null` filter everywhere — soft deletes only
- OrganizationContext provider must be wrapping all org-scoped routes
- OrgId persisted in localStorage key: `gateflow_selected_org`

## AI integration policy

- Vercel AI SDK v6 (`ai` package)
- **Human-in-the-loop mandatory:** Every AI output shows confirmation gate before publish
- Audit log created for every AI action
- Max 3 retries on AI failure; fallback content shown on exhaustion
