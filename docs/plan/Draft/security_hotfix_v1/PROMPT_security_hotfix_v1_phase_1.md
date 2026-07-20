# Phase 1: Enforce Auth and Tenant Scoping on scans bulk API

---

## Phase 1: Enforce Auth and Tenant Scoping on scans bulk API

### Primary role

SECURITY

### Preferred tool

- [x] Claude CLI
- [ ] Gemini CLI
- [ ] Opencode CLI
- [ ] Kilo CLI
- [ ] Qwen CLI
- [ ] Cursor CLI
- [ ] Kiro CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard, admin-dashboard, scanner-app, marketing
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `packages/db/src/tenant.ts`, `packages/types/src/user.ts` (`BUILT_IN_ROLES`)

### Goal

Harden `apps/client-dashboard/src/app/api/scans/bulk/route.ts` so the endpoint is authenticated, role-scoped, tenant-scoped, payload-validated, and returns explicit status codes.

### Scope (in)

- Add auth guard (`requireAuth` or equivalent existing guard utility).
- Enforce scans write permission (allow roles with write access: `Gate Operator`, `Security Manager`).
- Resolve `organizationId` from authenticated session context.
- Validate request payload:
  - must be array
  - max length 500
- Use bulk write with duplicate-safe semantics (`skipDuplicates: true`).
- Explicit status mapping: `401`, `400`, `201`.
- Add/update tests for unauthenticated and scoped-write behavior.

### Scope (out)

- No schema migration.
- No unrelated refactor to other scan APIs.

### Steps (ordered)

1. Inspect current route logic and auth/session helpers in client-dashboard.
2. Implement auth + role gate with early `401` exit (Gate Operator, Security Manager, or permission-equivalent check).
3. Add payload validation and `400` handling.
4. Ensure `organizationId` is attached to all inserted rows.
5. Perform duplicate-safe insert.
6. Add/update tests for:
   - unauthorized request returns `401`
   - invalid payload returns `400`
   - valid payload returns `201` and writes are org-scoped
7. Run `pnpm preflight`.
8. Update `TASKS_security_hotfix_v1.md`, `phase_logs/PHASE_LOG_phase_01.md`, and `SESSION_MEMORY.md`.

### Acceptance criteria

- [ ] Unauthenticated call receives `401`.
- [ ] Invalid payload receives `400`.
- [ ] Successful request receives `201`.
- [ ] All writes are scoped by authenticated `organizationId`.
- [ ] Only roles with scans write permission (`Gate Operator`, `Security Manager`) may call the endpoint.
- [ ] `pnpm preflight` passes; if preflight fails, stop and remediate before marking phase complete.
- [ ] Phase log updated with pass/fail criteria (include preflight failure remediation notes when applicable).
