---
name: gf-mcp
description: When and how to use MCP servers in GateFlow development. Use when schema work, migrations, docs lookup, E2E verification, or GitHub automation is needed.
---

# GateFlow MCP Usage

## Purpose

This skill maps GateFlow tasks and commands to the right MCP tools. Use MCP servers **in addition to** subagents and skills — they provide direct tool access (schema, migrations, docs, browser, GitHub).

**Rule:** MCPs are **infrastructure helpers**, not a second planning system. Planning, phases, roles, prompts, and learnings always come from the canonical plan tree under `docs/plan/` (IDEA/PLAN/PROMPT and `learning/` docs) and the four master commands `/idea`, `/plan`, `/dev`, `/ship`; MCPs then execute schema, docs, or browser tasks **inside those plans**.

## Task → MCP Mapping

| Task | MCP Server | Tools / Use |
|------|------------|------------|
| Prisma schema, migrations, Studio | **Prisma-Local** | migrate-dev, migrate-reset, migrate-status, Prisma-Studio |
| Schema introspection, read-only SQL | **Postgres** (or Neon if using) | query, table schemas |
| Library/framework docs, API refs | **Context7** | query-docs, resolve-library-id |
| E2E flows, login, navigation, i18n checks | **cursor-ide-browser** | browser_navigate, browser_click, browser_snapshot |
| GitHub PRs, issues, workflows | **GitHub** (via MCP_DOCKER or remote) | create PR, list issues, read repo |
| Database branching, migrations (if Neon) | **Neon** | create_branch, apply_migration |

## Command → MCP (4-command model)

| Command | When to use MCP |
|---------|-----------------|
| `/idea` | Rarely; optionally use GitHub / Postgres / docs MCPs if additional context is needed when shaping the initiative, but keep planning logic in `docs/plan/`. |
| `/plan` | Use GitHub for backlog/context and Context7 for framework docs when planning unfamiliar areas. MCPs help gather information; the planning subagent still writes `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md`. |
| `/dev`  | For the active phase prompt: use Prisma-Local for schema changes and migrations; Context7 when unsure about React/Next.js/Prisma APIs; browser MCP for focused page checks when needed. All MCP calls should be scoped by the current phase’s **Steps** and **Acceptance criteria**. |
| `/ship` | Same as `/dev`, but applied across all phases in sequence (schema, docs, browser MCPs as phases require). `/ship` must still treat `PLAN_<slug>.md` and phase prompts as the source of truth; MCPs are helpers, not planners. |

## Integration with Subagents

| Subagent | Complementary MCP |
|----------|-------------------|
| **explore** | Context7 for library docs during discovery |
| **shell** | Prisma-Local for migrate-dev; Postgres for ad-hoc queries |
| **browser-use** | cursor-ide-browser (alternative; Cursor-built-in) |

**Rule:** Prefer **browser-use subagent** for complex multi-step flows (login → nav → verify). Use **cursor-ide-browser MCP** when the task is single-page verification or snapshot capture.

## Available Servers (GateFlow)

- **Prisma-Local** — schema, migrations, Studio (packages/db)
- **Context7** — React, Next.js, Prisma, Tailwind, TypeScript docs
- **cursor-ide-browser** — browser automation
- **GitHub** — repo, issues, PRs (Docker or remote)
- **Postgres / Neon** — DB introspection, read-only queries

**Config:** `docs/MCP_SETUP.md`, `.cursor/mcp.json` (project), `~/.cursor/mcp.json` (global)
