# Projects CRM UI — Follow-up backlog

Optional improvements from **PR #38** (feat/projects-crm-ui → master). Refine into phases via `/plan` if prioritised.

| Item | Status |
|------|--------|
| 1. Export audit logging (Contacts & Units) | ✅ Complete |
| 2. QR Codes — density toggles & saved views | ✅ Complete |

---

## 1. Export audit logging (Contacts & Units)

**Why:** QR Codes export is rate-limited; bulk-delete is audited. Contacts/Units CSV export has no audit log — add for compliance parity.

**Scope:**
- When `GET /api/contacts?format=csv` or `GET /api/units?format=csv` is used, create an `AuditLog` entry (e.g. `CONTACTS_EXPORT`, `UNITS_EXPORT`) with `metadata: { filters, rowCount }`.
- Optional: rate-limit exports (like `/api/qrcodes/export`) if not already present.

**Acceptance:**
- [ ] AuditLog row created on contacts CSV export (org, user, action, count).
- [ ] AuditLog row created on units CSV export (org, user, action, count).
- [ ] No PII in log metadata; document in `AUDIT_tables_security.md`.

**Ref:** `docs/plan/done/projects_crm_ui/AUDIT_tables_security.md`, `/api/qrcodes/export` (rate limit + pattern).

---

## 2. QR Codes table — density toggles & saved views

**Why:** Contacts and Units support column customizer + user preferences (saved views). QR Codes table has column reorder (localStorage) but no density toggle or saved views in user preferences.

**Scope:**
- **Density:** Compact / default / comfortable row height toggle for QR Codes table (and optionally reuse for Contacts/Units).
- **Saved views:** Persist QR Codes column order (and optionally visibility) in User preferences (e.g. `tableViews.qrcodes`) so it matches Contacts/Units pattern; optionally allow named presets.

**Acceptance:**
- [ ] QR Codes table: density control (e.g. toolbar) with at least two modes (compact, default).
- [ ] QR Codes column order/visibility stored in user preferences API (or keep localStorage and document).
- [ ] Optional: TableCustomizerModal or equivalent for QR Codes to match residents UX.

**Ref:** `ResidentsFilterBar`, `TableCustomizerModal`, `useUserPreferences`, `lib/residents/table-views.ts`.
