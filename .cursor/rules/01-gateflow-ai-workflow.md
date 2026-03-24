---
description: GateFlow AI workflow — commands, skills, subagents, MCP, DoD
globs: *
alwaysApply: true
---

# GateFlow — AI Workflow Rules

> Full reference: `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`

## Master Commands

| Command | What it does |
|---------|--------------|
| `/idea` | Capture initiative → `IDEA_<slug>.md` + backlog entry |
| `/plan` | Turn idea → phased `PLAN_<slug>.md` + per-phase pro prompts |
| `/dev [N]` | Implement one phase end-to-end (preflight → code → tests → git) |
| `/dev ralph` | Autopilot: implement ALL remaining phases until plan is complete |
| `/ship` | Run full plan: idea → plan → all phases via `/dev` |
| `/guide` | "What should I do now?" — next steps, critical issues, improvements |
| `/clis team` | Run CLI team: `seo` / `refactor` / `audit` |

Definitions: `.agents/workflows/` (master) · `.agents/commands-ref/` (internal flows)

## Skills (load on demand — never pre-load all)

**Process:** `using-superpowers` · `test-driven-development` · `systematic-debugging` · `verification-before-completion` · `executing-plans` · `subagent-driven-development` · `finishing-a-development-branch`

**Domain:** `security` · `database` · `api` · `mobile` · `architecture` · `testing` · `i18n` · `ui-ux-pro-max` · `mcp-guide` · `cli-limits`

## MCP Servers

| Task | MCP |
|------|-----|
| Prisma schema / migrations / Studio | Prisma-Local |
| Library docs (React, Next.js, Prisma) | Context7 |
| E2E UI verification | cursor-ide-browser |
| GitHub PRs / issues | GitHub |

## Subagents (smallest tool for the job)

| Task | Subagent |
|------|----------|
| Trace flows, find features | explore |
| pnpm / turbo / git / prisma | shell |
| Login, navigate, verify UI | browser-use |
| Ambiguous mixed investigation | general-purpose |

## Definition of Done

- Lint + typecheck pass for touched workspaces
- Tests pass (or no regression)
- No secrets in git; QR/auth invariants preserved
- `docs/` updated if behavior changed
