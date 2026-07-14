# Gemini CLI — Project Instructions (GEMINI.md)

This file defines the foundational mandates and custom commands for Gemini CLI in the **GateFlow** workspace. These instructions take absolute precedence over general workflows.

---

## AI Memory (load at session start)

Before starting any task, load these files to avoid re-scanning the codebase:

- `.ai-memory/architecture.md` — monorepo, apps, ports, mandates, commands
- `.ai-memory/api_patterns.md` — auth, org scope, soft deletes, QR, offline sync
- `.ai-memory/common_errors.md` — Prisma gotchas, TS/test pitfalls, UI quirks
- `.ai-memory/modules.md` — scanner flow, Residents, CRM, AI assistant

For deeper reference (load only when relevant):

- `docs/reference/cache/API_ROUTES_MAP.md` — all 95+ routes (replaces globbing api/)
- `docs/reference/cache/SCHEMA_SNAPSHOT.md` — all 40 Prisma models + enums
- `docs/reference/cache/WORKSPACE_INDEX.md` — dep versions, env vars, ports

---

## Custom Commands

Gemini CLI supports the following slash commands by following the workflows defined in `.antigravity/workflows/`:

### `/idea [<slug>]`

**Purpose:** Capture and refine GateFlow initiatives into `IDEA_<slug>.md` and backlog entries.

- **Workflow:**
  1. Load core context: `CLAUDE.md`, `docs/PRD_v5.0.md`, `docs/plan/backlog/ALL_TASKS_BACKLOG.md`, and relevant specs.
  2. Conversationally refine goals, constraints, metrics, success criteria, and scope.
  3. Invoke skills: `gf-planner` for phased thinking, `gf-dev` for feasibility.
  4. Write/update `docs/development/initiatives/IDEA_<slug>.md` with problem, vision, constraints, success criteria, risks.
  5. Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` with linked section.
  6. **Auto-Sync:** `git add .`, `git commit -m "idea(<slug>): initialize"`, `git pull --rebase origin <branch>`, `git push origin <branch>`.
- **Usage:** `/idea` (refine default), `/idea new` (new initiative), `/idea <slug>` (continue existing).

### `/brainstorm [<topic>]`

**Purpose:** Strategic ideation, market research, and release planning from an app engineering perspective.

- **Workflow:**
  1. Load core context and audit current app state (`CLAUDE.md`, backlog, codebase).
  2. Research market trends and user needs (using `browser-use`).
  3. Suggest high-impact functions, specs, or modifications (Merge/Split/Prune).
  4. Plan next releases and strategic roadmaps.
  5. **Capture:** Write to `docs/development/brainstorming/BRAINSTORM_<topic>.md` and update roadmap.
  6. **Auto-Sync:** `git add .`, `git commit -m "brainstorm(<topic>): update roadmap"`, `git push origin master`.
- **Subcommands:**
  - `/brainstorm research`: Competitor analysis using `browser-use`.
  - `/brainstorm gaps`: Audit for missing market features and standards.
  - `/brainstorm merge`: Feature/app consolidation and package optimization.
  - `/brainstorm release`: Define semantic release specs (v1.x, v2.x).
  - `/brainstorm roadmap`: Strategic long-term roadmap generation.
- **Usage:** `/brainstorm`, `/brainstorm <topic>`, `/brainstorm roadmap`.

### `/plan [<slug>]`

**Purpose:** Turn an `IDEA_<slug>.md` into a phased `PLAN_<slug>.md` plus `PROMPT_<slug>_phase_<N>.md` pro prompts.

- **Workflow:**
  1. Read `docs/development/initiatives/IDEA_<slug>.md` and guidelines (`PHASED_DEVELOPMENT_WORKFLOW.md`, `SUBAGENT_HIERARCHY.md`, `AI_SKILLS_SUBAGENTS_RULES.md`).
  2. Create phased plan in `docs/plan/Draft/<slug>/`:
     - `PLAN_<slug>.md` — ordered phases with Scope, Deliverables, Depends on, Test criteria.
     - `PROMPT_<slug>_phase_<N>.md` — per-phase pro prompts using `TEMPLATE_PROMPT_phase.md`.
     - `TASKS_<slug>.md` — phase checklist (optional).
  3. Ensure each phase has **Primary role**, **Preferred tool**, concrete **Steps**, and **Acceptance criteria**.
  4. **Plan lifecycle:** Use `/plan ready <slug>` to move `planning/<slug>/` → `planned/<slug>/`.
  5. Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` and transition initiative status.
  6. **Auto-Sync:** `git add .`, `git commit -m "plan(<slug>): roadmap"`, `git pull --rebase origin <branch>`, `git push origin <branch>`.
- **Usage:** `/plan`, `/plan <slug>`, `/plan ready <slug>`, `/plan phase <n>`.

### `/dev [<slug>] [<n>]`

**Purpose:** Implement exactly one plan phase end-to-end (code, tests, git).

- **Workflow:**
  1. **Preflight:** Run `/ready` flow (check `git status`, optionally `pnpm preflight`).
  2. **Resolve plan location:** Check `in-progress/<slug>/`, `planned/<slug>/`, `planning/<slug>/`, then legacy `execution/`.
  3. **Lifecycle transitions:** Move `planned/` → `in-progress/` when starting; `in-progress/` → `done/` when last phase completes.
  4. Load `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md`.
  5. Adopt phase's **Primary role** and **Preferred tool**; follow **Steps** and invoke subagents.
  6. **Verify:** Run acceptance criteria (`pnpm turbo lint/typecheck/test --filter=<workspace>`).
  7. **Limits + permission:** Load `gf-cli-limits` skill; check `CLI_LIMITS_TRACKING.md`; respect 80% rule.
  8. **Learning:** Append entry to `docs/development/learning/CLI_USAGE_AND_RESULTS.md` after CLI usage.
  9. **Auto-Sync:** `git add .`, `git commit -m "feat(<slug>): complete phase <n>"`, `git pull --rebase origin <branch>`, `git push origin <branch>`.
- **Usage:** `/dev`, `/dev <n>`, `/dev <slug> <n>`, `/dev ralph` (recursive autopilot).

### `/man [<subcommand>]`

**Purpose:** One Man — one command, seven domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite).

- **Subcommands:**
  - `/man` (default): Status + next action; guide in chat.
  - `/man code|brand|saas|marketing|business|content|copywrite`: Domain-specific mode.
  - `/man tasks`: Task manager — list, add, move, start, focus.
  - `/man settings`: Interactive wizard for GitHub, MCPs, skills, planning flow.
  - `/man mindset`: Change profile/domain (lists seven domains; persists to `ONE_MAN_MEMORY.md`).
  - `/man inspire`: Collaborative ideation.
  - `/man run` or `/man go`: Execute next step in current domain.
  - `/man ship <slug>`: Ship plan to completion.
  - `/man status`: Quick overview.
- **Workflow:**
  1. Load `.antigravity/skills/one-man/SKILL.md`.
  2. Scan state: backlog, planning, planned, in-progress, done, git, preflight, current profile.
  3. Assess: What's next? Blocked? Ready?
  4. Guide in chat or execute based on subcommand.
- **Folder structure:** `docs/plan/{backlog,context,planning,planned,in-progress,done}/`

### `/ship [<slug>]`

**Purpose:** Execute all remaining phases of a plan sequentially via repeated `/dev`-style execution.

- **Workflow:**
  1. If no IDEA/PLAN exist: run `/idea` then `/plan` first.
  2. Resolve plan location per `PLAN_LIFECYCLE.md` (`in-progress/`, `planned/`, `planning/`, `execution/`).
  3. For each phase `1..N`:
     - Load/create `PROMPT_<slug>_phase_<N>.md`.
     - Run `/dev <slug> <N>` equivalent (preflight, implement, verify, commit).
     - **Stop on failure:** Fix issues; do not skip phases.
  4. Finish: All phases completed, docs updated, branch pushed.
- **Usage:** `/ship`, `/ship all`, `/ship <slug>`.

### `/guide`

**Purpose:** Run the GateFlow workspace guide — "what should I do now?", next steps, recommended actions.

- **Workflow:**
  1. Load context: `GATEFLOW_CONFIG.md`, `docs/PRD_v7.0.md`, `docs/plan/` (ideas, plans, learning).
  2. Assess state: git status, preflight, active plan/phase.
  3. **Ralph Perspectives:** Run `ralph-prioritize.js` for backlog intel, `ralph-skill-discover.js` for pattern scanner.
  4. **Report (Enforced):**
     - **Must do** — Actions that unblock the project.
     - **Workflow Health** — Ralph Loop status; enforcer status.
     - **Skill Compliance Score** — 0-100% rating against ~40 skills.
     - **Strategic Blockers** — Items preventing next phase.
     - **Recommended** — High-value next steps (e.g. `/dev`).
     - **Critical** — Security/Performance risks from enforcer scripts.
     - **Next Step Injection** — Ready-to-run `/dev` command block.
     - **CLI suggestions** — From `TOOL_AND_CLI_REFERENCE.md`; respects `GUIDE_PREFERENCES.md`.
  5. **Super-power mode:** Optionally follow plan, use hierarchy, run checks, execute automations.
- **Usage:** `/guide`, `/guide what should I do now`, `/guide` + "and do the next phase".

### `/clis team <name>`

**Purpose:** Run a predefined CLI team (2–4 CLIs in sequence). Cursor is master; outputs are proposals until applied/verified.

- **Teams:**
  | Name | Command | Team | Purpose |
  |------|---------|------|---------|
  | SEO/Content | `/clis team seo` | Kiro, Gemini, Opencode, Qwen | Draft → 2 improvers → curator → humanize |
  | Code/Refactor | `/clis team refactor` | Opencode, Gemini, Kilo | Refactor lead → second opinion → fast verify |
  | Review/Audit | `/clis team audit` | Gemini, Opencode, Claude (escalation) | Broad pass → code pass → escalate if hardest |
  | Ops/Recovery | `/clis team ops` | Claude, Gemini, Opencode | Scan logs → Root cause → Fix |
  | Perf/Speed | `/clis team perf` | Gemini, Opencode, Kilo | Analyze bottlenecks → Optimize → Verify |
- **Workflow:**
  1. Load `docs/development/learning/CLI_TEAMS.md` for roster and steps.
  2. Check limits: Load `gf-cli-limits` and `CLI_LIMITS_TRACKING.md`; respect 80% rule.
  3. Run steps sequentially; capture outputs.
  4. Apply & verify: Cursor/user applies changes; run `pnpm preflight`.
  5. Log: Append entries to `CLI_USAGE_AND_RESULTS.md`.

### `/deploy [<app>] [<subcommand>]`

**Purpose:** Manually orchestrate deployments to Vercel with pre-flight safety checks and error memory.

- **Workflow:**
  1. Load `.ai-memory/deployment_errors.md` and check for recurring pitfalls.
  2. Perform pre-flight: `pnpm turbo lint typecheck --filter=<app>`.
  3. Ensure branch is committed and pushed to `origin`.
  4. Trigger manual dispatch: `gh workflow run deploy.yml -f app=<app>`.
  5. Monitor Vercel logs via `browser-use` if build fails; propose fix and update memory.
- **Subcommands:**
  - `/deploy <app>`: Forces a production deploy for a specific app (marketing, client, admin, resident, design-system).
  - `/deploy fix`: Analyzes last failed build and implements a fix.
  - `/deploy status`: Fetches current deployment status.
  - `/deploy check`: Run pre-deployment checks WITHOUT deploying.
- **Usage:** `/deploy design-system`, `/deploy fix`.

---

## Skills System

**83 skills** available in `.antigravity/skills/`. Key skills:

### Core Workflow Skills

- `gf-planner` — Phased planning, roadmap generation.
- `gf-dev` — Implementation, feasibility, stack fit.
- `gf-guide` — Workspace guidance, state assessment.
- `gf-man` — One Man seven-domain orchestration.
- `gf-cli-limits` — CLI usage limits and 80% rule enforcement.
- `gf-cli-memory` — CLI tool memory and patterns.
- `multi-cli-cursor-workflow` — Multi-CLI coordination.

### Domain Skills

- **Backend:** `gf-api`, `gf-api-gateway`, `gf-backend-services`, `gf-database`, `gf-prisma-performance`.
- **Frontend:** `gf-design-guide`, `gf-responsive-design-system`, `gf-shadcn-*` adapters.
- **Security:** `gf-security`, `gf-rbac-permissions`, `gf-data-privacy-gdpr`, `gf-qr-crypto-security`.
- **Mobile:** `gf-expo-*`, `gf-mobile`, `gf-mobile-hardware-access`.
- **Analytics:** `gf-analytics-animation`, `gf-data-viz-chat`, `gf-observability-logging`.
- **SEO:** `gf-seo-core`, `gf-seo-international`.
- **Architecture:** `gf-architecture`, `gf-monorepo-architecture`, `gf-system-invariants`.

### ADS (Antigravity Design System) Skills

- `gf-ads-core-tokens`, `gf-ads-color-tokens`, `gf-ads-typography-scale`, `gf-ads-spacing-grid`, `gf-ads-iconography-grid`, `gf-ads-ui-styling-standard`, and more.

---

## Agent Roles

**11 agent roles** in `.antigravity/agents/roles/`:

- `frontend.md` — UI implementation, component development.
- `backend-api.md` — API design, endpoints, integration.
- `backend-database.md` — Schema, migrations, queries.
- `architecture.md` — System design, patterns, refactoring.
- `planning.md` — Roadmap, phases, task breakdown.
- `security.md` — Audits, compliance, RBAC.
- `devops.md` — CI/CD, deployment, infrastructure.
- `mobile.md` — React Native, Expo, mobile optimization.
- `qa.md` — Testing, quality assurance.
- `i18n.md` — Internationalization, localization.
- `explore.md` — Research, discovery, investigation.

### Subagents

- `browser-use.md` — Web browsing, scraping.
- `explore.md` — Codebase exploration.
- `shell.md` — Shell command execution.

---

## Operational Mandates

1. **Planning Mode:** Always use `enter_plan_mode` for `/idea`, `/plan`, and before starting a `/ship` run.
2. **Context First:** Always read `docs/CLAUDE.md` and the active `PLAN_<slug>.md` at the start of a session.
3. **80% Rule:** Check `docs/development/learning/CLI_LIMITS_TRACKING.md` before suggesting or using high-usage CLIs. If a CLI is at **80%+** of its limit, do not use it without explicit user permission.
4. **Learning Log:** After completing a phase or major task, append an entry to `docs/development/learning/CLI_USAGE_AND_RESULTS.md`. Record durable notes in `CLI_TOOL_MEMORY.md`.
5. **Pnpm Only:** Never use `npm` or `yarn`. Always use `pnpm` for commands.
6. **Multi-tenancy:** Ensure every DB query includes `organizationId` and `deletedAt: null`.
7. **Auto-Sync & Branching Mandate**:
   - **Planning commands** (`/brainstorm`, `/idea`, `/plan`): Execute on `master`. Auto-commit and push immediately.
   - **Execution commands** (`/dev`, `/ship`):
     - **Start**: Automatically create/switch to a feature branch (`feat/<slug>-phase-<N>`) via `node scripts/ralph-git.js branch`.
     - **Finish Phase**: Commit and Tag each phase via `node scripts/ralph-git.js commit` and `tag`.
     - **Final Merge**: Automatically run `node scripts/ralph-git.js merge` to merge into `master` and push once the **last** phase of a plan is marked Done.
   - No user permission needed if state is green.
8. **Performance Guard/100% Mandate:** Every major command must assess if performance is impacted. Trigger `/clis team perf` if score drops < 100.
9. **Plan Lifecycle:** Respect folder transitions: `planning/` (draft) → `planned/` (ready) → `in-progress/` (active) → `done/` (complete).
10. **Role + Tool Alignment:** Adopt the phase's **Primary role** from `SUBAGENT_HIERARCHY.md` and respect **Preferred tool** (Cursor, Claude CLI, Gemini CLI, Opencode, Kiro, Kilo, Qwen).
11. **Deployment Guard**: Automatic deployments on `push` are DISABLED. Use `/deploy` for all production releases.
    - **Auto-Trigger**: `/dev` automatically triggers `/deploy` after the final phase merge.
    - **Tracking**: All deployments MUST be logged in `.ai-memory/deployment_tracker.md`.
    - **Guide Suggestions**: `/guide` will proactively suggest `/deploy` if apps are out of sync with production.
12. **Role + Tool Alignment**: Adopt the phase's **Primary role** from `SUBAGENT_HIERARCHY.md` and respect **Preferred tool**.

---

## Reference Docs

### Core

- `docs/CLAUDE.md` — Core project overview and commands.
- `docs/PRD_v7.0.md` — Product requirements and roadmap.
- `GATEFLOW_CONFIG.md` — Commands, plans, security, agents, skills.

### Planning

- `docs/development/PLAN_LIFECYCLE.md` — Plan state transitions.
- `docs/development/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — Execution loop.
- `docs/development/guidelines/SUBAGENT_HIERARCHY.md` — Roles and subagents brain.
- `docs/development/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — Skills usage rules.
- `docs/development/guidelines/TEMPLATE_PROMPT_phase.md` — Phase prompt template.
- `docs/guides/PROMPTS_REFERENCE.md` — Professional prompt templates.

### Learning & Memory

- `docs/development/learning/GUIDE_PREFERENCES.md` — User AI interaction preferences.
- `docs/development/learning/CLI_TEAMS.md` — CLI team rosters and workflows.
- `docs/development/learning/CLI_LIMITS_TRACKING.md` — CLI usage limits.
- `docs/development/learning/CLI_USAGE_AND_RESULTS.md` — CLI usage log.
- `docs/development/learning/CLI_TOOL_MEMORY.md` — Durable tool learnings.
- `docs/development/learning/ONE_MAN_MEMORY.md` — One Man profile state.
- `docs/development/learning/ONE_MAN_CODE_SETTINGS.md` — One Man configuration.
- `docs/development/learning/{patterns,incidents,decisions}.md` — Cross-plan learnings.

### Guides

- `docs/guides/TOOL_AND_CLI_REFERENCE.md` — CLI tool recommendations.
- `docs/guides/UI_DESIGN_GUIDE.md` — UI design standards.
- `docs/guides/MOTION_AND_ANIMATION.md` — Animation guidelines.

---

## Antigravity Workspace Structure

```
.antigravity/
├── workflows/       # Command workflows (idea, plan, dev, man, ship, guide, clis-team)
├── skills/          # 83 specialized skills (gf-*, one-man, multi-cli, etc.)
├── agents/
│   ├── roles/       # 11 agent roles (frontend, backend, security, etc.)
│   ├── scenarios/   # Usage scenarios
│   └── orchestrator.md
├── subagents/       # Browser, explore, shell subagents
├── templates/       # Code/doc generation templates
├── contracts/       # System invariants and contracts
├── hooks/           # Event hooks
└── rules/           # Operational rules
```
