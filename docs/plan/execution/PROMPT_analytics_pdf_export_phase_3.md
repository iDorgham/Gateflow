## Phase 3: Hardening, i18n & tests

### Primary role
QA (with SECURITY + i18n considerations)

### Skills to load
- [ ] gf-testing
- [ ] gf-security
- [ ] gf-i18n

### MCP to use
| MCP | When |
|-----|------|
| Context7 | PDFKit + Next.js route testing nuances (if needed) |

### Preferred tool
- [x] Cursor (default)

### Context
- Route: `apps/client-dashboard/src/app/api/analytics/export-pdf/route.ts`
- Client button: `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsPDFExportButton.tsx`
- Jest: `apps/client-dashboard/jest.config.js`, `apps/client-dashboard/jest.setup.ts`
- Existing API test patterns: `apps/client-dashboard/src/app/api/**/route.test.ts`

### Goal
Add tests for the PDF export route and the client download trigger, and make PDF strings i18n-aware (EN/AR).

### Scope (in)
- Add `apps/client-dashboard/src/app/api/analytics/export-pdf/route.test.ts`
  - unauth (401)
  - invalid filters (400)
  - happy path returns PDF headers
- Add a small client unit test for `AnalyticsPDFExportButton` (mock fetch + URL.createObjectURL)
- Make PDF text labels i18n-aware (avoid hard-coded English in PDF)

### Scope (out)
- Product analytics instrumentation / PostHog events

### Steps (ordered)
1. Add `route.test.ts` for export-pdf:
   - Mock `getSessionClaims`
   - Mock `@gate-access/db` calls used by the route (`organization.findUnique`, `scanLog.count`, `scanLog.groupBy`, `$queryRaw`, etc.)
   - Call `GET(new NextRequest('http://localhost/api/analytics/export-pdf?dateFrom=...&dateTo=...'))`
   - Assert status + headers (and that body exists)
2. Add a client test ensuring download code path doesn’t throw:
   - Mock `global.fetch` returning a PDF-ish `Blob`
   - Mock `URL.createObjectURL`, `URL.revokeObjectURL`
   - Stub `document.createElement('a')` and its `click()`
3. Update PDF generation strings:
   - Replace hard-coded labels like “GateFlow Analytics Report”, “Key metrics”, “Visits over time” with i18n lookups
   - Thread locale from query param (e.g. `locale=en|ar`) and default to `en`
4. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm --filter=client-dashboard test`
5. Commit + push.

### Acceptance criteria
- [ ] `pnpm --filter=client-dashboard test` passes (including new tests)
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] Manual smoke test: export works in Security + Marketing mode
- [ ] AR locale generates translated labels (and no broken layout)
- [ ] No tenant leakage: all queries org-scoped

