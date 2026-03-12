---
name: dev
description: Implement a single plan phase end-to-end (code, tests, git) using the corresponding PROMPT_<slug>_phase_<N>.md. Moves plan to in-progress/ when starting, to done/ when last phase completes.
---

# /dev — Execute One Phase

Use `/dev` to implement **exactly one** phase from a plan end-to-end: code, tests, and git, following the acceptance criteria in its pro prompt. Respects **plan lifecycle** (`docs/plan/PLAN_LIFECYCLE.md`).

## What `/dev` does

- Runs a lightweight internal `/ready` flow:
  - Check `git status` (clean or committed branch).
  - Optionally run `pnpm preflight` when appropriate.
- **Resolves plan location**: check `in-progress/<slug>/`, `planned/<slug>/`, `planning/<slug>/`, then legacy `execution/`.
- **Lifecycle transitions:**
  - **When starting a phase:** If plan is in `planned/<slug>/`, move it to `in-progress/<slug>/` before executing.
  - **When completing the last phase:** Move `in-progress/<slug>/` → `done/<slug>/`.
- Determines which phase to execute:
  - Next incomplete phase for the active `PLAN_<slug>.md`, or
  - A specific phase number/slug if provided.
- Reads:
  - `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` from the resolved location (in-progress/, planned/, etc.)
  - Relevant guidelines from `PHASED_DEVELOPMENT_WORKFLOW.md` and `AI_SKILLS_SUBAGENTS_RULES.md`
- Executes the phase by:
  - Adopting the phase's **Primary role** and **Preferred tool**.
  - Following the **Steps** section, invoking subagents (explore/shell/browser-use) when specified.
  - Running checks required by **Acceptance criteria**:
    - `pnpm turbo lint --filter=<workspace>`
    - `pnpm turbo typecheck --filter=<workspace>`
    - `pnpm turbo test --filter=<workspace>` (or `pnpm preflight` when called out)
  - Using the git flow to add, commit, pull (rebase), and push when the phase is green.

## How to use it

- `/dev` — Execute the next incomplete phase of the active plan.
- `/dev <n>` — Execute phase `<n>` of the active plan.
- `/dev <slug> <n>` — Execute phase `<n>` of `PLAN_<slug>.md`.

## Implementation notes

- Treat the phase's **Acceptance criteria** as **hard gates**: do not mark the phase complete until all items pass.
- **Plan lifecycle:** Before starting: if plan is in `planned/`, move to `in-progress/`. After completing the **last** phase: move `in-progress/<slug>/` → `done/<slug>/`. Update `TASKS_<slug>.md` in the same location as the plan.
- Respect the phase's **Preferred tool**:
  - Kilo by default for edits.
  - When **Preferred tool** is another CLI: run that CLI with the phase prompt or use Kilo for edits.
- **Learning (after CLI usage)**:
  - After any task/phase where a CLI was used, append one entry to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.

# Dev

Implement **one plan phase** end-to-end: code, tests, git.

## Purpose

- Take a single phase prompt (`PROMPT_<slug>_phase_<N>.md`) from idea → plan → **done**.
- Run internal preflight, follow the phase prompt, and complete git workflow.

## When to use

- You have an existing plan in `planned/` or `in-progress/` (or legacy `execution/`) with phase prompts.
- You want to work on a specific phase with clear acceptance criteria.
- You want a repeatable flow: implement → test → commit → next phase.

## Workflow (per phase)

1. **Preflight** — Run clean git state (or commit/stash).
   - `pnpm preflight` (lint + typecheck + tests) must pass.
2. **Select phase**:
   - Next incomplete phase from the active plan, or
   - Explicit `<N>` / `<slug> <N>` when requested.
3. **Load prompt** — Open `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`:
   - Respect **Primary role**, **Preferred tool**, and **Subagents**.
4. **Implement**:
   - Use Kilo for edits.
   - Invoke explore/shell/browser-use subagents when the prompt calls for them.
5. **Verify**:
   - Run `pnpm turbo lint --filter=<workspace>`.
   - Run `pnpm turbo test --filter=<workspace>`.
6. **Git** — Use git flow to commit and push the phase.

## Usage

- `/dev` — run the next incomplete phase for the active plan.
- `/dev <N>` — run phase `<N>` for the active plan.
- `/dev <slug> <N>` — run phase `<N>` for a specific plan `<slug>`.
