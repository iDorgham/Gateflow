# Phase 1: Shell Upgrade + Admin Side Panel

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/layout.tsx` — current simple layout
  - `apps/admin-dashboard/src/components/Sidebar.tsx` — existing sidebar (good, keep as-is)
  - `apps/client-dashboard/src/components/dashboard/shell.tsx` — reference for shell pattern
  - `apps/client-dashboard/src/components/dashboard/side-panel.tsx` — reference for side panel
  - `apps/client-dashboard/src/components/dashboard/page-header.tsx` — PageHeader component to copy
  - `@gate-access/ui` — Tabs, TabsList, TabsTrigger, TabsContent, Button, cn

## Goal
Upgrade the admin-dashboard layout to include a collapsible right-side AI panel (matching client-dashboard UX), a polished header, and `PageHeader` component applied to the overview page. The panel tabs are: AI / Logs / Chat (stubs now, wired in Phase 5).

## Scope (in)
- **`AdminShell` component** (`src/components/admin-shell.tsx`):
  - Three-column flex layout: `Sidebar | main content | AdminSidePanel`
  - Toggle button on the right edge of main content area to open/close panel
  - Passes `isOpen` + `onToggle` to `AdminSidePanel`
  - Dark background `bg-background`, full viewport height
- **`AdminSidePanel` component** (`src/components/admin-side-panel.tsx`):
  - Collapsible: `w-[380px]` open, `w-0` closed (transition-all 300ms)
  - `border-l border-border bg-sidebar`
  - Tab bar: AI | Logs | Chat using `Tabs` from `@gate-access/ui`
  - Each tab content: stub `<div>` with centered placeholder text for now
  - Close button (X) in top-right of tab bar, calls `onToggle`
  - Collapse toggle button on left edge (same pattern as client-dashboard's ChevronRight button)
- **`layout.tsx` update**:
  - Replace raw `<div className="flex h-[105.3vh]...">` with `<AdminShell>` wrapper
  - Move `ThemeToggle`, `LanguageSwitcher`, `Badge`, `Avatar` into `AdminShell`'s header slot
  - Fix the `h-[105.3vh]` to `h-screen`
- **`PageHeader` component** (`src/components/page-header.tsx`):
  - Copy from `apps/client-dashboard/src/components/dashboard/page-header.tsx` (same interface: title, subtitle, badge, actions)
  - Title: `text-xl font-black uppercase tracking-tight text-foreground`
- **Apply `PageHeader` to overview page** (`src/app/[locale]/(dashboard)/page.tsx`):
  - Replace the existing `<h1>` + `<p>` header with `<PageHeader title={...} subtitle={...} />`
- **`src/components/index.ts`**: export new components

## Steps (ordered)
1. Create `src/components/page-header.tsx` — copy/adapt from client-dashboard.
2. Create `src/components/admin-side-panel.tsx`:
   ```tsx
   'use client';
   import { cn, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '@gate-access/ui';
   import { Sparkles, ScrollText, MessageSquare, X, ChevronRight } from 'lucide-react';
   // AdminSidePanel: isOpen, onToggle props
   // Tab bar h-10, tabs px-4
   // 3 stub content areas
   ```
3. Create `src/components/admin-shell.tsx`:
   - `'use client'` — needs useState for `isPanelOpen`
   - Accepts `locale`, `children` as props
   - Renders: `<Sidebar />` | `<main>` | `<AdminSidePanel>`
   - Header bar inside main area (ThemeToggle, LanguageSwitcher, Badge, Avatar)
   - Panel toggle button on right edge of main using `ChevronRight`/`ChevronLeft`
4. Update `src/app/[locale]/(dashboard)/layout.tsx`:
   - Import `AdminShell`
   - Replace existing flex div + header with `<AdminShell locale={params.locale}>` wrapping `{children}`
   - Move header elements into shell
5. Update `src/app/[locale]/(dashboard)/page.tsx`:
   - Import `PageHeader` from `@/components/page-header`
   - Replace existing h1 + p with `<PageHeader title={t('overview.title')} subtitle={t('overview.subtitle')} />`
6. Update `src/components/index.ts` to export new components.
7. Run `pnpm turbo lint --filter=admin-dashboard`.
8. Run `pnpm turbo typecheck --filter=admin-dashboard` (add `typecheck` script to `package.json` if missing: `"typecheck": "tsc --noEmit"`).
9. Commit: `feat(admin): shell upgrade — AdminShell + AdminSidePanel + PageHeader (phase 1)`.

## Scope (out)
- AI logic in the panel (Phase 5)
- Chart components (Phase 2)
- Finance or monitoring pages

## Acceptance criteria
- [ ] `AdminShell` wraps the layout; all dashboard pages load without regression.
- [ ] `AdminSidePanel` opens/closes with smooth transition; X button works.
- [ ] `h-screen` replaces `h-[105.3vh]`.
- [ ] `PageHeader` applied to overview page with correct title + subtitle.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): shell upgrade — AdminShell + AdminSidePanel + PageHeader (phase 1)
```
