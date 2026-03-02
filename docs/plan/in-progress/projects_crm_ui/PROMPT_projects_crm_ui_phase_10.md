# Pro Prompt — Phase 10: Export (CSV) & bulk selection

## Phase 10: Export (CSV) & bulk selection

### Primary role

BACKEND-API / FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] gf-security — auth, RBAC, org scope, audit (CONTRACTS.md, gf-security SKILL)
- [x] gf-api — API routes, validation, rate limiting
- [x] react — React/Next.js patterns
- [ ] gf-testing — Jest, test patterns

### Preferred tool

- [ ] Cursor (default)
- [x] **Claude CLI** — export endpoint, bulk-delete, audit logging, security (per GUIDE_PREFERENCES.md)
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

**Tool note:** Backend/export/bulk/audit: Claude CLI; table toolbar & checkboxes: Cursor. Cursor applies and verifies.

### Context

- **Project:** GateFlow — client-dashboard; Phases 6, 8, 9 done (QR Codes table with filter, sort, pagination).
- **Rules:** `.cursor/contracts/CONTRACTS.md`, `.cursor/rules/00-gateflow-core.mdc`, `.cursor/skills/gf-security/SKILL.md` — export and bulk actions must: require auth, scope by `organizationId`, validate inputs, log export/bulk-delete in audit trail; soft deletes only (no hard delete).

### Goal

Add **Export (CSV)** and **bulk row selection** to the QR Codes table: toolbar “Export” button (filtered & sorted data via server-side endpoint), optional “export selected only”; bulk checkboxes and bulk actions (export selected, delete selected with confirmation); **audit log** for export and bulk-delete.

### Scope (in)

- New endpoint: e.g. `GET /api/qrcodes/export` or `POST /api/qrcodes/export` with same filter/sort params as list (and optional `ids[]` for “selected only”). Return CSV; Content-Disposition attachment. Auth required; org scope; rate limit if needed.
- Audit: log export action (who, when, filters/ids) and bulk-delete (who, when, ids); extend existing audit mechanism or add a simple AuditLog table if missing.
- QR Codes table: “Export” button in toolbar; optional “Export selected” when rows selected. Row checkboxes; “Select all” on page; bulk actions dropdown: “Export selected”, “Delete selected” (with confirmation). Bulk delete: call DELETE or PATCH to soft-delete by ids; org scope and auth required.

### Scope (out)

- Contacts and Units bulk/export in a later phase (Phase 11).

### Steps (ordered)

1. **Load `.cursor/skills/gf-security/SKILL.md`** and `.cursor/contracts/CONTRACTS.md`; ensure export and bulk-delete design respects org scope, auth, and audit.
2. Implement export endpoint: accept filter/sort params (and optional ids); generate CSV server-side; set Content-Disposition; require auth; scope by org; log export in audit.
3. Implement bulk soft-delete (e.g. PATCH or DELETE with body ids); require auth and org scope; soft-delete only; log bulk-delete in audit.
4. Add “Export” and “Export selected” to table toolbar; wire to export API (open in new tab or blob download). Add row checkboxes and “Select all”; bulk actions: Export selected, Delete selected (with confirm modal).
5. Add or extend tests: export and bulk-delete require auth and respect org scope; audit entries created.
6. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] Export endpoint returns CSV for filtered/sorted data (or selected ids); auth and org scope enforced; export action logged.
- [ ] Bulk soft-delete endpoint accepts ids; auth and org scope enforced; bulk-delete logged; no hard delete.
- [ ] QR Codes table has Export button, row checkboxes, Select all, and bulk actions (Export selected, Delete selected with confirmation).
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (include export and bulk-delete tests).

### Files likely touched

- `apps/client-dashboard/src/app/api/qrcodes/export/route.ts` (new)
- `apps/client-dashboard/src/app/api/qrcodes/route.ts` (bulk delete or new route)
- Audit logging (existing or new table/handler)
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx` (toolbar, checkboxes, bulk actions)
