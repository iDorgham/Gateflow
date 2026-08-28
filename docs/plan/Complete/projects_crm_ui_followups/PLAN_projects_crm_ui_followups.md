# PLAN: Projects CRM UI Follow-ups & Export Compliance

**Slug:** `projects_crm_ui_followups`  
**Status:** complete  
**Created:** 2026-08-28  
**Completed:** 2026-08-28  
**Target:** Client Dashboard Q3/Q4 2026 Release Cycle  
**Focused App:** `apps/client-dashboard`

## Overview

Implement compliance-grade audit logging and rate limiting on Contacts and Units CSV exports in `apps/client-dashboard`, and upgrade the QR Codes table to full UX parity with CRM tables through density toggles (compact / default / comfortable) and user-preference-persisted saved views.

## Objectives

1. **Compliance & Audit Logging**: Emit structured `AuditLog` rows (`CONTACTS_EXPORT`, `UNITS_EXPORT`) with `organizationId` scoping, filter keys, and row counts (strictly zero PII).
2. **Abuse Prevention & Rate Limiting**: Apply export rate-limiting middleware to `/api/contacts?format=csv` and `/api/units?format=csv` matching `/api/qrcodes/export`.
3. **Table UX & Density Controls**: Provide row density toggles (compact, default, comfortable) in the QR Codes table toolbar.
4. **Saved Views Parity**: Connect QR Codes table column visibility and order to `useUserPreferences` (`tableViews.qrcodes`) with offline fallback.
5. **RTL & ADS Alignment**: Ensure full bidirectional layout and design token compliance (`@atlaskit/tokens` / `nativeTokens`).

## Hard Invariants

- **Multi-tenancy**: Mandatory `organizationId` scoping on all queries and `AuditLog` entries.
- **Privacy & PII**: Zero raw PII in `AuditLog.metadata`.
- **Soft Deletes**: Respect `deletedAt: null` filter behavior on soft-deletable models.
- **Tokens**: Use design tokens (`@atlaskit/tokens` / `nativeTokens`), no ad-hoc hardcoded styling.
- **Tooling**: `pnpm` only. No `npm` or `yarn`.

## Phases

| #   | Phase                                                 | Primary Role | Preferred Tool  | Status |
| --- | ----------------------------------------------------- | ------------ | --------------- | ------ |
| 1   | Export Audit Logging & Rate Limiting (API & Security) | SECURITY     | claude / cursor | [x]    |
| 2   | QR Codes Table Density & User Preferences (UI/UX)     | FRONTEND     | cursor / gemini | [x]    |
| 3   | Verification, RTL Testing & Documentation             | QA           | cursor / gemini | [x]    |

## Prompt Paths (Canonical)

- Phase 1: `phases/01_export_audit_logging_rate_limiting/PROMPT_phase_01.md`
- Phase 2: `phases/02_qr_codes_table_density_saved_views/PROMPT_phase_02.md`
- Phase 3: `phases/03_verification_rtl_testing_docs/PROMPT_phase_03.md`

## Dependencies

- Phase 2 UI integration relies on preference keys standardized in Phase 1 if types are shared.
- Phase 3 executes full preflight, RTL audit, and changelog synchronization after Phases 1 & 2.

## Verification Gates

- **Per phase**:
  - Focused test suite execution (`pnpm turbo test --filter=client-dashboard`).
  - Lint and typecheck validation (`pnpm turbo lint typecheck --filter=client-dashboard`).
- **Final**:
  - `pnpm preflight` passing across entire monorepo.
  - Zero PII verified in export audit log records.
  - Saved views persisting across browser reloads.

## Rollback Strategy

- Clean git commits per phase on feature branch `feat/projects-crm-ui-followups`.
- Revertable API middleware and non-breaking UI components with local storage fallback.
