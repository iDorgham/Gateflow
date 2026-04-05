# PLAN: GateFlow Platform Evolution — The Operating System for Access

**Slug:** `platform_evolution`  
**Status:** Draft  
**Primary apps:** `apps/admin-dashboard`, `apps/client-dashboard`, `apps/marketing`  
**Supporting:** `packages/db`, `packages/ui`, `packages/types`, `packages/api`

---

## Executive Summary — Six Strategic Phases

| Phase | Title                                  | Primary Role     | Outcome                                                                                                 |
| ----- | -------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| **1** | **Nested Organizational Hierarchy**    | **BACKEND**      | Users, Projects, and Gates moved inside Org context; Routing refactor; Sidebar cleanup.                 |
| **2** | **Advanced Settings & Integrations**   | **FRONTEND**     | Teams/Roles (RBAC), Integrations hub, and Tracking Tag injection (GA/FB Pixel).                         |
| **3** | **Marketing Suite & Live CMS**         | **ARCHITECTURE** | Blog system + Block-based Landing Page Builder inspired by Webflow; A/B testing foundation.             |
| **4** | **Support & Operational Hub**          | **FULLSTACK**    | Hybrid AI/Human chat system; Internal Task Manager for GateFlow Team; Page feature-flags.               |
| **5** | **UI/UX Unification & Custom Theming** | **FRONTEND**     | Global CSS synchronization; Admin settings to change fonts, colors, and logos per client.               |
| **6** | **Optimization & Resilience Hub**      | **OPS/BACKEND**  | Advanced Security (Rate limits), Caching (Edge), and Performance toggles for high-scale app operations. |
| **7** | **Analytics & Growth Optimization**    | **DATA**         | Conversion rate tracking, Lead generation attribution, and Performance monitoring across funnels.       |

---

## Phase 1: Nested Organizational Hierarchy

**Goal**: Transition from global management to an organization-centric model.

- **DB Refactor**: Move `User`, `Project`, and `Gate` entities to be children of `Organization`.
- **Admin Routing**:
  - `/organizations/[orgId]` becomes the primary workspace.
  - Child routes: `/users`, `/projects`, `/gates`.
- **Sidebar Update**:
  - Remove global "Users", "Projects", and "Gates" from the Admin sidebar.
  - Implement a "Context Switcher" for Organizations.
- **Org-Type Adaptation**: Integrate logic from `PLAN_org_types_dashboard.md` to change UI terminology/modules based on `Organization.type`.

## Phase 2: Settings v6 (Advanced Workspaces)

**Goal**: Deep customization and integration capabilities.

- **Teams & Roles**:
  - Add a "Team" tab to Org Settings.
  - Implement Roles (Owner, Admin, Editor, Viewer).
- **Integrations**: Add an area to manage Auth Keys, API access, and webhooks.
- **Custom Scripts**: Add input fields for `<head>` tags (Google Analytics, Facebook Pixel, Custom tracking).

## Phase 3: Marketing & Live CMS Engine

**Goal**: Turn GateFlow into a high-converting growth platform.

- **Blog CMS**: Headless CMS architecture with Markdown/Editor support.
- **Landing Page Builder**:
  - Live frontend editing environment.
  - Section-based drag-and-drop hierarchy.
  - SEO & Meta management for lead generation.
- **Experimentation**: Built-in A/B testing for landing pages with conversion analytics.

## Phase 4: Operational Support & Task Management

**Goal**: Build tools for internal team collaboration and customer success.

- **GateFlow Tasks**:
  - Internal Board (Kanban style).
  - Categorized by: Development, Sales, Marketing, Technical.
- **Support System**:
  - Chat widget for Marketing site and Client Dashboard.
  - AI Agent first-response via Gemini/OpenAI.
  - Human escalation queue for the GateFlow support team.
- **Feature Management**: Admin-only section to toggle dashboard features (On/Off) for specific organizations.

## Phase 5: UI/UX Unification & Global Theming

**Goal**: Perfect visual parity and client-specific branding.

- **Global Style System**: Consolidate `packages/ui` tokens.
- **White-Labeling**:
  - Brand settings in Admin: Primary/Secondary Colors, Google Font selection, Logo uploads.
  - Real-time CSS variables specifically for the client dashboard.

## Phase 6: Optimization & Resilience Hub

**Goal**: Enterprise-grade control over platform speed and safety.

- **Security Hardening**:
  - Per-organization rate-limiting profiles.
  - Global session management settings (TTL, concurrency, biometric enforcement).
- **Caching & State**:
  - Controls for React Query/SWR revalidation intervals.
  - Edge caching (Next.js 15) configuration per org type.
- **Performance Toggles**:
  - Asset prioritization controls for mission-critical scanners.
  - Global switches for aggressive image/video compression.

## Phase 7: Analytics & Growth Optimization

**Goal**: End-to-end attribution and funnel visualization.

- **Lead Generation**: Advanced tracking for landing page form submissions.
- **Funnel Analytics**: Conversion rate visualization from marketing hit to resident scan.
- **A/B Testing Dashboard**: Statistical analysis of landing page variations.

---

## Success Criteria

1. **Org Nesting**: Global Users/Projects/Gates are completely removed and replaced by Org-specific sub-routes.
2. **CMS Performance**: Landing pages are generated with perfect SEO and high-speed delivery.
3. **Internal Velocity**: The GateFlow team uses the internal Task Manager for all daily operations.
4. **Visual Parity**: Client and Admin dashboards are indistinguishable in aesthetic quality and style logic.

---

## Trade-offs & Risks

1. **Routing Complexity**: Dynamic nesting requires robust middleware to handle Org-scoping correctly.
2. **CMS Scope**: Building a "Webflow-like" builder is complex; phase 3 will focus on a "Block-Based" approach to ensure stability.
3. **Data Migration**: Moving existing global entities into organizations requires careful script-based migration.
