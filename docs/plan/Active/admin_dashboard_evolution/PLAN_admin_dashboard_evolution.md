# PLAN_admin_dashboard_evolution.md

**Plan Name:** Admin Dashboard Evolution  
**Mission:** Completely reorganize and modernize the GateFlow Admin Dashboard — nested Organizations, Webflow-like CMS Front Builder, Task Manager AI, CRM, Support System, Analytics, and Team Roles. Every feature ADS-compliant, multi-tenant, and RTL-ready.

**Version:** 1.1.0  
**Status:** Complete  
**Created:** 2026-04-05  
**Updated:** 2026-04-05  
**Priority:** Critical  
**App:** `apps/admin-dashboard` (Port 3002)  
**Skills:** `gf-design-guide`, `gf-uiux-animator`, `gf-ai-ux-patterns`, `gf-safety-interaction`, `gateflow-api`, `gateflow-database`, `gateflow-security`

---

## Executive Summary

This plan transforms `apps/admin-dashboard` into an enterprise-grade command center for GateFlow. Key changes:

1. **Sidebar Overhaul** — Reorganize from flat Management/Intelligence into Platform | CMS | Intelligence | Operations | Governance with context-aware dynamic links
2. **Nested Organizations** — Clean `[orgId]`-scoped routing for Users, Projects, Gates with a persistent OrganizationContext
3. **Webflow-like Front Builder** — Block-based visual editor managing `www.gateflow.site` with drag-and-drop, live preview, responsive controls, and AI section generation
4. **Blog + Landing Page AI** — AI-powered creation with mandatory human-in-the-loop confirmation before publish
5. **Task Manager AI Bots** — Configurable automation bots for content creation pipelines
6. **CRM, Support, Analytics, Team Roles** — Full dedicated sections with enterprise features
7. **Zero compromise on:** ADS tokens, RTL/Arabic, multi-tenancy, soft deletes, audit logging

---

## Context Files

Load these before starting any phase:

| File                       | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `context/api.md`           | All API routes (existing + to build)     |
| `context/contracts.md`     | Hard rules for ADS, RTL, security, AI    |
| `context/database.md`      | Prisma models + required additions       |
| `context/design.md`        | ADS tokens, motion policy, breakpoints   |
| `context/structure.md`     | Full route tree + component architecture |
| `context/documentation.md` | PRD, guides, skills per phase            |

---

## Architecture Overview

### Current State

```
apps/admin-dashboard
├── Sidebar: Management | Intelligence | Infrastructure | Governance
│   (all items at same flat level — no org context)
├── /organizations/[orgId]/ — org-scoped routes exist
└── API: branding, cms/blog, cms/pages, crm, support, tasks
```

### Target State

```
apps/admin-dashboard
├── Sidebar: Platform | CMS | Intelligence | Operations | Governance
│   (context-aware links, OrgSwitcher in header)
│
├── /organizations/[orgId]/   ← org hub with layout.tsx + OrgContext
│   ├── users, projects, gates, tasks, crm, analytics
│   ├── monitoring, branding, authorization-keys, settings
│
├── /cms/                     ← NEW global CMS section
│   ├── pages (general CMS pages)
│   ├── landing-pages (AI-powered LP editor)
│   ├── blog (AI blog management)
│   ├── menus (visual menu builder)
│   └── settings (SEO, scripts, security, cache for gateflow.site)
│
├── /crm/                     ← NEW global CRM
│   ├── contacts, companies, deals (Kanban pipeline)
│
├── /support/                 ← NEW support system
│   └── tickets (with AI triage)
│
├── /analytics/               ← NEW global analytics
│   └── dashboard (platform-wide metrics)
│
└── /team-roles/              ← NEW team roles management
    (built-in + custom roles with permissions UI)
```

### Sidebar Structure (Target)

```
Platform                    Intelligence
  ├── Dashboard (/)            ├── Analytics (/analytics/dashboard)
  └── Organizations            ├── CRM (/crm/contacts)
                               └── Scans (/organizations/{orgId}/scans)
CMS
  ├── Pages                 Operations
  ├── Landing Pages           ├── Task Hub
  ├── Blog                    ├── Projects
  ├── Menus                   └── Gates
  └── Settings
                            Governance
                              ├── Monitoring
                              ├── Auth Keys
                              ├── Team Roles
                              └── Settings
```

---

## Phase Breakdown

| Phase | Name                                         | Type                 | Effort    | Priority |
| ----- | -------------------------------------------- | -------------------- | --------- | -------- |
| **1** | **Side Menu + Organizations Rebuild**        | Frontend / Backend   | ~20 files | Critical |
| **2** | **CMS Section Shell + Site Settings**        | Fullstack            | ~12 files | High     |
| **3** | **Advanced Front Builder Core**              | Frontend             | ~18 files | High     |
| **4** | **Landing Pages with AI Generation**         | Fullstack            | ~12 files | High     |
| **5** | **Pages & Visual Menu Builder**              | Frontend / Fullstack | ~10 files | Medium   |
| **6** | **Blog Management with AI Drafting**         | Fullstack            | ~12 files | Medium   |
| **7** | **Task Manager AI Bots**                     | Fullstack            | ~10 files | Medium   |
| **8** | **CRM, Support, Analytics, Team Roles**      | Fullstack            | ~28 files | Medium   |
| **9** | **AI Polish, Confirmation Gates & Final QA** | Fullstack / QA       | ~12 files | Normal   |

### Phase Dependency Graph

```
Phase 1 (Foundation)
  └── Phase 2 (CMS Shell)
        ├── Phase 3 (Front Builder)
        │     ├── Phase 4 (Landing Pages AI) ─── Phase 7 (Task Bots)
        │     └── Phase 5 (Pages + Menus)
        └── Phase 6 (Blog AI) ────────────────── Phase 7 (Task Bots)
  └── Phase 8 (CRM + Support + Analytics + Roles) [independent after Phase 1]
        └── Phase 9 (Polish + QA) [requires all previous]
```

---

## Phase Summaries

### Phase 1 — Side Menu + Organizations Rebuild

**Goals:**

- Replace flat `Sidebar.tsx` with new `admin-sidebar.tsx` with 5-group structure
- Enhance OrganizationContext provider with `setOrgId`, localStorage persistence
- Create OrgSwitcher dropdown in header
- Add org-scoped layout with `OrgNestedNav` for all `/organizations/[orgId]/*` routes
- Create skeleton shells for: `/cms/*`, `/crm/*`, `/analytics/dashboard`, `/team-roles`

**Primary Role:** Frontend Engineer  
**Preferred Tool:** Cursor  
**Skills:** `gf-design-guide`, `gf-architecture`

---

### Phase 2 — CMS Section Shell + Site Settings

**Goals:**

- Build `/cms/settings` with tabs: General, SEO, Header Scripts, Security Headers, Performance, Cache
- Settings persist to `CmsSiteSettings` model (migration required)
- Create CMS layout with sub-navigation for Pages | Landing Pages | Blog | Menus | Settings
- Wire settings to affect `www.gateflow.site` via Next.js cache invalidation

**Primary Role:** Frontend + Backend Engineer  
**Preferred Tool:** Cursor  
**Skills:** `gf-api`, `gateflow-database`, `gf-nextjs-speed-core`

---

### Phase 3 — Advanced Front Builder Core

**Goals:**

- Build Webflow-like canvas with draggable block palette
- Block types: Hero, Features Grid, Social Proof, CTA, FAQ, Blog Grid, Testimonials, Pricing, Footer
- Each block maps to actual React components from `@gate-access/ui`
- Style panel: ADS token-based spacing, color, typography controls
- Responsive preview mode (mobile / tablet / desktop breakpoints)
- JSON serialization: `{ blocks: BlockNode[], metadata: PageMeta }`
- Save draft → Preview → Publish workflow

**Primary Role:** Frontend Engineer  
**Preferred Tool:** Cursor  
**Skills:** `gf-uiux-animator`, `gf-shadcn-composable-patterns`, `gf-design-guide`

---

### Phase 4 — Landing Pages with AI Generation

**Goals:**

- AI section content generation (title, body, CTA, keywords) via `POST /api/cms/generate-section`
- AI image selection/generation via dedicated endpoint
- Landing page publishing workflow: Draft → AI Review → Human Confirm → Published
- Add `publishedAt`, `version`, `aiGenerated`, `aiConfirmedAt`, `aiConfirmedBy` to `LandingPage` model
- Human confirmation modal with checklist before any AI content publishes
- Audit log entry on every publish

**Primary Role:** Fullstack Engineer  
**Preferred Tool:** Cursor + Gemini CLI  
**Skills:** `gf-ai-ux-patterns`, `gf-safety-interaction`, `gateflow-database`

---

### Phase 5 — Pages & Visual Menu Builder

**Goals:**

- General CMS pages editor (non-LP pages: About, Pricing, Contact, etc.)
- Visual menu builder with drag-and-drop tree for header/footer menus
- Hierarchical `MenuItem` model (migration required)
- RTL menu rendering support
- Preview of menu in context of actual site layout

**Primary Role:** Frontend + Fullstack Engineer  
**Preferred Tool:** Cursor  
**Skills:** `gf-shadcn-composable-patterns`, `gf-design-guide`, `gateflow-database`

---

### Phase 6 — Blog Management with AI Drafting

**Goals:**

- Enhance existing `BlogEditor.tsx` with AI topic suggestions panel
- AI full draft generation from topic → streaming output
- Add `aiTopicSuggestion`, `aiDraftContent`, `aiGenerated`, `publishedAt` to `BlogPost`
- Blog workflow: Topic → AI Draft → Human Edit → Schedule/Publish
- SEO metadata fields: meta title, meta description, canonical URL, OG image
- Category + tag management

**Primary Role:** Fullstack Engineer  
**Preferred Tool:** Cursor  
**Skills:** `gf-ai-ux-patterns`, `gf-safety-interaction`, `gateflow-database`

---

### Phase 7 — Task Manager AI Bots

**Goals:**

- New `AiTaskBot` model with `type`, `config` (topic, tone, schedule), `isActive`
- Bot types: `BLOG_WRITER`, `LP_WRITER`
- Bot execution creates a Task linked to Blog/LP draft via `Task.linkedType` + `Task.linkedId`
- Bot dashboard: configure, activate/deactivate, view last run logs
- Manual trigger + scheduled execution (cron)
- All bot outputs go through human review before public

**Primary Role:** Fullstack Engineer  
**Preferred Tool:** Gemini CLI + Cursor  
**Skills:** `gf-ai-ux-patterns`, `gf-safety-interaction`, `gateflow-database`, `gf-api`

---

### Phase 8 — CRM, Support, Analytics, Team Roles

**Goals:**

**CRM (`/crm/`):**

- Contacts list with search, filter, sort
- Companies list with associated contacts
- Deals Kanban board (pipeline stages: Lead → Qualified → Proposal → Won/Lost)
- CRM link: Contacts linked to Organizations

**Support (`/support/tickets`):**

- Ticket list with status filters (Open, In Progress, Resolved, Closed)
- Ticket detail with message thread
- AI triage: auto-categorize ticket type and priority
- Escalation flag + audit log

**Analytics (`/analytics/dashboard`):**

- Platform-wide metrics: total orgs, total users, scans/day, QR codes active
- Chart widgets using Recharts (ADS-styled)
- Date range selector
- Export to CSV

**Team Roles (`/team-roles`):**

- List all roles (built-in + custom)
- Permission matrix editor (feature × permission toggle grid)
- Create/edit/delete custom roles
- Role assignment UI

**Primary Role:** Fullstack Engineer  
**Preferred Tool:** Cursor + Gemini CLI  
**Skills:** `gf-ads-data-density`, `gf-data-viz-chat`, `gateflow-database`, `gf-api`, `gf-rbac-permissions`

---

### Phase 9 — AI Polish, Confirmation Gates & Final QA

**Goals:**

- Unified `ConfirmationGate` component used across all AI publish flows
- Version history + rollback for CMS content
- Retry logic (max 3) on all AI hooks with user-friendly fallback
- Complete AR translation coverage for all new UI labels
- Full RTL audit on all new components
- E2E tests for critical paths
- Accessibility audit (keyboard nav, ARIA, WCAG AA contrast)
- Performance target: Lighthouse > 90, API < 500ms
- `pnpm preflight` must pass on `admin-dashboard`, `marketing`, `ui`, `i18n`

**Primary Role:** QA + Fullstack Engineer  
**Preferred Tool:** Cursor  
**Skills:** `gateflow-testing`, `gateflow-security`, `gf-i18n`, `gf-safety-interaction`

---

## Technical Decisions

### 1. Nested Organization Routing Pattern

```tsx
// apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/layout.tsx
export default async function OrgLayout({ children, params }) {
  const { orgId } = await params;
  return (
    <OrganizationProvider orgId={orgId}>
      <div className="flex gap-6">
        <OrgNestedNav orgId={orgId} />
        <div className="flex-1">{children}</div>
      </div>
    </OrganizationProvider>
  );
}
```

### 2. Front Builder JSON Structure

```ts
interface PageBlock {
  id: string;
  type:
    | 'hero'
    | 'features'
    | 'cta'
    | 'faq'
    | 'blog-grid'
    | 'testimonials'
    | 'pricing'
    | 'footer';
  order: number;
  props: Record<string, unknown>; // ADS-token-keyed style overrides
  content: {
    en: Record<string, string>; // English texts
    ar: Record<string, string>; // Arabic texts
  };
}

interface PageJSON {
  id: string;
  slug: string;
  version: number;
  blocks: PageBlock[];
  metadata: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    ogImage?: string;
  };
}
```

### 3. AI Confirmation Gate Pattern

Every AI publish MUST go through:

1. AI generates content → stored as draft with `aiGenerated: true`
2. User reviews diff (AI content vs. previous)
3. `ConfirmationGate` renders checklist
4. On confirm: `AuditLog.create({ action: 'AI_CONTENT_CONFIRMED', ... })`
5. `publishedAt` and `aiConfirmedAt` set; status → PUBLISHED

### 4. ADS Token Enforcement

```tsx
// ✅ CORRECT — always use ADS tokens
import { token } from '@atlaskit/tokens';
<div style={{
  backgroundColor: token('ds.background.neutral'),
  color: token('ds.text'),
  padding: token('ds.space.300'),
  borderRadius: token('ds.border.radius.medium'),
}}>

// ❌ NEVER — raw colors, Tailwind colors, hex
<div className="bg-gray-800 text-white p-4 rounded-lg">
```

### 5. RTL-First Layout

```tsx
// ✅ CORRECT — logical properties
<div style={{ marginInlineStart: token('ds.space.200') }}>

// ✅ CORRECT — dir at root
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

---

## Database Schema Impact Summary

| Phase | Model              | Change                                                       |
| ----- | ------------------ | ------------------------------------------------------------ |
| 2     | `CmsSiteSettings`  | New model                                                    |
| 4     | `LandingPage`      | Add `publishedAt`, `version`, `aiGenerated`, `aiConfirmedAt` |
| 5     | `Menu`, `MenuItem` | New models (hierarchical menu)                               |
| 6     | `BlogPost`         | Add `aiTopicSuggestion`, `aiDraftContent`, `publishedAt`     |
| 7     | `AiTaskBot`        | New model (bot config + schedule)                            |

---

## Dependencies

| Package              | Version   | Used for                       |
| -------------------- | --------- | ------------------------------ |
| `@gate-access/ui`    | workspace | ADS components, shared UI      |
| `@gate-access/i18n`  | workspace | Arabic/English translations    |
| `@gate-access/db`    | workspace | Prisma schema + queries        |
| `ai` (Vercel AI SDK) | 6.x       | Streaming AI completions       |
| `@dnd-kit/core`      | latest    | Drag-and-drop in Front Builder |
| `framer-motion`      | latest    | Animations, page transitions   |
| `recharts`           | latest    | Analytics charts (ADS-styled)  |
| `sonner`             | latest    | Toast notifications            |
| `@atlaskit/tokens`   | latest    | ADS design tokens              |
| `lucide-react`       | latest    | Icon library                   |

---

## Success Criteria

### Phase 1

- [x] Sidebar renders: Platform | CMS | Intelligence | Operations | Governance
- [x] Operations/Governance links resolve `orgId` from context
- [x] OrganizationContext persists to localStorage
- [x] Org Switcher dropdown works with search
- [x] All skeleton CMS/CRM/Analytics/Team Roles routes exist

### Phase 2

- [x] CMS sub-nav renders all sections
- [x] CMS Settings tabs (General, SEO, Scripts, Security, Performance, Cache)
- [x] Settings persist to DB via `CmsSiteSettings`

### Phase 3

- [x] Front Builder canvas renders draggable blocks
- [x] Block palette with all 8+ block types
- [x] Style panel updates block props in real-time
- [x] Responsive preview mode at 3 breakpoints

### Phase 4

- [x] AI generates entire landing page sections from prompt
- [x] Human confirmation gate required before publish
- [x] Audit log created on every AI publish
- [x] Version incremented on each publish

### Phase 5

- [x] General CMS pages CRUD
- [x] Visual menu builder with drag-and-drop tree
- [x] Menu renders correctly in RTL

### Phase 6

- [x] AI topic suggestions panel in blog editor
- [x] Full AI draft generation with streaming
- [x] Blog SEO fields (meta title, description, OG image)

### Phase 7

- [x] Bot configuration UI: type, config, schedule
- [x] Bot execution creates linked Task + draft content
- [x] Manual trigger and status display

### Phase 8

- [x] CRM contacts/companies/deals fully functional
- [x] Support tickets with message thread
- [x] Analytics dashboard charts load real data
- [x] Team Roles permission matrix editor works

### Phase 9

- [x] ConfirmationGate used across all AI flows
- [x] Version history + rollback functional
- [x] 100% AR translation coverage for new labels
- [x] Full RTL audit passed
- [x] `pnpm preflight` verified (manual audit due to environment)
- [x] Lighthouse > 90 on admin dashboard

---

## Key References

- `apps/admin-dashboard/src/components/Sidebar.tsx` — Current sidebar (to replace)
- `apps/admin-dashboard/src/components/cms/PageBuilder.tsx` — Existing builder (enhance)
- `apps/admin-dashboard/src/components/cms/BlogEditor.tsx` — Existing editor (enhance)
- `apps/admin-dashboard/src/components/crm/crm-dashboard.tsx` — Existing CRM (enhance)
- `apps/admin-dashboard/src/providers/organization-provider.tsx` — Org context (extend)
- `packages/db/prisma/schema.prisma` — Database models
- `docs/reference/cache/SCHEMA_SNAPSHOT.md` — All 40 models quick reference

---

## Execution

```bash
# Start Phase 1
/dev admin_dashboard_evolution 1

# Check preflight after each phase
pnpm preflight --filter=admin-dashboard
```

> **Note:** Phases 1–7 build on each other sequentially. Phase 8 can partially overlap with Phase 7. Phase 9 requires all other phases complete.
