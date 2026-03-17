# PLAN: CRM Followups — Audit Logging & QR Table Polish

**Slug:** `crm_followups`
**Source:** `docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md` (issues #39 and #40)
**App:** `client-dashboard`
**Status:** Ready

---

## Problem

Two compliance and UX gaps left open from the `projects_crm_ui` release:

1. **Issue #40 — Missing audit logs on CSV exports.** QR Codes export is rate-limited and audit-logged (`QRCODES_EXPORT`). Contacts and Units CSV exports are not — a compliance gap.
2. **Issue #39 — QR Codes table is behind the Residents UX standard.** Contacts and Units tables have density toggles and API-backed saved views; QR Codes table stores column order only in `localStorage` with no density control.

---

## Phases

### Phase 1 — Export Audit Logging for Contacts & Units (#40)
**Role:** BACKEND-API | **Tool:** Cursor

**Scope:**
- After any CSV export in `GET /api/contacts` and `GET /api/units`, create an `AuditLog` row with action `CONTACTS_EXPORT` / `UNITS_EXPORT`, entityType, and metadata `{ rowCount, filters }`.
- No PII in metadata (only counts and filter keys, not contact names/emails).
- Pattern: mirror `apps/client-dashboard/src/app/api/qrcodes/export/route.ts` (lines ~213–237).

**Deliverables:**
- `AuditLog` entry on every Contacts CSV export.
- `AuditLog` entry on every Units CSV export.
- Tests for auth + audit log creation.

**Acceptance criteria:**
- `prisma.auditLog.create` called with correct fields on CSV response path.
- Metadata contains `rowCount` and active filter values — no raw PII fields.
- `pnpm turbo test --filter=client-dashboard` passes.

---

### Phase 2 — QR Codes Table: Density Toggle & Preferences API (#39)
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- **Density toggle:** Add a 3-mode toolbar button (Compact / Default / Comfortable) to `QRCodesTable`. Row height changes via a `density` state and a CSS class map.
- **Migrate column order to preferences API:** Replace `localStorage` (`'client-dashboard.qrcodes.columns'`) with `useUserPreferences()` + `tableViews.qrcodes`. Extend `PatchPreferencesSchema` in the preferences route to accept `tableViews.qrcodes`.
- **Column visibility toggle:** Reuse existing `TableCustomizerModal` pattern from the Residents pages (or a simplified version) for QR Codes.

**Deliverables:**
- Density toggle in QRCodesTable toolbar (3 modes, persisted to preferences API).
- Column order + visibility persisted in `User.preferences.tableViews.qrcodes`.
- Preferences route extended with `qrcodes` key.

**Acceptance criteria:**
- Density toggle is visible and functional; row height changes immediately.
- Column order persists across page refreshes (confirmed via preferences API, not localStorage).
- `pnpm turbo lint` passes.

---

## Key Files

| File | Change |
|------|--------|
| `apps/client-dashboard/src/app/api/contacts/route.ts` | Add `auditLog.create` after CSV generation |
| `apps/client-dashboard/src/app/api/units/route.ts` | Add `auditLog.create` after CSV generation |
| `apps/client-dashboard/src/app/api/users/me/preferences/route.ts` | Extend schema to accept `tableViews.qrcodes` |
| `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx` | Density toggle + migrate to preferences API |

## References

- Audit pattern: `apps/client-dashboard/src/app/api/qrcodes/export/route.ts`
- Preferences hook: `apps/client-dashboard/src/lib/residents/use-user-preferences.ts`
- Table views pattern: `apps/client-dashboard/src/lib/residents/table-views.ts`
- Residents table customizer: search for `TableCustomizerModal` in `src/app/[locale]/dashboard/residents/`
