# TASKS: GateFlow Platform Evolution — The Operating System Hub (v3.0)

**Slug:** `platform_evolution`  
**Status:** In Progress / Ready  
**Timeline:** 7 Phases  
**Ref:** `PLAN_platform_evolution.md`

---

## Phase 1: Nested Organizational Hierarchy & Routing

- [ ] **Database Schema Refactor**:
  - [ ] Add `organizationId` to `User`, `Project`, `Gate`.
  - [ ] Create `OrganizationType` and `OrganizationStatus` enums.
  - [ ] Add `AiActionLog` and `AiGeneratedAsset` tables.
- [ ] **Routing & Hierarchy**:
  - [ ] Move `/dashboard` pages to `/organizations/[orgId]`.
  - [ ] Implement `OrganizationContext` and `useOrganization` hook.
- [ ] **Sidebar Switcher**:
  - [ ] Build Premium `OrgSwitcher` with Cmd+K functionality.
  - [ ] Ensure full Arabic RTL support for labels and icons.
- [ ] **Middleware Guard**:
  - [ ] Implement Edge/Server-level org-scoping verification.

## Phase 2: Enhanced CRM System with AI Intelligence

- [ ] **Sales Pipeline System**:
  - [ ] `Lead` and `Deal` tables linked to Orgs.
  - [ ] AI Lead Scoring using Vercel AI SDK v6.
- [ ] **CRM Dashboard**:
  - [ ] Kanban board with High-Density lead cards.
  - [ ] AI "Next Best Action" insights panel.
- [ ] **HiTL Nurturing**:
  - [ ] AI email/message draft editor with human "Confirm" gate.
- [ ] **Translation (EN/AR)**:
  - [ ] Sales terminology (Lead, Deal, Pipeline) translated to Arabic.

## Phase 3: AI Task Manager & Rule-Based Bots

- [ ] **Task Engine**:
  - [ ] `Task` and `TaskBoard` schema for multi-departmental boards.
  - [ ] AI Task generation from natural language prompts.
- [ ] **Rule-Based Bots**:
  - [ ] Bot triggers for stage transitions (e.g., Lead → Negotiation).
- [ ] **Multi-View UI**:
  - [ ] Kanban, List, and reversed Arabic Calendar views.

## Phase 4: Style Editing & Live Theming Hub

- [ ] **Branding Library**:
  - [ ] `primaryColor`, `secondaryColor`, `logoUrl`, `fontFamily` in DB.
  - [ ] Logic for global inheritance and org-level overrides.
- [ ] **Style Editor**:
  - [ ] Real-time CSS variable injection engine.
  - [ ] Live preview iframe for Client Dashboard and Marketing site.

## Phase 5: AI Landing Page Builder

- [ ] **Block Composer**:
  - [ ] `LandingPage` and `LandingPageSection` schema.
  - [ ] Library of ADS-compliant structured blocks (Hero, Features).
- [ ] **AI Asset Generation**:
  - [ ] Vercel AI SDK v6 text generation for headings/copy.
  - [ ] Image generation tool integration (Grok Imagine).
- [ ] **Publishing Workflow**:
  - [ ] HiTL "Review & Approve" panel for all AI assets.

## Phase 6: AI Blog Content Engine

- [ ] **Blog CMS Model**:
  - [ ] Multi-language posts (EN/AR) with meta SEO support.
- [ ] **AI Drafting Engine**:
  - [ ] Automated draft generation from title prompts.
  - [ ] Side-by-side translation tool for perfect EN/AR parity.
- [ ] **Creative Media Pipeline**:
  - [ ] AI featured image generation and insertion.

## Phase 7: AI Support, Ops Hub & Resilience

- [ ] **Unified Support Queue**:
  - [ ] Multi-tenant chat inbox with AI self-service first response.
- [ ] **Ops Dashboard**:
  - [ ] Funnel analytics, conversion charts, and AI cost tracking.
- [ ] **Resilience Hardening**:
  - [ ] Admin dials for Rate limiting, Caching, and Session TTL.
- [ ] **Final QA**:
  - [ ] Full MENA-market accessibility audit (EN/AR RTL).
  - [ ] Performance benchmark for Admin Dashboard (100% Core Web Vitals).
