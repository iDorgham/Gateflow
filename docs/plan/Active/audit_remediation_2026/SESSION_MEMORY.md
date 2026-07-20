# Session Memory — audit_remediation_2026

## Active state

- **Phase:** 1 complete for code containment (P0); credential-rotation receipt still pending
- **Branch:** `fix/audit-remediation-phase-1`
- **Next action:** Record rotation receipt, then Phase 2 — tenant isolation (`PROMPT_audit_remediation_2026_phase_2.md`)

## Cross-session decisions

- Shared security helpers live in `@gate-access/types` (`packages/types/src/security/`) — sanitize CMS HTML and branding CSS at write + render.
- Bootstrap guard: `pnpm check:bootstrap-routes` scans `apps/` for reset-admin paths and `gateflow-setup-2026`; wired into `preflight` and CI Security Scan.
- Reset-admin route removed; no replacement HTTP bootstrap — dev uses prisma/seed scripts with `SEED_PASSWORD`.

## Discovered gotchas

- `password123` remains in local-only prisma utilities (not production HTTP); distinct from removed reset-admin default secret.
- Style save must validate token keys/values before persisting (`isValidBrandingTokenKey`, `validateBrandingTokenValue`).
- Root `pnpm preflight` excludes dashboard typecheck (`--filter=!admin-dashboard --filter=!client-dashboard`); “preflight green” ≠ dashboard type validation.

## State handoff

- Phase log: `phase_logs/PHASE_LOG_phase_01.md`
- Verification: `pnpm preflight` green after phase 1 work (**does not** typecheck admin/client dashboards)
- **Ops:** credential rotation receipt still pending in approved ops system (see phase log owner/expiry)

## Context budget (phase 1)

- L0–L2 + L3 phase prompt + CONTEXT + TASKS
