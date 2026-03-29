# PROMPT: docs_workspace_template_cursor_bootstrap — Phase 2

## Goal

Add a short installer prompt and polish template docs so bootstrap can run in either full mode or fast mode.

## Scope

### In

- `docs/workspace/template-project/INSTALL_PROMPT_SHORT.md`
- `docs/workspace/template-project/README.md`
- `docs/workspace/template-project/.cursor/README.md`
- `docs/workspace/template-project/.cursor/commands/install-workspace-template.md`
- `docs/plan/in-progress/docs_workspace_template_cursor_bootstrap/*`

### Out

- app runtime code changes
- infra/runtime security policy changes

## Steps

1. Create `INSTALL_PROMPT_SHORT.md` with concise install flow.
2. Add short prompt reference in template root README.
3. Add short prompt usage in `.cursor` docs and install command.
4. Mark phase 2 complete in PLAN + TASKS.

## Acceptance Criteria

- `INSTALL_PROMPT_SHORT.md` exists and is runnable.
- Template docs reference both full and short prompt paths.
- Plan phase table marks phase 2 as complete.
