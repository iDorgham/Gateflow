# PLAN: Pro Dashboard Polish — UX/UI Unification

**Slug:** `dashboard_polish`
**App:** `client-dashboard`
**Status:** Ready

---

## Problem

The client dashboard is functional but lacks visual consistency and polish:
- Sidebar is a single flat list of 11 items under one "Operations" group — no hierarchy.
- Theme toggle clutters the header.
- Every page has its own custom filter pattern — no shared component.
- Page titles use inconsistent typography across pages.
- Spacing is uneven (some pages have p-4 padding, others p-8).
- The AI/Tasks/Chat side panel tabs are small and unstyled.
- No design token conventions for section spacing or page chrome.

## Goal

Elevate the dashboard to a professional, consistent product by:
1. Reorganizing the sidebar into logical sections.
2. Removing the theme toggle from the header.
3. Creating a unified `PageHeader` component used on every page.
4. Creating a unified `FilterBar` component replacing per-page filter implementations.
5. Refining the AI side panel shell and tab bar.

---

## Phases

### Phase 1 — Sidebar Groups + Remove Theme Toggle
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- **Sidebar grouping**: Split the single flat `MAIN_NAV` into 4 semantic groups:
  - **WORKSPACE** — Overview, Projects, Analytics
  - **RESIDENTS** — Contacts, Units
  - **ACCESS CONTROL** — QR Codes, Access Logs, Gates, Gate Assignments
  - **SECURITY** — Watchlist, Incidents
- **Group header style**: `text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 px-3.5 mb-1 mt-4 first:mt-0`
- **Collapsed state**: group headers hidden; dividers (1px separator) replace them.
- **Remove ThemeToggle** from `shell.tsx` header. Move theme toggle to `HeaderUserMenu` dropdown (add it as a menu item with label "Theme: Light/Dark").

**Files:**
- `components/dashboard/sidebar.tsx` — restructure `getNavGroups()`
- `components/dashboard/shell.tsx` — remove `<ThemeToggle />` import + usage
- `components/dashboard/header-user-menu.tsx` — add theme toggle item

**Acceptance criteria:**
- [ ] 4 nav groups visible when sidebar is expanded; dividers when collapsed.
- [ ] Theme toggle removed from header bar.
- [ ] Theme toggle accessible from user menu dropdown.
- [ ] `pnpm turbo lint` passes.

---

### Phase 2 — Unified `PageHeader` + Spacing System
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- **`PageHeader` component** (new: `components/dashboard/page-header.tsx`):
  ```tsx
  <PageHeader
    title="QR Codes"
    subtitle="Manage and track access passes."
    actions={<Button>Create QR</Button>}
    badge={<Badge>59</Badge>}
  />
  ```
  - Title: `text-xl font-black uppercase tracking-tight text-foreground`
  - Subtitle: `text-sm text-muted-foreground mt-0.5`
  - Actions slot: right-aligned on `sm:flex-row` layout
  - `badge` slot: count badge next to title
- **Apply to these pages** (replace each page's existing title/header):
  - `qrcodes/page.tsx`
  - `scans/page.tsx`
  - `gates/page.tsx`
  - `analytics/page.tsx`
  - `dashboard/team/watchlist/watchlist-client.tsx`
  - Settings pages (settings/projects, settings/residents, etc. — use their existing h1 but apply the same class tokens)
- **Spacing tokens**: All dashboard pages get `space-y-6` between sections (was inconsistent). Main content area in `shell.tsx` stays `p-4 md:p-8`.

**Files:**
- `components/dashboard/page-header.tsx` (new)
- `app/[locale]/dashboard/qrcodes/page.tsx`
- `app/[locale]/dashboard/scans/page.tsx`
- `app/[locale]/dashboard/gates/page.tsx`
- `app/[locale]/dashboard/analytics/page.tsx`

**Acceptance criteria:**
- [ ] `PageHeader` renders title + subtitle + actions consistently.
- [ ] Applied to at least 4 major pages.
- [ ] Title style is identical across all applied pages.
- [ ] `pnpm turbo lint` passes.

---

### Phase 3 — Unified `FilterBar` Component
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- **`FilterBar` component** (new: `components/dashboard/filter-bar.tsx`):
  - A composable horizontal strip: `<FilterBar>` wrapper + slot children.
  - **`FilterBar.DatePresets`** — pill buttons for 7d / 30d / Custom (with CalendarDays icon, same style as analytics).
  - **`FilterBar.Select`** — icon-prefixed `NativeSelect` (h-9, rounded-xl, icon slot prop).
  - **`FilterBar.Search`** — Search-icon-prefixed `Input` (h-9, rounded-xl).
  - **`FilterBar.StatusPills`** — horizontal pills for status filtering (Active/Inactive/All or custom).
  - Container: `rounded-2xl border border-border bg-card px-4 py-3 flex flex-wrap items-center gap-2`.
- **Apply to:**
  - `QRCodesFilters` → replace with `FilterBar` primitives
  - Scans page filter area → replace with `FilterBar`
  - Contacts page (residents) → replace with `FilterBar`
  - Units page (residents) → replace with `FilterBar`
- **Deprecate/remove** per-page filter components (or make them use `FilterBar` internally).

**Files:**
- `components/dashboard/filter-bar.tsx` (new)
- `components/dashboard/qrcodes/QRCodesFilters.tsx` — refactor to use FilterBar
- `app/[locale]/dashboard/scans/page.tsx` — integrate FilterBar
- `app/[locale]/dashboard/residents/contacts/page.tsx` — integrate FilterBar
- `app/[locale]/dashboard/residents/units/page.tsx` — integrate FilterBar

**Acceptance criteria:**
- [ ] `FilterBar` renders consistent height, rounded, and icon-prefixed controls.
- [ ] Date presets match analytics pill style.
- [ ] Applied to at least QR Codes and Scans pages.
- [ ] `pnpm turbo lint` passes.

---

### Phase 4 — AI Panel + Side Panel Tab Refinement
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- **Side panel tab bar** (`side-panel.tsx`):
  - Increase tab height: `h-10 p-1`.
  - Tab labels: keep icons, show labels always (not just on hover).
  - Active tab: `bg-primary/10 text-primary` pill with primary underline indicator.
  - Panel header: add a title row above tabs showing which panel is active ("GateFlow AI / Team Tasks / Team Chat").
- **AI assistant** (`ai-assistant.tsx`):
  - Remove duplicate close-button header (close is in side panel, not in assistant).
  - Better welcome card: gradient background, larger Sparkles icon, description text.
  - Message list: increase `space-y-5`, better avatar sizing (h-8 w-8).
  - Input area: taller textarea (`min-height: 48px`), `rounded-2xl`, send button `h-11 w-11`.
- **Tasks panel** (`tasks-panel.tsx`):
  - Align header typography with `PageHeader` style.
  - Task rows: `min-h-[48px]` for touch-friendly targets.
- **Chat panel** (`team-chat.tsx`):
  - Consistent avatar sizing with AI panel (h-8 w-8 avatars).
  - Timestamp style: `text-[10px] text-muted-foreground/50`.

**Files:**
- `components/dashboard/side-panel.tsx`
- `components/dashboard/ai-assistant.tsx`
- `components/dashboard/tasks-panel.tsx`
- `components/dashboard/team-chat.tsx`

**Acceptance criteria:**
- [ ] Side panel tabs are visually distinct and clearly readable.
- [ ] AI welcome card looks premium.
- [ ] No duplicate close buttons.
- [ ] Typecheck and lint pass.

---

## Key Design Tokens to Use

From `packages/ui/src/tokens.ts`:
- `rounded-2xl` for cards and panels
- `bg-muted/20` for subtle section backgrounds
- `border-border/50` for dividers
- `text-[10px] font-black uppercase tracking-widest` for section/group labels
- `text-xl font-black uppercase tracking-tight` for page titles
- `space-y-6` for section gaps
- `h-9 rounded-xl` for filter controls
- `px-4 py-3` for filter bar internal padding

## References
- Sidebar: `components/dashboard/sidebar.tsx`
- Shell: `components/dashboard/shell.tsx`
- Header user menu: `components/dashboard/header-user-menu.tsx`
- Analytics FilterBar (reference): `components/dashboard/analytics/AnalyticsFilterBar.tsx`
- Design tokens: `packages/ui/src/tokens.ts`
