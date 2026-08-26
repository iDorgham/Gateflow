# PLAN: Scanner App Modularization (`scanner_app_modularization`)

**Status:** Active  
**Focused App:** `apps/scanner-app`  
**Created:** 2026-08-24  
**Primary Goal:** Decompose the monolithic scanner screen and mobile shell into decoupled, testable components (`ScannerTabBar`, `ScannerTopBar`, `CameraScannerView`), enabling clean bilingual token integration (`@gate-access/i18n`).

---

## Phase Roadmap

### Phase 1: Tab Navigation & Duty Top Bar Extraction

- **Scope:** Extract bottom tab navigation (`ScannerTabBar`) and top action controls (`ScannerTopBar`) into dedicated domain components under `src/components/views/`.
- **Deliverables:**
  - `src/components/views/scanner-tab-bar.tsx`
  - `src/components/views/scanner-top-bar.tsx`
  - Unit tests in `src/components/views/scanner-tab-bar.test.tsx` and `scanner-top-bar.test.tsx`
  - Refactor `scanner-screen.tsx` to consume modular components.
- **Acceptance Criteria:**
  - `pnpm --filter scanner-app test` passes 100%.
  - `pnpm --filter scanner-app typecheck` passes with zero errors.

### Phase 2: Live Camera Viewfinder & Decision Overlay Extraction

- **Scope:** Extract camera barcode handling, countdowns, and decision modals into `CameraScannerView`.
- **Deliverables:**
  - `src/components/views/camera-scanner-view.tsx`
  - Dedicated unit tests for scan cycle triggers.

### Phase 3: Bilingual i18n Wiring & RTL Layout

- **Scope:** Connect `@gate-access/i18n` Arabic and English string bundles across scanner wizard and duty screens.
- **Deliverables:**
  - Locale provider integration and localized button labels.
