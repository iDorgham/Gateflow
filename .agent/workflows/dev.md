---
name: dev
description: Implement a single plan phase end-to-end (code, tests, git) using the corresponding PROMPT_<slug>_phase_<N>.md.
---

# /dev — Execute One Phase

Use `/dev` to implement **exactly one** phase from a plan end-to-end: code, tests, and git, following the acceptance criteria in its pro prompt.

## What `/dev` does

- Runs a lightweight internal `/ready` flow (via `.cursor/commands-ref/ready.md`):
  - Check `git status` (clean or committed branch).
  - Optionally run `pnpm preflight` when appropriate.
- Determines which phase to execute:
  - Next incomplete phase for the active `PLAN_<slug>.md`, or
  - A specific phase number/slug if provided.
- Reads:
  - `docs/plan/execution/PLAN_<slug>.md`
  - `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`
  - Relevant guidelines from `PHASED_DEVELOPMENT_WORKFLOW.md` and `AI_SKILLS_SUBAGENTS_RULES.md`
- Executes the phase by:
  - Adopting the phase’s **Primary role** and **Preferred tool**.
  - Following the **Steps** section, invoking subagents (explore/shell/browser-use) when specified.
  - Running checks required by **Acceptance criteria**:
    - `pnpm turbo lint --filter=<workspace>`
    - `pnpm turbo typecheck --filter=<workspace>`
    - `pnpm turbo test --filter=<workspace>` (or `pnpm preflight` when called out)
  - Using the internal `/github` flow (see `.cursor/commands-ref/github.md`) to add, commit, pull (rebase), and push when the phase is green.

## How to use it

- `/dev` — Execute the next incomplete phase of the active plan.
- `/dev <n>` — Execute phase `<n>` of the active plan.
- `/dev <slug> <n>` — Execute phase `<n>` of `PLAN_<slug>.md`.

## Implementation notes (for agents)

- Treat the phase’s **Acceptance criteria** as **hard gates**: do not mark the phase complete until all items pass.
- Respect the phase’s **Preferred tool**:
  - Cursor by default for edits.
  - When **Preferred tool** is **Kiro CLI**, **Kilo CLI**, or **Qwen CLI**: run that CLI with the phase prompt (e.g. in a separate terminal or via shell), or use Cursor for edits and that CLI for analysis/review as the phase specifies. Prefer Cursor for file edits; use the CLI for prompts, reviews, or generation when the prompt says so. See `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`.
  - Invoke CLIs (Claude, Gemini, OpenCode, Kiro, Kilo, Qwen) when the prompt explicitly calls for that CLI as Preferred tool, or for Multi-CLI or external review.
- **Limits + permission (mandatory)**:
  - Load `.cursor/skills/gf-cli-limits/SKILL.md` and check `docs/plan/learning/GUIDE_PREFERENCES.md` + `docs/plan/learning/CLI_LIMITS_TRACKING.md` before invoking any CLI.
  - **80% rule**: if a CLI is at **80%+** of its limit, **do not use it** unless the user has given explicit permission; use a free-tier CLI or Cursor instead.
- **Learning (mandatory after CLI usage)**:
  - After any task/phase where a CLI was used, append one entry to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.
  - Optionally record durable notes in `docs/plan/learning/CLI_TOOL_MEMORY.md` (or use `.cursor/skills/gf-cli-memory/SKILL.md`).
- Use learning docs after completion:
  - Add any cross-plan patterns/incidents/decisions to `docs/plan/learning/{patterns,incidents,decisions}.md` when appropriate.

# Dev

Implement **one plan phase** end-to-end: code, tests, git.

## Purpose

- Take a single phase prompt (`PROMPT_<slug>_phase_<N>.md`) from idea → plan → **done**.
- Run internal preflight (`/ready`), follow the phase prompt, and complete git workflow.

## When to use

- You have an existing plan (`docs/plan/execution/PLAN_<slug>.md`) and phase prompts.
- You want to work on a specific phase with clear acceptance criteria.
- You want a repeatable flow: implement → test → commit → next phase.

## Workflow (per phase)

1. **Preflight** — Run `/ready` (or equivalent shell flow):
   - Clean git state (or commit/stash).
   - `pnpm preflight` (lint + typecheck + tests) must pass.
2. **Select phase**:
   - Next incomplete phase from the active plan, or
   - Explicit `<N>` / `<slug> <N>` when requested.
3. **Load prompt** — Open `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`:
   - Respect **Primary role**, **Preferred tool**, and **Subagents**.
4. **Implement**:
   - Use Cursor for edits (unless the phase is run primarily from a CLI).
   - When **Preferred tool** is **Kiro CLI**, **Kilo CLI**, or **Qwen CLI**: run that CLI with the phase prompt (e.g. paste or reference it in the terminal); keep Cursor for file edits and use the CLI for analysis/review/generation as the phase specifies. Follow `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`.
   - Invoke explore/shell/browser-use subagents when the prompt calls for them.
   - Use CLIs when `Preferred tool` warrants it (e.g. Claude/Gemini/Opencode for security, DB, refactors; Kiro/Kilo/Qwen for free-tier agentic or terminal-focused phases).
5. **Verify**:
   - Run `pnpm turbo lint --filter=<workspace>`.
   - Run `pnpm turbo test --filter=<workspace>`.
6. **Git** — Use `/github` (or the documented git flow) to commit and push the phase.

## Usage

- `/dev` — run the next incomplete phase for the active plan.
- `/dev <N>` — run phase `<N>` for the active plan.
- `/dev <slug> <N>` — run phase `<N>` for a specific plan `<slug>`.

