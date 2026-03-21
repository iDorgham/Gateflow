# Pro Prompt: Atlassian Remake — Phase 3 (Dashboard Shell)

## Phase 3: Dashboard Shell — Navigation & Layout

### Primary role

FRONTEND

### Preferred tool

- [x] Cursor (default)
- [x] browser_subagent (for navigation examples)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform
- **Apps**: client-dashboard (3001), admin-dashboard (3002)
- **Design Inspiration**: [Side Navigation](https://atlassian.design/components/side-navigation/examples), [Avatar](https://atlassian.design/components/avatar/examples), [Breadcrumbs](https://atlassian.design/components/breadcrumbs/examples).
- **Previous Phase**: Phase 1 (Tokens), Phase 2 (Public Realm).

### Goal

Refactor the core layout (Sidebar, Header, Shell) of both dashboards to follow strict Atlassian navigation patterns, including official side navigation ergonomics and avatar positioning.

### Scope (in)

- **Side Navigation**: Implement [Atlassian Side Navigation](https://atlassian.design/components/side-navigation/examples). Include "Header", "Nesting", and "Footer" sections.
- **Avatar**: Integrate [Atlassian Avatars](https://atlassian.design/components/avatar/examples) in the header and sidebar footer.
- **Breadcrumbs**: Implement official [Breadcrumbs](https://atlassian.design/components/breadcrumbs/examples) in the dashboard header.
- **PageHeader**: A premium PageHeader component with Title, Breadcrumbs, and Actions.
- **Grid Layout**: Use [Grid Beta](https://atlassian.design/foundations/grid-beta/applying-angrid) for the shell container.

### Scope (out)

- Feature specific modules (Phase 4).
- Marketing site changes (Phase 2 complete).

### Steps (ordered)

1. **Side Navigation implementation**:
    - Update the sidebar component in both apps to use the Atlassian structure:
        - Top: Logo/App Switcher.
        - Middle: Scrollable nav groups (nested if necessary).
        - Bottom: User/Settings/Help.
    - Use Atlassian Neutral tokens for background and Blue for active accents.

2. **Avatar Integration**:
    - Replace existing user icons with the Atlassian Avatar pattern (Round, specific sizes like 24px and 32px).

3. **Breadcrumbs & Header**:
    - Implement a dynamic breadcrumb system that matches the Atlassian styling (subtle separators, truncated long paths).
    - Refine the Dashboard Header to be fixed with a subtle shadow/border (mapped to PageHeader tokens).

4. **Verify**:
    - Manual check: Sidebar collapse behavior, avatar rendering, breadcrumb navigation.
    - `pnpm turbo build` across apps.

### Acceptance criteria

- [ ] Sidebar follows Atlassian "Side Navigation" patterns 1:1.
- [ ] Avatars are correctly sized and styled.
- [ ] Breadcrumbs are functional and styled per Atlassian specs.
- [ ] Layout is responsive across all Grid Beta breakpoints.

### Files likely touched

- `apps/*/src/components/dashboard/layout/`
- `packages/ui/src/components/` (Avatar, Breadcrumbs, Sidebar)
