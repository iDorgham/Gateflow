# Bounded loop checkpoints

Each `<runId>.json` file is a validated, atomic checkpoint for one `/dev loop`
or `/pilot loop` run. Loop state is separate from application focus state.
Commands load the most recently updated run unless `--run <runId>` is supplied.

Do not edit checkpoints manually. Approvals are bound to task/plan hashes,
evidence, owned files, release targets, or PR head SHAs.
