# PLAN: Atlassian Design System UI Remake

## Overview
Remake for GateFlow UI/UX across all web platforms using the [Atlassian Design System](https://atlassian.design/). This includes design tokens, shared components, marketing site, authentication flows, and both dashboards (Admin & Client). This plan emphasizes strict adherence to Atlassian foundations (Tokens, Spacing, Typography, Grid) and interaction patterns (Motion, Content Design).

**Slug:** `atlassian_ui_remake`
**Status:** 🏗️ Planning
**Target:** Q1 2026

---

## Foundations (Cross-Phase)
- **Tokens**: Use [Atlassian Tokens](https://atlassian.design/foundations/tokens) (`--ds-` prefix).
- **Spacing & Grid**: [8px spacing guide](https://atlassian.design/foundations/spacing) and [Grid Beta](https://atlassian.design/foundations/grid-beta/applying-angrid).
- **Typography**: [Atlassian Typography](https://atlassian.design/foundations/typography).
- **Motion**: [Motion specs](https://atlassian.design/components/motion/accessibility/code).
- **Content Design**: [Content Design principles](https://atlassian.design/get-started/content-design).
- **Illustrations**: [Atlassian Illustrations](https://atlassian.design/foundations/illustrations).

---

## Phases

### Phase 1: Foundation — Design Tokens & Theme Engine (Completed)
Establish the Atlassian visual foundation in the shared UI package and apps.
- **Primary Role:** FRONTEND
- **Acceptance Criteria:** 
    - Atlassian color palette (Neutral, Blue, Green, etc.) implemented using official tokens.
    - Spacing (space.100 = 8px) and Grid system integrated into Tailwind.
    - Light/Dark mode parity using `--ds-` variable mapping.
- **Files:** `packages/ui/`, `tailwind.config.ts`, `apps/*/src/app/globals.css`

### Phase 2: Public Realm — Marketing & Auth Flows (Completed)
Remake the landing page and authentication screens.
- **Primary Role:** FRONTEND
- **Inspiration:** [Atlassian Navigation for Marketing](https://atlassian.design/components/atlassian-navigation/examples).
- **Acceptance Criteria:**
    - Marketing homepage updated with Atlassian-style sections, illustrations, and motion.
    - Login/Signup pages using Atlassian form patterns and layout.
- **Files:** `apps/marketing/`, `apps/client-dashboard/src/app/(auth)/`

### Phase 3: Dashboard Shell — Navigation & Layout (Completed)
Refactor the core layout of both dashboards (Admin & Client).
- **Primary Role:** FRONTEND
- **Components:** [Side Navigation](https://atlassian.design/components/side-navigation/examples), [Avatar](https://atlassian.design/components/avatar/examples).
- **Acceptance Criteria:**
    - Sidebar and Header updated to Atlassian navigation patterns.
    - Responsive behavior audit with Grid Beta.
    - Breadcrumbs and PageHeader components integrated.
- **Files:** `apps/*/src/components/dashboard/layout/`

### Phase 4: Feature Modules — Tables, Forms & Interactions
Apply Atlassian patterns to specific dashboard features.
- **Primary Role:** FRONTEND
- **Components:** [Dynamic Table](https://atlassian.design/components/dynamic-table/examples), [Pagination](https://atlassian.design/components/pagination/examples), [DateTime Picker](https://atlassian.design/components/datetime-picker/examples).
- **Acceptance Criteria:**
    - Data tables (QR Logs, Scans) updated to Dynamic Table pattern with Pagination.
    - Forms updated with Atlassian-style buttons and inputs.
    - Motion applied to transitions and micro-interactions.
- **Files:** `apps/*/src/app/dashboard/`

### Phase 5: Global Polish & Audit
Final pass for consistency, accessibility, and content design.
- **Primary Role:** QA / CONTENT
- **Acceptance Criteria:**
    - Arabic (RTL) support verified for all new designs.
    - Accessibility (A11y) audit for motion and contrast.
    - Content design review for clarity and tone.
    - Performance audit for the new grid and motion.
