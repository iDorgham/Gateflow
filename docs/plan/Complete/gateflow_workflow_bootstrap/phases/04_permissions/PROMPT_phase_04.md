# Phase 04: Permissions

## Primary role

BACKEND / FRONTEND (Permissions)

## Tool Selection

| Tool            | Role this phase                                                 |
| --------------- | --------------------------------------------------------------- |
| **Cursor**      | Primary writer for QR permission APIs, filters, and unit tests  |
| **Antigravity** | Workspace execution, plan verification, and evidence generation |
| **Claude CLI**  | Read-only security & permission review                          |

## Skills to load

- `signed-qr-credentials`
- `rbac-gate-assignment`
- `tenant-isolation`
- `workflow-v2-contract`

## Scope

App: `apps/client-dashboard`
Scope: Verify QR permission listing, rule type schemas (`ONETIME`, `MULTIUSE`, `RECURRING`), filtering consistency, and bulk actions with strict tenant isolation. Create evidence document `PHASE_04_PERMISSIONS_MATRIX.md`.

## Steps

1. Confirm focus is `client-dashboard` via `node scripts/workflow-v2/cli.js focus status`.
2. Inspect QR code permission management endpoints (`/api/qrcodes`, `/api/qrcodes/validate`, `/api/qrcodes/export`, `/api/qrcodes/bulk-delete`).
3. Verify tenant boundary enforcement (`organizationId`) across permission lists and filters.
4. Verify access rule types and revocation status handling.
5. Generate evidence artifact `docs/plan/Active/gateflow_workflow_bootstrap/evidence/PHASE_04_PERMISSIONS_MATRIX.md`.
6. Run unit tests for QR APIs (`pnpm --filter client-dashboard test -- qrcodes`).
7. Run `pnpm workflow:v2:check` and ensure clean contract tests.

## Acceptance criteria

- [ ] QR permission APIs verified with tenant isolation (`organizationId`)
- [ ] Access rule types (`ONETIME`, `MULTIUSE`, `RECURRING`) cataloged and tested
- [ ] QR unit tests green (`pnpm --filter client-dashboard test -- qrcodes`)
- [ ] `pnpm workflow:v2:check` passes 100%
- [ ] Evidence document `PHASE_04_PERMISSIONS_MATRIX.md` created and dated

## Exit

```text
/dev client_dashboard_access_logs 5
```
