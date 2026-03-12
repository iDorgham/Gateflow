# GateFlow — AI Skills, Subagents, and Rules

This document defines **how we use AI assistance in this repo**: which skills exist, when to use subagents, and the engineering rules that must be followed to keep GateFlow safe, consistent, and shippable.

**Workflow integration:** These rules are implemented in:
- **Master slash commands** — `/idea`, `/plan`, `/dev`, `/ship` (the only visible slash commands in Cursor)
- **Internal flows** — legacy helpers like `/ready`, `/run`, `/automate`, `/github`, `/clis` live as markdown flows and are orchestrated by the master commands
- `.cursor/rules/01-gateflow-ai-workflow.mdc` — Cursor rule (always applied)
- `.cursor/skills/gf-dev/SKILL.md` — gf-dev skill
- `.cursor/skills/` — domain/workflow skills (gf-mcp, gf-architecture, gf-security, gf-database, gf-testing, gf-mobile, gf-i18n, gf-api, gf-planner, superdesign, excel-spreadsheets)
- `.cursor/subagents/` — prompt templates (explore, shell, browser-use)
- `.cursor/commands/` — definitions for master commands (`idea`, `plan`, `dev`, `ship`)
- `.cursor/commands-ref/` — internal helper flows (`ready`, `run`, `automate`, `github`, `clis`, etc.), not exposed as slash commands
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — section 3 (AI Skills & Subagents)

---

## What GateFlow is (context in 30 seconds)

GateFlow is a **Zero‑Trust digital gate infrastructure platform** (MENA-focused) spanning:

- **Web apps (Next.js 14)**: `apps/client-dashboard`, `apps/admin-dashboard`, `apps/marketing`, `apps/resident-portal` (planned)
- **Mobile apps (Expo SDK 54)**: `apps/scanner-app`, `apps/resident-mobile` (planned)
- **Shared packages**: `packages/db`, `packages/types`, `packages/ui`, `packages/api-client`, `packages/i18n`, `packages/config`

Primary flows: **QR generation (signed)** → **scan (online/offline)** → **audit logs + analytics** → **exports/integrations (webhooks/API keys)**.

Reference: `CLAUDE.md`, `docs/PRD_v5.0.md`, `docs/APP_DESIGN_DOCS.md`.

---

## Shared Knowledge Base (Plans & Learnings)

All tools (Cursor, CLIs, Kiro, Antigravity) share a **single planning and learning brain** under `docs/plan/`:

- **Ideas & context**: `docs/plan/context/IDEA_<slug>.md`
- **Backlog**: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
- **Plans & phases**:
  - `docs/plan/execution/PLAN_<slug>.md`
  - `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`
- **Guidelines / “brain”**:
  - `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`
  - `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
  - `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md`
- **Learnings (long-lived)**:
  - `docs/plan/learning/patterns.md`
  - `docs/plan/learning/incidents.md`
  - `docs/plan/learning/decisions.md`

Every IDE and CLI must treat these files as the **single source of truth** for ideas, plans, prompts, and learnings. New plans and phases are always written back here, not into ad‑hoc notes elsewhere.

**Phased execution rule:** Any serious initiative (anything larger than a trivial bug fix) must go through the phased development workflow defined in `PHASED_DEVELOPMENT_WORKFLOW.md`:

- Start from an `IDEA_<slug>.md` and create `PLAN_<slug>.md` with ordered phases.
- For each phase, create a pro prompt `PROMPT_<slug>_phase_<N>.md` using the shared template (Primary role, Preferred tool, clear steps, and Acceptance criteria).
- `/dev` and `/ship` treat each phase’s **Acceptance criteria** (including lint/typecheck/tests) as hard quality gates before declaring the phase or plan complete.

## Multi-tool setup

GateFlow development uses several AI tools (Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, Kilo CLI). See `docs/plan/guidelines/DEVELOPMENT_TOOLS.md` for the single reference.

### When to prefer which tool

| Situation | Prefer |
|-----------|--------|
| Day-to-day coding with inline edits | **Cursor** or **Kiro** |
| Design exploration (layouts, flows) | **SuperDesign** (via Cursor skill) |
| Quick one-off question, no IDE | **Claude CLI** or **Gemini CLI** |
| Automated checks (lint, prisma, security) | **Kiro** hooks |
| Terminal-only workflow | **Claude CLI**, **Opencode CLI**, **Gemini CLI**, or **Kilo CLI** |
| Multi-step UI verification | **Cursor** browser-use subagent |
| Codebase exploration across apps | **Cursor** explore subagent |
| Shell commands, builds, git | **Cursor** shell subagent |
| Alternative IDE or parallel task | **Antigravity**, **Kiro** |

### Shared context (all tools)

- `CLAUDE.md` — repo overview and constraints
- `.cursor/rules/` — core rules (apply regardless of IDE)
- `.kiro/` — Kiro skills, steering, hooks (when using Kiro)
- `docs/` — product and technical documentation

---

## Skills available in this workspace

### `superdesign`

- **Purpose**: UI/UX design exploration + infinite-canvas drafts, then mapping to production UI.
- **Trigger it when**:
  - Designing/redesigning a page, flow, layout, or component.
  - You need to align a UI change with existing tokens/components.
  - The user mentions SuperDesign or SuperDesign CLI commands.
- **Where**: `.cursor/skills/superdesign/SKILL.md`
- **Important**: Follow the skill’s mandatory pre-checks (CLI install + login), and keep `.superdesign/init/` current.

### `gf-planner`

- **Purpose**: Create phased plans and pro prompts; orchestrate apply → test → enhance → next phase. Uses **Subagent Hierarchy** (company-style roles); assigns primary role per phase. Includes **SuperDesign**, **subagent prompts**, **multi-CLI** (sparingly).
- **Trigger it when**:
  - User asks for a plan, task breakdown, or phased execution
  - Starting MVP launch, Resident Portal, or any multi-step initiative
  - Need to decompose backlog into executable phases
- **Where**: `.cursor/skills/gf-planner/SKILL.md`
- **Full reference**: `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
- **SuperDesign**: UI phases run design draft first; **Subagents**: explore/shell/browser-use; **Multi-CLI**: sparingly — only for complex/high-risk phases (Claude Pro limits)

### `gf-dev`

- **Purpose**: Commands, workflows, preflight, and subagent prompts for GateFlow development.
- **Trigger it when**:
  - User asks for commands, workflows, or "how do I..."
  - Adding API route, component, Prisma model
  - Pre-PR checks, debugging, onboarding
- **Where**: `.cursor/skills/gf-dev/SKILL.md`
- **Full reference**: `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md`

### `multi-cli-cursor-workflow`

- **Purpose**: Orchestrate Claude CLI, Opencode CLI, and Gemini CLI in terminal alongside Cursor for parallel AI development.
- **Trigger it when**:
  - User wants faster development with multiple AI tools
  - Running CLIs while editing in Cursor
  - Need multi-model consensus or parallel analysis
- **Where**: `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`

### `gf-mcp`

- **Purpose**: When and how to use MCP servers (Prisma-Local, Context7, cursor-ide-browser, GitHub) in GateFlow development.
- **Trigger it when**:
  - Schema work, migrations, Prisma Studio
  - Docs lookup (React, Next.js, Prisma)
  - E2E verification, browser flows
  - GitHub automation (PRs, issues)
- **Where**: `.cursor/skills/gf-mcp/SKILL.md`
- **Setup**: `docs/MCP_SETUP.md`

### `excel-spreadsheets`

- **Purpose**: Create, read, and edit Excel (.xlsx) and spreadsheet files.
- **Trigger it when**:
  - Working with .xlsx, .xls, spreadsheets, Excel exports
  - User mentions Excel, Google Sheets, or tabular data files
  - Adding CSV/Excel export, bulk import from Excel, or Excel-based features
- **Where**: `.cursor/skills/excel-spreadsheets/SKILL.md`

### Domain skills (Cursor)

| Skill | Purpose | Trigger when |
|-------|---------|--------------|
| **gf-architecture** | Monorepo structure, conventions | Any code change, architectural decision |
| **gf-security** | Auth, RBAC, multi-tenant, QR signing | Auth, sensitive data, new APIs |
| **gf-database** | Prisma, migrations, query patterns | Schema, queries, migrations |
| **gf-testing** | Jest, mocks, API tests | Writing tests, debugging |
| **gf-mobile** | Expo, offline sync, scanner | Scanner-app, resident-mobile |
| **gf-i18n** | Arabic/English, RTL, locale switching | Localization, MENA support |
| **gf-api** | Next.js API routes, auth, validation | New or modified API endpoints |

All in `.cursor/skills/<name>/SKILL.md`.

### Cursor workflow skills (system-level)

These are useful when the task is explicitly about Cursor configuration or authoring new skills/rules:

- **Create Cursor rules**: `.cursor/skills-cursor/create-rule/SKILL.md`
- **Create a new skill**: `.cursor/skills-cursor/create-skill/SKILL.md`
- **Install skills**: `~/.codex/skills/.system/skill-installer/SKILL.md`
- **Update Cursor settings**: `.cursor/skills-cursor/update-cursor-settings/SKILL.md`

If you’re making product changes (API/UI/mobile), you typically won’t use these unless asked.

---

## Subagent Hierarchy (Company Structure)

GateFlow uses a **development-company-style hierarchy** for consistent quality across Cursor and all CLIs (Claude, Opencode, Gemini). Every phase gets a **primary role**; each role has responsibilities and shared context.

**Roles:** PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE

**Full reference:** This doc (`AI_SKILLS_SUBAGENTS_RULES.md`) **plus** `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` together form the **single brain** for roles and subagents — they define the role list, responsibilities, CLI prefixes, and when to use each subagent. Other docs and skills should **reference these files instead of redefining roles.**

---

## Subagents: when to use which one

Use subagents to reduce latency and keep context clean. Pick the smallest tool for the job.

### Explore subagent (codebase scanning)

Use when you need to **understand an area of the repo quickly**:

- Finding where a feature is implemented (routes, schemas, components)
- Mapping a flow across apps/packages
- Locating all references for a refactor

**Good prompts**:
- “Where is QR signature verified and how is it used by scanner sync?”
- “List all API routes involved in onboarding and token issuance.”

### Shell subagent (commands + git + builds)

Use when you need to run **multiple terminal actions**:

- `pnpm` / turbo pipelines, tests, typecheck
- git inspection (status/diff/log), PR creation via `gh`
- local scripts, prisma generate/migrate

### Browser-use subagent (UI verification)

Use when you need **multi-step UI verification** or “click-through testing”:

- Validate navigation, auth redirect loops, table filters, exports, i18n switching
- Capture screenshots or confirm UI states after changes

### General-purpose subagent (mixed investigation)

Use when the task is ambiguous or spans code + docs + behavior and you want one agent to synthesize findings, but still keep a tight scope (avoid “do everything” prompts).

### Planning subagent (plan + phased execution)

Use when the user wants to **create a plan**, **break down tasks**, or **run phased development** (create plan → write pro prompts → apply one by one → test/enhance → next phase).

**Workflow:**
1. Create plan from goal/backlog → save to `docs/plan/execution/PLAN_<name>.md`
2. Write each phase as pro prompt → `PROMPT_<name>_phase_N.md`
3. Execute: apply prompt → test → enhance → commit → next

**Skill:** `.cursor/skills/gf-planner/SKILL.md`  
**Full reference:** `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`

---

## Subagent prompt recipes (copy/paste)

### Explore

- **Trace a flow**: “Trace the end-to-end flow for \<X\> (UI → API routes → DB models). Return the key files and a short call graph.”
- **Refactor discovery**: “Find all places where \<symbol/string\> is used across apps/packages and group by feature area.”
- **Route inventory**: “List all API routes under \<path\> and summarize inputs/outputs/auth requirements.”

### Shell

- **Pre-PR checks**: “Run lint + typecheck + tests for only the affected workspaces: \<filters\>. Return failures with file/line.”
- **Release sanity**: “Run `pnpm turbo build` and report any workspace that fails with the first actionable error.”

### Browser-use

- **Regression pass**: “Login as \<role\>, navigate to \<pages\>, verify \<behaviors\>, and capture screenshots for any broken states.”
- **i18n check**: “Toggle locale and verify routes, navigation labels, and RTL/LTR layout correctness.”

---

## Repo rules (non‑negotiable)

### Package manager

- **Use `pnpm` only**. Never use `npm` or `yarn`.
- Root scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm typecheck`.

### Multi-tenancy and soft deletes

Any query touching tenant data must:

- **Scope by `organizationId`** (row-level tenant isolation)
- **Filter soft deletes** with `deletedAt: null` where applicable

Schema location: `packages/db/prisma/schema.prisma`.

### Auth and token handling

- Access tokens are **short-lived** (15 min). Always handle refresh flows.
- **Never store tokens in `localStorage`**. Use secure cookies (web) / SecureStore (mobile).

### QR security

- QR payloads must be **HMAC‑SHA256 signed** (no unsigned QRs).
- Scanner must preserve **`scanUuid` deduplication** contract for offline sync.

### Secrets and environment variables

- **Never commit** `.env` / `.env.local`.
- Prefer `.env.example` for variable keys only.
- If an env var is security-critical, prefer **hard fail** over unsafe defaults.

Reference: `docs/ENVIRONMENT_VARIABLES.md`, `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md`.

### Shared packages and imports

- Use workspace package imports (`@gate-access/db`, `@gate-access/types`, `@gate-access/ui`, …).
- Avoid duplicating shared utilities in apps if `packages/*` already owns them (e.g., `cn()` should come from `@gate-access/ui`).

---

## “Definition of done” for AI-assisted changes

- **Correctness**: Works for the intended role(s) and tenant scope.
- **Security**: No new unsafe defaults, no secrets in git, QR/auth invariants preserved.
- **Quality**: Lint + typecheck pass for touched workspaces; tests added/updated for critical logic.
- **Docs**: Update `docs/` when behavior or setup changes.

---

## Where to look first (fast navigation)

- **Phased plan + pro prompts**: `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
- **Commands, workflows, prompts**: `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md`
- **Product / requirements**: `docs/PRD_v5.0.md`, `docs/RESIDENT_PORTAL_SPEC.md`
- **System design**: `docs/APP_DESIGN_DOCS.md`, `docs/PROJECT_STRUCTURE.md`
- **Security model**: `docs/SECURITY_OVERVIEW.md`, `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md`
- **Roadmaps**: `docs/IMPROVEMENTS_AND_ROADMAP.md`, `docs/PHASE_2_ROADMAP.md`

