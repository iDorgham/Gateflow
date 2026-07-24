# ADR: GateFlow Workflow v2

**Status:** Accepted locally  
**Date:** 2026-07-24

## Decision

GateFlow uses one versioned local state file at `.ai/workflow-v2/state.json` to
coordinate the residential pilot sequence:

`client-dashboard → resident-portal → scanner-app → integrated certification`.

The state engine is deterministic JavaScript under `scripts/workflow-v2/`.
Prompt workflows route intent, but only the state CLI may change focus/stage or
write a certification receipt. One conductor selects the minimum specialists,
one locked writer may edit the shared workdir, and independent gatekeepers
verify sensitive or completion claims.

Bounded development runs use separate atomic checkpoints under
`.ai/workflow-v2/loops/<runId>.json`. `/dev loop` is the reusable phase/task
engine; `/pilot loop` is its stricter pilot profile. Ad-hoc work requires a
hash-approved task contract under `.ai/workflow-v2/tasks/`.

## Why

The earlier command system described a phased workflow but did not persist
single-app focus or make certification depend on dated evidence. A local state
engine preserves multi-tool portability while making illegal transitions and
focus drift testable.

## Consequences

- Existing `docs/plan/{Draft,Ready,Active,Complete}` remains canonical for plans.
- `.agents/` remains canonical AI configuration and `pnpm sync` remains the
  mirror mechanism.
- Shared-package changes are allowed only for the focused app and must be
  explained in its phase.
- GitHub, Vercel, migrations, release, and all remote mutations remain explicit
  authorization boundaries.
- Certification receipts are immutable local files whose content is hash-bound
  to the app, evidence ID, evidence commit, and timestamp.
- Local delivery may create an isolated `codex/loop-*` branch/worktree but
  requires `ship-phase` approval before staging or commit.
- Draft-PR delivery authorizes only the feature branch, draft PR, inspection,
  and bounded fixes. Merge and release approvals are bound to current immutable
  targets; deployment and migration remain separate.
- Legacy Ralph Git mutation paths are not Workflow v2 authority. `/ralph`
  delegates to the bounded all-phase `/dev loop`.

## Recovery

Atomic writes rename a validated `.tmp` file over `state.json`. An interrupted
temporary file is ignored. If the durable file is invalid, restore the last
version-controlled state or initialize a fixture and re-establish stage from
fresh evidence; never hand-edit a certification receipt.

Paused loops release the workdir lock. Resume revalidates focus and the approved
plan/task hash before reacquiring it. A changed contract or plan requires a new
run; a changed PR head requires a new merge approval.
