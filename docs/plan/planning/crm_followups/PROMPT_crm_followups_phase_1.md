# Phase 1: Export Audit Logging for Contacts & Units (#40)

## Primary role
BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db
- **Rules**: No PII in audit metadata; org scoping on every query.
- **Refs**:
  - `apps/client-dashboard/src/app/api/qrcodes/export/route.ts` — audit log pattern (lines ~213–237)
  - `apps/client-dashboard/src/app/api/contacts/route.ts` — CSV export at bottom of GET handler
  - `apps/client-dashboard/src/app/api/units/route.ts` — CSV export at bottom of GET handler
  - `docs/plan/done/projects_crm_ui/AUDIT_tables_security.md` — PII guidance

## Goal
Add `AuditLog` entries whenever Contacts or Units data is exported as CSV, matching the QR Codes export audit pattern for compliance parity.

## Scope (in)
- `GET /api/contacts?format=csv` → create `AuditLog { action: 'CONTACTS_EXPORT', entityType: 'Contact', metadata: { rowCount, filters } }`.
- `GET /api/units?format=csv` → create `AuditLog { action: 'UNITS_EXPORT', entityType: 'Unit', metadata: { rowCount, filters } }`.
- `metadata.filters` contains only scalar filter values (search query, date ranges, projectId, unitType) — no contact names, emails, or other PII.
- `metadata.rowCount` is the count of rows returned in the CSV (not total in DB).

## Scope (out)
- Rate-limiting for contact/unit exports (optional, not in acceptance criteria).
- Changes to the CSV format or columns.

## Steps (ordered)
1. Read `apps/client-dashboard/src/app/api/qrcodes/export/route.ts` to understand the audit log call signature and location (after CSV generation, before returning the response).
2. Open `apps/client-dashboard/src/app/api/contacts/route.ts`. Locate the CSV branch (search for `format === 'csv'` or `Content-Type: text/csv`). After building the CSV rows array and before returning:
   ```ts
   await prisma.auditLog.create({
     data: {
       organizationId: orgId,
       userId: claims.sub,
       action: 'CONTACTS_EXPORT',
       entityType: 'Contact',
       metadata: {
         rowCount: contacts.length,
         filters: { search, projectId, unitType, dateFrom, dateTo, /* other active filters */ },
       },
     },
   });
   ```
3. Wrap in a `try/catch` so a failed audit log does NOT block the export response (non-fatal, same as QR pattern).
4. Open `apps/client-dashboard/src/app/api/units/route.ts`. Apply the same pattern for `UNITS_EXPORT` with `entityType: 'Unit'`.
5. Write a test file `apps/client-dashboard/src/app/api/contacts/route.test.ts` (or add to existing if present):
   - Mock `prisma.auditLog.create`.
   - GET with `?format=csv` → assert `auditLog.create` called with `action: 'CONTACTS_EXPORT'` and correct `organizationId`.
   - GET with `?format=json` → assert `auditLog.create` NOT called.
   - GET unauthenticated → 401, no audit log.
6. Apply the same test pattern for units (`units/route.test.ts`).
7. Run `pnpm turbo test --filter=client-dashboard` — all tests must pass.
8. Commit: `feat(audit): add export audit logging for contacts and units (phase 1)`.

## Acceptance criteria
- [ ] `AuditLog` row created with `action: 'CONTACTS_EXPORT'` on every contacts CSV export.
- [ ] `AuditLog` row created with `action: 'UNITS_EXPORT'` on every units CSV export.
- [ ] Metadata contains `rowCount` and filter scalars — no PII (no names, emails, phone numbers).
- [ ] Failed audit log is non-fatal (export still returns the CSV).
- [ ] `pnpm turbo test --filter=client-dashboard` passes.
