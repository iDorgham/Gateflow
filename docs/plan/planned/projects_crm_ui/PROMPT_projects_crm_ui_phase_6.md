# Pro Prompt — Phase 6: Advanced tables — TanStack Table base (QR Codes first)

## Phase 6: TanStack Table base + QR Codes page

### Primary role

FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] react — React/Next.js patterns
- [x] gf-architecture — app structure, conventions
- [x] gf-design-guide — layout, tokens
- [x] gf-security — org scope, no data leak (for data-fetching contract)
- [ ] gf-testing — Jest, test patterns

### MCP to use

| MCP | When |
|-----|------|
| Context7 | TanStack Table / React Table v8 API lookup |

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI

### Context

- **Project:** GateFlow — client-dashboard (Next.js 14), pnpm, Turborepo.
- **Rules:** `.cursor/contracts/CONTRACTS.md`, `.cursor/rules/00-gateflow-core.mdc` — multi-tenant (`organizationId`), soft deletes (`deletedAt: null`), no direct DB from client.
- **Refs:** `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/`, existing QR list/API (e.g. `/api/qrcodes`).

### Goal

Introduce **TanStack Table** (React Table v8) as the base for the QR Codes table with server-side data fetching and a default column set, without yet adding column reorder, advanced filters, or export.

### Scope (in)

- QR Codes page: replace or wrap existing table with TanStack Table.
- Default columns for QR: code/preview, type, createdAt, expiresAt, status, createdBy, scans count, lastScanAt, linked unit(s), linked contact(s), source (or available fields from API).
- Data fetching: use existing `/api/qrcodes` (or equivalent) with org scope; support `limit`/`offset` (or `page`/`pageSize`) for future pagination.
- Use `@gate-access/ui` components (Table, Button, Badge, etc.) and semantic tokens (real-estate palette).

### Scope (out)

- No column reorder, persistence, or advanced filtering in this phase.
- No export or bulk selection.
- Contacts and Units tables unchanged.

### Steps (ordered)

1. Load `gf-security` and skim CONTRACTS.md; ensure any new data hooks use auth and org-scoped API only.
2. Add `@tanstack/react-table` (and peer deps) to `apps/client-dashboard` if not present; verify version compatible with React 18.
3. In the QR Codes page (or a new `QRCodesTable` component), define column definitions for the default QR column set.
4. Implement server-side data fetching (e.g. `useSWR` or fetch) calling `/api/qrcodes` with query params for pagination (e.g. `limit`, `offset`); ensure response is org-scoped (no cross-tenant data).
5. Wire TanStack Table with the fetched data; render table using @gate-access/ui Table primitives; keep existing EditPanel or row actions if any.
6. Add a simple toolbar above the table: placeholder for future search/filters, “Refresh” button. No export yet.
7. Add loading and error states (skeleton or spinner).
8. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] QR Codes page uses TanStack Table with default column set.
- [ ] Data is loaded via existing org-scoped API; no client-side bypass of auth.
- [ ] Loading and error states are shown.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (no regression).

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/page.tsx` (or equivalent)
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx` (new or refactored)
- `apps/client-dashboard/package.json` (if adding @tanstack/react-table)
