# Security Audit — Table List / Export / Bulk Endpoints

**Date:** 2026-03-02  
**Scope:** QR Codes, Contacts, Units — list (GET), export (GET with format=csv or dedicated export), bulk-delete (POST).  
**Refs:** `.cursor/contracts/CONTRACTS.md`, `.cursor/skills/gf-security/SKILL.md`

---

## Checklist (per endpoint)

| # | Requirement | Notes |
|---|-------------|--------|
| 1 | Auth required before any tenant operation | getSessionClaims() or requireAuth(request) |
| 2 | organizationId in every query | All list/export/bulk scope by orgId |
| 3 | deletedAt: null where applicable | List/export only non-deleted; bulk sets deletedAt |
| 4 | Input validation (Zod) | Query params and body validated |
| 5 | Audit log for export/bulk | High-impact actions logged to AuditLog |

---

## QR Codes

| Endpoint | Auth | Org scope | Soft delete | Zod | Audit |
|----------|------|-----------|--------------|-----|-------|
| GET /api/qrcodes | ✅ getSessionClaims, orgId | ✅ where.organizationId, deletedAt: null | ✅ | ✅ GetQRCodesQuerySchema | N/A (list) |
| GET /api/qrcodes/export | ✅ getSessionClaims | ✅ where.organizationId, deletedAt: null | ✅ | ✅ ExportQRCodesQuerySchema | ⚠️ Not present; export is read-only, rate-limited |
| POST /api/qrcodes/bulk-delete | ✅ getSessionClaims | ✅ updateMany where organizationId | ✅ soft delete | ✅ BulkDeleteSchema | ✅ QRCODES_BULK_DELETE |

**Note:** Export is rate-limited (`qrcodes-export:${sub}`, 20/60s). Audit log for export can be added in a follow-up if required for compliance.

---

## Contacts

| Endpoint | Auth | Org scope | Soft delete | Zod | Audit |
|----------|------|-----------|--------------|-----|-------|
| GET /api/contacts | ✅ getSessionClaims, orgId | ✅ where.organizationId, deletedAt: null | ✅ | ✅ GetContactsQuerySchema | N/A (list) |
| GET /api/contacts?format=csv | ✅ same as list | ✅ same | ✅ | ✅ | ⚠️ No dedicated audit log for export (same as list) |
| POST /api/contacts/bulk-delete | ✅ getSessionClaims | ✅ findMany/updateMany organizationId | ✅ soft delete | ✅ BulkDeleteSchema | ✅ CONTACTS_BULK_DELETE (added Phase 12) |

---

## Units

| Endpoint | Auth | Org scope | Soft delete | Zod | Audit |
|----------|------|-----------|--------------|-----|-------|
| GET /api/units | ✅ requireAuth, orgId | ✅ where.organizationId, deletedAt: null | ✅ | ✅ GetUnitsQuerySchema | N/A (list) |
| GET /api/units?format=csv | ✅ same as list | ✅ same | ✅ | ✅ | ⚠️ No dedicated audit log for export |
| POST /api/units/bulk-delete | ✅ getSessionClaims | ✅ findMany/updateMany organizationId | ✅ soft delete | ✅ BulkDeleteSchema | ✅ UNITS_BULK_DELETE (added Phase 12) |

---

## Summary

- **Auth:** All endpoints require session claims or requireAuth; no gaps.
- **Org scope:** All list/export/bulk queries include `organizationId`; no cross-tenant leakage.
- **Soft delete:** List/export filter `deletedAt: null`; bulk-delete sets `deletedAt: new Date()`.
- **Validation:** All use Zod for query/body; invalid input returns 400.
- **Audit:** Bulk-delete for QR Codes, Contacts, and Units now write to `AuditLog`. Export actions are rate-limited; audit for export can be added later if required.

---

## Changes made (Phase 12)

1. **POST /api/contacts/bulk-delete** — Added `AuditLog.create` with action `CONTACTS_BULK_DELETE`, entityType `Contact`, metadata `{ idsCount, idsSample }`.
2. **POST /api/units/bulk-delete** — Added `AuditLog.create` with action `UNITS_BULK_DELETE`, entityType `Unit`, metadata `{ idsCount, idsSample }`.

No other security gaps were found; list and export endpoints already enforced auth, org scope, and soft delete.

---

## Performance (Phase 12)

- **List APIs:** All use server-side pagination with `pageSize` capped at 100. No unbounded queries.
- **Virtualization:** Not required for current design; no table displays >500 rows at once (data is paginated server-side).
