# Phase 06 — Pilot and deployment certification

Act as the certification owner, not a broad feature writer. Re-read every phase
log and reject stale or incomparable evidence.

Prove the complete happy path and required expired, revoked, tampered,
wrong-gate, wrong-tenant/project, replay, not-active, usage-limit, and
offline/interrupted outcomes. Validate English/Arabic and mobile/desktop where
UI is involved. Confirm denial reason codes, tenant boundaries, audit-event
immutability, optional notes, and access-log visibility.

Run exactly:

```bash
pnpm --filter client-dashboard lint
pnpm --filter client-dashboard typecheck
pnpm --filter client-dashboard test
pnpm --filter client-dashboard build
pnpm preflight
pnpm workflow:v2:check
```

Verify preview build, `/health`, runtime logs, non-secret environment-variable
references, database migration status, and rollback runbook. Vercel commands
must run from repository root. Preview or production actions require explicit
authorization; production also requires all P0/P1 findings closed and a
recorded certification receipt.

Update audit evidence, page scores, 9/9 pilot coverage, TASKS, SESSION_MEMORY,
phase log, and Workflow v2 state. Do not mark complete on compilation alone.

Stop on any P0/P1 security regression, destructive migration, failed denial
case, broken rollback, or missing credential-rotation evidence.
