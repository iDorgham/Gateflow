# Pro Prompt — Phase 8: Advanced filtering & date range (QR Codes first)

## Phase 8: Advanced filtering & date range

### Primary role

FRONTEND / BACKEND-API

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] gf-api — API routes, validation, org scope
- [x] gf-security — org scope, input validation (CONTRACTS.md)
- [x] react — React/Next.js patterns
- [ ] gf-testing — Jest, test patterns

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — for API security review if needed

### Context

- **Project:** GateFlow — client-dashboard; Phase 6 (TanStack Table + QR Codes) done.
- **Rules:** `.cursor/contracts/CONTRACTS.md`, `.cursor/rules/00-gateflow-core.mdc` — all list/export APIs must scope by `organizationId`, validate inputs (Zod), and respect `deletedAt: null`.
- **Refs:** `apps/client-dashboard/src/app/api/qrcodes/`, existing filter patterns in residents (Contacts/Units) filter bars.

### Goal

Add **advanced filtering** for the QR Codes table: global search, per-column filters where useful, and **date range** (from/to) for `createdAt`, `expiresAt`, `lastScanAt` with debounced inputs and server-side filter params.

### Scope (in)

- Extend `/api/qrcodes` (or equivalent GET list) to accept query params: `search`, `createdFrom`, `createdTo`, `expiresFrom`, `expiresTo`, `lastScanFrom`, `lastScanTo`, plus existing pagination. Validate with Zod; scope by auth org.
- QR Codes page: filter bar or popover with global search input (debounced), date range pickers (from/to) for createdAt, expiresAt, lastScanAt using @gate-access/ui DatePicker or similar.
- Debounced search (e.g. 300ms); pass filter params to API; table refreshes with filtered data.

### Scope (out)

- Multi-select per-column filters can be simplified (e.g. status dropdown) or deferred; focus on search + date ranges first.
- Contacts and Units tables not in scope for this phase.

### Steps (ordered)

1. Load `gf-security` and `gf-api`; ensure GET list route validates all query params with Zod and applies org scope.
2. Extend QR codes list API to accept and apply `search`, `createdFrom`/`createdTo`, `expiresFrom`/`expiresTo`, `lastScanFrom`/`lastScanTo` (or equivalent); keep `limit`/`offset`.
3. Add filter UI: global search (debounced), date range inputs in a popover or filter bar; use @gate-access/ui components.
4. Wire filter state to data fetch (e.g. useSWR key includes filter params); table updates when filters change.
5. Add unit or integration tests for API: filter params are applied and org scope is enforced.
6. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] API accepts and applies search + date range params; all queries scoped by `organizationId` and `deletedAt: null`.
- [ ] QR Codes table filter bar has global search (debounced) and date range pickers for createdAt, expiresAt, lastScanAt.
- [ ] Filtering triggers server-side request; table shows filtered results.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (include tests for filter API).

### Files likely touched

- `apps/client-dashboard/src/app/api/qrcodes/route.ts` (or equivalent GET handler)
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesFilterBar.tsx` (new or extended)
