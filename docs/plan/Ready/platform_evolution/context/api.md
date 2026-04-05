# API notes — platform_evolution

## Admin Dashboard API routes (by phase)

### Phase 1 — Org Hierarchy

- `GET /api/organizations` — list all orgs (SUPER_ADMIN only)
- `GET /api/organizations/[orgId]` — org details with nested Users/Projects/Gates
- `POST /api/organizations` — create org (with `orgType` from provisioning form)
- All org-scoped routes: `/api/organizations/[orgId]/**`

### Phase 2 — GateFlow CRM

- `POST /api/crm/leads` — create lead (Zod validated, consent required)
- `GET /api/crm/leads` — list leads (RBAC: own vs all per role)
- `PATCH /api/crm/leads/[id]/score` — AI scoring endpoint (logs to AiActionLog)
- `POST /api/crm/leads/[id]/nurture` — AI email draft (HiTL required)
- **PII**: `email`/`phone` encrypted at rest (AES-256-GCM). Never in LLM prompts.

### Phase 3 — Task Manager

- `GET /api/tasks/boards` — list boards for user's department
- `POST /api/tasks` — create task (auto-linked if `linkedType`/`linkedId` provided)
- `POST /api/tasks/generate` — AI natural language → task list
- `GET /api/tasks/bots` — list bot rules per department
- `POST /api/tasks/bots` — create/update bot rule (MANAGER+ only)

### Phase 4 — Style Hub

- `GET /api/branding/[orgId]` — current branding + snapshots
- `PATCH /api/branding/[orgId]` — update branding (auto-snapshot, WCAG check)
- `POST /api/branding/[orgId]/rollback` — restore from snapshot
- `POST /api/branding/upload` — logo/favicon → Vercel Blob (2MB max, image/\*)

### Phase 5 — Landing Page CMS

- `GET /api/cms/pages` — list landing pages (public for ISR)
- `GET /api/cms/pages/[slug]` — single page by slug (public for ISR)
- `POST /api/cms/pages` — create page (MARKETING_EDITOR+)
- `PATCH /api/cms/pages/[id]` — update/publish (triggers ISR revalidation)
- `POST /api/cms/generate-section` — AI section generation

### Phase 6 — Blog CMS

- `GET /api/cms/blog` — list published posts (public for ISR)
- `GET /api/cms/blog/[slug]` — single post by slug (public for ISR)
- `POST /api/cms/blog` — create post (MARKETING_EDITOR+)
- `PATCH /api/cms/blog/[id]` — update/publish (triggers ISR + sitemap update)
- `POST /api/cms/generate-blog` — AI draft generation
- ISR webhook: `POST {MARKETING_SITE_URL}/api/revalidate` with `x-revalidate-token`

### Phase 7 — Support & Ops

- `POST /api/support/triage` — AI ticket triage
- `POST /api/support/escalate` — create linked Task + notification
- `GET /api/ops/audit-trail` — paginated AiActionLog (filtered by role scope)
- `GET /api/ops/ai-usage` — AI cost data for analytics charts

## Common patterns (all routes)

- **Auth**: Server-side session check. Return 401 if unauthenticated.
- **RBAC**: Check user role against RBAC matrix. Return 403 if unauthorized.
- **Validation**: Zod schemas on all POST/PATCH bodies.
- **Scoping**: Include `organizationId` in all tenant queries.
- **Soft deletes**: `deletedAt: null` on all read queries.
- **Logging**: AI actions → `AiActionLog` with `PENDING_CONFIRMATION` until human approval.
