---
description: GateFlow AI skills, subagents, and docs
globs: *
alwaysApply: true
---

# GateFlow — AI Workflow Rules

**Full reference:** `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`

## Master slash commands

| Command | What it does |
|---------|--------------|
| `/idea` | Capture and refine initiatives into `IDEA_<slug>.md` and backlog entries. |
| `/plan` | Turn an idea into a multi-phase plan and per-phase pro prompts. |
| `/dev`  | Implement **one** phase end-to-end (preflight, code, tests, git). |
| `/ship` | Run a whole plan: idea (if needed) → plan → all remaining phases via `/dev`. |
| `/guide` | Workspace guide: “what should I do now?”, next steps, recommended, critical, improvements; pre-flight/post-task via `02-gateflow-guide.mdc` and `gf-guide` skill. |
| `/clis team` | Run a predefined CLI team: `seo` (content), `refactor` (code), `audit` (review); Cursor is master; definitions in `docs/plan/learning/CLI_TEAMS.md`. |

### Master command orchestration

- `/idea`:
  - Writes and maintains `docs/plan/context/IDEA_<slug>.md` as the canonical initiative context.
  - May use planning subagents (see `gf-planner`) to refine scope, but does **not** execute code.
  - Feeds `/plan`, `/dev`, and `/ship` with the original “why”.

- `/plan`:
  - Uses the **Planning** role (see `SUBAGENT_HIERARCHY.md`) and the `gf-planner` skill to:
    - Read `IDEA_<slug>.md`, `PRODUCT_BRAIN.md`, `GATEFLOW_CONFIG.md`, and `ALL_TASKS_BACKLOG.md`.
    - Generate or update `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` using the shared phase template
      (including **Primary role** and **Preferred tool**).
  - May delegate exploration to the **explore** subagent when needed, but never runs builds/tests itself.

- `/dev` (single-phase executor):
  - Always works from a single phase prompt: `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`.
  - Internally composes legacy flows from `.cursor/commands-ref/`:
    - Conceptually runs `ready` first (clean git state + `pnpm preflight` for affected workspaces).
    - Uses `test` and `docs` flows where the phase’s **Acceptance criteria** require them.
    - Uses `github` flow for branching, commits, rebases, and pushes at the end of the phase.
    - May use `clis` to coordinate external CLIs when the phase’s **Preferred tool** is a CLI or `Multi-CLI`.
  - Uses subagents according to the phase prompt:
    - **explore** for tracing flows/refactors,
    - **shell** for pnpm/turbo/prisma/git,
    - **browser-use** for multi-step UI verification,
    - **planning/general-purpose** only when explicitly requested by the phase.
  - Treats phase **Acceptance criteria** (lint, typecheck, tests, docs updates) as **hard gates** before marking a phase done.

- `/ship` (plan executor):
  - Reads `PLAN_<slug>.md` to determine the ordered list of phases to execute.
  - Loops `/dev` across all remaining phases, respecting each phase’s **Primary role** and **Preferred tool**.
  - Conceptually composes higher-level internal flows (from `.cursor/commands-ref/`), such as:
    - `run`/`automate` to apply `/dev` across phases,
    - `clis` for orchestrating multi-CLI review when phases request `Multi-CLI`.
  - Must not skip phases silently: if a phase is blocked, it records the blocker and leaves the phase incomplete rather than pretending success.

Only these four commands appear in Cursor's slash menu. Legacy granular flows (`/ready`, `/run`, `/automate`, `/github`, `/clis`, etc.) now live as internal markdown flows in `.cursor/commands-ref/` and are orchestrated by the master commands.

Definitions live in `.cursor/commands/` (master commands) and `.cursor/commands-ref/` (internal flows). Type `/` in chat to see the master commands. Templates: `.cursor/templates/`. Contracts: `.cursor/contracts/`. Agents: `.cursor/agents/` (role personas, scenarios, orchestrator).

## Skills

- **gf-dev** — commands, workflows, preflight. See `DEVELOPMENT_WORKFLOWS.md`.
- **gf-planner** — plans, phased execution. See `PHASED_DEVELOPMENT_WORKFLOW.md`.
- **SuperDesign** — before non-trivial UI: layouts, redesigns.
- **Subagent hierarchy** — company-style roles (Planning, Architecture, Security, Backend, Frontend, Mobile, QA, i18n, DevOps, Explore). Assign primary role per phase; use same roles in CLIs for consistency. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.
- **Domain skills** — architecture, security, database, testing, mobile, i18n, api, gf-mcp (MCP usage) (see `AI_SKILLS_SUBAGENTS_RULES.md`).
- **Cursor workflow skills** — only when task is about Cursor config or authoring skills.

## MCP Servers (use when available)

| Task | MCP |
|------|-----|
| Prisma schema, migrations, Studio | **Prisma-Local** |
| Library/docs (React, Next.js, Prisma) | **Context7** |
| E2E verification | **cursor-ide-browser** |
| GitHub PRs, issues | **GitHub** |

**Skill:** `.cursor/skills/gf-mcp/SKILL.md` | **Setup:** `docs/MCP_SETUP.md`

## Subagents (pick smallest tool for the job)

| Task | Subagent |
|------|----------|
| Trace flows, find features, refactor discovery | **explore** |
| pnpm/turbo, git, prisma, builds | **shell** |
| Login, navigation, filters, exports, i18n checks | **browser-use** |
| Ambiguous mixed investigation | **general-purpose** |
| Create plan, task breakdown, phased execution | **planning** |

Keep prompts **narrow and specific**. Avoid "do everything" requests.

**Prompt templates:** `.cursor/subagents/` — explore.md, shell.md, browser-use.md

### Subagent prompt recipes

- **Explore**: "Trace the end-to-end flow for [X] (UI → API → DB). Return key files and call graph."
- **Shell**: "Run pnpm preflight and report failures with file:line." / "Run pnpm turbo build and report first actionable error."
- **Browser-use**: "Login as [role], navigate to [pages], verify [behaviors]." / "Toggle locale, verify RTL/LTR correctness."

## Definition of done (AI-assisted changes)

- **Correctness**: Works for intended role(s) and tenant scope.
- **Security**: No unsafe defaults, no secrets in git, QR/auth invariants preserved.
- **Quality**: Lint + typecheck pass for touched workspaces; tests for critical logic.
- **Docs**: Update `docs/` when behavior or setup changes.

## Required docs to consult

Before major architecture or behavior changes:

- `CLAUDE.md` — overview & constraints
- `docs/PRD_v5.0.md` — product requirements
- `docs/APP_DESIGN_DOCS.md` — app architecture and route map
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — detailed AI usage patterns
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — commands, workflows, prompts
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — current tasks
