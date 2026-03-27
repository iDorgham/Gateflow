# Template Project Install Prompt

Copy-paste this prompt to install the full workspace system in a new project.

```md
You are installing the GateFlow-style workspace operating system into this repository.

Follow this order exactly.

## 1) Onboarding

1. Ask for:
   - project name
   - project slug
   - default branch (`main` or `master`)
   - monorepo scope (apps/packages)
   - preferred stack
2. Confirm target folder structure:
   - `docs/`
   - `plan/`
   - `assets/`
   - `.cursor/`
   - `scripts/`

## 2) Install Workspace Structure

Create and wire:

- `docs/workspace/README.md`
- `docs/workspace/CHANGELOG.md`
- `docs/workspace/installation/`
- `docs/workspace/catalog/`
- `docs/workspace/automation/`
- `docs/workspace/systems/`
- `docs/workspace/bootstrap/`
- `docs/workspace/templates/`
- `docs/workspace/contracts/`
- `docs/workspace/template-project/`

## 3) Install Rules

Install rules into `.cursor/rules/` and document them in `docs/workspace/catalog/RULES.md`.

Must include:

- core rules
- workflow rules
- guide rules
- security rules
- CLI limits + learning rules

## 4) Install Agents and Subagents

Install:

- `.cursor/agents/orchestrator.md`
- `.cursor/agents/roles/*`
- `.cursor/agents/scenarios/*`
- `.cursor/subagents/*`

Then document in:

- `docs/workspace/catalog/AGENTS.md`
- `docs/workspace/catalog/SUBAGENTS.md`

## 5) Install Skills

Install `.cursor/skills/*/SKILL.md` and document in:

- `docs/workspace/catalog/SKILLS.md`

## 6) Install Commands and Subcommands

Install:

- `.cursor/commands/*.md` (master slash commands)
- `.cursor/commands-ref/*.md` (internal command refs)

Document in:

- `docs/workspace/catalog/COMMANDS.md`

Include subcommands explicitly (example: `/man tasks`, `/man settings`, `/man run`, etc.).

## 7) Install Scripts

Install workspace scripts in `scripts/`:

- plan lifecycle scripts
- changelog scripts
- security scripts
- quality scripts
- setup scripts

Document in:

- `docs/workspace/catalog/SCRIPTS.md`
- `docs/workspace/catalog/DEV_TOOLS.md`

## 8) Install Automations

Install and document:

- Husky hooks
- GitHub Actions (CI, deploy, release, PR labels, security, optional Lighthouse, sync workflows)
- changelog checks in preflight + CI

Docs:

- `docs/workspace/automation/AUTOMATIONS.md`
- `docs/workspace/automation/GITHUB_AUTOMATION.md`
- `docs/workspace/automation/GITHUB_SECURITY.md`
- `docs/workspace/automation/RALPH_LOOP.md`

## 9) Install Systems Layer

Create docs for:

- plan system
- cache layer
- memory layer

Files:

- `docs/workspace/systems/PLAN_SYSTEM.md`
- `docs/workspace/systems/CACHE_LAYER.md`
- `docs/workspace/systems/MEMORY_LAYER.md`

## 10) Install Templates and Contracts

Create:

- `docs/workspace/templates/README.md`
- `docs/workspace/contracts/README.md`

Ensure contracts are wired into rules/prompts/review flow.

## 11) Bootstrap Prompt and Release Template

Create:

- `docs/workspace/bootstrap/NEXT_PROJECT_PROMPT.md`
- `docs/workspace/bootstrap/RELEASE_NOTES_TEMPLATE.md`

## 12) Final Validation Output

Return:

1. what was created
2. what was wired into CI/preflight
3. what still needs project-specific customization
4. MVP roadmap summary (phases + prompt files)
5. required MCP servers and onboarding status

Execution constraints:

- make concrete file edits
- keep naming in `docs/workspace` neutral (no names starting with `gf_`)
- exclude secrets
- run lint/check scripts where available
```
