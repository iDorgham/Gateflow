# API — admin_dashboard_evolution

## Existing API Routes (Already in codebase)

### Admin

- `GET /api/admin/organizations` — List all orgs (super-admin)
- `GET /api/admin/organizations/[orgId]` — Single org data

### Auth

- `POST /api/auth/login` — Admin login
- `POST /api/auth/refresh` — Token refresh

### CMS

- `GET|POST /api/cms/pages` — CRUD landing/CMS pages
- `GET|PUT|DELETE /api/cms/pages/[slug]` — Single page ops
- `POST /api/cms/generate-section` — AI section content generation
- `GET|POST /api/cms/blog` — Blog posts CRUD
- `POST /api/cms/generate-blog` — AI blog draft generation

### CRM

- `POST /api/crm/score-lead` — AI lead scoring

### Support

- `GET|POST /api/support/*` — Support ticket API

### Tasks

- `GET|POST /api/tasks/*` — Task Hub API

### Notifications

- `POST /api/notifications/*` — Admin notifications

## New API Routes to Build (by phase)

### Phase 1

- `GET /api/admin/organizations` — enhanced with pagination + search

### Phase 2

- `GET|POST /api/cms/settings` — CMS site-wide settings (SEO, scripts, security, cache)

### Phase 5

- `GET|POST|PUT|DELETE /api/cms/menus` — Menu builder CRUD
- `GET|POST|PUT|DELETE /api/cms/menus/[id]/items` — Menu items nested CRUD

### Phase 7

- `GET|POST /api/tasks/bots` — Task Manager AI bots config
- `POST /api/tasks/bots/[id]/run` — Trigger bot execution

### Phase 8

- `GET|POST /api/crm/contacts` — CRM contacts CRUD
- `GET|POST /api/crm/companies` — CRM companies CRUD
- `GET|POST /api/crm/deals` — CRM deals pipeline
- `GET|POST /api/support/tickets` — Support tickets CRUD
- `POST /api/support/tickets/[id]/triage` — AI triage
- `GET /api/analytics/overview` — Platform analytics summary
- `GET|POST|PUT|DELETE /api/team-roles` — Team roles management

## API Contracts

- All responses: `{ success: boolean, data?: T, message?: string, errors?: E }`
- All mutations require CSRF token and valid session
- All org-scoped requests must validate `organizationId` matches session org
- Rate limiting: 60 req/min per IP on public endpoints
