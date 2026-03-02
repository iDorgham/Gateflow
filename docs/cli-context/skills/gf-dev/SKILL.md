# GateFlow Development Skill

## Purpose

Quick reference for workflows, commands, and prompts when developing GateFlow.  
Use this skill when you need to run the right command, follow a standard workflow, or execute a **single phase** defined in `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` (typically via the `/dev` command).

**Full reference:** `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`

## When to Use

- User asks for "commands", "workflow", "how do I...", "preflight", "db migrate"
- Adding a new API route, component, or Prisma model
- Pre-PR checks, debugging, or onboarding

## MCP Tools (use when available)

| Task | MCP Server | Use |
|------|------------|-----|
| Prisma migrations, schema | **Prisma-Local** | migrate-dev, migrate-status, Prisma-Studio |
| Library/docs lookup | **Context7** | query-docs, resolve-library-id |
| E2E verification | **cursor-ide-browser** | browser_navigate, browser_snapshot |
| GitHub PRs/issues | **GitHub** | create PR, list issues |

**Reference:** `.cursor/skills/gf-mcp/SKILL.md`, `docs/MCP_SETUP.md`

## When to Prefer Which Subagent

| Task | Subagent |
|------|----------|
| Trace flows, find features, refactor discovery | **explore** |
| pnpm/turbo, git, prisma, builds | **shell** |
| Login, navigation, filters, exports, i18n checks | **browser-use** |
| Ambiguous mixed investigation | **general-purpose** |
| Create plan, task breakdown, phased execution | **planning** |

## Commands (run from repo root)

```bash
# Slash commands (Cursor chat)
# Master (visible): /idea, /plan, /dev, /ship
# Internal flows (invoked by master commands, not shown in `/`): ready, github, docs, test, clis, guide

# Core
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm typecheck

# Pre-PR (lint + typecheck + test)
pnpm preflight

# Database
pnpm db:generate    # After schema changes
pnpm db:studio      # Prisma GUI

# Single app dev
pnpm dev:client     # Client dashboard (3001)
pnpm dev:admin     # Admin dashboard (3002)
pnpm dev:scanner   # Scanner app (8081)
pnpm dev:marketing # Marketing (3000)
```

## Workflows (high level)

1. **New API route**: Auth → org scope → rate limit → validate → query with `deletedAt: null`
2. **New Prisma model**: Edit schema → `pnpm db:generate` → migrate → update types
3. **New component**: Check `@gate-access/ui` first → use workspace imports → i18n
4. **Pre-PR**: `pnpm preflight` → manual smoke test

## Phase execution with `/dev`

When executing a phase:

1. **Locate the phase prompt**:
   - Open `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`.
   - Read the phase’s **Primary role**, **Preferred tool**, **Steps**, and **Acceptance criteria**.
2. **Run via `/dev`**:
   - In Cursor, use `/dev` with the chosen phase; `/dev`:
     - Conceptually runs internal `ready` (clean git + `pnpm preflight` for affected workspaces) before implementation.
     - Uses this skill (`gf-dev`) for the concrete commands and workflows in the phase steps.
   - When **Preferred tool** is a CLI (Claude CLI, Gemini CLI, OpenCode CLI, **Kiro CLI**, **Kilo CLI**, **Qwen CLI**), follow `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`: invoke that CLI with the phase prompt and use Cursor for file edits (or run the phase primarily from the CLI as the prompt specifies).
   - Before choosing or invoking a CLI for a phase, **check** `docs/plan/learning/GUIDE_PREFERENCES.md` and `docs/plan/learning/CLI_LIMITS_TRACKING.md` (if present). **80% rule:** If a CLI is at **80% or more** of its limit, **do not use it** unless the user has given explicit permission; use a free-tier CLI or Cursor instead. If "near limit" or "prefer free today", prefer a free-tier CLI (Kiro, Kilo, Qwen, Opencode) or Cursor when the phase allows (see **gf-cli-limits** skill).
3. **Follow the phase steps**:
   - Implement changes using the workflows above (API, Prisma, components) and any subagent prompts specified in the phase.
4. **Satisfy Acceptance criteria**:
   - Run the lint/typecheck/test commands named in the phase (usually `pnpm turbo lint/test/typecheck --filter=<workspace>` or `pnpm preflight`).
   - Do **not** mark the phase done or let `/dev` finish until all Acceptance criteria are met.
5. **After a CLI task**: Add one entry to **`docs/plan/learning/CLI_USAGE_AND_RESULTS.md`** (date, CLI, task/phrase, outcome, notes) so usage can be analyzed for better tool choices. See **gf-cli-limits** for the recording format.
6. **Git flow**:
   - Use the Git workflow in this skill (and the internal `github` flow) to create a clear, reviewable commit for the phase.
7. **TASKS update (mandatory when finishing a phase)**:
   - **In the same pass as the commit**, update `docs/plan/execution/TASKS_<slug>.md`:
     - Tick off completed checklist items for the phase.
     - Set **Status: Done** for the phase.
     - Update the Summary table if present.
   - This keeps /guide and /dev accurate about "what's done". Do this **automatically after each phase** — do not commit without updating TASKS when a phase is complete.

## Subagent Prompts (copy/paste)

**Extended library:** `.cursor/templates/subagents/` — explore-library, shell-library, browser-library (flows, security, i18n, etc.)

### Explore
- "Trace the end-to-end flow for [X] (UI → API → DB). Return key files and call graph."
- "Find all places where [symbol/string] is used across apps/packages and group by feature area."
- "List all API routes under [path] and summarize inputs/outputs/auth requirements."
- "Find all organizationId usages in [app] and verify multi-tenant scoping."

### Shell
- "Run pnpm preflight and report failures with file:line. Fix the first error and re-run."
- "From packages/db: run prisma migrate dev --name [name], then pnpm turbo build from root."
- "Run pnpm turbo build and report any workspace that fails with the first actionable error."
- "Run pnpm turbo test --filter=client-dashboard and list failing tests with stack traces."

### Browser-use
- "Login to client-dashboard at localhost:3001, navigate to Projects, create a project, switch to it, then verify the project cookie and nav state."
- "Toggle locale (AR/EN) on client-dashboard login page and verify RTL layout and labels."
- "Login as [role], navigate to [pages], verify [behaviors], and capture screenshots for any broken states."

### Planning
- "Create a phased plan for [GOAL/EPIC]. Use docs/plan/backlog/ALL_TASKS_BACKLOG.md and RESIDENT_PORTAL_SPEC. Output: phases with scope, deliverables, test criteria. Save to docs/plan/execution/PLAN_[name].md."

## Rules (never forget)

- **pnpm only** — never npm or yarn
- **Multi-tenancy** — `organizationId` + `deletedAt: null` on all tenant queries
- **QR security** — HMAC-SHA256 signed; preserve `scanUuid` dedup
- **Secrets** — never commit `.env`

## Definition of done (AI-assisted changes)

- Correctness: works for intended role(s) and tenant scope
- Security: no unsafe defaults, no secrets in git, QR/auth invariants preserved
- Quality: lint + typecheck pass; tests for critical logic
- Docs: update `docs/` when behavior or setup changes

## Templates, Contracts & Agents

- `.cursor/templates/` — Phase prompt, API route, commit, PR, test, DoD
- `.cursor/contracts/CONTRACTS.md` — Invariants: org scope, soft delete, QR, auth
- `.cursor/agents/` — Role personas (planning, security, backend-api, etc.), scenarios (code-review, security-audit), orchestrator

## Key Files

- `CLAUDE.md` — full guide
- `docs/plan/README.md` — Canonical plan/learning structure for `docs/plan/`
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — commands, workflows, prompts
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — skills, subagents, rules, and phased execution requirements
- `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — detailed phased development loop
- `docs/plan/execution/` — `PLAN_<slug>.md` plans and `PROMPT_<slug>_phase_<N>.md` pro prompts
- `docs/plan/learning/{patterns,incidents,decisions}.md` — outcomes captured from phases
- `.kiro/QUICK_REFERENCE.md` — patterns, templates
- `packages/db/prisma/schema.prisma` — database schema
