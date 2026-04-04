# Pro Prompt Template — Phase N (Part A or Single)

Copy this template for each phase (or Part A of a long phase).
Save as: `docs/plan/{planning,planned,in-progress}/<slug>/phases/NN_<title>/PROMPT_phase_NN.md`
For Part B/C/D: use `TEMPLATE_PROMPT_phase_part.md`.

**Enrichment:** Add **Skills**, **MCP**, **Subagents**, **Commands** when the phase benefits.
See `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md` and `.antigravity/skills/gf-planner/SKILL.md`.

---

## Phase N: [Title]

> **Is this a long phase?** Check splitting rules in `PLAN_FOLDER_STRUCTURE.md`.
> If yes, this file = Part A. Create `PROMPT_phase_NN_part_b.md` for subsequent parts.

### Primary role

From `docs/development/guidelines/SUBAGENT_HIERARCHY.md`:
[PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE]

### Tool Selection (Quality vs Cost)

> Load `gf-cli-limits` skill and check `CLI_LIMITS_TRACKING.md` before choosing.
> Switch to Tool 2 when Tool 1 is at 80%+ limit or on a budget day.

|                            | Tool                                          | Why                                             |
| -------------------------- | --------------------------------------------- | ----------------------------------------------- |
| **Tool 1** (best quality)  | [Cursor / Claude Code CLI / Gemini CLI]       | [reason: e.g. security reasoning, inline edits] |
| **Tool 2** (free fallback) | [OpenCode CLI / Kiro CLI / Qwen CLI / Cursor] | [reason: e.g. same quality for CRUD, free tier] |

**Reference matrix** (from `PLAN_FOLDER_STRUCTURE.md`):

| Domain                 | Tool 1              | Tool 2              |
| ---------------------- | ------------------- | ------------------- |
| Security/Auth/RBAC     | Claude Code CLI     | Cursor              |
| DB/Prisma              | Cursor              | Gemini CLI (free)   |
| API complex            | Claude Code CLI     | Cursor              |
| API routine CRUD       | Cursor              | OpenCode CLI (free) |
| Frontend/UI            | Cursor              | OpenCode CLI (free) |
| Architecture/reasoning | Claude Code CLI     | Gemini CLI (free)   |
| Test generation        | Gemini CLI (free)   | Cursor              |
| Mobile/Expo            | Cursor              | Qwen CLI (free)     |
| DevOps/CI              | Kilo CLI (free)     | Cursor              |
| Code review            | Claude Code CLI     | Kiro CLI (free)     |
| Refactoring            | OpenCode CLI (free) | Cursor              |

### Skills to load

**Process skills (tick what applies to this phase):**

- [ ] `using-superpowers` — always: check skills before any response
- [ ] `test-driven-development` — write failing test BEFORE behavior-changing code
- [ ] `systematic-debugging` — when fix attempts fail or cause is unclear
- [ ] `verification-before-completion` — before claiming done, committing, or PR
- [ ] `executing-plans` — disciplined batch execution with checkpoints
- [ ] `subagent-driven-development` — phase has 3+ independent sub-tasks
- [ ] `dispatching-parallel-agents` — 2+ unrelated failures in parallel
- [ ] `brainstorming` — requirements unclear or creative work needed
- [ ] `finishing-a-development-branch` — implementation complete, before merge
- [ ] `requesting-code-review` — after pushing, before merging
- [ ] `receiving-code-review` — when reviewer comments arrive
- [ ] `using-git-worktrees` — risky or parallel work requiring isolation
- [ ] `writing-skills` — new recurring pattern to capture as skill

**Domain skills (tick what applies):**

- [ ] `gf-security` — auth, RBAC, QR, multi-tenant
- [ ] `gf-database` — Prisma, migrations, queries
- [ ] `gf-api` — API routes, validation, rate limiting
- [ ] `gf-mobile` — Expo, offline sync
- [ ] `gf-architecture` — monorepo, conventions
- [ ] `gf-testing` — Jest, test patterns
- [ ] `ui-ux-pro-max` — new pages, redesigns, components
- [ ] `gf-i18n` — Arabic/RTL changes
- [ ] (none — skip for straightforward phases)

### MCP to use

| MCP                | When                                    |
| ------------------ | --------------------------------------- |
| Prisma-Local       | Schema change, migration, Prisma Studio |
| Context7           | React/Next.js/Prisma API lookup         |
| cursor-ide-browser | E2E verification after UI changes       |

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000)
- **Packages**: db, types, ui, api-client, i18n, config
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`); QR HMAC-SHA256; no secrets in git
- **Context file**: `docs/plan/{state}/<slug>/CONTEXT_<slug>.md` — frozen schema + types snapshot
- **Refs**: `CLAUDE.md`, `packages/db/prisma/schema.prisma`, `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

### Goal

[One clear sentence: what this phase (or Part A) must achieve]

### Scope (in)

- [Item 1]
- [Item 2]
- [Item 3]

### Scope (out)

- [Explicitly exclude] — do not touch [X]
- [If Part A: "UI and integration are in Part B/C — stop after API layer"]

### Steps (ordered)

1. Load context: `CONTEXT_<slug>.md` and relevant domain skills
2. [Concrete step with file paths]
3. [Concrete step]
4. Add/update tests for [specific behavior]
5. `pnpm turbo lint --filter=<workspace>` && `pnpm turbo typecheck --filter=<workspace>` && `pnpm turbo test --filter=<workspace>`
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### Scaffolded files (optional)

Reference code in `phases/NN_<title>/files/` — use as starting point, not copy-paste:

- `files/schema.patch.prisma` — schema additions for this phase
- `files/types.patch.ts` — type definitions
- `files/api_route_template.ts` — route scaffold

### Subagents (optional)

Invoke before or during implementation when the phase needs exploration or verification.

| Subagent        | When                     | Prompt                                                                                |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| **explore**     | Trace flows or find code | "Trace the end-to-end flow for [X] (UI → API → DB). Return key files and call graph." |
| **shell**       | Preflight, migrate, test | "Run pnpm preflight and report failures with file:line."                              |
| **browser-use** | Verify UI after changes  | "Login at localhost:3001, navigate to [pages], verify [behaviors]."                   |

### Commands

- **Before phase**: `/ready` — clean git, run `pnpm preflight`
- **After phase**: `/github` — add, commit (conventional), pull --rebase, push
- **Security/audit phase**: `/clis team audit` — multi-CLI review

### Acceptance criteria

**Checklist:**

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] `pnpm turbo lint --filter=<workspace>` passes
- [ ] `pnpm turbo typecheck --filter=<workspace>` passes
- [ ] `pnpm turbo test --filter=<workspace>` passes (or no regression)

**Given/When/Then (optional — for precise behavior):**

- **Given** [precondition], **When** [action], **Then** [expected outcome]

### Files likely touched

- `path/to/file1.ts`
- `path/to/file2.tsx`

### Handoff to Part B / Phase N+1

After this phase/part commits, the next starts with:

- [State: e.g. "Schema migrated, types defined, API route exists at `/api/...`"]

### UI/UX Design Intelligence (for UI phases)

**Trigger**: This phase involves [New Screens | Component Design | RTL | Animations | Dashboard Widgets].

1. Run: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "keywords" --design-system`
2. Use Lucide/Heroicons only. `cursor-pointer` on all interactives. `transition-colors duration-200` on hovers.
3. Validate RTL layout for Arabic support.

### Adversarial Review (for security/auth/multi-tenant phases only)

**Trigger**: This phase involves [Auth | Multi-tenancy | Core Scripts | Security Invariants].

1. After implementation: use Tool 2 (or Kiro CLI) as adversary — "Attempt to break this. Look for org isolation bypasses, race conditions, edge cases."
2. Self-correct before commit.

### Escalation

If scope exceeds this phase during implementation:

- **Break down**: Add a follow-up phase or part to the plan
- **Security**: If touching auth/RBAC/QR unexpectedly, pause and add a SECURITY phase
