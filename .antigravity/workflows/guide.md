---
name: guide
description: Run the GateFlow workspace guide — "what should I do now?", next steps, recommended actions, critical items, and improvement ideas. Can run in super-power mode (follow plan, use hierarchy, run checks).
---

# /guide — Workspace Guide

Use `/guide` to get a clear picture of what to do next, what's recommended, what's critical, and optional improvements. The guide uses the **workspace-guide** skill and understands the full workspace (Skills, Agents, Rules, Commands, Templates, Contracts, GATEFLOW_CONFIG, docs, and plan).

## What /guide does

1. **Loads context**
   - `GATEFLOW_CONFIG.md` — commands, plans, security, agents, skills.
   - `docs/PRD_v7.0.md` — product status and roadmap.
   - `docs/plan/` — ideas, plans, phase prompts, learning (patterns, incidents, decisions).

2. **Assesses state**
   - Git (branch, uncommitted changes).
   - Whether preflight (lint/typecheck/test) is green or should be run.
   - Active plan and next incomplete phase.
   - **Ralph Perspectives**:
     - Run `node scripts/ralph-prioritize.js` for backlog intelligence.
     - Run `node scripts/ralph-skill-discover.js` for automated pattern scanner.

3. **Reports (Enforced)**
   - **Must do** — Actions that unblock the project.
   - **Workflow Health** — Status of the Ralph Loop. Are enforcers passing?
   - **Skill Compliance Score** — Quantitative rating (0-100%) of the codebase against ~40 skills.
   - **Strategic Blockers** — Items preventing the next phase.
   - **Recommended** — High-value next steps (e.g. `/dev`).
   - **Critical** — Security/Performance risks detected by enforcer scripts.
   - **Next Step Injection** — Always end with a "Ready-to-Run" block containing the exact `/dev` command for the next task.
   - **CLI suggestions** — When a task may be done better in terminal, suggests the right tool from **`docs/guides/TOOL_AND_CLI_REFERENCE.md`**. If the user has listed their tools in **`docs/plan/learning/GUIDE_PREFERENCES.md`**, the guide prefers those when they match the task.

4. **Optional: super-power mode**  
   If the user wants the guide to "do it for me" or "follow the plan":
   - Use the subagent hierarchy and phase prompts.
   - Use commands (`/ready`, `/dev`, `/github`) and shell for `pnpm preflight`, `pnpm turbo build`, etc.
   - Load the right skills (dev-guide, planner, security) and confirm automations, tests, performance, and code quality.

## How to use it

- **`/man`** — One-command orchestrator: assess state, recommend next step; `/man run` executes. See `docs/plan/MAN_WORKFLOW.md`.
- **`/guide`** or **`/guide what should I do now`** — Full guide pass: context, state, and report (Must do / Recommended / Critical / Improvements).
- **`/guide`** + "and do the next phase" / "run the plan" — Same as above, then run in super-power mode.
- **Preferences:** Edit `docs/plan/learning/GUIDE_PREFERENCES.md` so the guide adapts to your tone, format, and recurring needs.
- **Copy-paste prompts:** See `docs/plan/execution/PROMPTS_REFERENCE.md` for the professional /plan prompt.

## Implementation notes (for agents)

- **Skill discovery first (mandatory):** Invoke `using-superpowers` before any response — even clarifying questions. If 1% chance a skill applies, read it.
- **PR review feedback:** When user shares code review comments, invoke `receiving-code-review` — evaluate technically, verify before implementing, push back when warranted.
- **New skill creation:** If a recurring pattern or gap is identified during guide pass, invoke `writing-skills` to author a new skill.
- Always load `workspace-guide` skill when handling `/guide`.
- **When finishing a phase:** Update `docs/plan/execution/TASKS_<plan>.md` in the same pass as the commit.
- When recommending next steps, suggest a CLI when one might do the task better: use **`docs/guides/TOOL_AND_CLI_REFERENCE.md`** and **`docs/plan/learning/CLI_TOOL_MEMORY.md`**. Default: Claude = security/architecture; Gemini = schema/DB; Opencode = code gen; Kiro/Qwen = free agentic, large context; Kilo = free terminal, fast iteration.
- If `docs/plan/learning/GUIDE_PREFERENCES.md` exists, read it and adapt tone, format, and priorities.
- **Limits + permission (mandatory for CLI suggestions)**:
  - Load `cli-limits` skill and check `CLI_LIMITS_TRACKING.md`.
  - **80% rule**: if a CLI is at **80%+** of its limit, do **not** suggest it unless the user explicitly permits it.
- **Learning + memory**:
  - After any work that used a CLI, ensure one entry exists in `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.
  - For durable learnings, point the user to `docs/plan/learning/CLI_TOOL_MEMORY.md`.
- Use the skill's output format for the report.
- For super-power mode: respect `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`, use phase prompts and acceptance criteria, and run `pnpm preflight`.
