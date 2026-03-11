# Phase 3: Unified FilterBar Component

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Refs**:
  - `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsFilterBar.tsx` — reference (pill date presets, icon selects)
  - `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesFilters.tsx` (or `ScansFilters.tsx`) — current per-page filter
  - `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx` — scan filter usage

## Goal
Extract common filter UI patterns into a shared `FilterBar` component and apply it to the main data pages.

## Scope (in)
- **New component** `apps/client-dashboard/src/components/dashboard/filter-bar.tsx`:
  - `FilterBar` — container: `rounded-2xl border border-border bg-card px-4 py-3 flex flex-wrap items-center gap-2`
  - `FilterBar.DatePresets` — pill group: `<div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1">` with 7d/30d/Custom buttons (same style as AnalyticsFilterBar)
  - `FilterBar.Select` — icon-prefixed select: `<div className="relative">` + icon `absolute left-2.5` + `NativeSelect` h-9 w-auto rounded-xl pl-8 text-xs
  - `FilterBar.Search` — icon-prefixed input: `<div className="relative ml-auto">` + Search icon + `Input` h-9 rounded-xl pl-9 text-xs
  - `FilterBar.Divider` — `<div className="h-6 w-px bg-border/50 hidden sm:block" />`
- **Apply to:**
  - QR Codes page: replace `QRCodesFilters` usage with `FilterBar` primitives
  - Scans page: replace existing filter section with `FilterBar`
- Keep existing analytics `AnalyticsFilterBar` as-is (already matches the new standard).

## Steps (ordered)
1. Create `apps/client-dashboard/src/components/dashboard/filter-bar.tsx` with the 4 sub-components above.
2. Read `QRCodesFilters.tsx` or wherever QR filters are defined. Replace with `FilterBar` composition.
3. Read `scans/page.tsx` filter section. Replace with `FilterBar` composition.
4. Export `FilterBar` from the component (and optionally from a barrel).
5. Run `pnpm turbo lint --filter=client-dashboard`.
6. Commit: `feat(ui): unified FilterBar component applied to QR codes and scans (phase 3)`.

## Acceptance criteria
- [ ] `FilterBar` container renders with `rounded-2xl border bg-card` style.
- [ ] `DatePresets` uses same pill style as analytics.
- [ ] `Select` and `Search` have icon prefixes and h-9 height.
- [ ] Applied to QR Codes and Scans pages.
- [ ] `pnpm turbo lint` passes.
