# Phase 01: Product and route lock

## Primary role

FRONTEND / ARCHITECTURE (Route & Product Lock)

## Tool Selection

| Tool            | Role this phase                                               |
| --------------- | ------------------------------------------------------------- |
| **Cursor**      | Primary writer for route inventory and evidence documentation |
| **Antigravity** | Workspace execution, plan verification, and state transition  |
| **Claude CLI**  | Read-only architecture review                                 |

## Skills to load

- `frontend-nextjs`
- `page-inventory`
- `verification-before-completion`
- `workflow-v2-contract`

## Scope

App: `apps/client-dashboard`
Scope: Classify and lock all 43 routes (28 API endpoints, 15 localized UI routes) for the residential pilot journey. Update evidence documents under `docs/plan/Draft/gateflow_workflow_bootstrap/evidence/`.

## Steps

1. Confirm focus is `client-dashboard` and stage is `audited` via `node scripts/workflow-v2/cli.js focus status`.
2. Map all 43 routes under `apps/client-dashboard/src/app/` into pilot-critical vs standard dashboard categories.
3. Lock pilot journey dependencies:
   - Contacts & Onboarding (`/api/crm/contacts`, `/dashboard/.../contacts`)
   - Invitations & QR (`/api/qr/send-email`, `/api/qrcodes`, `/s/[shortId]`)
   - Resident Arrival (`/api/resident/arrived`, `/lib/arrival-capability`)
   - Scan & Access Events (`/api/scans`, `/api/gates`, `/dashboard/.../scans`)
4. Verify evidence artifact `PHASE_01_ROUTE_API_INVENTORY.md` matches filesystem truth.
5. Run `pnpm workflow:v2:check` and ensure clean typecheck/lint.
6. Transition workflow stage to `planned` using `node scripts/workflow-v2/cli.js transition planned`.

## Acceptance criteria

- [ ] All 43 routes in `client-dashboard` cataloged and locked in evidence matrix
- [ ] Pilot-critical routes mapped to the 9-step residential access journey
- [ ] `pnpm workflow:v2:check` passes 100%
- [ ] Workflow v2 stage transitioned to `planned`
- [ ] Working tree clean on `feat/client-dashboard-route-lock`

## Exit

```text
/dev client_dashboard_route_lock 1
```
