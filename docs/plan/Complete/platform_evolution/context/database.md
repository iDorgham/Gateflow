# Database — platform_evolution

## New Models by Phase

### Phase 1 — Org Hierarchy

- `AiActionLog` — audit trail for all AI actions
- `AiGeneratedAsset` — tracks AI-created images/content
- FK additions: `organizationId` on `User`, `Project`, `Gate`
- Migration: `npx prisma migrate dev --name nest_entities_under_org`

### Phase 2 — CRM

- `Lead` — GateFlow sales leads (encrypted `email`/`phone`)
- `Deal` — sales pipeline deals linked to leads
- Migration: `npx prisma migrate dev --name add_crm_leads_deals`

### Phase 3 — Task Manager

- `TaskBoard` — department-scoped boards
- `Task` — with polymorphic `linkedType`/`linkedId` for CRM/CMS cross-linking
- `TaskBotRule` — automation rules with conditions JSON and action templates
- `Notification` — in-app notifications for task events
- Migration: `npx prisma migrate dev --name add_task_hub_and_bots`

### Phase 4 — Style Hub

- `OrganizationBranding` — token overrides JSON, font, logo URL per org
- `BrandingSnapshot` — versioned history for rollback
- Migration: `npx prisma migrate dev --name add_org_branding_and_snapshots`

### Phase 5 — Landing Pages

- `LandingPage` — slug, title (EN/AR), status, publishedAt
- `LandingPageSection` — type enum, order, content JSON (EN/AR), aiGenerated flag
- Migration: `npx prisma migrate dev --name add_landing_page_cms`

### Phase 6 — Blog

- `BlogPost` — multi-language (titleEn/Ar, slugEn/Ar, contentEn/Ar), SEO fields
- `BlogCategory` — nameEn/Ar, slug (many-to-many with BlogPost)
- Migration: `npx prisma migrate dev --name add_blog_cms`

### Phase 7 — Support & Ops

- `SupportTicket` — ticket lifecycle, AI triage summary, assignee
- `SupportMessage` — chat messages (USER/AGENT/AI sender types)
- `AiUsageLog` — model, tokens, estimated cost, department tracking
- Migration: `npx prisma migrate dev --name add_support_tickets`

## Shared Enums

```
CmsStatus: DRAFT | IN_REVIEW | READY_TO_PUBLISH | PUBLISHED | ARCHIVED
Department: SALES | MARKETING | DEV | SUPPORT
TaskStatus: TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED
TaskPriority: LOW | MEDIUM | HIGH | URGENT
TicketStatus: OPEN | AI_TRIAGED | ASSIGNED | IN_PROGRESS | RESOLVED | CLOSED
TicketPriority: LOW | MEDIUM | HIGH | CRITICAL
```

## Migration Order (CRITICAL)

1. `org_types_dashboard` P1 migration pushes first (owns `OrganizationType` enum)
2. `platform_evolution` P1 migration follows (adds FKs, `AiActionLog`)
3. All subsequent phases migrate in order (P2 → P3 → ... → P7)
4. Never run two plan migrations in parallel on the same branch.

## Seeding

- Seed at least 5 leads, 3 deals, 10 tasks, 2 blog posts, 2 landing pages for QA.
- Align with `docs/development/initiatives/IDEA_advanced_seeding_v2.md`.
