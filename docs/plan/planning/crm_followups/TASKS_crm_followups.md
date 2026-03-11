# TASKS: CRM Followups — Audit Logging & QR Table Polish

**Plan**: [PLAN_crm_followups.md](PLAN_crm_followups.md)
**Status**: Ready
**GitHub**: [#40](https://github.com/iDorgham/Gateflow/issues/40) · [#39](https://github.com/iDorgham/Gateflow/issues/39)

## Phases

- [x] **Phase 1: Export Audit Logging (#40)**
  - [x] `AuditLog` created on contacts CSV export (`CONTACTS_EXPORT`)
  - [x] `AuditLog` created on units CSV export (`UNITS_EXPORT`)
  - [x] Metadata: rowCount + filter scalars only, no PII
  - [x] Failed audit is non-fatal (export still returns CSV)
  - [x] Tests pass

- [ ] **Phase 2: QR Table Density & Preferences (#39)**
  - [ ] Density toggle in toolbar (Compact / Default / Comfortable)
  - [ ] Preferences route extended with `tableViews.qrcodes`
  - [ ] Column order read from preferences API (fallback to localStorage)
  - [ ] Column order changes written to preferences API
  - [ ] Lint passes

---
*Created: 2026-03-11*
