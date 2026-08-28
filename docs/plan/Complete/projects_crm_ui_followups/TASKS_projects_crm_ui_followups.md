# Tasks — `projects_crm_ui_followups`

**Slug:** `projects_crm_ui_followups`  
**Plan:** `PLAN_projects_crm_ui_followups.md`  
**Target App:** `apps/client-dashboard`

---

## Phase 1: Export Audit Logging & Rate Limiting (API & Security)

- [x] Add `AuditLog` creation on contacts CSV export (`apps/client-dashboard/src/app/api/contacts/route.ts`) with action `CONTACTS_EXPORT` and non-PII metadata (`filters`, `rowCount`).
- [x] Add `AuditLog` creation on units CSV export (`apps/client-dashboard/src/app/api/units/route.ts`) with action `UNITS_EXPORT` and non-PII metadata (`filters`, `rowCount`).
- [x] Apply export rate-limiting middleware to `/api/contacts` and `/api/units` when `format=csv`.
- [x] Verify `organizationId` scoping and user session auth on export endpoints.
- [x] Unit & integration tests for rate limiting, tenant scoping, and audit log generation.
- [x] Update `phase_logs/PHASE_LOG_phase_01.md`.

---

## Phase 2: QR Codes Table Density & User Preferences (UI/UX)

- [x] Add row density selector (`compact` / `default` / `comfortable`) to QR Codes toolbar.
- [x] Connect column visibility and ordering to `useUserPreferences` (`tableViews.qrcodes`).
- [x] Support local storage fallback when offline or preferences API unavailable.
- [x] Integrate `TableCustomizerModal` parity for QR Codes table.
- [x] Verify ADS token alignment (`@atlaskit/tokens` / `nativeTokens`) and RTL bidirectional layout.
- [x] Component & hook tests for density changes and saved view synchronization.
- [x] Update `phase_logs/PHASE_LOG_phase_02.md`.

---

## Phase 3: Verification, RTL Testing & Documentation

- [x] Verify zero PII in created `AuditLog` entries across all CSV export flows.
- [x] End-to-end audit verification for table exports and preference persistence.
- [x] RTL visual and keyboard navigation audit across table controls.
- [x] Run full workspace preflight: `pnpm preflight`.
- [x] Update `CHANGELOG.md` and feature documentation.
- [x] Update `phase_logs/PHASE_LOG_phase_03.md`.

---

## Final Review & Hand-off

- [x] All 3 phase logs completed in `phase_logs/`.
- [x] `pnpm preflight` green on entire monorepo.
- [x] Move plan to `Complete/projects_crm_ui_followups/`.
