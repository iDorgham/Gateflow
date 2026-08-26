---
name: ralph
description: Compatibility alias for bounded all-phase execution through /dev loop.
---

# /ralph — Bounded all-phase compatibility alias

`/ralph <slug>` delegates to:

```text
/dev loop start <slug> --all --delivery=local
```

It uses atomic checkpoints, a single focused writer, three-task batches, three
repair attempts per failure, focused ownership, and explicit delivery approvals.

It never calls `scripts/ralph/ralph-git.js`, auto-stages, auto-commits, pushes,
merges, tags, releases, deploys, migrates, or bypasses CLI permissions. Use
`--delivery=draft-pr` explicitly when draft-PR delivery is intended.

## Usage

- `/ralph <slug>` — bounded local all-phase run.
- `/dev loop start <slug> --all --delivery=draft-pr` — explicitly authorized
  draft-PR delivery.

Full behavior: `.agents/workflows/dev.md`.
