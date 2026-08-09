# Workspace Changelog

## [Unreleased]

### Added

- NotebookLM Knowledge Base Source Suite (`NOTEBOOKLM_01` through `NOTEBOOKLM_05` + `NOTEBOOKLM_README.md`) under `docs/` providing comprehensive AI-ready architecture, database, PRD, and audit sources.
- Data Retention & Legal Hold system (`retention-executor.ts`, schema migration `add_retention_legal_hold`, soft-deletes for `ScanLog` & `Incident`).
- Workflow v2 state, fixed pilot sequence, atomic transitions, evidence-bound
  certification receipts, app registry, route inventory, page scoring,
  focused-diff checks, QR vectors, environment-name checks, and verification
  planning.
- Focused pilot commands, specialist contracts, and composable evidence skills.
- Reusable `/dev loop` controller with pilot profile, task contracts, atomic
  checkpoints, bounded repair, ownership-aware worktrees/commits, draft-PR
  planning, head-bound merge approval, and target-bound release approval.
- Workspace-aware Guide collector and renderer with live focus, stage, route,
  evidence, plan, score, pilot-flow, Git, blocker, next-command, and copy-ready
  prompt output.

### Changed

- `/plan`, `/dev`, and `/guide` now enforce Workflow v2 focus and stage.
- AI sync registers the Workflow v2 command surface for all supported clients.
- `/pilot loop` delegates to `/dev loop --profile=pilot`; `/ralph` delegates to
  bounded local all-phase execution and no longer authorizes legacy Ralph Git
  mutation behavior.
