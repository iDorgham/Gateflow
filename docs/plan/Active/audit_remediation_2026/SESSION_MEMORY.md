# Session Memory — audit_remediation_2026

## Active state

- **Phase:** 2 complete (tenant isolation ALS + fail-closed `db`)
- **Branch:** `fix/audit-remediation-phase-2`
- **Last focus:** `packages/db/src/tenant.ts`, validate route, `TENANT_PRISMA_ALLOWLIST.md`
- **Next action:** Phase 3 — Trustworthy CI (`PROMPT_audit_remediation_2026_phase_3.md`); ops still owes Phase 1 credential-rotation receipt

## Cross-session decisions

- Shared security helpers live in `@gate-access/types` (`packages/types/src/security/`) — sanitize CMS HTML and branding CSS at write + render.
- Bootstrap guard: `pnpm check:bootstrap-routes` scans `apps/` for reset-admin paths and `gateflow-setup-2026`; wired into `preflight` and CI Security Scan.
- Reset-admin route removed; no replacement HTTP bootstrap — dev uses prisma/seed scripts with `SEED_PASSWORD`.
- Tenant isolation: **AsyncLocalStorage** + fail-closed `db`; `prisma`/`privilegedDb` are privileged; PG **RLS deferred** (revisit Phase 4 / 2026-09-30).
- Bulk `prisma`→`db` migration of ~261 callers allowlisted with justification; high-risk validate path migrated this phase.

## Discovered gotchas

- `password123` remains in local-only prisma utilities (not production HTTP); distinct from removed reset-admin default secret.
- Style save must validate token keys/values before persisting (`isValidBrandingTokenKey`, `validateBrandingTokenValue`).
- Root `pnpm preflight` excludes dashboard typecheck (`--filter=!admin-dashboard --filter=!client-dashboard`); “preflight green” ≠ dashboard type validation.
- Prisma 5.22 extended unique where allows `organizationId` (+ `deletedAt`) on `findUnique`/`update` — tenant wrapper relies on this.
- `$transaction` `tx` is not tenant-wrapped; fire-and-forget after `clearOrganizationContext` must use privileged `prisma` + explicit org filters.
- `client.ts` still exports legacy `db = prisma` (deprecated); package index exports tenant `db`.

## State handoff

- Phase logs: `phase_logs/PHASE_LOG_phase_01.md`, `phase_logs/PHASE_LOG_phase_02.md`
- Allowlist: `TENANT_PRISMA_ALLOWLIST.md`
- **Ops:** credential rotation receipt still pending (Phase 1)
- Resume-from: start Phase 3 prompt after phase 2 commit/push

## Context budget (phase 2)

- L0–L2 + L3 phase 2 prompt + L4 tenant module + TASKS + SESSION_MEMORY + allowlist
