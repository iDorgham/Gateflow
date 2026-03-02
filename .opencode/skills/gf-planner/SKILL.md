# GateFlow Planning Subagent Skill

## Purpose

Create phased development plans and comprehensive pro prompts for GateFlow. Use when the user wants a **plan**, **task breakdown**, or **phased execution** of a feature or Epic.

**Integrations:** Use **SuperDesign** (UI/UX design before implementation), **subagents** (explore, shell, browser-use), and **multi-CLI** (Claude CLI, Opencode CLI, Gemini CLI) during execution for best UI/UX and faster, more accurate results. See below.

**Subagent hierarchy:** GateFlow uses a development-company-style hierarchy (Planning, Architecture, Security, Backend, Frontend, Mobile, QA, i18n, DevOps, Explore). Each phase gets a **primary role**. This hierarchy is shared across Cursor and all CLIs for consistent quality. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

**Claude Pro limits:** This project uses Claude on Pro plan with usage limits. Reserve **multi-CLI** and heavy subagent use for **really important, complex** phases only — not for routine work. See "Usage priorities" below.

## Usage Priorities (Claude Pro)

Given Claude Pro usage limits, **prioritize tools sparingly**:

| Priority | Use for | Skip for |
|----------|---------|----------|
| **High** | Security-critical (auth, multi-tenant, QR signing), architectural decisions, complex business logic (offline sync, conflict resolution), high-risk refactors | Routine CRUD, simple UI tweaks |
| **Multi-CLI** | Complex design decisions, critical code review, tricky test generation — phases where a second opinion materially reduces risk | Every phase, standard patterns |
| **Subagents** | Trace flows, verify UI, run preflight — when the phase explicitly needs exploration or verification | Phases that are straightforward |
| **SuperDesign** | New pages, redesigns, flows — when UI/UX quality matters | Backend-only phases, minor styling |

Add multi-CLI to a phase only when it is **complex** or **high-risk**. Prefer Cursor alone for routine phases.

## When to Use

- User asks for a "plan", "tasks", "breakdown", "phased approach"
- Starting MVP launch, Resident Portal, or any multi-step initiative
- Decomposing `ALL_TASKS_BACKLOG.md` into executable phases
- Creating pro prompts to apply one by one with test/enhance between phases

## Workflow Summary

1. **Plan (inputs)** → Read `IDEA_<slug>.md` (if present), `PRODUCT_BRAIN.md`, `GATEFLOW_CONFIG.md`, and `ALL_TASKS_BACKLOG.md` to understand intent, product context, and constraints.
2. **Plan (outputs)** → Use the planning prompt to save/update `docs/plan/execution/PLAN_<slug>.md` with ordered phases.
3. **Write** → For each phase, write a pro prompt using `.cursor/templates/TEMPLATE_PROMPT_phase.md` (must include **Primary role** and **Preferred tool**, plus any SuperDesign/subagent/Multi‑CLI notes) → save to `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`.
4. **Execute** → `/dev` and `/ship` consume the phase prompts, apply them in Cursor (or the phase’s **Preferred tool**), invoke subagents/CLIs as specified, then test → enhance → commit → next phase.

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
3. Per phase: assign **Primary role** from SUBAGENT_HIERARCHY (PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE). Match role to phase domain.
4. Per phase: if the phase adds or changes UI, add "SuperDesign" — run design exploration first (create-design-draft or iterate-design-draft) before implementing
5. Per phase: if exploration or verification is needed, add "Subagent" (explore/shell/browser-use) with a specific prompt
6. Per phase: add "Multi-CLI" **only** when the phase is complex or high-risk (security-critical, architectural, offline sync, conflict resolution). Do NOT add multi-CLI for routine phases — Claude Pro has usage limits.
7. Dependencies: files, packages, APIs per phase
8. Risks / blockers

Each phase = one focused session, testable, orderable. Role assignment ensures consistent quality across Cursor and CLIs.
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

## SuperDesign (UI/UX phases)

**Use SuperDesign *before* implementing UI** when the phase adds new pages, redesigns layouts, or changes components. See `.cursor/skills/superdesign/SKILL.md`.

### When to add SuperDesign to a phase

- Phase adds a **new page or flow**
- Phase **redesigns** an existing page or layout
- Phase introduces **new components** or significant visual changes
- Phase requires **design exploration** (themes, density, hierarchy)

### SuperDesign step (add to pro prompt)

```markdown
**SuperDesign (run first, before implementation):**
1. Ensure .superdesign/init/ exists; run superdesign init if needed.
2. Create project (if new): superdesign create-project --title "[Feature Name]"
3. Create or iterate draft:
   - New page: superdesign create-design-draft --project-id <id> --title "[Page Name]" -p "[design intent]" --context-file [path]
   - Improve existing: superdesign iterate-design-draft --draft-id <id> -p "[improvements]" --mode branch --context-file [path]
4. Use draft output to guide implementation. Align with theme.md and components.md.
```

### Quick prompt templates

| Scenario | SuperDesign action |
|----------|---------------------|
| New page | `create-design-draft` with purpose, user context, constraints |
| Redesign | `iterate-design-draft` with improvement prompts, `--mode branch` |
| Flow across pages | `execute-flow-pages` with page list and layout context |
| New app/feature | `create-project` then drafts |

Include in pro prompt when UI is in scope:
```
**SuperDesign:** [Create design draft for X before implementing. Use --context-file for layout and components.]
```

---

## Multi-CLI Integration

**Use sparingly.** Claude Pro has usage limits — reserve multi-CLI for **really important, complex** phases. See `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`.

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
- **Preferred tool**: Choose between **Cursor (default)**, **Claude CLI**, **Gemini CLI**, **OpenCode CLI**, or **Multi-CLI**. Follow `docs/plan/guidelines/DEVELOPMENT_TOOLS.md` and `.cursor/skills/multi-cli-cursor-workflow/SKILL.md` for selection rules and use Multi-CLI only for complex/high-risk phases.
- **Context**: GateFlow rules, paths
- **Goal**: One clear sentence
- **Scope (in/out)**
- **Steps**: Ordered, concrete, with file paths
- **SuperDesign (optional, for UI phases)**: Run design draft *before* implementation; see SuperDesign section above
- **Subagents (optional)**: Explore/Shell/Browser-use prompts for this phase
- **Acceptance criteria**: Including lint/test pass

See `.cursor/templates/TEMPLATE_PROMPT_phase.md` and `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` Section 2.

---

## Execution Loop (per phase)

1. Apply pro prompt (paste into Cursor)
2. **If phase includes UI and SuperDesign is specified:** Run SuperDesign first (init, create-project, create-design-draft or iterate-design-draft). Use draft output to guide implementation.
3. If phase includes subagent prompts: invoke explore/shell/browser-use subagent with the given prompt
4. Optional (only if phase is complex/high-risk): run Claude/Gemini CLI for design review or test generation. Skip for routine phases.
5. Implement (use SuperDesign draft output if phase included SuperDesign)
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
- `/plan` — Master planning command; uses this skill to create/update `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md`.
- `/dev` and `/ship` — Execution commands that consume the phase prompts produced by this skill.

## Key Files

- `docs/plan/README.md` — Canonical layout for `context/`, `backlog/`, `execution/`, `guidelines/`, and `learning/`
- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — Role definitions and CLI prefixes for all tools
- `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — Full phased execution workflow
- `docs/plan/execution/TEMPLATE_PROMPT_phase.md` + `.cursor/templates/TEMPLATE_PROMPT_phase.md` — Phase prompt template (Primary role, Preferred tool, steps, Acceptance criteria)
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — Task source
- `docs/plan/learning/{patterns,incidents,decisions}.md` — Cross-plan learnings captured from phases
- `.cursor/skills/superdesign/SKILL.md` — SuperDesign UI/UX design workflow
- `.cursor/skills/multi-cli-cursor-workflow/SKILL.md` — Multi-CLI patterns

---

## Rules (never forget)

- pnpm only
- Multi-tenancy (organizationId)
- Soft deletes (deletedAt: null)
- QR HMAC-SHA256, scanUuid dedup
