# Template Project Install Prompt (Short)

Use this when you want a fast install of the workspace operating system.

```md
You are installing the workspace operating system into this repository.

Do this in order:

1. Onboard

- confirm project name, slug, default branch, stack, monorepo shape
- if `docs/workspace/PRD.md` exists, improve it first and derive recommended rules/agents/subagents/skills

2. Scaffold core structure

- create: `docs/`, `plan/`, `assets/`, `.cursor/`, `.claude/`, `.antigravity/`, `scripts/`
- create: `docs/workspace/{installation,catalog,automation,systems,bootstrap,templates,contracts,template-project}`

3. Install AI operating essentials

- rules: core/workflow/security
- agents: orchestrator + planning/security/backend-api/frontend roles (`.cursor` + `.claude`)
- subagents: explore/shell/browser-use (`.cursor` + `.antigravity`)
- skills: workspace-bootstrap (`.cursor` + `.claude`)
- commands/workflows: installer + refs (`.cursor`, `.claude`, `.antigravity`)

4. Install docs essentials

- `docs/workspace/README.md`
- `docs/workspace/CHANGELOG.md`
- catalog docs for rules/agents/subagents/skills/commands/scripts/dev-tools
- automation docs for CI/GitHub/security/Ralph Loop
- systems docs for plan/cache/memory layers
- bootstrap docs for next-project prompt + release notes template

5. Wire checks

- ensure changelog structure check is in preflight and CI
- ensure security and secret checks are present
- run `node scripts/template-validate.js`

6. Final output

- list created files
- list CI/preflight hooks added
- list project-specific items still needed

After successful install, remove this bootstrap command:
`rm -f ".cursor/commands/install-workspace-template.md"`
```
