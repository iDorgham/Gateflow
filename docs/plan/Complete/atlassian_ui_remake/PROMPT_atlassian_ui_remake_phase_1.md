# Pro Prompt — atlassian_ui_remake — Phase 1

## Phase 1: Foundation — Design Tokens & Theme Engine

### Primary role

FRONTEND

### Preferred tool

- [x] Cursor (default)
- [x] browser_subagent (for token reference)

### Context

- **Project**: GateFlow — Zero-Zero digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000)
- **Packages**: db, types, ui, api-client, i18n, config
- **Refs**: `CLAUDE.md`, `packages/ui/src/tokens.ts`, `apps/*/src/app/globals.css`
- **Design Inspiration**: [Atlassian Design System](https://atlassian.design/) (Foundations).

### Goal

Establish the Atlassian visual foundation by correctly implementing Design Tokens, Spacing, Typography, and the Grid system across the monorepo. Use official `--ds-` prefixed tokens where possible for color, surface, and elevation.

### Scope (in)

- **Colors & Tokens**: Implement [Atlassian Tokens](https://atlassian.design/foundations/tokens). Map `--ds-background-default`, `--ds-text`, `--ds-border`, etc., to CSS variables.
- **Spacing**: Implement [8px spacing guide](https://atlassian.design/foundations/spacing) (`space.100` = 8px).
- **Grid**: Implement [Grid Beta](https://atlassian.design/foundations/grid-beta/applying-angrid) breakpoints and gutters.
- **Typography**: [Atlassian Typography](https://atlassian.design/foundations/typography) (Font families and weights).
- **Tailwind Config**: Extend `tailwind.config.ts` to include Atlassian tokens.

### Scope (out)

- Component refactors (Sidebar, Tables, etc.) are for Phases 2-4.
- API/DB changes.

### Steps (ordered)

1. **Tokens Definition**:
   - Update `packages/ui/src/tokens.ts` (web portion) to export Atlassian semantic tokens.
   - Export `spacing` following the `space.*` naming convention.
   - Export `typography` tokens for Font Family, Size, and Weight.

2. **Global CSS Update**:
   - Overhaul `globals.css` in `client-dashboard`, `admin-dashboard`, and `marketing`.
   - Implement the Atlassian light/dark palette using CSS variables:
     ```css
     :root {
       --ds-background-default: #ffffff;
       --ds-text: #172b4d;
       --ds-border: #dfe1e6;
       /* ... all core tokens ... */
     }
     .dark {
       --ds-background-default: #091e42;
       --ds-text: #ebecf0;
       --ds-border: #253858;
       /* ... dark mode equivalents ... */
     }
     ```

3. **Tailwind Mapping**:
   - Ensure `tailwind.config.ts` maps these variables to utilities (e.g., `bg-ds-surface`, `text-ds-primary`).

4. **Grid & Layout Foundation**:
   - Define Atlassian breakpoints in Tailwind (600px, 768px, 992px, 1200px).
   - Set default Page Margins and Gutters as per Grid Beta.

5. **Aesthetical Verification**:
   - Run the apps and verify the "broken colors" are fixed by the new semantic mapping.
   - Check Light/Dark theme switching.

### Acceptance criteria

- [ ] `packages/ui/src/tokens.ts` reflects official Atlassian names and values.
- [ ] `globals.css` implements strict `--ds-` token mapping for both themes.
- [ ] Spacing scale (8px base) is available in Tailwind.
- [ ] Typography aligned with Atlassian Foundations.
- [ ] `pnpm turbo build` passes across the monorepo.

### Files likely touched

- `packages/ui/src/tokens.ts`
- `apps/client-dashboard/src/app/globals.css`
- `apps/admin-dashboard/src/app/globals.css`
- `apps/marketing/src/app/globals.css`
- `tailwind.config.ts`
