# Workspace Changelog

## [Unreleased]

### Added

- Automated, diff-aware runtime-proof planning with `pnpm proof:plan`,
  head-bound evidence validation with `pnpm proof:check`, and fast PR readiness
  through `pnpm pr:ready` / `/github ready`.
- A runtime proof coordinator agent for browser, device, API, database, and
  access-decision evidence.
- AI workspace graph validation for commands, agents, parents, skills, and
  generated-artifact hygiene; Guide routing now discovers the live registry.
- Loop worktrees now use the pre-push-compatible `feat/loop-*` branch prefix.
- CI jobs now skip redundant dependency installation after an exact cache hit,
  and the required gate no longer describes advisory performance as required.
- Red Sea `--demo-full` / `pnpm --filter=@gate-access/db seed:demo` fills all demo orgs with 6-month contacts, units/classrooms, role logins, and optional scan history.
- Root `pnpm health` runs workflow v2 contract tests, changelog check, and preflight.

- NotebookLM Knowledge Base Source Suite (`NOTEBOOKLM_01` through `NOTEBOOKLM_09` + `NOTEBOOKLM_README.md`) under `docs/` providing comprehensive AI-ready architecture, database, PRD, and audit sources.
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

- Runtime proof is now a required `CI OK` dependency, covers runtime manifests,
  assets, dependency resolution, shared UI, deletions, and both rename paths,
  and rejects evidence that escapes through symlinked directories.
- Feature branches use the pull-request CI run only, deterministic performance
  failures are blocking, and clean checkouts validate the tracked AI registry
  instead of silently skipping AI checks.
- `/plan`, `/dev`, and `/guide` now enforce Workflow v2 focus and stage.
- AI sync registers the Workflow v2 command surface for all supported clients.
- `/pilot loop` delegates to `/dev loop --profile=pilot`; `/ralph` delegates to
  bounded local all-phase execution and no longer authorizes legacy Ralph Git
  mutation behavior.
