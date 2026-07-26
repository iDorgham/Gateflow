# Phase 03: Contacts and invitations

## Primary role

BACKEND / FRONTEND (Contacts and Invitations)

## Tool Selection

| Tool            | Role this phase                                                 |
| --------------- | --------------------------------------------------------------- |
| **Cursor**      | Primary writer for contact APIs, invite handlers, and tests     |
| **Antigravity** | Workspace execution, plan verification, and evidence generation |
| **Claude CLI**  | Read-only code & security review                                |

## Skills to load

- `invitation-lifecycle`
- `delivery-email`
- `delivery-whatsapp`
- `tenant-isolation`
- `workflow-v2-contract`

## Scope

App: `apps/client-dashboard`
Scope: Verify contact management (CRUD), resident invitation triggers, and multi-channel delivery states (Email/WhatsApp) with strict tenant isolation. Create evidence document `PHASE_03_CONTACTS_INVITATIONS_MATRIX.md`.

## Steps

1. Confirm focus is `client-dashboard` via `node scripts/workflow-v2/cli.js focus status`.
2. Inspect contact management endpoints (`/api/crm/contacts`, `/api/crm/contacts/[id]`, `/api/contacts/[id]/invite`).
3. Verify tenant boundary rules (`organizationId`) and soft-delete filters (`deletedAt: null`) across queries.
4. Verify invitation delivery status tracking:
   - SMTP Email delivery attempts (`/api/qr/send-email`)
   - WhatsApp webhook delivery triggers (`/api/webhooks/whatsapp`)
5. Generate evidence artifact `docs/plan/Active/gateflow_workflow_bootstrap/evidence/PHASE_03_CONTACTS_INVITATIONS_MATRIX.md`.
6. Run unit tests for contact APIs (`pnpm --filter client-dashboard test -- crm/contacts`).
7. Run `pnpm workflow:v2:check` and ensure clean contract tests.

## Acceptance criteria

- [ ] Contact CRUD & invitation APIs verified with tenant isolation (`organizationId`)
- [ ] Email & WhatsApp delivery states cataloged and tested
- [ ] Contact unit tests green (`pnpm --filter client-dashboard test -- crm/contacts`)
- [ ] `pnpm workflow:v2:check` passes 100%
- [ ] Evidence document `PHASE_03_CONTACTS_INVITATIONS_MATRIX.md` created and dated

## Exit

```text
/dev client_dashboard_permissions 4
```
