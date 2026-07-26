# Phase 02: Shared contract lock

## Primary role

BACKEND / SECURITY (Shared Contract Lock)

## Tool Selection

| Tool            | Role this phase                                                    |
| --------------- | ------------------------------------------------------------------ |
| **Cursor**      | Primary writer for shared contract types, interfaces, and evidence |
| **Antigravity** | Workspace execution, plan verification, and state transition       |
| **Claude CLI**  | Read-only security & contract review                               |

## Skills to load

- `api-contracts`
- `security-access`
- `scan-decision-reason-codes`
- `signed-qr-credentials`
- `workflow-v2-contract`

## Scope

App: `apps/client-dashboard` & shared packages (`packages/types`, `packages/db`, `packages/api-client`)
Scope: Verify and lock shared typed contracts for Identity, RBAC, HMAC-SHA256 signed QR credentials, Scan Decisions, and append-only Scan Event logs. Produce evidence artifact `PHASE_02_SHARED_CONTRACT_MATRIX.md`.

## Steps

1. Confirm focus is `client-dashboard` via `node scripts/workflow-v2/cli.js focus status`.
2. Transition workflow stage to `developing` via `node scripts/workflow-v2/cli.js transition developing`.
3. Lock shared contract definitions across:
   - Identity & RBAC (`UserRole`, `TenantAccess`, `SessionClaims`)
   - Signed QR Credentials (`HMAC-SHA256`, arrival capability payloads)
   - Scan Decisions (`SUCCESS`, `EXPIRED`, `REVOKED`, `INVALID_SIGNATURE`, `REPLAYED`, `LIMIT_EXCEEDED`)
   - Append-Only Access Logs (`ScanLog` schema invariants & audit records)
4. Generate evidence artifact `docs/plan/Active/gateflow_workflow_bootstrap/evidence/PHASE_02_SHARED_CONTRACT_MATRIX.md`.
5. Run `pnpm workflow:v2:check` and verify zero contract errors.
6. Transition workflow stage to `checking` via `node scripts/workflow-v2/cli.js transition checking`.

## Acceptance criteria

- [ ] Shared contracts (Identity, RBAC, QR, Scan Decisions) locked and verified
- [ ] QR signature verification vectors tested and green
- [ ] `pnpm workflow:v2:check` passes 100%
- [ ] Workflow v2 stage transitioned to `checking`
- [ ] Evidence document `PHASE_02_SHARED_CONTRACT_MATRIX.md` created and dated

## Exit

```text
/dev client_dashboard_contacts 3
```
