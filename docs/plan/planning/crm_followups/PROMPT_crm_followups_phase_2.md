# Phase 2: QR Codes Table — Density Toggle & Preferences API (#39)

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui, api-client
- **Rules**: Match the Residents table UX pattern; keep localStorage only as a migration fallback.
- **Refs**:
  - `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx` — current table (441 lines, localStorage column key `'client-dashboard.qrcodes.columns'`)
  - `apps/client-dashboard/src/lib/residents/use-user-preferences.ts` — preferences hook
  - `apps/client-dashboard/src/lib/residents/table-views.ts` — `TableViewState` type + preset helpers
  - `apps/client-dashboard/src/app/api/users/me/preferences/route.ts` — PATCH schema (currently only `tableViews.contacts` and `tableViews.units`)

## Goal
Add a density toggle to the QRCodesTable toolbar and migrate column order/visibility persistence from `localStorage` to the API-backed user preferences system.

## Scope (in)
- **Density toggle:** 3-mode button group (Compact / Default / Comfortable) in the QRCodesTable toolbar. Stored in `User.preferences.tableViews.qrcodes.density`.
- **Column persistence migration:** Read initial column order from `User.preferences.tableViews.qrcodes.columnOrder` (falling back to localStorage, then defaults). Write changes to the preferences API instead of localStorage.
- **Preferences route extension:** Add `tableViews.qrcodes` to `PatchPreferencesSchema` in the preferences route.

## Scope (out)
- Named preset views for QR Codes (nice-to-have, not in acceptance criteria).
- Full `TableCustomizerModal` (column visibility is bonus — density + column order are the must-haves).

## Steps (ordered)
1. Open `apps/client-dashboard/src/app/api/users/me/preferences/route.ts`. Extend `PatchPreferencesSchema` to include:
   ```ts
   tableViews: z.object({
     contacts: ...,
     units: ...,
     qrcodes: z.object({
       columnOrder: z.array(z.string()).optional(),
       columnVisibility: z.record(z.boolean()).optional(),
       density: z.enum(['compact', 'default', 'comfortable']).optional(),
     }).optional(),
   }).optional(),
   ```
2. Open `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`. Read the full file to understand the current state shape.
3. Add the `useUserPreferences` hook at the top of `QRCodesTable`:
   ```ts
   import { useUserPreferences } from '@/lib/residents/use-user-preferences';
   const { preferences, updatePreferences } = useUserPreferences();
   ```
4. **Density state:** Add `density` state initialized from `preferences?.tableViews?.qrcodes?.density ?? 'default'`. When changed, call `updatePreferences({ tableViews: { qrcodes: { density: newValue } } })`.
5. **Density toolbar:** Add a 3-button toggle group to the toolbar area (near the column reorder drag handle):
   - Compact: tighter row padding (`py-1`)
   - Default: current padding (`py-2`)
   - Comfortable: more padding (`py-3`)
   - Apply via a CSS class map on the `<TableRow>` className.
6. **Migrate column order:** Change the column order initialization to prefer preferences over localStorage:
   ```ts
   const savedOrder = preferences?.tableViews?.qrcodes?.columnOrder;
   const localOrder = localStorage.getItem('client-dashboard.qrcodes.columns');
   // Use preferences first, fall back to localStorage, then defaults.
   ```
   On column reorder, call `updatePreferences({ tableViews: { qrcodes: { columnOrder: newOrder } } })` in addition to (or instead of) localStorage.
7. Run `pnpm turbo lint --filter=client-dashboard` — fix any warnings.
8. Commit: `feat(qrcodes): density toggle and preferences API persistence for QR table (phase 2)`.

## Acceptance criteria
- [ ] Density toggle is visible in the QRCodesTable toolbar with 3 modes (Compact / Default / Comfortable).
- [ ] Selecting a density immediately changes row height; selection persists to user preferences.
- [ ] Column order is read from `User.preferences.tableViews.qrcodes.columnOrder` (falls back gracefully to localStorage or defaults).
- [ ] Column order changes are written to the preferences API.
- [ ] `pnpm turbo lint` passes.
