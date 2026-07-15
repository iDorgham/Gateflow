# GateFlow Design System Reference

This document captures the current state of the GateFlow design system and what has already been implemented, so it can be used as planning context in AI tools.

## Coverage Status

- Design foundation and token architecture: covered.
- Shared component library: covered.
- Navigation/shell design patterns across apps: covered.
- API linkage: covered where DS intersects style/CMS endpoints.
- DB linkage: covered at model family level.
- Per-component prop/function internals: summarized, not exhaustively documented one-by-one.

## Scope and Current Reality

- Primary implementation lives in `packages/ui`.
- Token foundations live in `packages/ui/src/tokens.ts` and `packages/ui/src/globals.css`.
- A standalone `apps/design-system` workspace exists, but currently contains build artifacts only (`.next`, `.turbo`, `node_modules`, `public`) and no active source documentation/code.
- Practical design-system usage is distributed across app shells (`apps/client-dashboard`, `apps/admin-dashboard`, `apps/marketing`) using shared UI primitives and token contracts.

## What Has Been Completed

### Foundation

- ADS-aligned semantic token model is implemented (background, text, border, icon, surface families).
- Shared spacing, typography, border radius, and screen breakpoint tokens are in place.
- RTL/LTR support patterns are implemented and used across app navigation and layout components.
- Dark mode support is integrated via tokenized CSS variable approach.

### Shared Component Layer (`@gate-access/ui`)

- Centralized export surface exists in `packages/ui/src/index.ts`.
- Current exported component families include:
  - `ui`: button, input, card, badge, table, dialog, label, checkbox, select, dropdown-menu, avatar, avatar-tag, separator, skeleton, switch, radio-group, popover, command, multi-select, icon, loading-spinner, empty-state, toast, textarea, tabs, sheet, scroll-area, collapsible, form, tooltip, dynamic-table, pagination, date-picker.
  - `auth`: login-shell, squares-background.
  - `layout`: breadcrumbs, page-header, side-navigation, page-container.
  - `shared/panels/tables`: atlassian-navigation, maintenance-status-badge, `EditPanel`, `AdvancedTable`.
- Utility contract is standardized with `cn` in `packages/ui/src/lib/utils`.

### Multi-Platform Token Strategy

- Web tokens are exposed as CSS variable references through `tokens`.
- React Native-compatible token maps are shipped via `nativeTokens` and `nativeTokensRealEstate`.
- Design token contract already includes semantic and density-ready primitives for dashboards.

## Design System Architecture

## 1) Package Boundaries

- `@gate-access/ui` is the design-system runtime package.
- `@gate-access/types` supplies shared type contracts used by DS-backed UI.
- App-level components compose DS primitives instead of rebuilding base controls.

## 2) Token Model

- Core groups:
  - Color (base + semantic + ADS semantic aliases).
  - Spacing (`space-050` ... `space-600`).
  - Typography (families + weights).
  - Radius (`xsmall`...`circle`, `sm`, `lg`, `full`).
  - Responsive screens (`xs`, `sm`, `md`, `lg`).

## 3) Consumption Model

- Tailwind themes consume tokenized values.
- Apps use shared DS components and utility classes.
- Navigation and shell components in client/admin/marketing consume DS tokens heavily.

## DB Models Related to Design/Theming/CMS

Design-system-adjacent schema domains (source: `packages/db/prisma/schema.prisma`):

- Theming/branding:
  - `OrganizationBranding`
  - `StyleSnapshot`
  - `ThemeVariable`
- CMS/content:
  - `LandingPage`
  - `LandingPageSection`
  - `BlogPost`
  - `BlogCategory`
- AI-generated design/content assets:
  - `AiGeneratedAsset`
  - `AiActionLog` (for generation history/workflow linkage)

## Menu / Navigation Components Already Built

- Client dashboard structured side navigation and grouped modules in:
  - `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
  - `apps/client-dashboard/src/lib/navigation-builder.ts`
- Admin grouped side navigation in:
  - `apps/admin-dashboard/src/components/Sidebar.tsx`
- Marketing top navigation and mega menu in:
  - `apps/marketing/components/nav.tsx`

## APIs Related to Design System

Design system itself is package-based and does not expose direct route handlers. DS-driven workflows are surfaced through app APIs, especially style/theming/content APIs in admin:

- `apps/admin-dashboard/src/app/api/organizations/[orgId]/style/ai-edit/route.ts`
- `apps/admin-dashboard/src/app/api/organizations/[orgId]/style/save/route.ts`
- `apps/admin-dashboard/src/app/api/branding/[orgId]/route.ts`
- `apps/admin-dashboard/src/app/api/cms/*` routes (design/content composition support)

## Known Gaps / Context for Future Planning

- `apps/design-system` is not currently an actively developed source app; planning should treat `packages/ui` as the source of truth.
- Design documentation is present but fragmented across app README files and implementation-level files; this file is now the consolidation anchor.
- Any future DS app revival should define:
  - canonical visual catalog/storybook strategy,
  - token governance workflow,
  - visual regression baseline.

## Canonical Source Files for AI Planning

- `packages/ui/src/index.ts`
- `packages/ui/src/tokens.ts`
- `packages/ui/src/globals.css`
- `packages/ui/src/components/**/*`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/lib/navigation-builder.ts`
- `apps/admin-dashboard/src/components/Sidebar.tsx`
- `apps/marketing/components/nav.tsx`
- `CHANGELOG.md` (historical completion context)
