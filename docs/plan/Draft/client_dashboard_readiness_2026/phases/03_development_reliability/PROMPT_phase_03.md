# Phase 03 — Development and test reliability

Act as the single primary writer for `apps/client-dashboard`.

Find the actual Jest open handles and remove the need for `--forceExit`; do not
hide leaks with longer timeouts. Restore the QR validation suite and classify
every remaining skip with owner, reason, and expiry. Establish a ratcheted lint
baseline below 282 warnings and fix risk-path `any`, dead imports, and empty
blocks without blanket disables. Document a deterministic local readiness check
that validates variable names and connectivity without reading secret values.

Preserve the security invariants from Phase 02. Add regression tests before or
with each fix. Run:

```bash
pnpm --filter client-dashboard lint
pnpm --filter client-dashboard typecheck
pnpm --filter client-dashboard test
pnpm --filter client-dashboard build
```

Update TASKS, SESSION_MEMORY, and a phase log with natural test exit evidence,
skip inventory, warning count, and changed-file ownership.

Mutation boundary: focused app and necessary test tooling only; no deployment,
push, migration, or broad formatting.

Exit: Phase 04 prompt.
