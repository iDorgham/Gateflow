# NOTEBOOKLM SOURCE 8: GateFlow Design System, UI/UX & Visual Architecture

## 1. Design System Foundation

GateFlow's design system is built around **semantic tokens**, **shared primitives**, and **MENA-first bilingual support** (Arabic RTL + English LTR).

### Core Principles

- Semantic tokens over raw colors.
- Shared primitives via `@gate-access/ui`, not app-local reinvention.
- Mobile-first responsive behavior with high-density desktop support.
- AR/EN + RTL parity as a default requirement.
- Accessible interactions and contrast-safe text/background pairing.

### Source-of-Truth Files

- `packages/ui/src/tokens.ts` — token contracts
- `packages/ui/src/globals.css` — theme variables
- `packages/ui/src/components/**/*` — shared primitives
- `docs/guides/UI_DESIGN_GUIDE.md` — design guide

---

## 2. Token Architecture

### Color System

- Base semantic set: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.
- Atlassian Design System (ADS) semantic families (`ds` namespace):
  - `ds.background.*`
  - `ds.text.*`
  - `ds.border.*`
  - `ds.icon.*`
  - `ds.surface.*`
  - `ds.sidebar.*`

### Spacing / Typography / Radius

- Spacing scale: `space-050` through `space-600`.
- Typography: tokenized families and weights.
- Radius: `xsmall`, `small`, `medium`, `large`, `circle`, plus shadcn aliases `sm`, `lg`, `full`.

### Breakpoints

- Token breakpoints: `xs`, `sm`, `md`, `lg`.
- Tailwind default breakpoints remain active.

### Platform Parity

- Web consumes CSS-variable-backed tokens.
- React Native consumes `nativeTokens` / `nativeTokensRealEstate`.

---

## 3. Light / Dark Theme System

Implemented in `packages/ui/src/globals.css`:

- `:root` defines light theme semantic variables.
- `.dark` defines dark theme semantic variables.
- Shared mapping to shadcn-compatible CSS vars (`--background`, `--foreground`, etc.).
- DS surface and shadow tokens define elevation behavior.

### Theme Characteristics

- Light mode: neutral, high-legibility surfaces.
- Dark mode: deep-neutral backgrounds and brand-accent highlights.
- Borders and text subtlety tuned for dense dashboard readability.

---

## 4. Shared UI Component Architecture

`@gate-access/ui` is the reusable component runtime.

### Core Primitive Families

| Family    | Components                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Inputs    | button, input, textarea, select, checkbox, switch, radio-group, form         |
| Structure | card, table, tabs, sheet, dialog, popover, tooltip, collapsible, scroll-area |
| Feedback  | badge, skeleton, loading-spinner, empty-state, toast                         |
| Advanced  | dynamic-table, pagination, date-picker, multi-select, command                |
| Layout    | breadcrumbs, page-header, side-navigation, page-container                    |
| Auth      | login-shell, squares-background                                              |

### Utility Contract

- `cn()` utility centralized in `packages/ui/src/lib/utils`.
- Apps should import `cn` from `@gate-access/ui` instead of duplicating it locally.

---

## 5. Information Architecture & Navigation Patterns

### Dashboard IA (Client / Admin)

- Persistent sidebar with grouped modules.
- Main content zones for lists, detail, analytics, and settings.
- Secondary panel overlays or sheets for contextual actions.

### Marketing IA

- Top-level nav + mega menu.
- Content-led hierarchy: solutions, resources, legal, blog, pricing.
- Conversion CTAs integrated at section and navigation levels.

### Resident / Scanner IA

- Resident portal: shell + responsive nav modes (sidebar on desktop, bottom nav on mobile).
- Scanner app: tab-driven operational UX for field speed.

---

## 6. UX Patterns by Domain

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

---

## 7. RTL and Internationalization Design

### Requirements

- All user-visible content supports EN/AR localization.
- Directional UI must respect locale direction.

### Implementation Rules

- Prefer logical alignment and spacing (`start`/`end` semantics).
- Directional icons (chevrons/arrows) should mirror correctly.
- Navigation, tables, and form affordances must be tested in RTL mode.

---

## 8. Accessibility Standards

Baseline expectations:

- WCAG 2.2 AA contrast compliance for text/surface pairs.
- Keyboard-accessible interactive components.
- Visible focus states via semantic border/ring tokens.
- Meaningful labels and semantic heading hierarchy.
- Touch target sizing appropriate for mobile controls.

---

## 9. Cross-App Visual Consistency Rules

- Use `@gate-access/ui` first; extend before creating app-local primitives.
- Reuse token classes (`bg-*`, `text-*`, `border-*`) instead of hardcoded color values.
- Keep spacing on the token scale; avoid arbitrary one-off spacing values.
- Maintain consistent card radius, border treatment, and elevation semantics.

---

## 10. Design-Related Data Touchpoints

Design/content/theming functionality intersects with backend via:

- Style/branding APIs in admin dashboard: `organizations/[orgId]/style/*`, `branding/[orgId]`.
- CMS APIs: `cms/pages*`, `cms/generate-*`, blog generation.

Relevant schema domains:

- `OrganizationBranding`
- `StyleSnapshot`
- `ThemeVariable`
- `LandingPage`
- `LandingPageSection`
- `BlogPost`
- `BlogCategory`
- `AiGeneratedAsset`

---

## 11. Design System Gaps & Future Work

- `apps/design-system` is not currently an actively developed source app; `packages/ui` is the source of truth.
- Design documentation is fragmented across app READMEs and implementation files.
- Future DS app revival should define: canonical visual catalog/storybook strategy, token governance workflow, and visual regression baseline.
