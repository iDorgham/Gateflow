# GateFlow UI/UX and Design Reference

Comprehensive cross-repo reference for UI/UX and design decisions.  
Use this as context for AI planning, feature design, refactors, and consistency checks.

## Coverage Status

- Design foundations and tokens: covered.
- UI architecture and component system: covered.
- UX patterns (dashboard, forms, tables, analytics, mobile): covered.
- Navigation and IA patterns: covered.
- Accessibility and RTL: covered.
- Implementation rules and anti-patterns: covered.

## 1) Design System Foundation

Primary sources of truth:

- `packages/ui/src/tokens.ts`
- `packages/ui/src/globals.css`
- `packages/ui/src/components/*`
- `docs/guides/UI_DESIGN_GUIDE.md`

### Core Principles

- Semantic tokens over raw colors.
- Shared primitives via `@gate-access/ui`, not app-local reinvention.
- Mobile-first responsive behavior with high-density desktop support.
- AR/EN + RTL parity as default requirement.
- Accessible interactions and contrast-safe text/background pairing.

## 2) Token Architecture

Token contracts are defined in `packages/ui/src/tokens.ts`.

### Color System

- Base semantic set: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.
- ADS semantic families (`ds` namespace):
  - `ds.background.*`
  - `ds.text.*`
  - `ds.border.*`
  - `ds.icon.*`
  - `ds.surface.*`
  - `ds.sidebar.*`

### Spacing / Typography / Radius

- Spacing scale includes `space-050` through `space-600`.
- Typography families and weights are tokenized.
- Radius uses compact defaults with semantic aliases (`xsmall`, `small`, `medium`, `large`, `circle`, `sm`, `lg`).

### Breakpoints

- Token breakpoints currently include: `xs`, `sm`, `md`, `lg`.
- Tailwind default breakpoints remain active in app styling patterns.

### Platform Parity

- Web consumes CSS-variable-backed tokens.
- Native consumes `nativeTokens` / `nativeTokensRealEstate`.

## 3) Light / Dark Theme System

Implemented in `packages/ui/src/globals.css`:

- `:root` defines light theme semantic variables.
- `.dark` defines dark theme semantic variables.
- Shared mapping to shadcn-compatible CSS vars (`--background`, `--foreground`, etc.).
- DS surface and shadow tokens define elevation behavior.

### Theme Characteristics

- Light mode emphasizes neutral, high-legibility surfaces.
- Dark mode uses deep-neutral backgrounds and brand-accent highlights.
- Borders and text subtlety are tuned for dense dashboard readability.

## 4) UI Component Architecture

`@gate-access/ui` is the reusable component runtime.

### Core Primitive Families

- Inputs and controls: button, input, textarea, select, checkbox, switch, radio-group, form.
- Structure: card, table, tabs, sheet, dialog, popover, tooltip, collapsible, scroll-area.
- Feedback/state: badge, skeleton, loading-spinner, empty-state, toast.
- Advanced/reusable: dynamic-table, pagination, date-picker, multi-select, command.

### App Shell and Shared Layout

- Side navigation and nav groups are standardized via UI package layout components.
- Common shells are implemented in apps using shared primitives + token classes.

## 5) Information Architecture and Navigation Patterns

### Dashboard IA Model

Common pattern across client/admin:

- Persistent sidebar with grouped modules.
- Main content zones for lists, detail, analytics, and settings.
- Secondary panel overlays or sheets for contextual actions.

### Marketing IA Model

- Top-level nav + mega menu.
- Content-led page hierarchy (solutions, resources, legal, blog, pricing).
- Conversion CTAs integrated at section and navigation levels.

### Resident/Scanner IA Model

- Resident portal uses shell + responsive nav modes.
- Scanner app uses tab-driven operational UX for field speed.

## 6) UX Patterns by Domain

### Data-Dense Dashboards

- KPI cards + chart rows + table drill-down.
- Clear filter bars and visible active filters.
- Export/report actions near analytics sections.

### CRUD and Configuration

- List + sheet/modal editing pattern.
- Inline status chips and deterministic action affordances.
- Guard rails for destructive actions (danger zones, confirmations).

### AI-Assisted Workflows

- Assistant side panels or dedicated AI pages.
- Renderers for charts, reports, schedules, confirmations.
- Human-in-the-loop approval patterns for sensitive actions.

### Mobile and Offline

- Scanner UX optimized for one-hand, low-latency flows.
- Queue visibility and sync-state transparency.
- Minimal interaction depth in mission-critical actions.

## 7) RTL and Internationalization Design

### Requirements

- All user-visible content supports EN/AR localization.
- Directional UI must respect locale direction.

### UI Behavior

- Prefer logical alignment and spacing (`start`/`end` semantics).
- Directional icons (chevrons/arrows) should mirror correctly.
- Navigation, tables, and form affordances must be tested in RTL mode.

## 8) Accessibility Standards

Baseline expectations:

- WCAG AA contrast compliance for text/surface pairs.
- Keyboard-accessible interactive components.
- Visible focus states via semantic border/ring tokens.
- Meaningful labels and semantic heading hierarchy.
- Touch target sizing appropriate for mobile controls.

## 9) Cross-App Visual Consistency Rules

- Use `@gate-access/ui` first; extend before creating app-local primitives.
- Reuse token classes (`bg-*`, `text-*`, `border-*`) instead of hardcoded color values.
- Keep spacing on the token scale; avoid arbitrary one-off spacing values.
- Maintain consistent card radius, border treatment, and elevation semantics.

## 10) Implementation Rules for Designers and AI

### Do

- Use semantic tokens.
- Keep components composable and purpose-specific.
- Preserve existing navigation group logic when expanding menus.
- Validate designs in both light/dark and EN/AR modes.

### Avoid

- Hardcoded hex/rgb color values in app code.
- Duplicated primitives when UI package already has a matching component.
- Mixed visual language across dashboards for similar features.
- RTL regressions caused by left/right hardcoding.

## 11) Design-Related API and Data Touchpoints

Design/content/theming functionality intersects with backend via:

- Style/branding APIs in admin dashboard (`organizations/[orgId]/style/*`, `branding/[orgId]`).
- CMS APIs (`cms/pages*`, `cms/generate-*`, blog generation).

Relevant schema domains:

- `OrganizationBranding`
- `StyleSnapshot`
- `ThemeVariable`
- `LandingPage`
- `LandingPageSection`
- `BlogPost`
- `BlogCategory`
- `AiGeneratedAsset`

## 12) File Map for Deep Design Work

- Design guide: `docs/guides/UI_DESIGN_GUIDE.md`
- Tokens: `packages/ui/src/tokens.ts`
- Theme variables: `packages/ui/src/globals.css`
- Shared components: `packages/ui/src/components/*`
- Client navigation: `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- Admin navigation: `apps/admin-dashboard/src/components/Sidebar.tsx`
- Marketing navigation: `apps/marketing/components/nav.tsx`

## 13) Planning Notes for AI Tools

- Treat this file as the UX/design baseline contract.
- Pair this with app-specific references for route/API/function detail.
- When proposing UI changes, always include:
  - affected component families,
  - token usage implications,
  - RTL/accessibility checks,
  - light/dark validation expectations.
