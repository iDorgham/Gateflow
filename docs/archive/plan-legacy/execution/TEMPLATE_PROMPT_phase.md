# Template moved

The phase prompt template now lives in `.cursor/templates/`.

**Use:** `.cursor/templates/TEMPLATE_PROMPT_phase.md`

Copy that template, fill placeholders, and save as `PROMPT_<initiative>_phase_<N>.md` in this directory.

The shared template already enforces:

- **Primary role**: chosen from the Subagent Hierarchy and used by all tools.
- **Preferred tool**: checkboxes for Cursor, Claude CLI, Gemini CLI, OpenCode CLI, or Multi-CLI.
- **Clear ordered steps**: including implementation and test commands.
- **Acceptance criteria**: checklist with explicit lint/test gates for the affected workspace(s).
