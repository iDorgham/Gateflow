# GateFlow Planning Subagent Skill

## Purpose

Create phased development plans and comprehensive pro prompts for GateFlow. Use when the user wants a **plan**, **task breakdown**, or **phased execution** of a feature or Epic.

**Integrations:** Use **SuperDesign** (UI/UX design before implementation), **subagents** (explore, shell, browser-use), and **multi-CLI** (Claude CLI, Opencode CLI, Gemini CLI) during execution for best UI/UX and faster, more accurate results. See below.

**Subagent hierarchy:** GateFlow uses a development-company-style hierarchy (Planning, Architecture, Security, Backend, Frontend, Mobile, QA, i18n, DevOps, Explore). Each phase gets a **primary role**. This hierarchy is shared across Kilo and all CLIs for consistent quality. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

## When to Use

- User asks for a "plan", "tasks", "breakdown", "phased approach"
- Starting MVP launch, Resident Portal, or any multi-step initiative
- Decomposing `ALL_TASKS_BACKLOG.md` into executable phases
- Creating pro prompts to apply one by one with test/enhance between phases

## Workflow Summary

1. **Plan (inputs)** → Read `IDEA_<slug>.md` (if present), `PRODUCT_BRAIN.md`, `GATEFLOW_CONFIG.md`, and `ALL_TASKS_BACKLOG.md` to understand intent, product context, and constraints.
2. **Plan (outputs)** → Use the planning prompt to save/update `docs/plan/planning/<slug>/PLAN_<slug>.md` with ordered phases. New plans go to **planning/** until the user marks them ready.
3. **Write** → For each phase, write a pro prompt using `.kilocode/templates/TEMPLATE_PROMPT_phase.md` (must include **Primary role** and **Preferred tool**, plus any SuperDesign/subagent/Multi‑CLI notes) → save to `docs/plan/planning/<slug>/PROMPT_<slug>_phase_<N>.md`.
4. **Mark ready** → When the plan is approved, user runs `/plan ready <slug>` to move `planning/<slug>/` → `planned/<slug>/`.
5. **Execute** → `/dev` and `/ship` consume the phase prompts from `planned/` or `in-progress/`, apply them in Kilo (or the phase's **Preferred tool**), invoke subagents/CLIs as specified, then test → enhance → commit → next phase. `/dev` moves `planned/` → `in-progress/` when starting, and `in-progress/` → `done/` when the last phase completes.

See `docs/plan/PLAN_LIFECYCLE.md` for full lifecycle.

## Planning Workflow (Understand → Investigate → Generate)

For complex initiatives, follow this flow before writing phase prompts:

1. **Understand** — Read IDEA, backlog, product context. Ask clarifying questions if scope is unclear.
2. **Investigate** (optional) — For multi-component or uncertain scope: invoke **explore** subagent to map flows, file patterns, dependencies. Use: "Trace the end-to-end flow for [X]. Return key files and a call graph."
3. **Generate** — Create PLAN + phase prompts. Populate **Skills**, **MCP**, **Subagents**, **Commands** per phase when relevant.

For simple changes (bug fix, single-file refactor), skip to Generate.

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
4. Per phase: add **Skills to load** (gf-security, gf-database, gf-api, gf-mobile, gf-architecture, gf-testing) when relevant
5. Per phase: add **MCP to use** (Prisma-Local for schema, Context7 for docs) when relevant
6. Per phase: add **Subagent** (explore/shell/browser-use) with a concrete prompt when exploration or verification helps
7. Per phase: add **Commands** (/ready, /github, /clis team audit) when relevant
8. Per phase: if UI, add "SuperDesign" — design draft before implementation
9. Per phase: add "Multi-CLI" **only** when security-critical, architectural, or high-risk. Skip for routine phases.
10. Dependencies, risks, blockers

Each phase = one focused session. Use `.kilocode/templates/TEMPLATE_PROMPT_phase.md` for phase prompts. Optionally add Given/When/Then acceptance criteria for precise behavior.
Return structured markdown.
```

---

## Subagent Hierarchy (Role Assignment)

Each phase has a **primary role** from the hierarchy. Use this for Kilo context and CLI prompts. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

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

### Browser-use (UI verification)

Use when the phase adds or changes UI that needs click-through verification.

```
**Subagent (browser-use):**
Login to client-dashboard at localhost:3001, navigate to [pages], verify [behaviors], and capture screenshots for any broken states.
```

---

## SuperDesign (UI/UX phases)

**Use SuperDesign *before* implementing UI** when the phase adds new pages, redesigns layouts, or changes components. See `.kilocode/skills/superdesign/SKILL.md`.

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

---

## Pro Prompt Template (per phase)

Each phase becomes a self-contained pro prompt with:
- **Primary role**: From SUBAGENT_HIERARCHY (e.g., SECURITY, BACKEND-API, FRONTEND). Use for Kilo/CLI context.
- **Preferred tool**: Choose between **Kilo (default)**, **Claude CLI**, **Gemini CLI**, **OpenCode CLI**, or **Multi-CLI**.
- **Context**: GateFlow rules, paths
- **Goal**: One clear sentence
- **Scope (in/out)**
- **Steps**: Ordered, concrete, with file paths
- **SuperDesign (optional, for UI phases)**: Run design draft *before* implementation
- **Subagents (optional)**: Explore/Shell/Browser-use prompts for this phase
- **Acceptance criteria**: Including lint/test pass

See `.kilocode/templates/TEMPLATE_PROMPT_phase.md`.

---

## Execution Loop (per phase)

1. Apply pro prompt
2. **If phase includes UI and SuperDesign is specified:** Run SuperDesign first
3. If phase includes subagent prompts: invoke explore/shell/browser-use subagent with the given prompt
4. Implement
5. Run `pnpm turbo test --filter=<workspace>` and `pnpm turbo lint`
6. Enhance until pass
7. **Git:** Run `/github` or git add/commit/pull/push
8. Next phase

---

## Git / GitHub Workflow (best practice)

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

---

## Integration with master commands

- `/idea` — Captures and refines initiatives; produces `IDEA_<slug>.md` and backlog entries consumed by this skill.
- `/plan` — Master planning command; uses this skill to create/update `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` in `planning/<slug>/`.
- `/plan ready <slug>` — Moves `planning/<slug>/` → `planned/<slug>/` when the plan is approved.
- `/dev` and `/ship` — Execution commands that consume phase prompts from `planned/` or `in-progress/`.

---

## Key Files

- `docs/plan/PLAN_LIFECYCLE.md` — Plan lifecycle: planning → planned → in-progress → done.
- `docs/plan/README.md` — Canonical layout for `context/`, `planning/`, `planned/`, `in-progress/`, `done/`, `execution/`, `guidelines/`, and `learning/`
- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — Role definitions and CLI prefixes for all tools
- `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — Full phased execution workflow
- `.kilocode/templates/TEMPLATE_PROMPT_phase.md` — Phase prompt template

---

## Rules (never forget)

- pnpm only
- Multi-tenancy (organizationId)
- Soft deletes (deletedAt: null)
- QR HMAC-SHA256, scanUuid dedup
