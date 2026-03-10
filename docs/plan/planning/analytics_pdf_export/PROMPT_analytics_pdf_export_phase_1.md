## Phase 1: Backend PDF export API

### Primary role
BACKEND-API (optional review: SECURITY)

### Skills to load
- [ ] gf-api
- [ ] gf-security (review checklist)
- [ ] gf-database (query sanity)

### MCP to use
| MCP | When |
|-----|------|
| Context7 | PDFKit / NextResponse nuances (if needed) |

### Preferred tool
- [x] Cursor (default)

### Context
- **Project**: GateFlow (Next.js 14, pnpm, Prisma)
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Contracts**: `.cursor/rules/00-gateflow-core.mdc`, `.cursor/contracts/CONTRACTS.md`
- **Existing helper**: `apps/client-dashboard/src/lib/analytics/analytics-query.ts` (`AnalyticsQuerySchema`, `validateAnalyticsQuery`)
- **Route**: `apps/client-dashboard/src/app/api/analytics/export-pdf/route.ts`

### Goal
Add a secure, org-scoped `GET /api/analytics/export-pdf` route that generates a PDF report for the Analytics dashboard based on existing filters.

### Scope (in)
- Implement `apps/client-dashboard/src/app/api/analytics/export-pdf/route.ts`
- Use `getSessionClaims()` auth gate
- Validate query params with `AnalyticsQuerySchema` + `validateAnalyticsQuery`
- Ensure org scoping + soft-delete safety (`organizationId`, `deletedAt: null`)
- Return `application/pdf` with `Content-Disposition: attachment; filename="analytics-....pdf"`

### Scope (out)
- Client-side UI wiring (Phase 2)
- Fancy PDF layout / charts (Phase 2+)

### Steps (ordered)
1. Create `apps/client-dashboard/src/app/api/analytics/export-pdf/route.ts`.
2. Auth first: if `!claims?.orgId` return 401.
3. Parse query params: `dateFrom`, `dateTo`, `projectId?`, `gateId?`, `unitType?` via `AnalyticsQuerySchema.safeParse`.
4. Call `validateAnalyticsQuery(orgId, parsed.data)` and return 400 on invalid project/gate.
5. Query summary + visits series with org-scoped filters and soft-delete filters.
6. Generate PDF server-side (PDFKit is acceptable) and return bytes in `NextResponse`.
7. Add `pdfkit` dependency to `apps/client-dashboard/package.json` if not already.
8. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm --filter=client-dashboard test`
9. Commit + push.

### Acceptance criteria
- [ ] `401` when unauthenticated
- [ ] `400` when query invalid
- [ ] `200` returns PDF with correct headers (`Content-Type`, `Content-Disposition`)
- [ ] Queries are org-scoped and respect soft deletes
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm --filter=client-dashboard test` passes

