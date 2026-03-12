---
name: plan
description: Turn an IDEA_<slug>.md into a phased PLAN_<slug>.md plus PROMPT_<slug>_phase_<N>.md pro prompts. Create in planning/, then use "ready" to move to planned/.
---

# /plan — Create or Refine a Phased Plan

Use `/plan` to convert an idea into an executable multi-phase plan with per-phase pro prompts, following the phased workflow and **plan lifecycle** (`docs/plan/PLAN_LIFECYCLE.md`).

## What `/plan` does

- Reads:
  - `docs/plan/context/IDEA_<slug>.md` (or goal text if none exists)
  - Existing plan in `docs/plan/planning/<slug>/` or legacy `docs/plan/execution/` (when refining)
  - `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
  - `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`
  - `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`
- Produces/updates in **`docs/plan/planning/<slug>/`** (draft until marked ready):
  - `PLAN_<slug>.md` — ordered phases with Scope, Deliverables, Depends on, and Test criteria.
  - `PROMPT_<slug>_phase_<N>.md` — one pro prompt per phase using `.kilocode/templates/TEMPLATE_PROMPT_phase.md`.
  - `TASKS_<slug>.md` — phase checklist (optional, created by planner).
- Ensures for each phase:
  - **Primary role** is chosen from the Subagent Hierarchy.
  - **Preferred tool** (Kilo, Claude CLI, Gemini CLI, OpenCode CLI, Multi-CLI) is set based on risk and complexity.
  - **Steps** are concrete with file paths and commands.
  - **Acceptance criteria** include lint, typecheck, and tests for the affected workspaces.

## How to use it

- `/plan` — Plan from the default/latest idea (creates/updates in `planning/`).
- `/plan <slug>` — Plan or refine for a specific IDEA/PLAN.
- `/plan ready <slug>` — **Mark plan ready:** move `planning/<slug>/` → `planned/<slug>/`. Do this when the plan is approved and ready for `/dev`.
- `/plan phase <n>` — (Re)generate `PROMPT_<slug>_phase_<n>.md` for the active plan only.
- `/plan <slug> phase <n>` — Same as above, but explicit plan slug.

## Plan lifecycle

| State | Folder | Command |
|-------|--------|---------|
| Planning (draft) | `planning/<slug>/` | `/plan` creates here |
| Planned (ready) | `planned/<slug>/` | `/plan ready <slug>` moves here |
| In progress | `in-progress/<slug>/` | `/dev` moves here when starting |
| Done | `done/<slug>/` | `/dev` moves here when last phase done |

See `docs/plan/PLAN_LIFECYCLE.md` for full workflow.

## Implementation notes

- Always use `.kilocode/templates/TEMPLATE_PROMPT_phase.md` when creating or updating phase prompts.
- For complex initiatives: follow Understand → Investigate (explore subagent) → Generate before writing phases.
- **New plans:** Write to `docs/plan/planning/<slug>/`. If slug folder exists in `planned/`, `in-progress/`, or `done/`, ask user before overwriting.
- **`/plan ready <slug>`:** Move all files from `planning/<slug>/` to `planned/<slug>/`. Create `planned/<slug>/` if needed. Remove `planning/<slug>/` after move.
- Treat:
  - `AI_SKILLS_SUBAGENTS_RULES.md` and `SUBAGENT_HIERARCHY.md` as the **single brain** for roles and subagents.
  - `PHASED_DEVELOPMENT_WORKFLOW.md` as the canonical execution loop.
- Prefer small, testable phases that can be executed in one focused session and gated by lint/typecheck/tests.

# Plan

Create phased development plans from goals or backlog. This is one of the **four master commands**:

- `/idea` — capture and refine initiatives.
- `/plan` — turn an idea into a multi-phase plan and pro prompts (in `planning/`); use `/plan ready <slug>` when approved.
- `/dev` — implement one phase end-to-end (moves plan to `in-progress/`, then `done/`).
- `/ship` — execute all remaining phases for a plan.

## Instructions

1. Read `.kilocode/skills/gf-planner/SKILL.md` (Planning Subagent Prompt section).
2. Start from an idea:
   - Use `/idea` to create/refine `docs/plan/context/IDEA_<slug>.md`, or
   - Use an existing IDEA or high-level goal text.
3. Create a phased plan: breakdown, deliverables per phase, test criteria.
4. Save the plan to `docs/plan/planning/<slug>/PLAN_<slug>.md`.
5. For each phase, write a pro prompt using `.kilocode/templates/TEMPLATE_PROMPT_phase.md`:
   - Save as `docs/plan/planning/<slug>/PROMPT_<slug>_phase_<N>.md`.
6. When user approves the plan: run `/plan ready <slug>` to move `planning/<slug>/` → `planned/<slug>/`.

## When to use

- User asks for "plan", "breakdown", "phases".
- Goal: MVP, Resident Portal, feature epic.
- Source: `docs/plan/backlog/ALL_TASKS_BACKLOG.md` and any relevant `IDEA_<slug>.md` files.
