# Pro Prompt — Phase 9: Sorting, pagination, server-side

## Phase 9: Sorting, pagination, server-side

### Primary role

BACKEND-API / FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] gf-api — API routes, validation
- [x] gf-security — org scope (CONTRACTS.md)
- [x] react — React/Next.js patterns
- [ ] gf-testing — Jest, test patterns

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — client-dashboard; Phases 6 and 8 done (TanStack Table + filtering for QR Codes).
- **Rules:** `.cursor/contracts/CONTRACTS.md` — list APIs must scope by `organizationId`; validate sort/order params to avoid injection.

### Goal

Add **sortable column headers** (asc/desc, optional multi-sort with shift+click) and **server-side pagination** (limit/offset or cursor) for the QR Codes table; optional row virtualization for large result sets.

### Scope (in)

- API: extend QR codes list endpoint to accept `sortBy`, `sortOrder` (and optionally multiple sort fields); validate allowed columns. Accept `page`/`pageSize` or `limit`/`offset`; return `total` or `hasMore` for UI.
- QR Codes table: clickable column headers toggle sort; shift+click adds secondary sort (optional). Pagination controls (page size selector, prev/next or page numbers). Optionally use TanStack Table’s sorting state and a virtualized body for >500 rows.

### Scope (out)

- Contacts and Units tables not in scope; only QR Codes table.

### Steps (ordered)

1. Load `gf-security`; ensure sort params are allowlisted (no raw column names from client without validation).
2. Extend GET list API: accept `sortBy`, `sortOrder`, `page`, `pageSize` (or `limit`, `offset`); return total count or hasMore; apply ordering in Prisma safely.
3. In QR Codes table: wire TanStack Table sorting state to API params; add pagination UI (page size, prev/next); fetch new page when user changes page or sort.
4. If result set can exceed ~500 rows, consider adding row virtualization (e.g. TanStack Virtual or similar) to the table body.
5. Add tests for API: sort and pagination params are applied correctly and org scope is preserved.
6. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] API accepts sort and pagination params; responses are org-scoped and correctly ordered/paged.
- [ ] QR Codes table headers are clickable for sort (asc/desc); optional multi-sort with shift+click.
- [ ] Pagination controls work; table shows correct page of results.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (include sort/pagination API tests).

### Files likely touched

- `apps/client-dashboard/src/app/api/qrcodes/route.ts` (or equivalent)
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`
- Optional: virtualization wrapper for table body
