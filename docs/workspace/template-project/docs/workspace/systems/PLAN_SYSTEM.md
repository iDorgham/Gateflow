# Plan System and File Organization

This document defines how planning artifacts are organized and executed in this workspace.

## Plan Lifecycle Folders

Root: `docs/plan/`

- `context/` - idea briefs (`IDEA_<slug>.md`)
- `planning/` - draft plans under authoring
- `planned/` - approved plans ready to start
- `in-progress/` - active initiatives
- `done/` - completed initiatives
- `execution/` - execution helpers and task tracking docs
- `guides/` - operational playbooks
- `guidelines/` - templates, standards, and conventions
- `learning/` - persistent lessons and tool memory

## Canonical Plan Files per Initiative

For initiative `<slug>`:

- `PLAN_<slug>.md` - high-level plan with phase table
- `PROMPT_<slug>_phase_<N>.md` - one prompt file per phase
- `TASKS_<slug>.md` - execution checklist (when used by initiative)

Typical location during execution:

- `docs/plan/in-progress/<slug>/PLAN_<slug>.md`
- `docs/plan/in-progress/<slug>/PROMPT_<slug>_phase_<N>.md`

## Execution Commands

- `pnpm plan:new <slug>`
- `pnpm plan:ready <slug>`
- `pnpm plan:start <slug>`
- `pnpm plan:run <slug> <phase>`
- `pnpm plan:done <slug>`
- `pnpm plan:status`

## Phase Prompt Standards

Each prompt should include:

- Primary role
- Preferred tool
- Context and references
- Goal
- Scope (in/out)
- Ordered implementation steps
- Acceptance criteria (lint/typecheck/test/build/docs as applicable)

## Rules for Reliable Plan Operations

- Keep one source of truth for phase status (plan table + tasks file).
- Do not mark a phase done without evidence from acceptance criteria.
- Keep `in-progress` and `done` folders synchronized with actual state.
- Update changelog/docs as part of phase completion when behavior or workflow changes.
