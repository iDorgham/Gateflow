# Session Memory — audit_remediation_2026

## Active state

- **Phase:** 3 complete (trustworthy CI / scanners)
- **Branch:** `fix/audit-remediation-phase-3`
- **Last commits:** (pending phase 3 commit)
- **Next action:** Phase 4 — API certification (`PROMPT_audit_remediation_2026_phase_4.md`); ops still owes Phase 1 credential-rotation receipt

## Cross-session decisions

- Shared security helpers live in `@gate-access/types` (`packages/types/src/security/`) — sanitize CMS HTML and branding CSS at write + render.
- Bootstrap guard: `pnpm check:bootstrap-routes` scans `apps/` for reset-admin paths and `gateflow-setup-2026`; wired into `preflight` and CI Security Scan.
- Reset-admin route removed; no replacement HTTP bootstrap — dev uses prisma/seed scripts with `SEED_PASSWORD`.
- Tenant isolation: **AsyncLocalStorage** + fail-closed `db`; `prisma`/`privilegedDb` are privileged; PG **RLS deferred** (revisit Phase 4 / 2026-09-30).
- Bulk `prisma`→`db` migration of ~261 callers allowlisted with justification; high-risk validate path migrated this phase.
- Scanner root: `scripts/check/repo-root.js` → `../..` (never single `..`). Empty scans fail closed.
- Dependency advisory: unavailable → exit **2**; vulns → exit 1 (with `--fail`); clean → 0.
- Dashboard typecheck restored in preflight/CI (no exclusion).
- Skipped-test / `--forceExit` budgets in `scripts/check/test-budgets.json` (expiry 2026-09-30).
- pnpm stays **8.15.0**; document Node drift rather than blind upgrade (`PNPM_RUNTIME_DRIFT.md`).

## Discovered gotchas

- `password123` remains in local-only prisma utilities (not production HTTP); distinct from removed reset-admin default secret.
- Style save must validate token keys/values before persisting (`isValidBrandingTokenKey`, `validateBrandingTokenValue`).
- Prisma 5.22 extended unique where allows `organizationId` (+ `deletedAt`) on `findUnique`/`update` — tenant wrapper relies on this.
- `$transaction` `tx` is not tenant-wrapped; fire-and-forget after `clearOrganizationContext` must use privileged `prisma` + explicit org filters.
- `client.ts` still exports legacy `db = prisma` (deprecated); package index exports tenant `db`.
- False-green scanners previously reported success with **0 files** because ROOT was `scripts/`.
- `progress.tsx` → barrel `index` caused the only circular import once scanners saw real files.
- Tenant `db.incident.create` still needs explicit `organizationId` for Prisma Exact types even when ALS injects org at runtime.
- Tracked `scan_results.txt` / `.lighthouseci` create noisy MEDIUM secret hits — skip patterns required.
- `js-yaml` 3.14.2 / 4.1.1 failed HIGH advisory until overrides 3.15.0 / 4.3.0.

## State handoff

- Phase logs: `phase_logs/PHASE_LOG_phase_01.md` … `PHASE_LOG_phase_03.md`
- Allowlist: `TENANT_PRISMA_ALLOWLIST.md`
- **Ops:** credential rotation receipt still pending (Phase 1)
- Resume-from: start Phase 4 prompt after phase 3 commit/push

## Context budget (phase 3)

- L0–L2 + L3 phase 3 prompt + TASKS + SESSION_MEMORY + check scripts + CI workflow
