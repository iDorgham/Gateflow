# Development Tools (Workspace)

Comprehensive map of development tools and systems created/used in this workspace.

## Package and Build Toolchain

- `pnpm` workspaces (package manager)
- `turbo` (monorepo task orchestration + caching)
- TypeScript, ESLint, Prettier, Jest

## Automation and Quality Scripts

Primary sources: `scripts/*.js`, `.husky/*`, `.github/workflows/*.yml`

- Plan lifecycle: `ralph-plan.js`, `ralph-run.js`, `phase-close.js`
- Docs/release: `ralph-docs.js`, `ralph-organize.js`, `format-changelog.js`, `check-changelog.js`
- Security/quality: `scan-secrets.js`, `check-security.js`, `check-imports.js`, `check-db-drift.js`, `check-bundle-size.js`, `pre-deploy.js`, `check-env.js`
- Developer setup/ops: `setup-dev.js`, `ralph.js`, `ralph-short`, `ralph-hotfix.js`, `ralph-version.js`, `ralph-git.js`, `todos.js`

## AI Tooling Ecosystem

Workspace tool roots:

- `.cursor/`
- `.claude/`
- `.qwen/`
- `.opencode/`
- `.kilocode/`
- `.antigravity/`

See: `AI_TOOLS.md`

## MCP and Integration Config

- `.cursor/mcp.json`
- `.antigravity/mcp.json`
- `.kiro/settings/mcp.json` (if present in repo/tool sync)

## GitHub and CI/CD Tooling

- Workflows: CI, Deploy, Release, PR Labels, Lighthouse, CodeQL, Sync AI Tools
- Dependabot: `.github/dependabot.yml`
- Security policy: `.github/SECURITY.md`
- Ownership: `.github/CODEOWNERS`

## Developer Entry Commands

- `pnpm preflight`
- `pnpm ralph`
- `pnpm ralph:short`
- `pnpm plan:new <slug>`
- `pnpm plan:run <slug> <phase>`
- `pnpm docs:changelog:format`
- `pnpm docs:changelog:check`
