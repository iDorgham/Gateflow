# Tasks: `admin_dashboard_redesign`

- **Initiative:** `admin_dashboard_redesign`
- **Application:** `apps/admin-dashboard`
- **Status:** ✅ Complete — all phases 1–5 complete (verified)

---

## Phase 1: Global Shell & Header/Sidebar Modernization

- [x] Refactor dashboard layout shell to match Client Dashboard V10 standards
- [x] Modernize header toolbar (remove redundant Super Admin badge, add Help Center icon)
- [x] Streamline sidebar navigation and unify Sign Out in footer
- [x] Write unit tests for shell layout and navigation active states
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Categorized Multi-Page Settings Hub

- [x] Implement sub-navigation layout for `/settings`
- [x] Build General, Security, Organizations, and Integrations sub-pages
- [x] Add form validation and tenant default quota configs
- [x] Write unit tests for settings state and form validation schemas
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Operational Hubs & High-Density Table Actions

- [x] Build standardized action header with primary "Add" and secondary filter actions
- [x] Implement table row action dropdowns (Edit, Emulate, Suspend, Delete)
- [x] Refactor Organizations, Projects, and CRM views to wide-format layout
- [x] Write unit tests for table actions and organization filtering
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`

## Phase 4: Super Admin Intelligence & Emulation Hub

- [x] Implement persistent "Emulation Active" top warning banner with quick exit
- [x] Build AI assistant configuration and system prompt editor view
- [x] Add platform health telemetry cards (API latency, active scanners, queue size)
- [x] Write unit tests for emulation state and system metrics calculations
- [x] Write `phase_logs/PHASE_LOG_phase_04.md`

## Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

- [x] Audit all admin components for ADS semantic tokens (`nativeTokensNewEra`)
- [x] Audit Arabic RTL text alignment, tables, and logical layout properties
- [x] Run full automated test suite: `pnpm --filter admin-dashboard test` (100% pass)
- [x] Verify zero TypeScript errors (`tsc --noEmit`) and zero lint warnings
- [x] Write `phase_logs/PHASE_LOG_phase_05.md`
