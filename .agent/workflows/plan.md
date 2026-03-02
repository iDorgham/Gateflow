---
name: plan
description: Turn an IDEA_<slug>.md into a phased PLAN_<slug>.md plus PROMPT_<slug>_phase_<N>.md pro prompts.
---

# /plan — Create or Refine a Phased Plan

Use `/plan` to convert an idea into an executable multi-phase plan with per-phase pro prompts, following the phased workflow.

## What `/plan` does

- Reads:
  - `docs/plan/context/IDEA_<slug>.md` (or goal text if none exists)
  - Existing `docs/plan/execution/PLAN_<slug>.md` (when refining)
  - `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
  - `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`
  - `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`
- Produces/updates:
  - `docs/plan/execution/PLAN_<slug>.md` — ordered phases with Scope, Deliverables, Depends on, and Test criteria.
  - `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` — one pro prompt per phase using `.cursor/templates/TEMPLATE_PROMPT_phase.md`.
- Ensures for each phase:
  - **Primary role** is chosen from the Subagent Hierarchy.
  - **Preferred tool** (Cursor, Claude CLI, Gemini CLI, OpenCode CLI, Multi-CLI) is set based on risk and complexity.
  - **Steps** are concrete with file paths and commands.
  - **Acceptance criteria** include lint, typecheck, and tests for the affected workspaces.

## How to use it

- `/plan` — Plan from the default/latest idea.
- `/plan <slug>` — Plan or refine for a specific IDEA/PLAN.
- `/plan phase <n>` — (Re)generate `PROMPT_<slug>_phase_<n>.md` for the active plan only.
- `/plan <slug> phase <n>` — Same as above, but explicit plan slug.

## Implementation notes (for agents)

- Always use `.cursor/templates/TEMPLATE_PROMPT_phase.md` when creating or updating phase prompts.
- Treat:
  - `AI_SKILLS_SUBAGENTS_RULES.md` and `SUBAGENT_HIERARCHY.md` as the **single brain** for roles and subagents.
  - `PHASED_DEVELOPMENT_WORKFLOW.md` as the canonical execution loop.
- Prefer small, testable phases that can be executed in one focused session and gated by lint/typecheck/tests.

# Plan

Create phased development plans from goals or backlog. This is one of the **four master commands**:

- `/idea` — capture and refine initiatives.
- `/plan` — turn an idea into a multi-phase plan and pro prompts.
- `/dev` — implement one phase end-to-end.
- `/ship` — execute all remaining phases for a plan.

## Instructions

1. Read `.cursor/skills/gf-planner/SKILL.md` (Planning Subagent Prompt section).
2. Start from an idea:
   - Use `/idea` to create/refine `docs/plan/context/IDEA_<slug>.md`, or
   - Use an existing IDEA or high-level goal text.
3. Create a phased plan: breakdown, deliverables per phase, test criteria.
4. Save the plan to `docs/plan/execution/PLAN_<slug>.md`.
5. For each phase, write a pro prompt using `.cursor/templates/TEMPLATE_PROMPT_phase.md`:
   - Save as `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`.

## When to use

- User asks for "plan", "breakdown", "phases".
- Goal: MVP, Resident Portal, feature epic.
- Source: `docs/plan/backlog/ALL_TASKS_BACKLOG.md` and any relevant `IDEA_<slug>.md` files.

