# IDEA: Atlassian Design System UI Remake

## Context & Vision
Remake the entire UI/UX of GateFlow using the **Atlassian Design System** (https://atlassian.design/). This initiative targets both admin and client dashboards, marketing landing pages, and authentication flows (login/signup). The goal is to provide a premium, consistent, and highly functional user experience that leverages Atlassian's tried-and-tested design patterns.

## Goals & Objectives
- **Modernized Aesthetics**: Adoption of Atlassian's visual language (colors, typography, spacing).
- **Comprehensive Coverage**: Apply the theme to "every small part" of the dashboards.
- **Dynamic Theming**: Support for both Light and Dark modes using component color themes.
- **Functional Components**: Use Atlassian-style forms for landing pages and login pages.
- **SaaS Readiness**: Distinct themes for Marketing/Landing vs. Dashboards.

## Core Initiatives
1. **Design System Foundation**: Establish Atlassian design tokens (colors, typography, spacing) in `@gate-access/ui`.
2. **Dashboard Remake**:
    - **Admin Dashboard**: Refactor screens using Atlassian patterns.
    - **Client Dashboard**: Refactor screens using Atlassian patterns.
3. **Public Facing Remake**:
    - **Marketing Landing Page**: High-impact Atlassian-style landing page.
    - **Authentication Flows**: Redesigned login and signup pages with robust form patterns.
4. **Theme Implementation**:
    - "Component color themes" for marketing and dashboards.
    - Full light/dark mode support.

## Scope
- `apps/admin-dashboard`
- `apps/client-dashboard`
- `apps/marketing`
- `packages/ui` (Shared components)

## Success Criteria
- [ ] 1:1 alignment with Atlassian visual language.
- [ ] Seamless light/dark mode transition across all apps.
- [ ] Improved user registration and login conversion via better UX.
- [ ] All dashboard modules (QR, Scans, Gates, Projects, Settings) fully updated.
