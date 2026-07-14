# GateFlow Workspace AI Environment Reference

This file is the operational reference for the GateFlow AI workspace environment:

- agents,
- subagents,
- skills,
- commands and subcommands,
- templates,
- sync and automation (`ralph`, AI tool sync),
- directory scanning commands across `.antigravity`, `.cursor`, `.agents`, `.claude`, `.gemini`, `.kiro`, `.opencode`, `.qwen`.

## Coverage Status

- Workspace AI directory map: covered.
- Commands + usage: covered.
- Ralph + automation + sync: covered.
- Scan commands for all requested folders: covered.
- Subagents/skills/templates references: covered.

## 1) AI Workspace Directory Map

Current repo-level AI directories:

- `.antigravity` (primary shared AI source)
- `.cursor` (Cursor-specific commands/rules/skills/subagents/templates)
- `.claude` (Claude Code config and symlinked command surface)
- `.gemini`
- `.kiro`
- `.kilocode`
- `.opencode`
- `.qwen`
- `.agents` (symlink to `.antigravity`)
- `.ai-memory` (present)

Important notes:

- `.agents` is a symlink to `.antigravity`.
- `.ai` directory is currently **not present** in this workspace.

## 2) Command Surfaces (What Exists)

### Cursor command files

From `.cursor/commands`:

- `dev.md`
- `guide.md`
- `ship.md`
- `docs.md`
- `ralph.md`
- `version.md`
- `man.md`
- `organize.md`
- `prompt.md`
- `draft.md`
- `clis-team.md`

### Antigravity workflow files

From `.antigravity/workflows`:

- `dev.md`
- `guide.md`
- `ship.md`
- `docs.md`
- `ralph.md`
- `version.md`
- `man.md`
- `organize.md`
- `prompt.md`
- `draft.md`
- `clis-team.md`
- `brainstorm.md`
- `creative.md`
- `deploy.md`

### Claude command surface

- `.claude/commands` points to `.antigravity/workflows` (shared command definitions).

## 3) Core Commands and How to Use Them

## Ralph and workspace control

- `pnpm ralph`  
  Show full workspace dashboard (git, plans, hooks, quality snapshot, next action).

- `pnpm ralph:short`  
  Compact dashboard view.

## Plan lifecycle commands

- `pnpm plan:new <slug> [--phases N]`  
  Create a new phased plan scaffold.

- `pnpm plan:ready <slug>`  
  Move approved plan to execution-ready state.

- `pnpm plan:start <slug>`  
  Move plan to active state and begin execution flow.

- `pnpm plan:run <slug> <phase>`  
  Execute a specific phase.

- `pnpm plan:done <slug>`  
  Complete plan and trigger docs/release updates.

- `pnpm plan:status`  
  Show current plan status across lifecycle folders.

## Documentation and release

- `pnpm docs:changelog`  
  Update changelog entries.

- `pnpm docs:changelog:check`  
  Validate changelog structure.

- `pnpm docs:changelog:format`  
  Normalize changelog formatting.

- `pnpm docs:release`  
  Run release-oriented docs/version flow.

- `pnpm docs:index`  
  Regenerate docs index.

- `pnpm docs:organize`  
  Organize/clean docs structure.

## Quality and automation checks

- `pnpm preflight`  
  Full lint + typecheck + tests (+ changelog check in this repo).

- `pnpm check:env`
- `pnpm check:secrets`
- `pnpm check:bundle`
- `pnpm check:imports`
- `pnpm check:db-drift`
- `pnpm check:security`
- `pnpm check:pre-deploy`

## AI sync

- `pnpm sync`  
  Run AI-tool sync script (`scripts/ai-sync/sync-ai-tools.sh`).

- `pnpm sync:watch`  
  Watch mode for sync operations.

## 4) Slash Commands and Subcommands (Workspace Usage)

Primary slash command family (as documented in workspace guides):

- `/idea [slug]`
- `/draft [slug]`
- `/prompt [slug]`
- `/plan [slug]`
- `/dev [slug|phase]`
- `/ship [slug]`
- `/guide`
- `/man`
- `/docs`
- `/version`
- `/clis team <seo|refactor|audit>`

### Practical examples

- `/guide`  
  Ask what to do next now (state-aware recommendation).

- `/dev 2`  
  Execute phase 2 of the active plan.

- `/ship my_feature_slug`  
  Execute remaining phases and finalize.

- `/clis team refactor`  
  Run predefined multi-CLI refactor team workflow.

## 5) Agents, Subagents, Skills, Templates

### Where they live

- Agents:
  - `.antigravity/agents`
  - `.cursor/agents`
  - `.claude/agents`
- Subagents:
  - `.antigravity/subagents`
  - `.cursor/subagents`
  - `.claude/subagents`
- Skills:
  - `.antigravity/skills`
  - `.cursor/skills`
  - `.claude/skills`
  - plus tool-specific skill mirrors in `.gemini`, `.opencode`, `.qwen`, etc.
- Templates:
  - `.antigravity/templates`
  - `.cursor/templates`

### How to inspect quickly

- `ls -la .antigravity/agents .antigravity/subagents .antigravity/skills .antigravity/templates`
- `ls -la .cursor/agents .cursor/subagents .cursor/skills .cursor/templates`
- `ls -la .claude/agents .claude/subagents .claude/skills`

## 6) Scan Commands for Requested Directories

Use these from repo root.

### Fast structure scan

```bash
ls -la .antigravity .cursor .agents .claude .gemini .kiro .opencode .qwen .kilocode .ai-memory
```

### Recursive file inventory (safe and fast)

```bash
rg --files .antigravity
rg --files .cursor
rg --files .claude
rg --files .gemini
rg --files .kiro
rg --files .opencode
rg --files .qwen
rg --files .kilocode
rg --files .ai-memory
```

### Focused scans by artifact type

```bash
rg --files .antigravity | rg "commands|workflows|skills|subagents|templates|rules|contracts"
rg --files .cursor | rg "commands|skills|subagents|templates|rules|agents"
rg --files .claude | rg "commands|skills|subagents|agents|settings"
```

### Check for optional `.ai` folder

```bash
ls -la .ai
```

If it does not exist, keep using `.antigravity` + `.cursor` + `.claude` as primary config sources.

## 7) Ralph + AI Sync Operational Flow

Recommended sequence before/after significant AI workflow changes:

1. `pnpm ralph` (state check)
2. Apply command/rule/skill/template changes
3. `pnpm sync` (propagate to AI tool folders)
4. `pnpm docs:index` (refresh docs index if docs changed)
5. `pnpm preflight` (validate workspace health)

## 8) Canonical Docs for This Environment

- `docs/workspace/WORKSPACE_GUIDE.md`
- `docs/guides/AUTOMATION_GUIDE.md`
- `docs/guides/TOOL_AND_CLI_REFERENCE.md`
- `docs/reference/workspace/GATEFLOW_CONFIG.md`
- `docs/guides/ANTIGRAVITY_SKILLS.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## 9) Planning Notes for AI Tools

- Use `.antigravity` as canonical shared AI workflow source.
- Treat `.cursor` and `.claude` as tool-specific adapters/mirrors.
- Use `pnpm sync` after changing shared AI artifacts.
- Use `pnpm ralph` to pick next action and avoid drift in plan execution.
