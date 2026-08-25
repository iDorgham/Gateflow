# Phase 4 — API Hardening, Coverage, and Final Certification

**Role:** Security/API/testing. Read all plan artifacts and phase logs first.

## Goal and scope

Inventory high-risk routes; standardize composable authentication, authorization, tenant, schema, rate-limit, and audit controls; add negative/cross-tenant/replay tests; verify CSP/security headers; resolve Jest open handles; align docs; certify the audit. Do not rewrite every route or infer coverage from file counts alone.

Prioritize mutation, admin, setup, cron, webhook, bulk, import/export, and AI-tool endpoints. Preserve clear 400/401/403/429 behavior.

## Acceptance and verification

- [ ] High-risk routes have explicit controls and positive/negative/cross-tenant tests.
- [ ] Security headers/CSP are verified; open handles are fixed or have dated owned exceptions.
- [ ] No P0/P1 finding is reproducible; full checks pass.

```bash
pnpm check:env
pnpm check:imports:fail
pnpm check:secrets
pnpm check:security:fail
pnpm typecheck:all
pnpm preflight
```

Complete tasks, memory, phase 4 log, docs, and backlog reconciliation before `pnpm plan:done audit_remediation_2026`; do not edit the plan.
