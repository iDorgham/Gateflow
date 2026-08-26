# Guide

**Workflow guide** — interprets intent and fires the right command for phased development.

## Your role

You are the Guide. When the user adds text after `/guide` (e.g. `/guide plan Resident Portal` or `/guide phase 2`), interpret and fire the right sub-command.

## Sub-commands (fire when needed)

| Command     | When to fire                                        |
| ----------- | --------------------------------------------------- |
| `/plan`     | User wants plan, breakdown, or starting new epic    |
| `/prompt`   | Need phase prompt for implementation                |
| `/dev`      | Implement, test, and commit one phase               |
| `/ship`     | Execute all remaining phases sequentially           |
| `/pilot`    | Orchestrate pilot application through certification |
| `/check`    | Deterministic workspace & evidence checks           |
| `/test`     | Focused test suites or preflight runs               |
| `/docs`     | Update documentation, changelog, versioning         |
| `/audit`    | Evidence-backed read-only audit                     |
| `/security` | Auth, RBAC, multi-tenant, QR review                 |
| `/github`   | Branch, commit, push — after phase done             |
| `/deploy`   | Deploy changes to Vercel/production                 |

## Agents (role personas)

Adopt role for phase domain: `.antigravity/agents/roles/` (planning, security, backend-api, frontend, etc.). Scenarios: `.antigravity/agents/scenarios/` (code-review, security-audit).

## MCP (when available)

- **Prisma-Local** — migrations, schema, Prisma Studio
- **Context7** — docs for React, Next.js, Prisma
- **cursor-ide-browser** — E2E verification
- **gf-mcp skill** — `.antigravity/skills/gf-mcp/SKILL.md`

## Rules (always apply)

- pnpm only
- organizationId scope, deletedAt null (where supported)
- QR HMAC-SHA256
- No secrets in git

## Phased flow

1. **Check** → `/check` (or `pnpm preflight`) — verify clean workspace before starting
2. **Plan** → `/plan <slug>` — create or refine phased plan
3. **Prompt** → `/prompt <slug> <N>` — load phase prompt
4. **Dev** → `/dev <slug> <N>` — implement, test, and commit phase
5. **Ship** → `/ship <slug>` — run remaining phases sequentially
6. **Audit/Certify** → `/audit` / `/certify` — verify pilot gates and evidence
7. **Deploy** → `/deploy <app>` when ready for deploy

## Execution (dev vs guide)

- **`/dev`** — Execute one phase (preflight + implement + test + git), then stop
- **`/ship`** — Execute all phases until plan complete
- **`/guide`** — Guide to the right step; does not execute phases

## Shorthand (user types after /guide)

| User says         | Fire              |
| ----------------- | ----------------- |
| `/guide check`    | `/check`          |
| `/guide plan X`   | `/plan X`         |
| `/guide phase N`  | `/prompt phase N` |
| `/guide dev`      | `/dev`            |
| `/guide ship`     | `/ship`           |
| `/guide github`   | `/github`         |
| `/guide test`     | `/test`           |
| `/guide security` | `/security`       |
| `/guide audit`    | `/audit`          |
