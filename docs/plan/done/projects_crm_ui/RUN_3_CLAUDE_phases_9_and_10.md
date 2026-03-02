# Run 3 — CLAUDE CLI (Phases 9 backend + Phase 10)

**Run this prompt in Claude CLI.** Phases 2–9 UI are done in Cursor (Run 2). You implement: (1) Phase 9 backend — sort and pagination for QR codes list API; (2) Phase 10 — export (CSV), bulk selection/actions, and audit logging. After Claude proposes changes, apply in Cursor and run preflight.

---

You are implementing **backend only** for **Phase 9** and full **Phase 10** of the GateFlow projects_crm_ui plan.

**Context:** GateFlow client-dashboard. Apps: `apps/client-dashboard` (Next.js 14). Packages: `@gate-access/db`. Rules: `.cursor/contracts/CONTRACTS.md` — all list/export/bulk APIs must scope by `organizationId`, validate inputs (Zod), respect `deletedAt: null`, require auth. Load `.cursor/skills/gf-security/SKILL.md` and `.cursor/skills/gf-api/SKILL.md`.

**Goal (Phase 9 backend):** Extend QR codes list API to accept `sortBy`, `sortOrder` (allowlisted columns), `page`, `pageSize` (or `limit`/`offset`). Return `total` or `hasMore`. Apply ordering safely in Prisma; no raw user input as column names.

**Goal (Phase 10):** Add export and bulk for QR Codes table.
- **Export:** New endpoint (e.g. `GET /api/qrcodes/export` or `POST`) with same filter/sort params as list, optional `ids[]` for “selected only”. Return CSV; Content-Disposition attachment. Auth + org scope; log export in audit.
- **Bulk:** Bulk soft-delete endpoint (e.g. PATCH/DELETE with body ids); auth + org scope; soft-delete only; log bulk-delete in audit. No hard delete.
- Audit: log who, when, and what (filters/ids) for export and bulk-delete. Use existing audit mechanism or add AuditLog table if missing.

**Scope (out):** No UI changes; Cursor already added Export button, checkboxes, and bulk actions in Run 2. You only implement the APIs and audit.

**Steps:**
1. Phase 9: Extend GET list API for qrcodes: accept and validate `sortBy`, `sortOrder`, `page`, `pageSize`; return total/count; apply ordering with allowlisted columns.
2. Phase 10: Implement export endpoint (filter/sort/ids → CSV); implement bulk soft-delete by ids; add audit logging for both. Ensure auth and org scope on every path.
3. Add or extend tests for sort/pagination, export, and bulk-delete (auth, org scope, audit).
4. Output: file list and code (or patches). Cursor will apply and run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

**Acceptance:** Sort and pagination params work and are org-scoped; export returns CSV with auth and audit; bulk soft-delete works with auth and audit; no hard delete; lint/typecheck/tests pass.
