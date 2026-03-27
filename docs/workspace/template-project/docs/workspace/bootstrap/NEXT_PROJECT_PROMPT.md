# Next Project Bootstrap Prompt

Use this prompt to reproduce the same workspace operating system in a new repository.

```md
You are setting up a full AI-assisted workspace system for a new monorepo project.

Goal:
Replicate the GateFlow-style workspace architecture and automation model, including:

- Commands + subcommands
- Agents + subagents
- Rules + skills
- Scripts + Ralph-style loop
- CI/CD + GitHub automation/security
- Cache layer + memory layer
- Workspace docs hub

Execution order (must follow):

1. **Onboarding**
   - Ask for project name and short slug.
   - Ask for monorepo scope (apps/packages) and preferred stack.
   - Ask for default branch naming (`main` or `master`).
2. **GitHub bootstrap**
   - Create/init GitHub repo.
   - Add base files: `README.md`, `CHANGELOG.md`, `.gitignore`, license, PR template.
   - Configure branch protection recommendations.
3. **Choose GitHub workflow model**
   - Pick workflow set: CI, Deploy, Release, PR Labels, Security (CodeQL), Lighthouse (optional), AI-sync.
   - Apply pinned action SHAs.
4. **Install workspace template root**
   - Create clean root with: `docs/`, `plan/`, `assets/`, `.cursor/`, `scripts/`.
   - Initialize `.cursor/` subfolders for rules, agents, subagents, skills, commands, commands-ref, templates.
5. **MCP setup**
   - Ask which MCP servers are required.
   - Create project MCP config and document required auth/setup steps.
6. **MVP planning**
   - Create MVP roadmap with phases.
   - Generate `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` files.
   - Add acceptance criteria per phase.
7. **Templates + contracts bootstrap**
   - Create workspace templates pack (prompt, API, PR, commit, DoD, subagent templates).
   - Create contracts pack for security/invariants and wire it into rules/prompts.
8. **Automation wiring**
   - Wire scripts, hooks, CI checks, and changelog checks.
   - Ensure plan lifecycle commands and docs automation exist.

Required workspace docs:

1. Create a `docs/workspace/` folder as the workspace source of truth.
2. Include these files at minimum:
   - `README.md`
   - `CHANGELOG.md`
   - `catalog/AGENTS.md`
   - `catalog/SUBAGENTS.md`
   - `catalog/RULES.md`
   - `catalog/COMMANDS.md`
   - `catalog/SKILLS.md`
   - `catalog/SCRIPTS.md`
   - `catalog/DEV_TOOLS.md`
   - `catalog/AI_TOOLS.md`
   - `catalog/WORKSPACE_SOURCES.md`
   - `automation/AUTOMATIONS.md`
   - `automation/RALPH_LOOP.md`
   - `automation/GITHUB_AUTOMATION.md`
   - `automation/GITHUB_SECURITY.md`
   - `systems/PLAN_SYSTEM.md`
   - `systems/CACHE_LAYER.md`
   - `systems/MEMORY_LAYER.md`
   - `bootstrap/RELEASE_NOTES_TEMPLATE.md`
   - `bootstrap/NEXT_PROJECT_PROMPT.md`
   - `templates/README.md`
   - `contracts/README.md`
3. Create workspace template scaffold folder:
   - `template-project/README.md`
   - `template-project/docs/README.md`
   - `template-project/plan/README.md`
   - `template-project/assets/README.md`
   - `template-project/.cursor/README.md`
   - `template-project/scripts/README.md`
   - `template-project/.cursor/{rules,agents,subagents,skills,commands,commands-ref,templates}/README.md`
4. Keep naming in `docs/workspace/` neutral; do not introduce names starting with `gf_`.
5. Add source mapping coverage for:
   - `.ai-memory`
   - `.antigravity/templates`
   - `.antigravity/contracts`
   - `docs/security`
   - `docs/plan/learning`
   - `docs/plan/guides`
   - `docs/plan/guidelines`
   - `docs/plan/context`
6. Add separate version tracks:
   - Workspace version
   - Apps/product version
   - AI tools track
7. Split changelog unreleased entries into:
   - Workspace
   - AI Tools
   - Apps
8. Add scripts:
   - `docs:changelog:format`
   - `docs:changelog:check`
     and enforce changelog structure in CI + preflight.
9. Document cache and memory systems explicitly:
   - Build/CI cache
   - Runtime cache
   - AI memory/logging layer
10. Add GitHub automation + security docs:

- CI
- Deploy
- Release
- PR automation
- CodeQL
- Dependabot
- secret scanning

11. Ensure docs are comprehensive, structured, and badge-driven.
12. Add install-style subfolders under `docs/workspace/`:

- `installation/`
- `catalog/`
- `automation/`
- `systems/`
- `bootstrap/`
- `templates/`
- `contracts/`

13. After setup, output:

- What was created
- What was wired to CI/preflight
- What still needs project-specific customization
- MVP roadmap summary with phases and prompt files
- Required MCP servers and onboarding status

Execution style:

- Make concrete file edits.
- Keep content production-ready.
- Validate with lint/check scripts where available.
```
