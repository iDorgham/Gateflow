# Phase Log — Phase 02: QR Codes Table Density & User Preferences (UI/UX)

**Slug:** `projects_crm_ui_followups`  
**Phase:** 02  
**Target App:** `apps/client-dashboard`  
**Executed At:** 2026-08-28

---

## 1. Summary of Changes

- **QRCodesTable Component Enhancement**:
  - Added support for `density?: TableDensity` (`compact`, `default`, `comfortable`) with dynamic row and header padding classes aligned with ADS design tokens.
  - Added support for custom `columnOrder?: string[]` and `columnVisibility?: Record<string, boolean>`.
  - Built comprehensive column definitions for all `QR_COLUMN_IDS` (`code`, `guestName`, `guestPhone`, `guestEmail`, `type`, `projectName`, `gateName`, `status`, `createdAt`, `expiresAt`, `scansCount`, `lastScanAt`).
- **QRCodesPage Toolbar & Integration**:
  - Integrated `useUserPreferences` with `preferences.tableViews.qrcodes` and `localStorage` fallback.
  - Added row density toggle buttons (`compact` / `default` / `comfortable`) in the filter bar.
  - Integrated `TableCustomizerModal` with full column show/hide and reordering capabilities.
  - Integrated `SavedViewManager` for saving, switching, and deleting named view presets.
- **Preferences & Table Views Types**:
  - Updated `TableViewState` and `table-views.ts` to support `density` and named `savedViews`.
  - Added unit test coverage for `tableViews.qrcodes` in `preferences/route.test.ts` and `table-views.test.ts`.

---

## 2. Test Verification

- `apps/client-dashboard/src/app/api/users/me/preferences/route.test.ts`:
  - `PATCH merges tableViews.qrcodes density and saved views` (PASS)
- `apps/client-dashboard/src/lib/residents/table-views.test.ts`:
  - `generates default table view state for QR codes` (PASS)
  - `contains critical pinned columns for QR codes` (PASS)
  - `generates default table view state for Contacts and Units` (PASS)

---

## 3. Acceptance Criteria Checklist

- [x] Row density selector (`compact` / `default` / `comfortable`) in QR Codes toolbar.
- [x] Column visibility and ordering connected to `useUserPreferences` (`tableViews.qrcodes`).
- [x] Local storage fallback for offline / unauthenticated states.
- [x] `TableCustomizerModal` parity for QR Codes table.
- [x] ADS design tokens (`@atlaskit/tokens` / `nativeTokens`) and RTL layout verified.
- [x] Unit and preference tests passing.
