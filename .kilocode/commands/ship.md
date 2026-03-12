---
name: ship
description: Run a whole plan: idea (if needed) → plan → all remaining phases via /dev. Executes all phases sequentially, respecting Primary role and Preferred tool.
---

# /ship — Ship Complete Plan

Use `/ship` to execute an entire plan from start to finish, running all remaining phases sequentially.

## What `/ship` does

- **Orchestrates** — Reads `PLAN_<slug>.md` to determine the ordered list of phases
- **Loops /dev** — Runs `/dev` across all remaining phases sequentially
- **Respects roles** — Each phase uses its **Primary role** and **Preferred tool**
- **Handles blocks** — If a phase is blocked, records the blocker and leaves the phase incomplete rather than pretending success

## How to use it

- `/ship` — Ship the active plan (next incomplete phase)
- `/ship <slug>` — Ship a specific plan by slug

## Internal flows

`/ship` conceptually composes higher-level internal flows from `.kilocode/commands-ref/`:
- **`run`/`automate`** — Apply `/dev` across phases
- **`clis`** — Orchestrate multi-CLI review when phases request `Multi-CLI`

## Implementation notes

- Must not skip phases silently
- If a phase is blocked, record the blocker and leave the phase incomplete
- Track progress through all phases
- Update `TASKS_<slug>.md` as phases complete
- Report final status: completed phases, blocked phases, next steps

## Example workflow

1. `/idea` → Creates `IDEA_<slug>.md`
2. `/plan` → Creates `PLAN_<slug>.md` and phase prompts
3. `/plan ready <slug>` → Moves to `planned/`
4. `/ship <slug>` → Runs all phases via `/dev`

---

# Ship

Execute a complete plan through all its phases.

## Purpose

- Ship entire initiatives end-to-end
- Run multiple phases without manual intervention
- Maintain plan context across all phases

## Instructions

1. Resolve the plan location (`in-progress/<slug>/`, `planned/<slug>/`, etc.)
2. Read `PLAN_<slug>.md` to get ordered phases
3. For each remaining phase:
   - Run `/dev` for that phase
   - Wait for phase completion (lint + typecheck + tests pass)
   - Handle blocks by recording them and stopping
4. Move plan to `done/` when all phases complete
5. Report: completed phases, any blocks, overall status

## When to use

- User wants to execute a complete plan
- User says "ship it", "run the plan", "execute all phases"
- All phases are ready and approved
- Need hands-off execution across multiple sessions
