# GateFlow Workflow v2 state

`state.json` is the local, repository-owned source of truth for the focused pilot
application and its stage. Use `node scripts/workflow-v2/cli.js`; do not edit the
state manually.

Writes are schema/invariant validated and atomic. If a `.tmp` file remains after
an interrupted process, the CLI ignores it and loads the last complete
`state.json`. Certification receipts are write-once files under `receipts/`.
