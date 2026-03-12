---
name: idea
description: Capture and refine initiatives into IDEA_<slug>.md and backlog entries. Feeds /plan, /dev, and /ship with the original "why".
---

# /idea — Capture and Refine Initiatives

Use `/idea` to capture, refine, and maintain initiative context as `IDEA_<slug>.md` files. This is the starting point for the planning workflow.

## What `/idea` does

- **Writes context** — Creates and maintains `docs/plan/context/IDEA_<slug>.md` as the canonical initiative context
- **Refines scope** — Helps narrow down broad goals into actionable initiatives
- **Feeds planning** — Provides the "why" that `/plan`, `/dev`, and `/ship` use
- **Backlog integration** — Creates or updates entries in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

## How to use it

- `/idea` — Create a new idea from user input
- `/idea <slug>` — Create or refine a specific idea
- `/idea <text>` — Create idea from the provided text

## Output

Creates `docs/plan/context/IDEA_<slug>.md` with:
- **Title** — Initiative name
- **Problem** — What problem this solves
- **Solution** — Proposed approach
- **Scope** — What's in/out of scope
- **Success criteria** — How success is measured
- **Dependencies** — What else is needed
- **Priority** — P0/P1/P2/P3

## Implementation notes

- May use planning subagents (see `gf-planner`) to refine scope, but does **not** execute code.
- Always write to `docs/plan/context/IDEA_<slug>.md` format.
- Update `ALL_TASKS_BACKLOG.md` when creating new initiatives.
- Feed the resulting IDEA to `/plan` for phased execution.

---

# Idea

Capture and refine initiatives for planned execution.

## Purpose

- Start new initiatives with clear context
- Refine existing ideas before planning
- Maintain a backlog of ideas and initiatives

## Instructions

1. Understand the user's goal or initiative.
2. Create/refine `docs/plan/context/IDEA_<slug>.md`.
3. Include problem, solution, scope, and success criteria.
4. Add to `ALL_TASKS_BACKLOG.md`.
5. Recommend next steps: `/plan <slug>` to create a phased plan.

## When to use

- User mentions a new feature, project, or initiative
- User says "I have an idea..." or "what if we..."
- Starting a newEpic/feature that needs planning
- Refining an existing idea for clarity
