---
name: plan
description: Turn an IDEA or FOR_PLAN_PROMPT into a phased plan in Draft/, then ready → Ready/. Maintains PLAN_FEEDBACK.md for improvements and workspace skill/agent suggestions.
---

# /plan — Create or Refine a Phased Plan

Use `/plan` to convert an idea (or output from `/prompt <slug>`) into an executable multi-phase plan with per-phase pro prompts. Lifecycle: **`docs/development/PLAN_LIFECYCLE.md`**.

## Plan lifecycle (folder names)

| State    | Folder                       | Command                           |
| -------- | ---------------------------- | --------------------------------- |
| Draft    | `docs/plan/Draft/<slug>/`    | `/draft`, `/plan`, `/prompt` prep |
| Ready    | `docs/plan/Ready/<slug>/`    | `/plan ready <slug>`              |
| Active   | `docs/plan/Active/<slug>/`   | `/dev` starts (moves from Ready)  |
| Complete | `docs/plan/Complete/<slug>/` | `/dev` after last phase           |

## What `/plan` does

- Reads:
  - `docs/plan/Draft/<slug>/DRAFT_<slug>.md` and/or `FOR_PLAN_PROMPT.md` (from `/prompt`) when present
  - `docs/development/initiatives/IDEA_<slug>.md` (or goal text if none exists)
  - `docs/development/brainstorming/` strategy files when relevant
  - Existing plan in `Draft/<slug>/` or `Active/<slug>/` when refining
  - `docs/development/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`, `SUBAGENT_HIERARCHY.md`, `AI_SKILLS_SUBAGENTS_RULES.md`
  - `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`
- **Scaffolds** under `docs/plan/Draft/<slug>/` (same shape travels with the folder to Ready → Active → Complete):

```
Draft/<slug>/
├── PLAN_<slug>.md
├── TASKS_<slug>.md
├── CONTEXT_<slug>.md
├── PLAN_FEEDBACK.md          # plan improvements + workspace skills/agents to add (mandatory section)
├── DRAFT_<slug>.md          # optional; from /draft
├── FOR_PLAN_PROMPT.md       # optional; from /prompt
├── context/
├── phase_logs/
├── phases/NN_<title>/PROMPT_phase_NN.md
└── assets/
```

- **During and after planning:** Update **`PLAN_FEEDBACK.md`** with:
  - Suggested edits to the plan (scope, phases, risks)
  - Skills worth adding to `.cursor/skills/` (or synced tools) and why
  - Agents / subagents worth adding and why
  - Links to `docs/development/learning/` if the note is cross-plan

## How to use it

- `/plan` — Plan from default/latest context (writes under `Draft/<slug>/`).
- `/plan <slug>` — Plan or refine that slug.
- `/plan ready <slug>` — Move **`Draft/<slug>/` → `Ready/<slug>/`** when approved.
- `/plan phase <n>` / `/plan <slug> phase <n>` — Regenerate a phase prompt.

## Implementation notes (for agents)

- Use `docs/development/plan-templates/TEMPLATE_PROMPT_phase.md` for phase prompts.
- **`/plan ready`:** Move the **entire** directory `Draft/<slug>/` to `Ready/<slug>/` (no orphaned files).
- If `Ready/<slug>/`, `Active/<slug>/`, or `Complete/<slug>/` already exists, confirm with the user before overwriting Draft content that would collide.
- Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` when creating a new initiative.
- Prefer `pnpm plan:ready <slug>` / lifecycle scripts in `scripts/plan/ralph-plan.js` when automating moves.

## Workflow summary

- `/draft <slug>` — Raw capture and iteration → `DRAFT_<slug>.md`
- `/prompt <slug>` — Single handoff file for `/plan` → `FOR_PLAN_PROMPT.md`
- `/plan <slug>` — Full PLAN + TASKS + CONTEXT + phases + **PLAN_FEEDBACK.md**
- `/plan ready <slug>` → Ready; `/dev` → Active → Complete

See also: `docs/plan/README.md`, `docs/development/plan-guides/README.md`.
