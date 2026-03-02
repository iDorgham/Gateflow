---
name: gf-prompt-writer
description: Write effective prompts for /plan, /dev, CLIs — phase prompts, CLI role prefixes, design briefs, animation specs. Use when creating or refining prompts.
---

# gf-prompt-writer

Prompt engineering reference for GateFlow. Load this skill when writing phase prompts, CLI prompts, design briefs, or animation specs.

## Canonical doc

**Primary reference:** `docs/guides/PROMPT_ENGINEERING.md`

Read that file for:
- Phase prompt structure (Primary role, Preferred tool, Context, Goal, Scope, Steps, Acceptance criteria)
- CLI role prefixes (Security, API, Database, Frontend, Mobile, QA, Architecture)
- Design brief templates
- Animation spec templates
- GateFlow context snippet for prompts
- Copy-paste prompt locations (PROMPTS_REFERENCE.md)

## When to use

- User asks to write a prompt for /plan, /dev, or a CLI
- Creating or refining phase prompts, design briefs, or animation specs
- Need role prefix for Claude/Gemini/Opencode/Kiro/Kilo/Qwen CLI

## References

- Phase template: `.cursor/templates/TEMPLATE_PROMPT_phase.md`
- Pro prompts: `docs/plan/execution/PROMPTS_REFERENCE.md`
- Subagent hierarchy: `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`
- Tool reference: `docs/guides/TOOL_AND_CLI_REFERENCE.md`
