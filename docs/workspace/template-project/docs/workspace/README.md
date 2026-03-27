# Workspace Installation Hub

![Workspace](https://img.shields.io/badge/Workspace-GateFlow-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-0.1.0-0ea5e9?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Coverage-Agents%20%7C%20Rules%20%7C%20Subagents%20%7C%20Commands%20%7C%20Skills%20%7C%20Scripts%20%7C%20Ralph%20Loop%20%7C%20AI%20Tools%20%7C%20Automations%20%7C%20Cache%20%7C%20Memory%20%7C%20Dev%20Tools-1f2937?style=for-the-badge)
![Standards](https://img.shields.io/badge/Standards-pnpm%20only%20%7C%20Multi--tenant%20%7C%20Soft%20delete-success?style=for-the-badge)

This folder is the installation-style source of truth for the GateFlow workspace operating system.

## Scope

- **Workspace assets only**: agents, rules, subagents, commands, skills, scripts, Ralph Loop, AI tools sync map, automations, cache layer, memory layer, dev tools, portability prompt.
- **No app feature specs**: app delivery remains in app docs and root docs.
- **No `gf_` prefixed names**: all files in this folder use neutral naming.

## Version Tracks

- **Workspace Version**: `0.1.0`
- **Apps Version**: `0.1.0`
- **AI Tools Track**: `v6 migration in progress`

## Installation Structure

```text
docs/workspace/
├── installation/
├── catalog/
├── automation/
├── systems/
├── bootstrap/
├── templates/
└── contracts/
```

## Installation Entry Points

- [Installation Guide](./installation/README.md)
- [Template Installation Playbook](./installation/TEMPLATE_INSTALLATION.md)
- [Catalog Index](./catalog/README.md)
- [Automation Index](./automation/README.md)
- [Systems Index](./systems/README.md)
- [Bootstrap Index](./bootstrap/README.md)
- [Templates](./templates/README.md)
- [Contracts](./contracts/README.md)
- [Template Project Root](./template-project/README.md)

## Structured Document Locations

- **Catalog:** `catalog/AGENTS.md`, `catalog/RULES.md`, `catalog/SUBAGENTS.md`, `catalog/COMMANDS.md`, `catalog/SKILLS.md`, `catalog/SCRIPTS.md`, `catalog/DEV_TOOLS.md`, `catalog/AI_TOOLS.md`, `catalog/WORKSPACE_SOURCES.md`
- **Automation:** `automation/AUTOMATIONS.md`, `automation/RALPH_LOOP.md`, `automation/GITHUB_AUTOMATION.md`, `automation/GITHUB_SECURITY.md`
- **Systems:** `systems/PLAN_SYSTEM.md`, `systems/CACHE_LAYER.md`, `systems/MEMORY_LAYER.md`
- **Bootstrap:** `bootstrap/NEXT_PROJECT_PROMPT.md`, `bootstrap/RELEASE_NOTES_TEMPLATE.md`
- **Root:** `README.md`, `CHANGELOG.md`

## Source of Truth Mapping

- Agents source: `.antigravity/agents/`
- Rules source: `.cursor/rules/`
- Subagents source: `.antigravity/subagents/`
- Commands source: `.antigravity/commands-ref/`
- Skills source: `.cursor/skills/`
- Scripts source: `scripts/*.js`
- Ralph Loop sources: `scripts/ralph*.js`, `scripts/phase-close.js`, `.husky/*`
- AI tools roots: `.cursor/`, `.claude/`, `.qwen/`, `.kilocode/`, `.opencode/`, `.antigravity/`
- GitHub automation sources: `.github/workflows/*.yml`, `.github/dependabot.yml`, `.github/CODEOWNERS`
- GitHub security sources: `.github/workflows/codeql-analysis.yml`, `.github/SECURITY.md`, `scripts/check-security.js`
- Plan system sources: `docs/plan/context`, `docs/plan/planning`, `docs/plan/planned`, `docs/plan/in-progress`, `docs/plan/done`, `docs/plan/execution`
- Cache layer sources: `docs/cache/*`, `apps/**/**cache*.ts`, CI cache sections in workflows
- Memory layer sources: `.ai-memory/*`, `docs/plan/learning/*`, hook state files, sync logs
- Dev tools sources: `scripts/*`, `.husky/*`, `.github/*`, tool roots (`.cursor`, `.claude`, `.qwen`, `.opencode`, `.kilocode`)
- Workspace source map refs: `.ai-memory`, `.antigravity/templates`, `.antigravity/contracts`, `docs/security`, `docs/plan/learning`, `docs/plan/guides`, `docs/plan/guidelines`, `docs/plan/context`

## Usage

1. Start with `installation/README.md`.
2. Use `catalog/`, `automation/`, `systems/`, and `bootstrap/` indexes.
3. Use `templates/` and `contracts/` to install the same workspace system in new projects.
