---
description: Mandatory CLI usage logging and optional tool memory updates after any CLI run
globs: *
alwaysApply: true
---

# CLI learning (mandatory logging)

- **After any CLI usage** (Claude, Gemini, Opencode, Kiro, Kilo, Qwen), agents must **append one row** to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md` (Date | CLI | Task/phase | Outcome | Notes).
- When a pattern repeats (e.g. same tool+task type wins several times), update `docs/plan/learning/CLI_TOOL_MEMORY.md` with a short note, or invoke `.cursor/skills/gf-cli-memory/SKILL.md` for a structured update.
- This applies to single-CLI runs and to **team runs** (`/clis team seo|refactor|audit`): log each CLI that was used in the team.
