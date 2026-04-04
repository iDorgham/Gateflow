# PROMPT: docs_workspace_template_cursor_bootstrap — Phase 1

## Goal

Create an essential `.cursor` bootstrap starter in `docs/workspace/template-project/.cursor` with:

- core rules,
- core orchestrator/role agents,
- core subagent prompt templates,
- one essential bootstrap skill,
- one install command that executes `INSTALL_PROMPT.md` and removes itself after success.

## Scope

### In

- `docs/workspace/template-project/.cursor/rules/*`
- `docs/workspace/template-project/.cursor/agents/*`
- `docs/workspace/template-project/.cursor/subagents/*`
- `docs/workspace/template-project/.cursor/skills/*`
- `docs/workspace/template-project/.cursor/commands/install-workspace-template.md`
- `docs/workspace/template-project/.cursor/README.md`

### Out

- app runtime code changes
- production API changes
- CI pipeline logic changes

## Steps

1. Add three baseline rules (core/workflow/security).
2. Add orchestrator and role agent files (planning, security, backend-api, frontend).
3. Add three baseline subagent prompts (explore, shell, browser-use).
4. Add one bootstrap skill pointing to install command.
5. Add one command file `/install-workspace-template` pointing to `INSTALL_PROMPT.md`.
6. Require explicit post-install self-removal command in install command doc.
7. Update `.cursor/README.md` with starter-pack index and one-command install flow.

## Acceptance Criteria

- Essential files exist and are internally consistent.
- Install command includes explicit delete command:
  - `rm -f ".cursor/commands/install-workspace-template.md"`
- `.cursor/README.md` documents the one-command flow.
