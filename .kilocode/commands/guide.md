---
name: guide
description: Run the GateFlow workspace guide — "what should I do now?", next steps, recommended actions, critical items, and improvement ideas.
---

# /guide — Workspace Guide

Use `/guide` to get a clear picture of what to do next, what's recommended, what's critical, and optional improvements. The guide uses the **gf-guide** skill and understands the full workspace (Skills, Agents, Rules, Commands, Templates, Contracts, GATEFLOW_CONFIG, docs, and plan).

## What /guide does

1. **Loads context**
   - `GATEFLOW_CONFIG.md` — commands, plans, security, agents, skills.
   - `docs/PRD_v5.0.md` — product status and roadmap.
   - `docs/plan/` — ideas, plans, phase prompts, learning (patterns, incidents, decisions).

2. **Assesses state**
   - Git (branch, uncommitted changes).
   - Whether preflight (lint/typecheck/test) is green or should be run.
   - Active plan and next incomplete phase.

3. **Reports**
   - **Must do** — Actions that unblock or keep the project healthy (e.g. fix tests, commit, push).
   - **Recommended** — High-value next steps (e.g. run next phase with `/dev`, update docs).
   - **Critical** — Security or compliance items if any.
   - **Improvements** — Concrete ideas (features, docs, automation).

4. **Optional: super-power mode**  
   If the user wants the guide to "do it for me" or "follow the plan":
   - Use the subagent hierarchy and phase prompts.
   - Use commands (`/ready`, `/dev`, `/github`) and shell for `pnpm preflight`, `pnpm turbo build`, etc.
   - Load the right skills (gf-dev, gf-planner, gf-security) and confirm automations, tests, performance, and code quality.

## How to use it

- **`/guide`** or **`/guide what should I do now`** — Full guide pass: context, state, and report (Must do / Recommended / Critical / Improvements).
- **`/guide`** + "and do the next phase" / "run the plan" — Same as above, then run in super-power mode (follow plan, use hierarchy, run checks).

## Implementation notes

- Always load `.kilocode/skills/gf-guide/SKILL.md` when handling `/guide`.
- **When finishing a phase:** Update `docs/plan/execution/TASKS_<plan>.md` in the same pass as the commit so "what's done" stays accurate for /guide and /dev. Do this automatically after each phase.
- Use the skill's output format for the report.
- For super-power mode: respect `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`, use `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` and acceptance criteria, and run `pnpm preflight` to confirm everything works.
