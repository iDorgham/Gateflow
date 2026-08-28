# GateFlow Workspace — Commands & Workflow Guide

Reference for **GateFlow phased development**: commands, agents, skills, and sync. For a compact command list see [COMMAND_GUIDE.md](./COMMAND_GUIDE.md).

---

## AI tooling layout

| What               | Where                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Canonical source   | `.antigravity/` (tracked in git) with `.agents` (auto-symlink)                                        |
| IDE slash commands | `.cursor/commands/` and synced tool surfaces (from `pnpm sync`)                                       |
| Skills             | `.antigravity/skills/` (~80+ curated executable skills)                                               |
| Agents             | `.antigravity/agents/roles/`                                                                          |
| Sync               | `pnpm sync` → Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, Kilo CLI, and Qwen CLI |

> `.antigravity/` is tracked in version control as the canonical source. Fresh clones automatically restore the `.agents` symlink and sync all tools on `pnpm sync` (or automatically via CI).

**Sovereign / AIWF (separate):** `.ai/commands/` — content-factory commands; not the GateFlow `/dev` loop.

---

## Development lifecycle

### Workflow v2 pilot focus

Workflow v2 wraps the plan lifecycle with a fixed single-app state machine.
See [WORKFLOW_V2.md](./WORKFLOW_V2.md). A parked app cannot be planned or
developed while another app is uncertified.

### 1. Discovery & intent

- **`/idea <slug>`** — `docs/development/initiatives/IDEA_<slug>.md`
- **`/draft <slug>`** — `docs/plan/Draft/<slug>/DRAFT_<slug>.md`
- **`/draft <slug> c`** — refine draft in place (additive)

### 2. Planning

- **`/prompt <slug>`** — `FOR_PLAN_PROMPT.md`
- **`/plan <slug>`** — `PLAN_*.md`, `TASKS_*.md`, `phases/NN_*/PROMPT_*.md`
- **`/plan ready <slug>`** — Draft → Ready

### 3. Execution

- **`/dev`** — next incomplete phase (Ready → Active on start)
- **`/dev <n>`** — specific phase
- **`/dev loop`** — bounded approved plan-phase or task-contract controller
- **`/pilot loop`** — stricter pilot profile with certification and next-app gates
- **`/ship <slug>`** — all remaining phases

### 4. DevOps, PR Review & Merge Lifecycle

- **`/github` (or `/github ready`)** — Stage diff, run `pnpm pr:ready`, commit to `feat/<slug>`, and push to remote.
- **`/review <pr_number>`** — Open pull request and run 5-gate security, multi-tenancy, RTL, and performance audit.
- **Fix CI & Triage** — Inspect `gh pr checks`, resolve failing checks before merge.
- **`/review <pr_number> --merge`** — Coordinate safe squash merge into master once CI is 100% green.
- **`/docs` & `/version`** — Sync changelog, PRD, feature logs, and semantic release tags.
- **`/deploy <app>`** — Trigger production / staging deployments with pre-flight checks.

### 5. Guidance

- **`/guide`** — **router + coach** (Situation → Teach → Ask → Action → Motivate). Directs only; use **`/dev`** to execute.
- **`/man`** — seven-domain orchestrator (tasks, settings, mindset)

---

## `/guide` behavior

Two modes in one command (see local `.agents/workflows/guide.md` after sync):

1. **Router** — `/guide plan|phase|ready|…` fires the matching workflow.
2. **Coach** — bare `/guide` or “what should I do now” loads **`gf-guide`** and reports Must do / Recommended / Critical.

Preferences: `docs/development/learning/GUIDE_PREFERENCES.md`. Rule: local `.agents/rules/02-gateflow-guide.mdc`.

---

## Command table (synced set)

| Command       | Purpose                  |
| ------------- | ------------------------ |
| `/idea`       | Capture initiative       |
| `/draft`      | Pre-plan notes           |
| `/prompt`     | Handoff file for `/plan` |
| `/plan`       | Phased plan generation   |
| `/dev`        | One phase implementation |
| `/ship`       | Full plan execution      |
| `/guide`      | Router + coach           |
| `/man`        | One Man orchestrator     |
| `/brainstorm` | Strategic roadmap        |
| `/creative`   | Creative direction       |
| `/deploy`     | Deploy apps              |
| `/docs`       | Documentation sync       |
| `/version`    | Versioning / tags        |
| `/organize`   | Docs cleanup             |
| `/clis-team`  | Multi-CLI teams          |
| `/ralph`      | Bounded all-phase alias  |

---

## Agents (roles)

Under local `.agents/agents/roles/` (after sync):

| Role               | Focus                    |
| ------------------ | ------------------------ |
| `planning`         | Phased plans             |
| `architecture`     | Monorepo / system design |
| `frontend`         | UI, ADS, i18n            |
| `backend-api`      | API routes, auth, Zod    |
| `backend-database` | Prisma, migrations       |
| `security`         | RBAC, QR, tenant scope   |
| `mobile`           | Expo / scanner           |
| `qa`               | Tests                    |
| `devops`           | CI/CD, deploy            |
| `explore`          | Codebase discovery       |

Scenarios: `code-review`, `security-audit`, `refactor`. Orchestrator: local `.agents/agents/orchestrator.md`.

---

## Key skills

| Skill                  | Role                             |
| ---------------------- | -------------------------------- |
| **`gf-guide`**         | Workspace guide — `/guide` brain |
| **`source-command-*`** | Per-command workflow helpers     |
| **`cli-limits`**       | 80% CLI quota rule               |
| **`security`**         | Auth, RBAC, QR                   |
| **`api`**              | Next.js API patterns             |
| **`database`**         | Prisma, multi-tenancy            |
| **`one-man`**          | `/man` orchestrator              |

Full index: [SKILLS_GUIDE.md](./SKILLS_GUIDE.md).

---

## Operational rules

1. **80% CLI rule** — check `CLI_LIMITS_TRACKING.md` before paid CLIs.
2. **Multi-tenancy** — `organizationId` + `deletedAt: null` on tenant data.
3. **QR security** — HMAC-SHA256 signed payloads only.
4. **Verification** — `pnpm preflight` before considering work done.
5. **Plan moves** — update `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
6. **Sync after AI edits** — change `.agents/` then `pnpm sync`.

---

## Terminal essentials

| Command          | Purpose                              |
| ---------------- | ------------------------------------ |
| `pnpm sync`      | Propagate `.agents/` to all AI tools |
| `pnpm preflight` | Lint + typecheck + test              |
| `pnpm turbo dev` | Dev all apps                         |

---

> Use **`/guide`** when unsure of the next step. It scans plan folders and git state, then gives one copy-ready command.
