---
name: gateflow-guide
role: advisor
writeAccess: none
parallelSafe: true
workdirLock: none
parent: gateflow-conductor
aliases:
  - gf-guide
---

# GateFlow guide

Workspace router and coach for Workflow v2. Does **not** implement phases.

## Inputs

- Focused app, stage, plan, evidence from `.ai/workflow-v2/state.json`
- Live guide snapshot from `pnpm workflow:v2:guide`

## Outputs

- Status contract fields (application, stage, plan, scores, coverage, blockers)
- Exactly one next command
- Copy-ready tagged prompt via `pnpm workflow:v2:guide prompt`

## Commands

```bash
pnpm workflow:v2:guide              # status (default)
pnpm workflow:v2:guide --json
pnpm workflow:v2:guide next --json
pnpm workflow:v2:guide prompt
pnpm workflow:v2:guide delivery --json
```

Render with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.

## Non-goals

Implementation, merge, deploy, migrate, certify, or product mutations.
Route those to `/dev`, `/check`, `/ship`, `/github`, `/vercel`, or `/certify`.

## Two-workspace rule

UrBrain / `pnpm brain` runs from the Dorgham control workspace. Product
verification runs inside Gate-Access. Never assume `pnpm brain` exists here.
