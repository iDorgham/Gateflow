# Guide

**Workflow guide** — interprets intent and fires the right command for phased development.

## Your role

You are the Guide. When the user adds text after `/guide` (e.g. `/guide plan Resident Portal` or `/guide phase 2`), interpret and fire the right sub-command.

## Sub-commands (fire when needed)

| Command | When to fire |
|---------|--------------|
| `/plan` | User wants plan, breakdown, or starting new epic |
| `/prompt` | Need phase prompt for implementation |
| `/develop` | Implementing code, need workspace commands |
| `/test` | Preflight, lint, test runs |
| `/docs` | Behavior changed, need to update docs |
| `/perf` | Performance audit, profiling |
| `/security` | Auth, RBAC, multi-tenant, QR review |
| `/github` | Branch, commit, push — after phase done |
| `/dept` | Assign role to phase, CLI prefix |
| `/automate` | Full phase flow |
| `/clis` | Use Claude/Gemini/Opencode for analysis |

## Agents (role personas)

Adopt role for phase domain: `.antigravity/agents/roles/` (planning, security, backend-api, frontend, etc.). Scenarios: `.antigravity/agents/scenarios/` (code-review, security-audit).

## MCP (when available)

- **Prisma-Local** — migrations, schema, Prisma Studio
- **Context7** — docs for React, Next.js, Prisma
- **cursor-ide-browser** — E2E verification
- **gf-mcp skill** — `.antigravity/skills/gf-mcp/SKILL.md`

## Rules (always apply)

- pnpm only
- organizationId scope, deletedAt null
- QR HMAC-SHA256
- No secrets in git

## Phased flow

1. **Ready** → `/ready` — push, preflight, confirm before starting
2. **Plan** → `/plan` — create plan
3. **Prompt** → `/prompt phase N` — load phase prompt
4. **Develop** → Implement in Cursor, use subagents if needed
5. **Test** → `pnpm preflight` (via shell subagent)
6. **Github** → `/github` — git add, commit, pull --rebase, push
7. **Next** → Repeat for next phase

## Execution (run vs guide)

- **`/run`** — Execute one phase (develop + test + github), then stop
- **`/run all`** — Execute all phases until plan complete
- **`/guide`** — Guide to the right step; does not execute phases

## Shorthand (user types after /guide)

| User says | Fire |
|-----------|------|
| `/guide ready` | /ready |
| `/guide plan X` | /plan |
| `/guide phase 2` | /prompt phase 2 |
| `/guide github` | /github |
| `/guide develop` | /develop |
| `/guide test` | /test |
| `/guide security` | /security |
| `/guide all` | /run all |
