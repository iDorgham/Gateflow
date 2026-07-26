# PLAN — gateflow_workflow_bootstrap

**Status:** Draft  
**Date:** 2026-07-24  
**Focused app:** `apps/client-dashboard`  
**Branch:** `codex/gateflow-workflow-bootstrap`  
**Canonical state:** `.ai/workflow-v2/state.json` (do not add `.gateflow/`)

## Outcome

Prove one Workflow v2 source of truth and a working `/guide` surface so Client
Dashboard pilot work can start from fresh evidence. Phase 0 does not change
product behavior.

## Pilot order (locked)

```text
Client Dashboard → Resident Portal → Scanner App → End-to-end pilot
```

## Pilot journey (context for later phases)

```text
Admin creates or imports a resident contact
→ invitation is sent by email or WhatsApp
→ resident activates the account
→ resident creates a guest QR permission
→ permission appears in Client Dashboard
→ security scans the QR
→ scanner accepts or denies deterministically
→ security adds an optional note
→ event appears in Client Dashboard access log
```

Required denial cases: expired, revoked, tampered signature, wrong gate, wrong
tenant, already used/replayed, not active yet, usage limit reached,
offline/interrupted scan policy.

## Phases

| Phase  | Title                          | Scope                                                                               | Branch                                 |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------- |
| **00** | Workflow bootstrap             | Guide status/next/prompt/delivery, state schema pointers, agent alias, plan package | `codex/gateflow-workflow-bootstrap`    |
| 01     | Product and route lock         | Route inventory, pilot-critical classification, page scores                         | `codex/client-dashboard-route-lock`    |
| 02     | Shared contract lock           | Identity, RBAC, QR, scan decisions, access events                                   | `codex/client-dashboard-contracts`     |
| 03     | Contacts and invitations       | Contact CRUD + invite delivery states                                               | `codex/client-dashboard-contacts`      |
| 04     | Permissions                    | QR permission list/filter consistency                                               | `codex/client-dashboard-permissions`   |
| 05     | Gates and access logs          | Gate config + immutable access events                                               | `codex/client-dashboard-access-logs`   |
| 06     | Client Dashboard certification | Lint/typecheck/test/build + security/RTL + preview                                  | `codex/client-dashboard-certification` |
| 07     | Focus transition               | Explicit Resident Portal focus decision                                             | new focus decision                     |

**Execution now:** Phase 00 only. Phases 01–07 wait for Phase 00 exit and `/audit all`.

## Two-workspace rule

- Control / UrBrain: `/Users/Dorgham/Documents/Work/Devleopment/Dorgham`
- Product: `/Users/Dorgham/Documents/Work/Devleopment/Gate-Access`
- Never assume `pnpm brain` exists inside Gate-Access.

## Phase 00 acceptance

- [x] `pnpm workflow:v2:guide --json` shows `client-dashboard` / `focused` / next `/audit all`
- [x] Guide subcommands `status|next|prompt|delivery` work
- [x] State schema allows optional pageScores/pilot/selection/delivery pointers
- [x] `gateflow-guide` agent exists and points at Workflow v2 guide
- [x] `pnpm workflow:v2:check` green
- [x] No Client Dashboard product behavior changes

## Exit handoff

```text
/audit all
```
