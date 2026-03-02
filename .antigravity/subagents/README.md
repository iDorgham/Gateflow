# GateFlow Subagent Prompts

**Purpose:** Copy-paste prompts for Cursor's built-in subagents. Use these when invoking **explore**, **shell**, or **browser-use** subagents.

Cursor subagents are invoked from the UI (not file-configured). Paste the prompt from the relevant file below when launching a subagent.

| Subagent | When to use | Prompts in |
|----------|--------------|------------|
| **explore** | Trace flows, find code, refactor discovery | [explore.md](explore.md) |
| **shell** | pnpm, turbo, prisma, git, builds | [shell.md](shell.md) |
| **browser-use** | Login, navigate, verify UI, i18n | [browser-use.md](browser-use.md) |
| **planning** | Create plan, phased execution | See [gateflow-planner](../skills/gateflow-planner/SKILL.md) |

**Extended library:** `.cursor/templates/subagents/` — More prompts for explore, shell, browser-use (flows, security, i18n, etc.)

**Full reference:** `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`, `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`
