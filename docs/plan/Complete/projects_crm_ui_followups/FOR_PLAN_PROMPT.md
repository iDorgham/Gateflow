# FOR_PLAN_PROMPT — `projects_crm_ui_followups`

**Slug:** `projects_crm_ui_followups`  
**Target App:** `apps/client-dashboard`  
**Draft Reference:** [`docs/plan/Draft/projects_crm_ui_followups/DRAFT_projects_crm_ui_followups.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/projects_crm_ui_followups/DRAFT_projects_crm_ui_followups.md)  
**Date:** 2026-08-28

---

## 1. Mission

Implement comprehensive export audit logging and rate limiting across Contacts and Units CSV exports in `apps/client-dashboard`, while bringing the QR Codes management table to full UX parity with CRM tables through density toggles (compact / default / comfortable) and user-preference-persisted saved views.

---

## 2. In Scope / Out of Scope

### In Scope:

- **Export Audit Logging**: Structured `AuditLog` creation (`CONTACTS_EXPORT`, `UNITS_EXPORT`) with `organizationId` scoping, filter keys, and row counts (strictly zero PII).
- **Export Rate Limiting**: Abuse prevention middleware on CSV export endpoints matching `/api/qrcodes/export` (e.g. 10 exports per 5 min per user/org).
- **QR Codes Table Density Controls**: Toolbar controls for row density (`compact`, `default`, `comfortable`) using ADS design tokens.
- **QR Codes Saved Views & Customizer**: Column visibility and ordering persistence synced via `useUserPreferences` (`tableViews.qrcodes`) with offline fallback.
- **Testing & Verification**: Unit and API route tests for rate limiting, tenant-scoped audit logging, and preference persistence.

### Out of Scope:

- Modifying underlying database schemas for `Contact`, `Unit`, or `QRCode`.
- Modifying cryptographic HMAC signing or verification for QR code passes.
- Global table pagination redesign or virtualization rewrite.

---

## 3. Users & Constraints

- **Users**: Property managers, security operations leads, and enterprise compliance auditors.
- **Apps Touched**:
  - `apps/client-dashboard`
  - `packages/db` (AuditLog action constants / client)
  - `packages/types` (User preferences typing)
- **Multi-Tenancy**: Mandatory `organizationId` scoping and tenant isolation on all database queries and audit logs.
- **Security & PII**: Zero raw PII in `AuditLog.metadata`.
- **UI & i18n**: Bidirectional (RTL/LTR) support in table customizers and toolbar controls; ADS token adherence (`@atlaskit/tokens` / `nativeTokens`).

---

## 4. Definition of Done

- [ ] `GET /api/contacts?format=csv` creates an `AuditLog` entry with action `CONTACTS_EXPORT` and no PII.
- [ ] `GET /api/units?format=csv` creates an `AuditLog` entry with action `UNITS_EXPORT` and no PII.
- [ ] Contacts and Units CSV export endpoints are protected by rate limiting.
- [ ] QR Codes table includes density controls (compact/default/comfortable) matching Contacts/Units.
- [ ] QR Codes column visibility and order persist across reloads via `useUserPreferences`.
- [ ] Unit & API route tests pass (`pnpm turbo test --filter=client-dashboard`).
- [ ] Workspace preflight check passes cleanly (`pnpm preflight`).

---

## 5. Suggested Phase Breakdown

1. **Phase 1 — Export Audit Logging & Rate Limiting (API & Security)**
2. **Phase 2 — QR Codes Table Density & User Preferences (UI/UX)**
3. **Phase 3 — Verification, RTL Testing & Documentation**

---

## 6. References

- Draft: [`docs/plan/Draft/projects_crm_ui_followups/DRAFT_projects_crm_ui_followups.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/projects_crm_ui_followups/DRAFT_projects_crm_ui_followups.md)
- Backlog: [`docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md)
- Completed PR: PR #38 (`feat/projects-crm-ui`)
- Hook: `apps/client-dashboard/src/hooks/use-user-preferences.ts`
- Table Customizer: `apps/client-dashboard/src/components/residents/table-customizer-modal.tsx`

---

```text
/plan projects_crm_ui_followups
```
