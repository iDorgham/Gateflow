# Develop

Development workflow: implement, preflight, workspace commands.

## Instructions

1. Read `.antigravity/skills/gf-dev/SKILL.md` for commands and workflows.
2. Follow: implement → `pnpm preflight` → fix errors.
3. Use subagents: explore (trace flows), shell (builds, migrate).
4. Use MCP when available: **Prisma-Local** (migrations, schema), **Context7** (docs).

## Commands

```bash
pnpm dev
pnpm build
pnpm preflight    # lint + typecheck + test
pnpm db:generate
```

## Workspace filters

```bash
pnpm turbo build --filter=client-dashboard
pnpm turbo test --filter=scanner-app
```
