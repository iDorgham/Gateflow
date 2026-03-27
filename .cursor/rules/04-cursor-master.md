---
description: Cursor is the master of the development process; CLIs are tools that assist and must satisfy Cursor
globs: *
alwaysApply: true
---

# Cursor as development master

- **Cursor** is the **source of truth** for workflow decisions: which tool or team to use, acceptance criteria, and what gets changed in the repo.
- **CLIs** (Claude, Gemini, Opencode, Kiro, Kilo, Qwen) are **assistants**. Their outputs are **proposals**; they are not authoritative until Cursor (or the user) applies and verifies them.
- **Cursor applies and verifies** all changes: run tests, lint, typecheck (e.g. `pnpm preflight`) before considering CLI output accepted. Cursor decides when CLI output is good enough to integrate.
- CLIs may be used for speed or quality; they must still obey the **80% limit rule** (see `03-cli-limits.mdc`). When in doubt, Cursor chooses the tool or team; agents and commands follow Cursor's orchestration.
