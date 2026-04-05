# IDEA: Admin Dashboard Redesign (v10 Match)

## Problem

The Admin Dashboard currently has a UI that doesn't perfectly match the Client Dashboard's premium style, colors, typography, and component density. Some layout elements are misplaced (e.g., side panel toggle, Super Admin badge), and the settings page is a flat list rather than a categorized multi-page experience.

## Vision

A high-fidelity, comprehensive redesign of the Admin Dashboard to achieve 100% parity with the Client Dashboard (V10). This includes a reorganized navigation system, a better header layout, a multi-page settings experience, and wide-format operational hub pages with advanced controls.

## Success Criteria

- [ ] UI matches Client Dashboard in style, colors, and typography.
- [ ] Header refined: side panel toggle moved, "Super Admin" removed, help icon added.
- [ ] Sidebar refined: avatar removed, help removed, sign out only in footer.
- [ ] Settings page is multi-page with a side menu.
- [ ] Operational Hub pages are wide with advanced controls.
- [ ] CRUD pages (Orgs, Users, Projects, Gates) have "Add" buttons at top right and "Edit/Remove" options.
- [ ] 100% English/Arabic coverage with perfect RTL support.
- [ ] Perfect light/dark mode color correctness.

## Constraints

- Use existing `@gate-access/ui` components where possible.
- Maintain consistency with ADS (Atlassian Design System) tokens.
- Do not break existing API integrations.

## Risks

- Breaking complex operational pages (Emulation/Seeding) during redesign.
- Missing specific dark mode tokens resulting in poor contrast.
- RTL layout issues in high-density tables.
