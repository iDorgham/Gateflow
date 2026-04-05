# TASKS: GateFlow Platform Evolution — The Operating System Hub (v3.0)

**Slug:** `platform_evolution`  
**Status:** Ready  
**Timeline:** 7 Phases  
**Ref:** `PLAN_platform_evolution.md`

---

## Phase 1: Nested Organizational Hierarchy & Routing

- [ ] **1a — Database Schema Refactor**:
  - [ ] Add `organizationId` FK to `User`, `Project`, `Gate`.
  - [ ] Create `OrganizationType` and `OrganizationStatus` enums.
  - [ ] Add `AiActionLog` and `AiGeneratedAsset` tables.
  - [ ] Migration: `npx prisma migrate dev --name nest_entities_under_org`.
  - [ ] Conflict gate: `org_types_dashboard` P1 migration must be merged first.
- [ ] **1b — Routing & Redirects**:
  - [ ] Move `/dashboard/*` pages to `/organizations/[orgId]/*`.
  - [ ] Implement `OrganizationContext` and `useOrganization` hook.
  - [ ] 301 permanent redirects from all legacy `/dashboard/*` routes.
  - [ ] Edge/Server middleware for org-scoping verification.
- [ ] **1c — OrgSwitcher UI & Admin Provisioning**:
  - [ ] Build Premium `OrgSwitcher` with Cmd+K search.
  - [ ] `OrgProvisioningForm` to set `orgType` on creation.
  - [ ] Full Arabic RTL support for labels, icons, and keyboard shortcuts.

## Phase 2: GateFlow Lead CRM with AI Intelligence

- [ ] **Schema & PII Encryption**:
  - [ ] `Lead` and `Deal` tables (GateFlow sales pipeline — NOT client CRM).
  - [ ] Field-level AES-256-GCM encryption for `email` and `phone`.
  - [ ] `consentGiven` flag — AI cannot generate outreach without it.
- [ ] **AI Lead Scoring**:
  - [ ] Vercel AI SDK v6 scoring endpoint.
  - [ ] No raw PII in LLM prompts — metadata tiers only.
  - [ ] Log all scoring to `AiActionLog`.
- [ ] **CRM Dashboard**:
  - [ ] Kanban board with high-density lead cards.
  - [ ] AI "Next Best Action" insights panel.
- [ ] **HiTL Nurturing**:
  - [ ] AI email/message draft editor with human "Confirm" gate.
- [ ] **RBAC**: `SALES_REP` (own leads), `SALES_MANAGER` (all), others blocked.
- [ ] **Translation**: Sales terminology translated to Arabic.

## Phase 3: AI Task Manager & Rule-Based Automation Bots

- [ ] **Schema**:
  - [ ] `Task`, `TaskBoard`, `TaskBotRule` tables with `Department` enum.
  - [ ] Polymorphic linking (`linkedType`/`linkedId`) to Lead, Deal, BlogPost, LandingPage.
  - [ ] Migration: `npx prisma migrate dev --name add_task_hub_and_bots`.
- [ ] **RBAC Enforcement**:
  - [ ] Department-scoped boards (Sales, Marketing, Dev, Support).
  - [ ] `SALES_REP` sees own tasks + Sales board. `SUPER_ADMIN` sees all.
  - [ ] Middleware check on `/api/tasks/**` routes.
- [ ] **AI Task Generation**:
  - [ ] Natural language → structured task list via Vercel AI SDK v6.
  - [ ] All generated tasks logged in `AiActionLog`.
- [ ] **Bot Rule Engine**:
  - [ ] Event-driven reactor (Lead score > 80 → Sales follow-up task).
  - [ ] `autoExecute` toggle per rule with HiTL confirmation when off.
  - [ ] Rate limit: max 10 bot tasks/rule/hour. Auto-disable on exceed.
- [ ] **Multi-View UI**:
  - [ ] Kanban (drag-and-drop), Calendar (MENA Fri-Sat weekend), List view.
  - [ ] Linked entity side panel (click task → see Lead card).
- [ ] **Bot Manager UI**:
  - [ ] Rule CRUD with condition builder and `{{variable}}` template.
  - [ ] Activity log: last 50 bot-created tasks.
- [ ] **Notification System**:
  - [ ] In-app notification bell. Triggers: assignment, bot approval, due date.
  - [ ] `Notification` table with `read` flag.
- [ ] **RTL**: Arabic task statuses, calendar reversed, Hijri option.

## Phase 4: Style Editing & Live Theming Hub

- [ ] **Schema & Versioning**:
  - [ ] `OrganizationBranding` and `BrandingSnapshot` tables.
  - [ ] JSON `tokenOverrides` field for whitelisted `@gateflow/tokens` slots.
  - [ ] Migration: `npx prisma migrate dev --name add_org_branding_and_snapshots`.
- [ ] **Token Integration**:
  - [ ] Whitelist of overridable tokens from `@gateflow/tokens`.
  - [ ] CSS override block generator per org.
- [ ] **WCAG Contrast Validator**:
  - [ ] `contrast.ts` utility in `packages/utils`.
  - [ ] Block save if primary/foreground contrast < 4.5:1 (WCAG AA).
- [ ] **Live Preview**:
  - [ ] Iframe loading `apps/client-dashboard`.
  - [ ] `PostMessage` protocol for real-time CSS variable overrides.
  - [ ] Origin validation in listener (security).
- [ ] **Asset Storage**: Logo/favicon upload to Vercel Blob. Max 2MB, image/\* only.
- [ ] **Rollback**: Version history panel. One-click restore from `BrandingSnapshot`.
- [ ] **RBAC**: `DEV_ADMIN` / `SUPER_ADMIN` only. Others get 403.
- [ ] **RTL**: Arabic font selector (Cairo, Almarai, Tajawal). Preview toggle.

## Phase 5: AI Landing Page Builder

- [ ] **Schema**: `LandingPage` and `LandingPageSection` with `CmsStatus` enum.
- [ ] **Headless CMS API**:
  - [ ] `GET /api/cms/pages/[slug]` consumed by `apps/marketing`.
  - [ ] `POST` publish triggers ISR revalidation webhook.
- [ ] **AI Composer**: Section JSON generation via Vercel AI SDK v6.
- [ ] **Block-Based Builder UI**: Section library, drag-to-reorder, AI generate.
- [ ] **HiTL**: Publish blocked until all AI assets approved.
- [ ] **Marketing Site Route**: `apps/marketing/[locale]/[slug]/page.tsx` (ISR).
- [ ] **Target URLs**: `gateflow.site/en/[slug]` and `gateflow.site/ar/[slug]`.
- [ ] **RBAC**: `MARKETING_EDITOR` / `SUPER_ADMIN` only.

## Phase 6: AI Blog Content Engine

- [ ] **Schema**: `BlogPost`, `BlogCategory` with multi-language fields.
- [ ] **Headless CMS API**:
  - [ ] `GET /api/cms/blog/[slug]` and list endpoint.
  - [ ] Publish triggers ISR + sitemap update.
- [ ] **AI Drafting**: Full draft from title, `translateContent` tool (EN → AR).
- [ ] **Premium Editor**: Tiptap rich text, side-by-side EN/AR, SEO panel.
- [ ] **Review Checklist**: SEO verified, Arabic tone, featured image, categories.
- [ ] **Marketing Site Routes**: `/en/blog/[slug]`, `/ar/blog/[slug]`, sitemap.
- [ ] **RBAC**: `MARKETING_EDITOR` / `SUPER_ADMIN` only.

## Phase 7: Support Hub, Audit Trail, Analytics & Hardening

- [ ] **Module A — Support Hub**:
  - [ ] `SupportTicket` and `SupportMessage` schema.
  - [ ] AI triage: summary, priority, suggested action.
  - [ ] Escalation creates linked Task (Phase 3) + notification.
  - [ ] HiTL: AI auto-resolution requires human confirm.
- [ ] **Module B — Audit Trail Viewer**:
  - [ ] Searchable `AiActionLog` UI with filters (date, type, department, status).
  - [ ] Detail side panel with full payload and reasoning.
  - [ ] CSV/XLSX export for PDPL/GDPR compliance.
  - [ ] Scoped access: admins see all, others see own department.
- [ ] **Module C — Predictive Analytics**:
  - [ ] Lead funnel chart (Recharts).
  - [ ] Deal pipeline value bar chart.
  - [ ] CMS performance (views, conversions).
  - [ ] AI usage cost tracker (`AiUsageLog` table + interceptor).
  - [ ] AI weekly summary generator.
- [ ] **Module D — Platform Hardening**:
  - [ ] Rate limiting sliders per API route group.
  - [ ] Force ISR revalidation button.
  - [ ] Session TTL profiles (Strict/Standard/Demo).
  - [ ] Status indicator gauges.
- [ ] **RTL**: Arabic chart labels, audit trail columns, support inbox.
- [ ] **Final QA**: Full MENA accessibility audit. Core Web Vitals ≥ 100%.
