# PROMPT — Phase 01: Export Audit Logging & Rate Limiting (API & Security)

**Slug:** `projects_crm_ui_followups`  
**Phase:** 01  
**Target App:** `apps/client-dashboard`  
**Primary Role:** SECURITY / BACKEND-API  
**Preferred Tool:** Claude Code CLI (or Cursor / Gemini CLI)

---

## 1. Objective

Add compliance-grade `AuditLog` records and rate limiting to Contacts and Units CSV export endpoints in `apps/client-dashboard`.

---

## 2. Scope & Touchpoints

- `apps/client-dashboard/src/app/api/contacts/route.ts`
- `apps/client-dashboard/src/app/api/units/route.ts`
- `apps/client-dashboard/src/lib/rate-limit.ts` (or export rate limit helper)
- `packages/db/src/` (Prisma client & AuditLog types)
- `apps/client-dashboard/src/__tests__/api/` (API route tests)

---

## 3. Invariants & Rules

- **Tenant Scoping**: All queries and audit logs MUST be scoped by session `organizationId`.
- **Zero PII in AuditLog**: Log metadata MUST contain only operational details (e.g. `{ filters: { search: boolean, status: string }, rowCount: number }`). Do not include names, phone numbers, or email addresses.
- **Rate Limiting**: Protect CSV export endpoints from bulk scraping/abuse (e.g. max 10 export requests per 5 minutes per user/org).
- **Error Handling**: Return explicit HTTP status codes (`401`, `429`, `500`).

---

## 4. Implementation Steps

1. **Audit Contacts Export**:
   - In `apps/client-dashboard/src/app/api/contacts/route.ts`, intercept `format=csv` requests.
   - Insert an `AuditLog` row with `action: 'CONTACTS_EXPORT'`, `organizationId`, `userId`, and sanitized metadata.
2. **Audit Units Export**:
   - In `apps/client-dashboard/src/app/api/units/route.ts`, intercept `format=csv` requests.
   - Insert an `AuditLog` row with `action: 'UNITS_EXPORT'`, `organizationId`, `userId`, and sanitized metadata.
3. **Rate Limiting**:
   - Ensure rate-limiting middleware is applied to CSV export queries.
4. **Testing**:
   - Add unit/integration tests verifying audit log creation and 429 response when rate limit is exceeded.
5. **Phase Log**:
   - Document results in `phase_logs/PHASE_LOG_phase_01.md`.

---

## 5. Verification Command

```bash
pnpm turbo test --filter=client-dashboard
pnpm turbo lint typecheck --filter=client-dashboard
```
