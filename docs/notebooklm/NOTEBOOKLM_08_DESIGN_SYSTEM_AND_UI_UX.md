# NOTEBOOKLM SOURCE 8: GateFlow Design System, UI/UX & Visual Architecture

## 1. Design System Foundation (Impeccable Revamp)

GateFlow's design system is built around a **3-tier token architecture**, **OKLCH Satin-Charcoal dark mode**, **calibrated enterprise corner radii**, and **MENA-first bilingual support** (Arabic RTL + English LTR).

### Core Principles

- **3-Tier Token Hierarchy**: Foundations -> Semantic (`ds` namespace) -> Component Tokens.
- **Calibrated Enterprise Radii**: Crisp scale (`4px` to `16px`), eliminating bubbly radii.
- **OKLCH Dark Mode Layers**: Multi-layered background elevation (`--ds-layer-01` to `--ds-layer-04`) with Porcelain light mode and procedural rim-light edge-glow shaders.
- **Switchable Accent Profiles**: Kimchi (default brand), Cobalt, and Emerald with automated 19/19 WCAG 2.2 AA contrast checks.
- **Shared Primitives**: Centralized in `@gate-access/ui`, eliminating app-local reinvention.
- **Density Control**: Compact 36px control height for operational dashboards (`client-dashboard`, `admin-dashboard`) and Comfortable 48px for public interfaces (`marketing`, `resident-portal`).
- **AI Design Infrastructure**: Root `DESIGN.md`, `llms.txt`, prompt writing guide, and Vibe-Check AI code sanitizer sandbox.

### Source-of-Truth Files

- `packages/ui/src/tokens.ts` — token contracts & `nativeTokens`
- `packages/theme/src/globals.css` — 3-tier OKLCH CSS variables & theme layers
- `packages/ui/src/components/**/*` — shared primitives
- `DESIGN.md` — canonical root design specification

---

## 2. Token Architecture & Calibration

### 2.1 Color System & OKLCH Layers

- Base semantic set: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.
- Atlassian Design System (ADS) semantic families (`ds` namespace):
  - `ds.background.*` (`--ds-background-default`, `--ds-layer-01` to `--ds-layer-04`)
  - `ds.text.*` (`--ds-text-primary`, `--ds-text-subtle`, `--ds-text-brand`)
  - `ds.border.*` (`--ds-border-subtle`, `--ds-border-brand`)
  - `ds.surface.*`
  - `ds.sidebar.*`

### 2.2 Enterprise Radii Scale

- `radius-xs`: `4px` (Tags, micro-badges)
- `radius-sm`: `6px` (Inputs, buttons, dropdown items)
- `radius-md`: `8px` (Cards, dialogs, popovers)
- `radius-lg`: `12px` (Modal shells, drawer containers)
- `radius-xl`: `16px` (Hero panels, feature cards)

---

## 3. Light / Dark Theme System & Accents

Implemented in `@gateflow/theme` (`packages/theme`):

- **Porcelain Light Mode**: Neutral, crisp background with high contrast text.
- **Satin-Charcoal Dark Mode**: OKLCH multi-depth layers (`#111112`, `#161719`, `#1c1d20`) reducing ocular fatigue during night guard shifts.
- **Switchable Accent Profiles**:
  - `kimchi`: Signature warm coral brand accent.
  - `cobalt`: Enterprise blue operational profile.
  - `emerald`: Eco/sustainability green profile.
- **Theme Persistence**: Hydration-safe `ThemeProvider` with synchronous `gateflow-theme` cookie sync.

---

## 4. Shared UI Component Architecture

`@gate-access/ui` is the reusable component runtime.

### Core Primitive Families

| Family    | Components                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Inputs    | button (FAB variant, spinner), input, textarea, select, checkbox, switch, radio-group, formfield (ARIA) |
| Structure | card (interactive/selectable/metric), table, tabs, sheet, dialog, popover, tooltip, scroll-area         |
| Feedback  | badge (5 variants, 7 tones, pulsing dot), skeleton, loading-spinner, empty-state, toast                 |
| Advanced  | dynamic-table (mobile card transform), pagination, date-picker, multi-select, command                   |
| Layout    | bottom-sheet (mobile drawer), breadcrumbs, page-header, side-navigation, page-container                 |
| Auth      | login-shell, squares-background                                                                         |

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
