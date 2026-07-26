# Phase 05: Gates and access logs

## Primary role

BACKEND / SECURITY (Gates and Access Logs)

## Tool Selection

| Tool            | Role this phase                                                   |
| --------------- | ----------------------------------------------------------------- |
| **Cursor**      | Primary writer for gate assignment, scan log APIs, and unit tests |
| **Antigravity** | Workspace execution, plan verification, and evidence generation   |
| **Claude CLI**  | Read-only security & audit log review                             |

## Skills to load

- `access-event-audit`
- `rbac-gate-assignment`
- `tenant-isolation`
- `workflow-v2-contract`

## Scope

App: `apps/client-dashboard`
Scope: Verify gate configuration (`/api/gates`), operator assignments (`/api/gates/assignments`), append-only scan event log syncing (`/api/scans/bulk`), and manual denial overrides with strict tenant isolation. Create evidence document `PHASE_05_GATES_ACCESS_LOGS_MATRIX.md`.

## Steps

1. Confirm focus is `client-dashboard` via `node scripts/workflow-v2/cli.js focus status`.
2. Inspect gate management and operator assignment endpoints (`/api/gates`, `/api/gates/assignments`, `/api/gates/assigned`).
3. Inspect scan event logging and denial endpoints (`/api/scans/bulk`, `/api/scans/[scanId]/deny`, `/api/scans/my-recent`, `/api/scans/export`).
4. Verify append-only log invariants and tenant boundary enforcement (`organizationId`) across all scan queries.
5. Generate evidence artifact `docs/plan/Active/gateflow_workflow_bootstrap/evidence/PHASE_05_GATES_ACCESS_LOGS_MATRIX.md`.
6. Run unit tests for gates and scan log APIs (`pnpm --filter client-dashboard test -- gates`, `pnpm --filter client-dashboard test -- scans`).
7. Run `pnpm workflow:v2:check` and ensure clean contract tests.

## Acceptance criteria

- [ ] Gate configuration and assignment APIs verified with tenant isolation (`organizationId`)
- [ ] Scan Log sync & denial endpoints cataloged and tested
- [ ] Gate & Scan unit tests green (`pnpm --filter client-dashboard test -- gates`, `pnpm --filter client-dashboard test -- scans`)
- [ ] `pnpm workflow:v2:check` passes 100%
- [ ] Evidence document `PHASE_05_GATES_ACCESS_LOGS_MATRIX.md` created and dated

## Exit

```text
/dev client_dashboard_certification 6
```
