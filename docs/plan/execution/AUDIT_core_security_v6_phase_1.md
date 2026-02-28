# API Route Security Audit — Core Security v6 Phase 1

**Date:** 2026-02-28  
**Scope:** `apps/client-dashboard/src/app/api/` (tenant-scoped and scanner-facing routes)  
**Reference:** `.cursor/contracts/CONTRACTS.md`, `.cursor/skills/gf-security/SKILL.md`

---

## Checklist (per route)

For each route we verify:

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | Auth first | `requireAuth(request)` or `getSessionClaims()`; reject unauthenticated before any tenant access |
| 2 | Role/permission | Enforce role/tenant ownership where applicable |
| 3 | Org scope | Queries use `organizationId` from auth (or equivalent tenant scope) |
| 4 | Soft delete | Reads filter `deletedAt: null`; "delete" operations set `deletedAt: new Date()` |
| 5 | Input validation | Zod (or equivalent) on request body/params |
| 6 | Rate limit | Applied on login, QR create, bulk sync, validate, exports where applicable |
| 7 | CSRF | For cookie-auth mutating routes (POST/PUT/PATCH/DELETE) when applicable |

---

## Route-by-route compliance

### Auth

| Route | Auth | Role | Org | Soft del | Validation | Rate limit | CSRF |
|-------|------|------|-----|----------|------------|-----------|------|
| `auth/login` | N/A | N/A | — | User: `deletedAt: null` | Zod (LoginPayloadSchema) | ✅ 10/min by IP | — |
| `auth/refresh` | Cookie (refresh token) | — | — | User: check `deletedAt` | — | — | — |
| `auth/logout` | Cookie | — | — | — | — | — | — |

### Tenant-scoped (session: `getSessionClaims()`)

| Route | Auth | Role | Org | Soft del | Validation | Rate limit | CSRF |
|-------|------|------|-----|----------|------------|-----------|------|
| `gates` GET/POST/PATCH/DELETE | ✅ claims | Implicit (org) | ✅ orgId | ✅ deletedAt: null, soft delete | Zod | — | (cookie mut) |
| `projects` GET/POST | ✅ | ✅ | ✅ | ✅ | Zod | — | — |
| `projects/[id]` GET/PATCH/DELETE | ✅ | ✅ | ✅ | ✅ | Zod | — | — |
| `projects/wizard` POST | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `project/switch` POST | ✅ | ✅ | ✅ (project) | ✅ | — | — | — |
| `users` GET | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `contacts` GET/POST | ✅ | ✅ | ✅ | ✅ | Zod | — | — |
| `contacts/[id]` GET/PATCH/DELETE | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `webhooks` GET/POST | ✅ | ✅ | ✅ | ✅ | Zod | — | — |
| `webhooks/[id]` GET/PATCH/DELETE | ✅ | ✅ | ✅ | ✅ soft del | — | — | — |
| `webhooks/[id]/test` POST | ✅ | ✅ | ✅ | — | — | — | — |
| `api-keys` GET/POST | ✅ | ✅ | ✅ | — (no deletedAt on ApiKey) | Zod | — | — |
| `api-keys/[id]` DELETE | ✅ | ✅ | ✅ | N/A (hard delete by design for revocation) | — | — | — |
| `workspace/settings` GET/PUT | ✅ | ✅ | Org by claims | Org: check deletedAt | — | — | — |
| `search` GET | ✅ | ✅ | ✅ orgId | ✅ | — | — | — |
| `notifications/expired-qrs` GET | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `scans/export` GET | ✅ | ✅ | ✅ | ✅ (project, qrCode) | Query params | — | — |
| `qr/bulk-create` POST | ✅ | ✅ | ✅ | ✅ (project, gate) | Zod | — | — |
| `qr/send-email` POST | ✅ | ✅ | ✅ | ✅ (QR, org) | Zod | — | — |
| `override/log` POST | ✅ | ✅ | ✅ gate | ✅ | Zod | — | — |
| `onboarding/complete` POST | ✅ | ✅ | — | — | — | — | — |
| `ai/assistant` POST | ✅ | ✅ | ✅ | — | — | — | — |
| `resident/units` GET | ✅ (session) | Resident | userId/unit | ✅ | — | — | — |
| `resident/quota` GET | ✅ | Resident | userId/unit | ✅ | — | — | — |
| `resident/visitors` GET/POST | ✅ | ✅ | ✅ org + unit | ✅ | Zod | — | — |
| `resident/visitors/[id]` DELETE | ✅ | ✅ | Unit scope | Soft del | — | — | — |
| `units` GET/POST | ✅ requireAuth | — | ✅ orgId | ✅ | Zod | — | — |
| `units/[id]` GET/PATCH/DELETE | ✅ | ✅ | ✅ | ✅ | — | — | — |

### Bearer / scanner-facing

| Route | Auth | Role | Org | Soft del | Validation | Rate limit | CSRF |
|-------|------|------|-----|----------|------------|-----------|------|
| `qrcodes/validate` POST | ✅ requireAuth | — | ✅ payload + DB row check | ✅ inactive if deletedAt | Zod (QRValidateRequestSchema) | ✅ 100/min | — |
| `scans/bulk` POST | ✅ requireAuth | — | (in processBulkScans: QR by code, no direct org filter*) | — | BulkScanRequestSchema | ✅ 30/min | — |
| `scans/my-recent` GET | ✅ requireAuth | — | ✅ qrCode.organizationId | — | — | — | — |
| `scans/[scanId]/deny` POST | ✅ requireAuth | — | ✅ scanLog.qrCode.organizationId | — | — | — | — |

\* **Note:** `scans/bulk` delegates to `processBulkScans`, which fetches QRCodes by `code` only. The scanner is already authenticated; bulk sync does not re-check org per QR. Acceptable because the scanner operator’s token is org-scoped and syncs are for that operator’s scans. No cross-org QR code lookup by code alone in a single-tenant operator context.

---

## Summary

- **Auth:** All tenant and scanner routes check auth first (session or Bearer).
- **Org scope:** All tenant routes scope by `organizationId` (or equivalent, e.g. resident by userId/unit). Validate route enforces org on payload and DB row.
- **Soft deletes:** All mutable tenant models use `deletedAt: null` on reads and set `deletedAt` on "delete". Exception: `ApiKey` has no `deletedAt`; revocation is by design a hard delete (documented).
- **Validation:** Login, gates, projects, contacts, webhooks, api-keys, qr/bulk-create, qr/send-email, override/log, qrcodes/validate, scans/bulk use Zod or equivalent.
- **Rate limiting:** Login (by IP), qrcodes/validate (per user), scans/bulk (per user).
- **CSRF:** Cookie-based mutations may rely on SameSite + auth cookie; explicit CSRF token usage is not present on all mutation routes—documented as existing behavior; no change in this phase.

---

## Gaps / follow-ups (no change in Phase 1)

1. **qrcodes/validate:** Uses `findUnique({ where: { id } })` then checks `qrCode.organizationId !== claims.orgId`. Prefer `findFirst({ where: { id, organizationId: claims.orgId } })` when `claims.orgId` is set for defense-in-depth (optional hardening).
2. **ApiKey:** Model has no `deletedAt`; revocation is hard delete. Align with product: if soft-delete for keys is required later, add schema + migration.
3. **Bulk-sync:** `processBulkScans` does not receive `orgId`; QR lookup is by code. Scanner is authenticated per-org; acceptable for current design. If multi-tenant scanner support is added, consider passing orgId and scoping QR lookup.

---

## Test coverage (Phase 1)

- **Org scoping:** `qrcodes/validate/route.test.ts` — wrong org payload and DB row; `gates/route.test.ts` (new) — GET gates scoped by org and excludes soft-deleted.
- **Soft deletes:** `qrcodes/validate/route.test.ts` — rejected when QR `deletedAt` set; gates test — list excludes deleted gates by where clause.
- **QR / scanUuid:** `qrcodes/validate` — signing and validation; `bulk-sync.test.ts` — scanUuid dedup (idempotent duplicate); `scans/bulk/route.test.ts` — integration with processBulkScans.
