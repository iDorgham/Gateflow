# Phase 3 — Trustworthy CI and Repository Scanners

**Role:** DevOps/testing/security. Read the plan, context, tasks, check scripts, root package/turbo config, and CI workflows.

## Goal and scope

Fix repository-root resolution, make empty/unavailable scans non-green, add scanner regression tests, strengthen full-tree/history secret and dependency scanning, restore dashboard typecheck enforcement or an approved ratchet, and document/fix pnpm runtime drift without blind upgrades or lockfile churn.

## Acceptance and verification

- [ ] Repository scans report meaningful mode/scope/nonzero counts.
- [ ] Smoke tests catch root regressions; unavailable dependency scans are distinct from clean.
- [ ] Dashboard type checking is enforced or has a decreasing owned budget.
- [ ] Scanner gates and preflight pass.

```bash
pnpm check:imports:fail
pnpm check:todos
pnpm check:secrets
pnpm check:security:fail
pnpm typecheck:all
pnpm preflight
```

Never record secret values. Update tasks, memory, and phase 3 log; do not edit the plan.
