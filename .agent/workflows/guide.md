---
name: guide
description: Run the GateFlow workspace guide — "what should I do now?", next steps, recommended actions, critical items, and improvement ideas. Can run in super-power mode (follow plan, use hierarchy, run checks).
---

# /guide — Workspace Guide

Use `/guide` to get a clear picture of what to do next, what’s recommended, what’s critical, and optional improvements. The guide uses the **gf-guide** skill and understands the full workspace (Skills, Agents, Rules, Commands, Templates, Contracts, GATEFLOW_CONFIG, docs, and plan).

## What /guide does

1. **Loads context**
   - `GATEFLOW_CONFIG.md` — commands, plans, security, agents, skills.
   - `docs/PRD_v6.0.md` — product status and roadmap.
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
   - **Active Mode** — Report the currently active workspace mode (Development, Design, Architect, Security) and suggest switching if context matches.
   - **Design mode** — When in Design Mode or intent detected: include design brief, recommend gf-design-guide, gf-creative-ui-animation, SuperDesign, and motion checklist.
   - **CLI suggestions** — When a task may be done better in terminal, suggests the right tool from **`docs/guides/TOOL_AND_CLI_REFERENCE.md`** (Cursor, **Claude CLI**, **Gemini CLI**, **Opencode CLI**, **Kiro CLI**, **Kilo CLI**, **Qwen CLI**). If the user has listed their tools in **`docs/plan/learning/GUIDE_PREFERENCES.md`** (e.g. “CLIs & plans” / “My tools”), the guide prefers suggesting those when they match the task (e.g. security review → Claude CLI; schema/DB → Gemini CLI; code gen/refactor → Opencode CLI; free agentic → Kiro or Qwen CLI; free terminal → Kilo CLI).

4. **Optional: super-power mode**  
   If the user wants the guide to "do it for me" or "follow the plan":
   - Use the subagent hierarchy and phase prompts.
   - Use commands (`/ready`, `/dev`, `/github`) and shell for `pnpm preflight`, `pnpm turbo build`, etc.
   - Load the right skills (gf-dev, gf-planner, gf-security) and confirm automations, tests, performance, and code quality.

## How to use it

- **`/guide`** or **`/guide what should I do now`** — Full guide pass: context, state, and report (Must do / Recommended / Critical / Improvements).
- **`/guide`** + "and do the next phase" / "run the plan" — Same as above, then run in super-power mode (follow plan, use hierarchy, run checks).
- **Preferences:** Edit `docs/plan/learning/GUIDE_PREFERENCES.md` so the guide adapts to your tone, format, and recurring needs. When you say how you like things, the agent can suggest adding it there.
- **Copy-paste prompts:** See `docs/plan/execution/PROMPTS_REFERENCE.md` for the professional /plan prompt; the file states exactly which line to start copying from.

## Implementation notes (for agents)

- Always load `.cursor/skills/gf-guide/SKILL.md` when handling `/guide`.
- **When finishing a phase:** Update `docs/plan/execution/TASKS_<plan>.md` in the same pass as the commit so "what's done" stays accurate for /guide and /dev. Do this automatically after each phase.
- When recommending next steps, suggest a CLI when one might do the task better: use **`docs/guides/TOOL_AND_CLI_REFERENCE.md`** (task-to-tool matrix and Section 10) and, when present, **`docs/plan/learning/CLI_TOOL_MEMORY.md`** for the recommended tool per task type; and the user’s tools in **`GUIDE_PREFERENCES.md`**. gf-guide: Claude = security/architecture; Gemini = schema/DB; Opencode = code gen; Kiro/Qwen = free agentic, large context; Kilo = free terminal, fast iteration.
- If `docs/plan/learning/GUIDE_PREFERENCES.md` exists, read it and adapt tone, format, and priorities.
- **Limits + permission (mandatory for CLI suggestions)**:
  - Load `.cursor/skills/gf-cli-limits/SKILL.md` and check `docs/plan/learning/CLI_LIMITS_TRACKING.md` (if present).
  - **80% rule**: if a CLI is at **80%+** of its limit, do **not** suggest it unless the user explicitly permits it; suggest free-tier CLIs or Cursor instead.
- **Learning + memory**:
  - After any work that used a CLI, ensure one entry exists in `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.
  - For durable learnings, point the user to `docs/plan/learning/CLI_TOOL_MEMORY.md` (or use `.cursor/skills/gf-cli-memory/SKILL.md`).
- When the user asks for prompts to copy or where to copy from, use `docs/plan/execution/PROMPTS_REFERENCE.md` and state the exact start line.
- Use the skill’s output format for the report.
- For super-power mode: respect `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`, use `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` and acceptance criteria, and run `pnpm preflight` (or equivalent) to confirm everything works.
