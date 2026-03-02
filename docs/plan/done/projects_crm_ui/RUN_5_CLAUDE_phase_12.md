# Run 5 — CLAUDE CLI (Phase 12: final audit & check)

**Run this prompt in Claude CLI last.** After Run 4, all three tables (QR Codes, Contacts, Units) are implemented. You perform a final security and code review and output a checklist plus any fixes.

---

You are performing **Phase 12** of the GateFlow projects_crm_ui plan: **Tables polish, performance, mobile, security audit** — in your role as reviewer/auditor. Cursor will apply any code fixes you recommend; you may also propose concrete patches.

**Context:** GateFlow client-dashboard. Phases 1–11 done. Refs: `.cursor/contracts/CONTRACTS.md`, `.cursor/skills/gf-security/SKILL.md`, `apps/client-dashboard/src/app/api/` (qrcodes, contacts, units — list, export, bulk).

**Goal:** (1) **Security audit** of all table-related APIs (list, export, bulk-delete) for qrcodes, contacts, units: auth required, `organizationId` in every query, `deletedAt: null` where applicable, Zod validation on inputs, export/bulk actions logged. Document findings; propose fixes for any gap. (2) **Performance check:** no N+1 or unbounded queries; list APIs select only needed fields; recommend virtualization for table body if >500 rows. (3) **Code/API consistency:** ensure filter/sort/pagination/export params are consistent across the three resources and that error handling and audit logging are complete.

**Scope (in):**
- Review every list, export, and bulk-delete route for qrcodes, contacts, units.
- Check: requireAuth (or equivalent), org scope on all reads/writes, soft deletes only, Zod for all inputs, audit log for export and bulk-delete.
- Recommend performance improvements (indexes, select fields, virtualization) and any UI polish (loading skeleton, error state, responsive) that Cursor should do.

**Scope (out):** You do not need to implement UI polish yourself; you may list “Cursor should add loading skeleton and error state for each table” etc. You may output patches for API fixes.

**Steps:**
1. Load `.cursor/skills/gf-security/SKILL.md` and `.cursor/contracts/CONTRACTS.md`.
2. For each of `/api/qrcodes`, `/api/contacts`, `/api/units`: list, export, bulk — verify auth, org scope, soft delete, validation, audit. List any violation.
3. Propose concrete code changes (or patches) to fix violations. Recommend performance and UI polish items for Cursor.
4. Optionally produce a short audit summary (e.g. `docs/plan/in-progress/projects_crm_ui/AUDIT_phase12.md`) with checklist and findings.

**Acceptance:** Audit document or checklist exists; all security gaps have proposed fixes; Cursor can apply fixes and run preflight to confirm.
