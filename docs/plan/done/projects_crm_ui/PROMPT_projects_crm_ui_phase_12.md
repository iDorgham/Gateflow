# Pro Prompt — Phase 12: Tables polish, performance, mobile, security audit

## Phase 12: Tables polish, performance, mobile, security audit

### Primary role

FRONTEND / QA / SECURITY

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] gf-security — CONTRACTS.md, gf-security SKILL (audit checklist)
- [x] gf-design-guide — responsive, tokens
- [x] gf-testing — Jest, integration tests
- [ ] gf-creative-ui-animation — transitions, loading states

### Preferred tool

- [ ] Cursor (default)
- [x] **Claude CLI** — security audit of table/export/bulk APIs (per GUIDE_PREFERENCES.md)
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

**Tool note:** Security audit: Claude CLI; polish, performance, responsive: Cursor. Cursor applies and verifies.

### Context

- **Project:** GateFlow — client-dashboard. Phases 6–11 done (advanced tables for QR Codes, Contacts, Units).
- **Rules:** `.cursor/contracts/CONTRACTS.md`, `.cursor/skills/gf-security/SKILL.md` — all table list/export/bulk endpoints must be audited for org scope, auth, input validation, and audit logging.

### Goal

**Polish** the three tables (QR Codes, Contacts, Units): loading skeletons, error states, inline loading when filtering/sorting/paginating; **responsive** behavior (mobile: collapse non-essential columns or horizontal scroll); **performance** (virtualization if >500 rows); and a **security audit** of all table-related APIs (list, export, bulk delete) for org scope, auth, and audit trail.

### Scope (in)

- Loading: skeleton rows or spinner while data is loading; inline loading indicator when filters/sort/pagination change.
- Error: display error state with retry when fetch fails.
- Responsive: on narrow viewport, either collapse less important columns or enable horizontal scroll; ensure toolbar (search, export) remains usable.
- Performance: ensure virtualization is used for table body where row count can exceed ~500; verify no N+1 or unbounded queries in list APIs.
- Security audit: review `/api/qrcodes`, `/api/contacts`, `/api/units` (list, export, bulk) for: auth required, `organizationId` in every query, `deletedAt: null` where applicable, Zod validation on inputs, export/bulk actions logged; fix any gap.

### Scope (out)

- No new features; only polish, performance, and security verification.

### Steps (ordered)

1. **Load `.cursor/skills/gf-security/SKILL.md`** and `.cursor/contracts/CONTRACTS.md`.
2. Add or refine loading skeleton for each table; add error state with retry; add inline loading when filters/sort/pagination change.
3. Implement responsive behavior: media query or container query to hide or collapse columns on small screens, or enable horizontal scroll with sticky first column if needed.
4. Verify virtualization is in place for any table that can show >500 rows; optimize list API queries (select only needed fields, indexes).
5. Security audit: for each of qrcodes, contacts, units — list, export, bulk-delete — confirm: auth checked, org scope applied, soft delete only, input validated, audit log written. Document findings; fix any violation.
6. Run full preflight: `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] All three tables show loading skeleton and error state with retry; inline loading on filter/sort/page change.
- [ ] Tables are responsive on mobile (collapsed columns or horizontal scroll; toolbar usable).
- [ ] List APIs and table rendering do not cause performance issues (virtualization where needed; no unbounded queries).
- [ ] Security audit completed: all table/export/bulk endpoints enforce auth, org scope, soft deletes, validation, and audit logging; no gaps.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes.

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ContactsTable.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/UnitsTable.tsx`
- List/export/bulk API routes (audit only, or small fixes)
- Optional: `docs/plan/execution/AUDIT_tables_security.md` (audit summary)
