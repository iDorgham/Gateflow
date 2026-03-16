# Pro Prompt — atlassian_ui_remake — Phase 2

## Phase 2: Public Realm — Marketing & Auth Flows

### Primary role

FRONTEND

### Preferred tool

- [x] Cursor (default)
- [x] browser_subagent (for pattern reference)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform
- **Apps**: marketing (3000), client-dashboard (3001)
- **Design Inspiration**: [Atlassian Marketing Navigation](https://atlassian.design/components/atlassian-navigation/examples), [Illustrations](https://atlassian.design/foundations/illustrations), [Motion](https://atlassian.design/components/motion/accessibility/code).
- **Previous Phase**: Phase 1 established design tokens (Colors, Spacing, Grid, Typography).

### Goal

Remake the marketing landing page and authentication flows (Login/Signup) using Atlassian Design System patterns, focusing on premium navigation, meaningful illustrations, and smooth motion.

### Scope (in)

- **Marketing Navigation**: Implement [Atlassian-style Top Navigation](https://atlassian.design/components/atlassian-navigation/examples) for Marketing.
- **Marketing Homepage**: Redesign with Atlassian-style hero, feature grids, and [Illustrations](https://atlassian.design/foundations/illustrations).
- **Authentication**: Redesign login/signup via Atlassian form patterns.
- **Motion**: Apply [Atlassian Motion](https://atlassian.design/components/motion/accessibility/code) to section entries and component interactions.
- **Content**: Follow [Content Design](https://atlassian.design/get-started/content-design) for copy hierarchy.

### Scope (out)

- Dashboard internal layout (Phase 3).
- Backend logic.

### Steps (ordered)

1. **Navigation & Shell**:
    - Implement a shared `AtlassianNavigation` component for marketing.
    - Focus on the "Product Switcher" and "Search" styling even if they are static for now.

2. **Marketing Homepage implementation**:
    - Refactor `apps/marketing/app/[locale]/page.tsx`.
    - Use "Hero" with Blue primary CTA and Atlassian-style illustrations.
    - Implement [Grid Beta](https://atlassian.design/foundations/grid-beta/applying-angrid) for the layout.
    - Integrate Framer Motion inspired by Atlassian Motion specs.

3. **Auth Flow Remake**:
    - Refactor login/signup screens.
    - Use Atlassian "Center Content" login pattern.
    - Ensure typography follows strict Heading/Body tokens defined in Phase 1.

4. **Verify**:
    - Manual check: Nav responsiveness, illustration scaling, and motion accessibility (prefers-reduced-motion).
    - `pnpm turbo build` across apps.

### Acceptance criteria

- [ ] Top navigation matches Atlassian Marketing Navigation examples.
- [ ] Homepage uses official Atlassian-style illustrations and grid.
- [ ] Login page form matches Atlassian component standards.
- [ ] Motion is subtle, accessible, and premium.

### Files likely touched

- `apps/marketing/app/[locale]/page.tsx`
- `apps/client-dashboard/src/app/[locale]/login/page.tsx`
- `packages/ui/src/components/` (Navigation, Button)
