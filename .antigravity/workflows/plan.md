---
name: plan
description: Turn an IDEA_<slug>.md into a phased PLAN_<slug>.md plus PROMPT_<slug>_phase_<N>.md pro prompts. Create in planning/, then use "ready" to move to planned/.
---

# /plan — Create or Refine a Phased Plan

Use `/plan` to convert an idea into an executable multi-phase plan with per-phase pro prompts, following the phased workflow and **plan lifecycle** (`docs/plan/PLAN_LIFECYCLE.md`).

## What `/plan` does

- Reads:
  - `docs/plan/context/IDEA_<slug>.md` (or goal text if none exists)
  - Existing plan in `docs/plan/planning/<slug>/` or `docs/plan/in-progress/<slug>/` (when refining)
  - `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
  - `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`
  - `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`
  - `docs/plan/templates/PLAN_FOLDER_STRUCTURE.md` — canonical folder structure + tool matrix
- **Creates the following folder hierarchy** in `docs/plan/planning/<slug>/`:
  ```
  planning/<slug>/
  ├── PLAN_<slug>.md              # Master: phases, deps, risks
  ├── TASKS_<slug>.md             # Flat checklist (phases + parts)
  ├── CONTEXT_<slug>.md           # Frozen schema/types/env snapshot
  ├── phases/
  │   ├── 01_<title>/
  │   │   ├── PROMPT_phase_01.md              # or part_a + part_b if long
  │   │   └── files/                          # Code scaffolds (schema patch, templates)
  │   └── 02_<title>/
  │       └── PROMPT_phase_02.md
  └── assets/
      └── ARCH_NOTES.md                       # ADRs for complex initiatives
  ```
- For each phase, determines if it needs **parts** (split when > 5 steps, > 3 areas, or > 700-word prompt).
- Ensures for each phase prompt:
  - **Primary role** is chosen from the Subagent Hierarchy.
  - **Tool 1** (best quality) and **Tool 2** (free/cheaper fallback) are set using the tool matrix.
  - **Steps** are concrete with file paths and commands.
  - **Scaffolded files** in `phases/NN_<title>/files/` for schema patches, type defs, templates.
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

## Implementation notes (for agents)

- Always use `TEMPLATE_PROMPT_phase.md` template when creating or updating phase prompts. The template now includes **Skills**, **MCP**, **Commands**, and optional **Given/When/Then** acceptance criteria — populate these when relevant. See `docs/plan/PLANNING_ENHANCEMENTS.md`.
- For complex initiatives: follow Understand → Investigate (explore subagent) → Generate before writing phases.
- **New plans:** Write to `docs/plan/planning/<slug>/`. If slug folder exists in `planned/`, `in-progress/`, or `done/`, ask user before overwriting.
- **`/plan ready <slug>`:** Move all files from `planning/<slug>/` to `planned/<slug>/`. Create `planned/<slug>/` if needed. Remove `planning/<slug>/` after move.
- Treat:
  - `AI_SKILLS_SUBAGENTS_RULES.md` and `SUBAGENT_HIERARCHY.md` as the **single brain** for roles and subagents.
  - `PHASED_DEVELOPMENT_WORKFLOW.md` as the canonical execution loop.
- Prefer small, testable phases that can be executed in one focused session and gated by lint/typecheck/tests.

## Workflow

Create phased development plans from goals or backlog. This is one of the **four master commands**:

- `/idea` — capture and refine initiatives.
- `/plan` — turn an idea into a multi-phase plan and pro prompts (in `planning/`); use `/plan ready <slug>` when approved.
- `/dev` — implement one phase end-to-end (moves plan to `in-progress/`, then `done/`).
- `/ship` — execute all remaining phases for a plan.

### Instructions

- **Persistent Memory (mandatory):** At session start, check for `SESSION_MEMORY.md` in the plan folder and load it first (L5, ~400t). Update it at the end of the session with decisions made and context loaded.
- **Progressive context loading:** Load files in layer order — L0 (git log ~50t) → L1 (TASKS ~150t) → L2 (PLAN ~600t). Only load L4 (CONTEXT_<slug>.md ~1,800t) if the plan touches schema/types.

1. Read `planner` skill (Planning Subagent Prompt section).
2. **Skill discovery (mandatory):** Invoke `using-superpowers` — check if any skill applies before any response.
3. **Idea refinement (before planning):** If goal is unclear or creative, invoke `brainstorming` skill first. Ask one question at a time until requirements are validated.
4. Start from an idea:
   - Use `/idea` to create/refine `docs/plan/context/IDEA_<slug>.md`, or
   - Use an existing IDEA or high-level goal text.
5. **Phase prompt writing:** Invoke `writing-plans` skill when creating phase prompts. Each plan must have exact file paths, complete steps, and test-first approach.
6. **Isolated work:** When the initiative is large or risky, invoke `using-git-worktrees` to set up an isolated workspace before writing phases.
7. Create a phased plan: breakdown, deliverables per phase, test criteria.
8. **Scaffold folder structure FIRST** (before writing any files):
   ```bash
   mkdir -p docs/plan/planning/<slug>/phases
   mkdir -p docs/plan/planning/<slug>/assets
   # For each phase NN:
   mkdir -p docs/plan/planning/<slug>/phases/NN_<title>/files
   ```
9. **Write root files**: `PLAN_<slug>.md`, `TASKS_<slug>.md`, `CONTEXT_<slug>.md` (frozen schema + key types + env vars).
10. **For each phase**, determine if it needs **parts** (see splitting rules in `PLAN_FOLDER_STRUCTURE.md`):
    - Short phase (≤5 steps, 1-2 areas): single `PROMPT_phase_NN.md`
    - Long phase (>5 steps, 3+ areas, >700 words): split into `PROMPT_phase_NN_part_a.md`, `_part_b.md`, etc.
    - Add scaffolded code in `phases/NN_<title>/files/` (schema patches, type defs, templates)
11. **Tool 1 + Tool 2** in every phase prompt: use `docs/plan/templates/PLAN_FOLDER_STRUCTURE.md` tool matrix. Load `cli-limits` to check current limits.
12. **UI/UX Intelligence (Automated)**:
   - If the initiative involves UI (SaaS, Mobile, Dashboard, Landing):
   - Run: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<slug> <industry>" --design-system --persist -p "<slug>"`
   - Reference `design-system/MASTER.md` in the plan and prompts.
5. Save the plan to `docs/plan/planning/<slug>/PLAN_<slug>.md`.
6. For each phase, write a pro prompt using `TEMPLATE_PROMPT_phase.md`:
   - Save as `docs/plan/planning/<slug>/PROMPT_<slug>_phase_<N>.md`.
7. When user approves the plan: run `/plan ready <slug>` to move `planning/<slug>/` → `planned/<slug>/`.
8. **Automated Backlog & Lifecycle Orchestration**:
   - For every new or updated plan: Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
   - **Transition**: Move the initiative from "Open/Refining" to "Planned" or "In Progress" as appropriate.
   - **Linking**: Ensure the backlog entry links to the `PLAN_<slug>.md` file.
9. **Auto-Sync:** Execute a full Git cycle (`git add .`, `git commit -m "plan(<slug>): roadmap"`, `git pull --rebase origin <branch>`, `git push origin <branch>`).

### When to use

- User asks for "plan", "breakdown", "phases".
- Goal: MVP, Resident Portal, feature epic.
- Source: `docs/plan/backlog/ALL_TASKS_BACKLOG.md` and any relevant `IDEA_<slug>.md` files.
