# TASKS: Scanner App Modularization (`scanner_app_modularization`)

## Phase 1: Tab Navigation & Duty Top Bar Extraction

- [x] Create `src/components/views/scanner-tab-bar.tsx`
- [x] Create `src/components/views/scanner-top-bar.tsx`
- [x] Refactor `src/screens/scanner/scanner-screen.tsx` to use `ScannerTabBar` and `ScannerTopBar`
- [x] Create unit tests `src/components/views/scanner-tab-bar.test.tsx` and `scanner-top-bar.test.tsx`
- [x] Run test suite: `pnpm --filter scanner-app test`
- [x] Run typecheck: `pnpm --filter scanner-app typecheck`
- [x] Update `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Camera Viewfinder & Decision Overlay Extraction

- [x] Create `src/components/views/camera-scanner-view.tsx`
- [x] Connect barcode handling, decision dialogs, ID capture modal, and result feedback overlays
- [x] Create unit test `src/components/views/camera-scanner-view.test.ts`
- [x] Verify test suite (16 suites, 151 tests passing) and typecheck (0 errors)
- [x] Update `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Bilingual i18n Wiring

- [x] Create `src/lib/i18n.ts` with English & Arabic translations
- [x] Update `AppPreferences` with locale support
- [x] Connect locale to `ScannerTabBar`, `ScannerTopBar`, and `CameraScannerView`
- [x] Create unit tests in `src/lib/i18n.test.ts` and bilingual component tests
- [x] Verify full test suite (17 suites, 161 tests passing) and typecheck (0 errors)
- [x] Update `phase_logs/PHASE_LOG_phase_03.md`
