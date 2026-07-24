# GateFlow Workflow v2 state

`state.json` is the local, repository-owned source of truth for the focused pilot
application and its stage. Use `node scripts/workflow-v2/cli.js`; do not edit the
state manually.

Optional per-app pointers (schema-validated): `pageScoresFile`,
`pilotFlowCoverage`, `selection` (command/agent/skills/cli), and `delivery`
(branch/commit/upstream/pr/previewSha). Guide subcommands:

```bash
pnpm workflow:v2:guide status|next|prompt|delivery [--json]
```

Writes are schema/invariant validated and atomic. If a `.tmp` file remains after
an interrupted process, the CLI ignores it and loads the last complete
`state.json`. Certification receipts are write-once files under `receipts/`.
Do not add a second store under `.gateflow/`.
