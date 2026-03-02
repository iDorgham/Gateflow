---
name: ship
description: Run the full phased plan for an initiative via repeated /dev-style execution until all phases are complete.
---

# /ship — Execute All Remaining Phases

Use `/ship` to run a complete plan: idea → plan (if needed) → all remaining phases executed like `/dev`, gated by tests and quality checks.

## What `/ship` does

- Ensures plan artifacts exist:
  - If no `IDEA_<slug>.md` / `PLAN_<slug>.md` are present, orchestrates `/idea` then `/plan` first.
- For each phase `1..N` in `PLAN_<slug>.md`:
  - Loads `PROMPT_<slug>_phase_<N>.md` (creating it via `/plan phase <N>` if missing).
  - Runs the equivalent of `/dev <slug> <N>`:
    - Honors **Primary role** and **Preferred tool**.
    - Follows **Steps** and **Subagents** sections.
    - Enforces **Acceptance criteria** (lint, typecheck, tests, and any additional gates).
  - On failure:
    - Stops and fixes the issue; **does not skip** the phase.
    - Optionally records blockers or follow-ups into `ALL_TASKS_BACKLOG.md`.
- After the last phase:
  - Ensures all phases meet the EC‑plan rules from `PHASED_DEVELOPMENT_WORKFLOW.md`.
  - Uses the `/github` flow to ensure the branch is pushed and ready for review.

## How to use it

- `/ship` — Ship the current/active plan from the current phase onward.
- `/ship all` — From scratch: run `/idea` and `/plan` (if needed), then execute all phases.
- `/ship <slug>` — Ship a specific `PLAN_<slug>.md`.

## Implementation notes (for agents)

- `/ship` is a **loop over `/dev`**; do not invent new behavior per phase—always delegate to the phase prompt and EC rules.
- Respect Claude Pro / Multi-CLI usage limits: follow the phase prompts and `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`; only use Multi-CLI for phases that explicitly call for it.
- After each phase, consider whether to capture:
  - A new pattern in `learning/patterns.md`
  - An incident in `learning/incidents.md`
  - A decision in `learning/decisions.md`

# Ship

Automate a whole plan: run all remaining phases from idea → plan → implementation → tests → git.

## Purpose

- Execute every phase in `docs/plan/execution/PLAN_<slug>.md` sequentially.
- Ensure each phase meets its **acceptance criteria** before moving on.
- Keep history clean with one conventional commit per phase.

## When to use

- You already have a solid plan and phase prompts.
- You want to move through multiple phases with minimal manual coordination.
- You are ready for end-to-end execution with tests and git in the loop.

## Workflow

1. **If no IDEA/PLAN exist**:
   - Run `/idea` to capture the initiative.
   - Run `/plan` to create `PLAN_<slug>.md` and phase prompts.
2. **For each phase 1..N**:
   - Equivalent of `/dev <slug> <N>`:
     - `/ready` (preflight).
     - Load `PROMPT_<slug>_phase_<N>.md`.
     - Implement according to **Primary role**, **Preferred tool**, and **Subagents**.
     - Run lint/tests for affected workspaces.
     - Commit and push via `/github`.
   - **Do not skip** a phase if tests or quality gates fail — fix and re-run.
3. **Finish**:
   - All phases completed and merged.
   - Docs updated as specified in prompts (`docs/`, `CLAUDE.md`, etc.).

## Usage

- `/ship` — ship the active plan from the current phase onward.
- `/ship all` — from scratch: idea (if missing) → new plan → all phases.
- `/ship <slug>` — ship a specific plan `<slug>` from its first phase.

