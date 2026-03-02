---
description: CLI usage limits — agents and commands must not use a CLI at 80%+ without user permission
globs: *
alwaysApply: true
---

# CLI 80% limit rule

When a CLI account has used **80% or more** of its limit (as recorded in `docs/plan/learning/CLI_LIMITS_TRACKING.md` or `docs/plan/learning/GUIDE_PREFERENCES.md`):

- **Agents and commands must NOT use that CLI** for any task unless the user has given **explicit permission**.
- Do not invoke it, suggest it as the primary tool, or run phases with it.
- Instead: suggest a free-tier CLI (Kiro, Kilo, Qwen, Opencode) or Cursor, or ask the user: "This CLI is at 80%+ of its limit. Use it anyway, or use [alternative] instead?"

**Load** `.cursor/skills/gf-cli-limits/SKILL.md` when suggesting or choosing a CLI. This rule applies to `/dev`, `/guide`, and any phase or command that can invoke an external CLI.
