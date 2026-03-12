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
| GitHub PRs/issues | **GitHub** | create PR, list issues |

**Reference:** `.kilocode/skills/gf-mcp/SKILL.md`, `docs/MCP_SETUP.md`

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
   - Read the phase's **Primary role**, **Preferred tool**, **Steps**, and **Acceptance criteria**.
2. **Run via `/dev`**:
   - Use `/dev` with the chosen phase; `/dev`:
     - Conceptually runs internal `ready` (clean git + `pnpm preflight` for affected workspaces) before implementation.
     - Uses this skill (`gf-dev`) for the concrete commands and workflows in the phase steps.
   - When **Preferred tool** is a CLI (Claude CLI, Gemini CLI, OpenCode CLI), follow the workflow: invoke that CLI with the phase prompt and use Kilo for file edits.
3. **Follow the phase steps**:
   - Implement changes using the workflows above (API, Prisma, components) and any subagent prompts specified in the phase.
4. **Satisfy Acceptance criteria**:
   - Run the lint/typecheck/test commands named in the phase (usually `pnpm turbo lint/test/typecheck --filter=<workspace>` or `pnpm preflight`).
   - Do **not** mark the phase done until all Acceptance criteria are met.
5. **Git flow**:
   - Use the Git workflow to create a clear, reviewable commit for the phase.
6. **TASKS update (mandatory when finishing a phase)**:
   - **In the same pass as the commit**, update `docs/plan/execution/TASKS_<slug>.md`:
     - Tick off completed checklist items for the phase.
     - Set **Status: Done** for the phase.
   - This keeps /guide and /dev accurate about "what's done".

## Subagent Prompts (copy/paste)

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

- `.kilocode/templates/` — Phase prompt, API route, commit, PR, test, DoD
- `.kilocode/contracts/CONTRACTS.md` — Invariants: org scope, soft delete, QR, auth
- `.kilocode/agents/` — Role personas (planning, security, backend-api, etc.), scenarios (code-review, security-audit), orchestrator

## Key Files

- `CLAUDE.md` — full guide
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — commands, workflows, prompts
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — skills, subagents, rules, and phased execution requirements
- `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — detailed phased development loop
- `docs/plan/execution/` — `PLAN_<slug>.md` plans and `PROMPT_<slug>_phase_<N>.md` pro prompts
- `packages/db/prisma/schema.prisma` — database schema
