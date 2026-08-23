# Session Memory — workspace_ai_surface_hardening_2026

## Active State

- **Phase:** Phase 0 extension — CI/runtime-proof hardening | checking
- **Branch:** `feat/workspace-automation`
- **Last commit:** `28118ece` — fix(workspace): harden runtime proof automation
- **Next action:** Review the uncommitted Phase 0 extension; local production build verification remains environment-blocked.

## Cross-Session Decisions

| Phase | Decision                                                                        | Why                                                            | Still valid?   |
| ----- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------- |
| 0     | Keep `.agents` local and validate the tracked routing registry in clean CI      | Full canonical-source versioning is larger than this PR repair | Yes, temporary |
| 0     | Require committed, head-bound runtime receipts only when classification matches | Docs/tooling-only changes must not require invented evidence   | Yes            |
| 0     | Run feature-branch CI on `pull_request`, not both push and PR                   | Prevent duplicate full pipelines                               | Yes            |

## Discovered Gotchas

- `pull_request` and feature-branch `push` events use different refs, so the old concurrency key could not deduplicate them.
- `git diff --name-only` loses the old side of a rename; runtime classification now parses name-status records.
- Terminal-only `lstat` does not stop escape through a symlinked parent directory.

## State Handoff

- **Files modified:** CI workflow, runtime-proof engine/CLI/tests, AI validator/tests, workspace docs/changelogs.
- **Tests:** 72 workflow tests, 15 checker tests, full preflight, import-cycle gate, changelog check, AI registry check, and security gate pass.
- **Blockers:** Full canonical AI source remains gitignored and is intentionally deferred to the plan's main Phase 0.
- **Environment blocker:** Next.js/Turbopack production build cannot bind its internal process port locally; GitHub CI must verify the newly blocking build/bundle lane.
- **Resume from:** Review the focused diff, then authorize commit/push if accepted.

## Context Budget

| Layer | File                                           | Est. Tokens | Loaded     |
| ----- | ---------------------------------------------- | ----------: | ---------- |
| L0    | Git log + phase                                |         ~50 | Yes        |
| L1    | `TASKS_workspace_ai_surface_hardening_2026.md` |        ~150 | Yes        |
| L2    | `PLAN_workspace_ai_surface_hardening_2026.md`  |        ~600 | Yes        |
| L3    | Phase prompt                                   |      ~1,200 | Not needed |
| L4    | Schema/context                                 |      ~1,800 | Not needed |
| L5    | `SESSION_MEMORY.md`                            |        ~400 | Created    |

Phase log: `phase_logs/PHASE_LOG_phase_00_extension.md`.
