# GateFlow Planning Subagent Skill

## Purpose

Create phased development plans and comprehensive pro prompts for GateFlow. Use when the user wants a **plan**, **task breakdown**, or **phased execution** of a feature or Epic.


**Subagent hierarchy:** GateFlow uses a development-company-style hierarchy (Planning, Architecture, Security, Backend, Frontend, Mobile, QA, i18n, DevOps, Explore). Each phase gets a **primary role**. This hierarchy is shared across Cursor and all CLIs for consistent quality. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

**Claude Pro limits:** This project uses Claude on Pro plan with usage limits. Reserve **multi-CLI** and heavy subagent use for **really important, complex** phases only — not for routine work. See "Usage priorities" below.

## Usage Priorities (Claude Pro)

Given Claude Pro usage limits, **prioritize tools sparingly**:

| Priority | Use for | Skip for |
|----------|---------|----------|
| **High** | Security-critical (auth, multi-tenant, QR signing), architectural decisions, complex business logic (offline sync, conflict resolution), high-risk refactors | Routine CRUD, simple UI tweaks |
| **Multi-CLI** | Complex design decisions, critical code review, tricky test generation — phases where a second opinion materially reduces risk | Every phase, standard patterns |
| **Subagents** | Trace flows, verify UI, run preflight — when the phase explicitly needs exploration or verification | Phases that are straightforward |

Add multi-CLI to a phase only when it is **complex** or **high-risk**. Prefer Cursor alone for routine phases.

## When to Use

- User asks for a "plan", "tasks", "breakdown", "phased approach"
- Starting MVP launch, Resident Portal, or any multi-step initiative
- Decomposing `ALL_TASKS_BACKLOG.md` into executable phases
- Creating pro prompts to apply one by one with test/enhance between phases

## Workflow Summary

1. **Plan (inputs)** → Read `IDEA_<slug>.md` (if present), `PRODUCT_BRAIN.md`, `GATEFLOW_CONFIG.md`, and `ALL_TASKS_BACKLOG.md` to understand intent, product context, and constraints.
2. **Plan (outputs)** → Use the planning prompt to save/update `docs/plan/planning/<slug>/PLAN_<slug>.md` with ordered phases. New plans go to **planning/** until the user marks them ready.
4. **Mark ready** → When the plan is approved, user runs `/plan ready <slug>` to move `planning/<slug>/` → `planned/<slug>/`.
5. **Execute** → `/dev` and `/ship` consume the phase prompts from `planned/` or `in-progress/`, apply them in Cursor (or the phase’s **Preferred tool**), invoke subagents/CLIs as specified, then test → enhance → commit → next phase. `/dev` moves `planned/` → `in-progress/` when starting, and `in-progress/` → `done/` when the last phase completes.

See `docs/plan/PLAN_LIFECYCLE.md` for full lifecycle. See `docs/plan/PLANNING_ENHANCEMENTS.md` for workflow improvements (Bmad, ADD, Kiro-inspired).

**Planning workflow:** Understand → Investigate (optional) → Generate. For complex initiatives, invoke explore subagent before writing phases to map flows and dependencies. See `docs/plan/PLANNING_ENHANCEMENTS.md` for workflow improvements (Bmad, ADD, Kiro-inspired).

---

## Plan Folder Structure

Every new plan gets a structured folder. See `docs/plan/templates/PLAN_FOLDER_STRUCTURE.md` for full spec.

```
docs/plan/planning/<slug>/
├── PLAN_<slug>.md              # Master overview
├── TASKS_<slug>.md             # Flat checklist
├── CONTEXT_<slug>.md           # Frozen schema/types/env snapshot
├── phases/
│   ├── 01_<title>/
│   │   ├── PROMPT_phase_01.md          # Single prompt (short phase)
│   │   ├── PROMPT_phase_01_part_a.md   # OR Part A (long phase)
│   │   ├── PROMPT_phase_01_part_b.md   # Part B
│   │   └── files/                      # Code scaffolds (schema patches, templates)
│   └── 02_<title>/
│       └── PROMPT_phase_02.md
└── assets/
    └── ARCH_NOTES.md           # Architecture decisions
```

**Create this folder structure first before writing any files.**

### Phase Splitting Rules

Split a phase into parts when any of these apply:

| Condition | Action |
|-----------|--------|
| > 5 implementation steps | Split at logical boundary |
| Touches > 3 areas (schema + API + UI) | Split by concern |
| Estimated prompt > 700 words | Split into ~600-word parts |
| Spans multiple apps or packages | Split by app/package |
| Mixes DB work + frontend work | Always split |

Part naming convention: `part_a` (foundation/schema), `part_b` (logic/API), `part_c` (UI/integration), `part_d` (tests).

### Tool Selection Matrix (Quality vs Cost)

Every phase prompt must specify **Tool 1** (best quality) and **Tool 2** (free/cheaper fallback).

| Domain | Tool 1 | Tool 2 (free/cheaper) |
|--------|--------|----------------------|
| Security / Auth / RBAC | Claude Code CLI | Cursor |
| DB Schema / Prisma | Cursor | Gemini CLI (free) |
| API complex | Claude Code CLI | Cursor |
| API routine CRUD | Cursor | OpenCode CLI (free) |
| Frontend / UI | Cursor | OpenCode CLI (free) |
| Architecture reasoning | Claude Code CLI | Gemini CLI (free) |
| Test generation | Gemini CLI (free) | Cursor |
| Mobile / Expo | Cursor | Qwen CLI (free) |
| DevOps / CI | Kilo CLI (free) | Cursor |
| Code review | Claude Code CLI | Kiro CLI (free) |
| Refactoring | OpenCode CLI (free) | Cursor |

Switch to Tool 2 when Tool 1 is at 80%+ limit (`gf-cli-limits` skill).

---

## Planning Workflow (Understand → Investigate → Generate)

For complex initiatives, follow this flow before writing phase prompts:

1. **Understand** — Read IDEA, backlog, product context. Ask clarifying questions if scope is unclear. Invoke `brainstorming` skill if goal is creative/unclear.
2. **Investigate** (optional) — For multi-component or uncertain scope: invoke **explore** subagent to map flows, file patterns, dependencies. Use: "Trace the end-to-end flow for [X]. Return key files and call graph."
3. **Scaffold folder** — Create `docs/plan/planning/<slug>/` with phases/ and assets/ subdirectories before writing any files.
4. **Generate** — Create PLAN + CONTEXT + phase prompts. Populate **Skills** (process + domain), **Tool 1/Tool 2**, **MCP**, **Subagents**, **Commands** per phase. Use `writing-plans` skill for prompt quality. Split long phases into parts.

For simple changes (bug fix, single-file refactor), skip to step 3.

---

## Planning Subagent Prompt (copy/paste)

```
You are the GateFlow Planning Subagent. Create an executable phased plan.

CONTEXT:
- Project: GateFlow (Zero-Trust digital gate platform, Turborepo monorepo)
- Docs (shared brain):
  - CLAUDE.md
  - docs/plan/context/PRODUCT_BRAIN.md
  - docs/plan/context/GATEFLOW_CONFIG.md
  - docs/plan/context/IDEA_<slug>.md (if it exists for this initiative)
  - docs/plan/backlog/ALL_TASKS_BACKLOG.md
- Stack: Next.js 14, Expo SDK 54, Prisma 5, PostgreSQL, pnpm

TASK:
Create a phased development plan for: [GOAL / EPIC / BACKLOG SECTION]

OUTPUT:
1. Plan summary (2–3 sentences)
2. Phases (ordered): each with Title, Scope, Deliverables, Depends on, Test criteria
3. Per phase: assign **Primary role** from SUBAGENT_HIERARCHY. Match role to phase domain.
8. Per phase: add **Skills to load** (gf-security, gf-database, gf-api, gf-mobile, gf-architecture, gf-testing, ui-ux-pro-max) when relevant
9. **UI/UX Intelligence**: If the phase involves UI, add a step to run `python3 .agents/skills/ui-ux-pro-max/scripts/search.py` and follow its design system.
10. Per phase: add **MCP to use** (Prisma-Local for schema, Context7 for docs, cursor-ide-browser for E2E) when relevant
11. Per phase: add **Subagent** (explore/shell/browser-use) with a concrete prompt when exploration or verification helps
12. Per phase: add **Commands** (/ready, /github, /clis team audit) when relevant
13. Per phase: add "Multi-CLI" **only** when security-critical, architectural, or high-risk. Skip for routine phases.
14. Dependencies, risks, blockers

Each phase = one focused session. Use `.antigravity/templates/TEMPLATE_PROMPT_phase.md` for phase prompts. Optionally add Given/When/Then acceptance criteria for precise behavior.
Return structured markdown.
```

---

## Subagent Hierarchy (Role Assignment)

Each phase has a **primary role** from the hierarchy. Use this for Cursor context and CLI prompts. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` for full role definitions and CLI prefixes.

| Phase domain | Primary role |
|--------------|--------------|
| Plans, orchestration | PLANNING |
| Cross-app, conventions | ARCHITECTURE |
| Auth, RBAC, QR, sensitive | SECURITY |
| Schema, migrations, queries | BACKEND-Database |
| API routes | BACKEND-API |
| Pages, components, UI | FRONTEND |
| Scanner, resident-mobile | MOBILE |
| Tests, verification | QA |
| AR/EN, RTL, locale | i18n |
| Builds, migrate, preflight | DEVOPS |
| Codebase discovery | EXPLORE |

Include in pro prompt: `**Primary role:** [ROLE] — Use this role's context when implementing or when invoking CLIs.`

---

## Subagent Prompts (add to pro prompts when needed)

Embed these in phase prompts when the phase benefits from subagent help. Pick by task type.

### Explore (codebase discovery)

Use when the phase requires tracing flows, finding implementations, or refactor discovery.

```
**Subagent (explore):**
Trace the end-to-end flow for [e.g. QR creation / scan validation / bulk sync] (UI → API → DB). Return key files and a short call graph.
```

```
**Subagent (explore):**
Find all places where [symbol/string] is used across apps/packages and group by feature area.
```

```
**Subagent (explore):**
List all API routes under [path] and summarize auth, input validation, and org scoping.
```

### Shell (commands, builds, tests)

Use when the phase needs preflight, migrations, or test runs.

```
**Subagent (shell):**
Run pnpm preflight and report any failure with file:line. Fix the first error and re-run.
```

```
**Subagent (shell):**
From packages/db: run prisma migrate dev --name [name], then pnpm turbo build from root.
```

```
**Subagent (shell):**
Run pnpm turbo test --filter=[workspace] and list failing tests with stack traces.
```

### Browser-use (UI verification)

Use when the phase adds or changes UI that needs click-through verification.

```
**Subagent (browser-use):**
Login to client-dashboard at localhost:3001, navigate to [pages], verify [behaviors], and capture screenshots for any broken states.
```

```
**Subagent (browser-use):**
Toggle locale (AR/EN) on [page] and verify RTL layout and labels.
```

---


### UI/UX Pro Max (Design Intelligence)

Use when:
- Phase adds a **new page or flow**
- Phase **redesigns** an existing page or layout
- Phase introduces **new components** or significant visual changes
- Phase requires **design exploration** (themes, density, hierarchy)

#### Quick prompt templates

| Task | Action |
|----------|---------------------|
| New page | `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "context" --design-system` |
| Redesign | `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "context" --domain style` |
| UX Audit | `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "context" --domain ux` |
| Component | `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "context" --stack shadcn` |

Include in pro prompt when UI is in scope:
```markdown
**UI/UX Intelligence:** Run `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "[keywords]" --design-system` and align with its MASTER.md.
```

---

## Multi-CLI Integration

**Use sparingly.** Claude Pro has usage limits — reserve multi-CLI for **really important, complex** phases. See `.antigravity/skills/multi-cli-cursor-workflow/SKILL.md`.

### When to add multi-CLI to a phase

Only add when the phase is **complex** or **high-risk**:
- Security-critical (auth, RBAC, multi-tenant isolation, QR signing)
- Architectural decisions (offline sync, conflict resolution, new patterns)
- High-risk refactors touching many files
- Tricky business logic that benefits from a second opinion

**Do NOT add** for routine phases: CRUD, simple UI, standard API routes, config updates.

### CLI actions (when justified)

| Phase need | CLI action |
|------------|------------|
| Complex design decision | Same prompt to 2 CLIs → compare → implement in Cursor |
| Security-critical code review | `cat path/to/file.ts \| claude -p "Check for multi-tenant scoping"` |
| Complex test generation | `claude -p "Generate Jest test for [module]. GateFlow uses orgId, deletedAt."` |

Include in pro prompt only when phase warrants it:
```
**Multi-CLI (only if complex/high-risk):** In a separate terminal, run: claude -p "[prompt]". Use output to validate or refine.
```

---

## Pro Prompt Template (per phase)

Each phase becomes a self-contained pro prompt with:
- **Primary role**: From SUBAGENT_HIERARCHY (e.g., SECURITY, BACKEND-API, FRONTEND). Use for Cursor/CLI context.
- **Preferred tool**: Choose between **Cursor (default)**, **Claude CLI**, **Gemini CLI**, **OpenCode CLI**, or **Multi-CLI**. Follow `docs/plan/guidelines/DEVELOPMENT_TOOLS.md` and `.antigravity/skills/multi-cli-cursor-workflow/SKILL.md` for selection rules and use Multi-CLI only for complex/high-risk phases.
- **Context**: GateFlow rules, paths
- **Goal**: One clear sentence
- **Scope (in/out)**
- **Steps**: Ordered, concrete, with file paths
- **Subagents (optional)**: Explore/Shell/Browser-use prompts for this phase
- **Acceptance criteria**: Including lint/test pass

See `.antigravity/templates/TEMPLATE_PROMPT_phase.md` and `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` Section 2.

---

## Execution Loop (per phase)

1. Apply pro prompt (paste into Cursor)
3. If phase includes subagent prompts: invoke explore/shell/browser-use subagent with the given prompt
4. Optional (only if phase is complex/high-risk): run Claude/Gemini CLI for design review or test generation. Skip for routine phases.
6. Run `pnpm turbo test --filter=<workspace>` and `pnpm turbo lint`
7. Enhance until pass
8. **Git:** Run `/github` or git add/commit/pull/push (see Git/GitHub Workflow below)
9. Next phase

---

## Git / GitHub Workflow (best practice)

Automate branching, commit, pull, and push during phased development. Use `/github` slash command or follow these steps (via shell subagent).

### Branch naming

| Scenario | Branch pattern | Example |
|----------|----------------|---------|
| New epic/plan | `feat/<plan-slug>` | `feat/mvp-resident`, `feat/resident-portal` |
| Phase on existing branch | Same branch for all phases | Stay on `feat/mvp-resident` |
| Hotfix | `fix/<issue>` | `fix/csrf-project-switch` |

### Conventional commits

| Type | Use for | Example |
|------|---------|---------|
| `feat` | New feature, phase deliverable | `feat(residents): unit-resident linking (phase 2)` |
| `fix` | Bug fix | `fix(auth): CSRF on project switch` |
| `chore` | Config, deps, docs | `chore(deps): update prisma` |
| `refactor` | Non-behavioral change | `refactor(units): extract LinkResidentModal` |

Format: `<type>(<scope>): <description>`. Scope = app or package: `client-dashboard`, `resident-portal`, `db`, `scanner-app`.

### Phase-completion flow (run after each phase)

```bash
# 1. Ensure on correct branch (create if starting new plan)
git checkout main && git pull origin main
git checkout -b feat/mvp-resident   # or: git checkout feat/mvp-resident

# 2. Stage and commit (conventional message)
git add -A
git status   # verify staged files
git commit -m "feat(residents): unit-resident linking (phase 2)"

# 3. Pull latest from main (rebase to avoid merge commits)
git pull --rebase origin main

# 4. Push to remote
git push -u origin feat/mvp-resident
```

### Slash command

- `/github` — Git workflow (branch, commit, pull, push). Run via shell subagent or terminal.

### Rules

- **Never commit** without passing preflight (lint + typecheck + test).
- **Never force-push** to shared branches (`main`, `develop`).
- **One commit per phase** — atomic, reviewable.
- **Pull before push** — `git pull --rebase origin main` keeps history linear.

---

## Integration with master commands

- `/idea` — Captures and refines initiatives; produces `IDEA_<slug>.md` and backlog entries consumed by this skill.
- `/plan` — Master planning command; uses this skill to create/update `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` in `planning/<slug>/`.
- `/plan ready <slug>` — Moves `planning/<slug>/` → `planned/<slug>/` when the plan is approved.
- `/dev` and `/ship` — Execution commands that consume phase prompts from `planned/` or `in-progress/`; `/dev` moves plans through lifecycle (planned → in-progress → done).

## Key Files

- `docs/plan/PLAN_LIFECYCLE.md` — Plan lifecycle: planning → planned → in-progress → done.
- `docs/plan/README.md` — Canonical layout for `context/`, `planning/`, `planned/`, `in-progress/`, `done/`, `execution/`, `guidelines/`, and `learning/`
- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — Role definitions and CLI prefixes for all tools
- `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — Full phased execution workflow
- `docs/plan/execution/TEMPLATE_PROMPT_phase.md` + `.antigravity/templates/TEMPLATE_PROMPT_phase.md` — Phase prompt template (Primary role, Preferred tool, steps, Acceptance criteria)
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — Task source
- `docs/plan/learning/{patterns,incidents,decisions}.md` — Cross-plan learnings captured from phases
- `.antigravity/skills/multi-cli-cursor-workflow/SKILL.md` — Multi-CLI patterns

---

## Rules (never forget)

- pnpm only
- Multi-tenancy (organizationId)
- Soft deletes (deletedAt: null)
- QR HMAC-SHA256, scanUuid dedup
