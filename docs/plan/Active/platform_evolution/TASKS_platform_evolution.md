# TASKS: GateFlow Platform Evolution — The Operating System Hub (v3.0)

**Slug:** `platform_evolution`  
**Status:** Ready  
**Timeline:** 7 Phases  
**Ref:** `PLAN_platform_evolution.md`

---

## Phase 1: Nested Organizational Hierarchy & Routing

- [x] **1a — Database Schema Refactor**:
  - [x] Add `organizationId` FK to `User`, `Project`, `Gate`.
  - [x] Create `OrganizationType` and `OrganizationStatus` enums.
  - [x] Add `AiActionLog` and `AiGeneratedAsset` tables.
  - [x] Migration: `npx prisma migrate dev --name nest_entities_under_org`.
  - [x] Conflict gate: `org_types_dashboard` P1 migration must be merged first.
- [x] **1b — Routing & Redirects**:
  - [x] Move `/dashboard/*` pages to `/organizations/[orgId]/*`.
  - [x] Implement `OrganizationContext` and `useOrganization` hook.
  - [x] 301 permanent redirects from all legacy `/dashboard/*` routes.
  - [x] Edge/Server middleware for org-scoping verification.
- [x] **1c — OrgSwitcher UI & Admin Provisioning**:
  - [x] Build Premium `OrgSwitcher` with Cmd+K search.
  - [x] `OrgProvisioningForm` to set `orgType` on creation.
  - [x] Full Arabic RTL support for labels, icons, and keyboard shortcuts.

## Phase 2: GateFlow Lead CRM with AI Intelligence

- [x] **Schema & PII Encryption**:
  - [x] `Lead` and `Deal` tables (GateFlow sales pipeline — NOT client CRM).
  - [x] Field-level AES-256-GCM encryption for `email` and `phone`.
  - [x] `consentGiven` flag — AI cannot generate outreach without it.
- [x] **AI Lead Scoring**:
  - [x] Vercel AI SDK v6 scoring endpoint.
  - [x] No raw PII in LLM prompts — metadata tiers only.
  - [x] Log all scoring to `AiActionLog`.
- [x] **CRM Dashboard**:
  - [x] Kanban board with high-density lead cards.
  - [x] AI "Next Best Action" insights panel.
- [x] **HiTL Nurturing**:
  - [x] AI email/message draft editor with human "Confirm" gate.
- [x] **RBAC**: `SALES_REP` (own leads), `SALES_MANAGER` (all), others blocked.
- [x] **Translation**: Sales terminology translated to Arabic.

## Phase 3: AI Task Manager & Rule-Based Automation Bots

- [x] **Schema**:
  - [x] `Task`, `TaskBoard`, `TaskBotRule` tables with `Department` enum.
  - [x] Polymorphic linking (`linkedType`/`linkedId`) to Lead, Deal, BlogPost, LandingPage.
  - [x] Migration: `npx prisma migrate dev --name add_task_hub_and_bots`.
- [x] **RBAC Enforcement**:
  - [x] Department-scoped boards (Sales, Marketing, Dev, Support).
  - [x] `SALES_REP` sees own tasks + Sales board. `SUPER_ADMIN` sees all.
  - [x] Middleware check on `/api/tasks/**` routes.
- [x] **AI Task Generation**:
  - [x] Natural language → structured task list via Vercel AI SDK v6.
  - [x] All generated tasks logged in `AiActionLog`.
- [x] **Bot Rule Engine**:
  - [x] Event-driven reactor (Lead score > 80 → Sales follow-up task).
  - [x] `autoExecute` toggle per rule with HiTL confirmation when off.
  - [x] Rate limit: max 10 bot tasks/rule/hour. Auto-disable on exceed.
- [x] **Multi-View UI**:
  - [x] Kanban (drag-and-drop), Calendar (MENA Fri-Sat weekend), List view.
  - [x] Linked entity side panel (click task → see Lead card).
- [x] **Bot Manager UI**:
  - [x] Rule CRUD with condition builder and `{{variable}}` template.
  - [x] Activity log: last 50 bot-created tasks.
- [x] **Notification System**:
  - [x] In-app notification bell. Triggers: assignment, bot approval, due date.
  - [x] `Notification` table with `read` flag.
- [x] **RTL**: Arabic task statuses, calendar reversed, Hijri option.

## Phase 4: Style Editing & Live Theming Hub

- [x] **Schema & Versioning**:
  - [x] `StyleSnapshot` and `ThemeVariable` tables (Industrialized theming).
  - [x] `Organization` relation: one active style, many snapshots.
  - [x] Migration: `npx prisma migrate dev --name add_style_hub_and_snapshots`.
- [x] **Token Integration**:
  - [x] Whitelist of overridable tokens from `@gateflow/tokens`.
  - [x] CSS override block generator per org.
- [x] **WCAG Contrast Validator**:
  - [x] `contrast.ts` utility in `packages/utils`.
  - [x] Block save if primary/foreground contrast < 4.5:1 (WCAG AA).
- [x] **Live Preview**:
  - [x] Iframe-style preview block in Style Hub.
  - [x] Real-time CSS variable local overrides.
- [x] **Asset Storage**: Logo/favicon logic ready (linked to branding relation).
- [x] **Rollback**: Version history panel. One-click restore logic in `StyleSnapshot`.
- [x] **RBAC**: `ADMIN` only via `requireAdmin` and `isAdminAuthorized`.
- [x] **RTL**: Arabic font support in token whitelist.

## Phase 5: AI Landing Page Builder

- [x] **Schema**: `LandingPage` and `LandingPageSection` with `LandingPageStatus` enum.
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
