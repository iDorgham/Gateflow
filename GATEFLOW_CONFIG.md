 Powers  pthis ## GateFlow Configuration Index

GateFlow uses a shared set of docs, rules, skills, and agents across Cursor, CLIs (Claude, Gemini, Opencode), and other IDEs (Kiro, Antigravity). This file is the **entry point** for any tool that needs to understand how GateFlow is configured.

---

## 1. Master Commands & Flows (Cursor)

- **Visible slash commands (Cursor)**: `/idea`, `/plan`, `/dev`, `/ship`, `/guide`
  - `/idea`: Refine goals and capture context into `docs/plan/context/IDEA_<slug>.md` and backlog entries in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
  - `/plan`: Turn an idea/backlog section into a phased plan in `docs/plan/execution/PLAN_<slug>.md` and per‑phase prompts in `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`.
  - `/dev`: Implement **one phase** end‑to‑end using its `PROMPT_<slug>_phase_<N>.md` file (code, tests, lint/typecheck, git).
  - `/ship`: Run remaining phases for a plan sequentially (internally chaining `/dev`), enforcing tests and quality gates.
  - `/guide`: Workspace guide — “what should I do now?”, next steps, recommended, critical, improvements; uses `.cursor/skills/gf-guide/SKILL.md` and can run in super‑power mode (follow plan, use hierarchy, run checks). Rule `.cursor/rules/02-gateflow-guide.mdc` adds pre‑flight before tasks and optional post‑task summary.
- **Supporting commands** (defined in `.cursor/commands/` and documented in `.cursor/rules/01-gateflow-ai-workflow.mdc` and `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md`):
  - `/ready` (pre‑dev checks), `/github` (branch/commit/push), `/docs`, `/test`, `/perf`, `/security`, `/dept`, `/clis`, **`/clis team <seo|refactor|audit>`** (predefined CLI teams; see `docs/plan/learning/CLI_TEAMS.md`), `/automate`.

**Primary references**

- `CLAUDE.md` — global assistant guide and constraints.
- `.cursor/rules/01-gateflow-ai-workflow.mdc` — AI workflow rules and slash command surface.
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — commands and workflows.

---

## 2. Phased Plans & Phase Prompts

GateFlow development is organized as **phased plans** with one pro prompt per phase.

- **Plan files**
  - `docs/plan/execution/PLAN_<slug>.md` — ordered phases with scope, deliverables, and test criteria.
  - `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` — executable pro prompt for phase N.
- **Template & workflow**
  - `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — end‑to‑end phased workflow (plan → prompts → execute → test → enhance).
  - `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — skills and subagent rules.
  - `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — canonical roles and CLI prefixes.
  - `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — how phased execution integrates with everyday dev.
  - `.cursor/templates/TEMPLATE_PROMPT_phase.md` — phase prompt template (primary role, context, steps, subagents, acceptance criteria).
- **Planning and execution skills**
  - `.cursor/skills/gf-planner/SKILL.md` — create phased plans + per‑phase prompts, assign **Primary role**, decide when to use SuperDesign, subagents, and multi‑CLI.
  - `.cursor/skills/gf-dev/SKILL.md` — commands, workflows, subagent prompts for implementation.

**Rule for tools**: Any tool (Cursor, CLIs, Kiro, Antigravity) that wants to participate in phased work should:

- Read `PLAN_<slug>.md` to understand phases, then
- Use `PROMPT_<slug>_phase_<N>.md` as the canonical task description for phase N,
- Respect the **Primary role** and **acceptance criteria** sections in that prompt.
- Enforce the **EC rules** (“Exit conditions”) from `PHASED_DEVELOPMENT_WORKFLOW.md`:
  - A phase is only “done” when all of its acceptance criteria are met, required checks (tests/lint/typecheck or `pnpm preflight`) pass, and the work is committed.
  - A plan is only “done” when every phase has satisfied those phase‑level EC rules; blocked phases must be documented and converted into follow‑up work instead of being silently skipped.

---

## 3. Security Model, Rules, and Contracts

Security is enforced at three layers: **core rules**, **contracts**, and **specialist security guidance**.

- **Core security rules (always‑on)**
  - `.cursor/rules/00-gateflow-core.mdc`
    - pnpm only.
    - Multi‑tenancy: all tenant queries must scope by `organizationId`.
    - Soft deletes: filter `deletedAt: null`; no hard deletes.
    - Auth tokens: short‑lived access tokens; secure cookies / SecureStore (never `localStorage`).
    - QR security: HMAC‑SHA256 signing; preserve `scanUuid` dedup.
    - Secrets: never commit `.env`, fail‑closed for security‑critical env vars.
- **Security skill (Cursor + CLIs)**
  - `.cursor/skills/gf-security/SKILL.md`
    - Auth stack, RBAC roles, API route checklist, soft delete patterns, QR and mobile security.
    - Referenced by the **SECURITY** role in `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.
- **Code contracts**
  - `.cursor/contracts/CONTRACTS.md`
    - Multi‑tenancy, soft deletes, QR security and `scanUuid` invariants, authentication, input validation, secrets/tokens, pnpm‑only, workspace imports.
    - Use this as the **authoritative invariant list** for implementation and code review.
- **Security overview docs**
  - `docs/SECURITY_OVERVIEW.md` — high‑level security architecture.
  - `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` — security and quality checks.

> **Security rule for agents/tools:** Before changing auth, RBAC, QR flows, scanner sync, or any API that touches tenant data, always load:
> - `.cursor/skills/gf-security/SKILL.md`
> - `.cursor/contracts/CONTRACTS.md`
> - `.cursor/rules/00-gateflow-core.mdc`

---

## 4. Specialist Agents & Roles

GateFlow uses a **subagent hierarchy** so every phase has a clear owner role shared across all tools.

- **Role definitions**
  - `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`
    - Roles: `PLANNING`, `ARCHITECTURE`, `SECURITY`, `BACKEND-Database`, `BACKEND-API`, `FRONTEND`, `MOBILE`, `QA`, `i18n`, `DEVOPS`, `EXPLORE`.
    - Each role includes responsibilities, associated skills, and a canonical CLI prefix (e.g. “You are the GateFlow Security Specialist…”).
- **Role personas and orchestrator (Cursor)**
  - `.cursor/agents/orchestrator.md` — when to invoke subagents, MCP, and multi‑CLI; how to adopt role agents per phase.
  - `.cursor/agents/roles/` — role‑specific personas (planning, architecture, security, backend‑database, backend‑api, frontend, mobile, QA, i18n, devops, explore).
  - `.cursor/agents/scenarios/` — scenario prompts (e.g. security‑audit, code‑review).
- **Skills by role (Cursor)**
  - `.cursor/skills/gf-architecture/SKILL.md` — ARCHITECTURE.
  - `.cursor/skills/gf-security/SKILL.md` — SECURITY.
  - `.cursor/skills/gf-database/SKILL.md` — BACKEND‑Database.
  - `.cursor/skills/gf-api/SKILL.md` — BACKEND‑API.
  - `.cursor/skills/gf-mobile/SKILL.md` — MOBILE.
  - `.cursor/skills/gf-testing/SKILL.md` — QA.
  - `.cursor/skills/gf-i18n/SKILL.md` — i18n.
  - `.cursor/skills/gf-dev/SKILL.md` — DEVOPS (builds, migrations, preflight).

**Security specialist phases**

- Phases whose **Primary role** is `SECURITY` must:
  - Use `.cursor/skills/gf-security/SKILL.md` as primary reference.
  - Enforce all invariants from `.cursor/contracts/CONTRACTS.md` and `.cursor/rules/00-gateflow-core.mdc`.
  - Treat QR signing, scanner sync (`scanUuid`), multi‑tenant scoping, CSRF, and rate limiting as **non‑negotiable**.
  - Prefer security‑oriented CLIs (Claude) for reviews only when the phase is complex or high‑risk, in line with `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` and multi‑CLI guidance.

---

## 5. Multi‑IDE Adapter Guidance (Kiro, Antigravity, CLIs)

**Tool and CLI choice:** The tool set includes **Cursor IDE**, **Claude CLI**, **Gemini CLI**, **Opencode CLI**, **Kiro CLI**, **Kilo CLI**, and **Qwen CLI**. For which task to use which tool (and for model/plan info), see **`docs/guides/TOOL_AND_CLI_REFERENCE.md`**. It defines strengths, weaknesses, a task-to-tool matrix, and user tools & plans for accurate suggestions and best results. The workspace guide (gf-guide) uses this reference when recommending a tool or CLI.

Other tools should **not** re‑implement planning logic. Instead, they should treat these docs as the source of truth:

- **Planning & phases**
  - Read from `docs/plan/execution/PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md`.
  - Respect the **Primary role**, **Scope**, and **Acceptance criteria** in each phase prompt.
- **Rules & contracts**
  - Enforce `.cursor/rules/00-gateflow-core.mdc`, `.cursor/rules/01-gateflow-ai-workflow.mdc`, `.cursor/contracts/CONTRACTS.md`, and (for security) `gateflow-security.mdc` once present.
- **Skills mapping**
  - Mirror the role/skill mapping from `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` and `SUBAGENT_HIERARCHY.md` when configuring role‑based behaviors in other IDEs.

For any new automation, CI hook, or external tool, start by reading **this file** plus:

- `CLAUDE.md`
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md`
- `docs/guides/ENVIRONMENT_VARIABLES.md` (or `docs/ENVIRONMENT_VARIABLES.md` if present)

---

## 6. Workspace Guide (pre‑flight, post‑task, “what should I do now”)

GateFlow has a **workspace guide** that understands the full setup (skills, agents, rules, commands, templates, contracts) and can steer the user and automation.

- **Skill:** `.cursor/skills/gf-guide/SKILL.md`
  - Workspace map (GATEFLOW_CONFIG, docs, plan, commands, agents, contracts).
  - Pre‑flight before tasks (git, preflight, blocking phase, security).
  - Post‑task summary (must do, recommended, critical, improvements).
  - “What should I do now?” and optional super‑power mode (follow plan, use hierarchy, run CLIs and checks).
- **Rule:** `.cursor/rules/02-gateflow-guide.mdc` (always‑on)
  - Before executing a user task: consider pre‑flight; if something should be done first, offer “1 — Proceed” or “2 — Do suggestions first”.
  - When the user says `/guide` or “what should I do now”: invoke gf-guide fully.
  - After completing a task: optionally give a short guide summary.
- **Command:** `/guide` — `.cursor/commands/guide.md`
  - Explicit “what should I do now?” flow; can run in super‑power mode to follow the plan and use the subagent hierarchy.

