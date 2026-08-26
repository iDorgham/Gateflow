# Orchestrator Agent

**Purpose:** Decision rules for when to invoke subagents, MCP, or multi-CLI. Use when the main agent needs to delegate or choose tools.

## When to Invoke Subagents

| Subagent        | Invoke when                                                  | Skip when                          |
| --------------- | ------------------------------------------------------------ | ---------------------------------- |
| **explore**     | Phase needs codebase discovery; flow tracing; refactor scope | Straightforward single-file change |
| **shell**       | Preflight, migrate, test run, build                          | No commands needed                 |
| **browser-use** | UI verification after changes; login flow; i18n/RTL check    | Backend-only phase                 |

## When to Use MCP

| MCP                    | Use when                                | Skip when                               |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| **Prisma-Local**       | Schema change, migration, Prisma Studio | No DB work                              |
| **Context7**           | Unsure about React/Next.js/Prisma API   | Familiar pattern                        |
| **cursor-ide-browser** | E2E verification; single-page check     | Complex multi-step (prefer browser-use) |
| **GitHub**             | Create PR, check status                 | Manual git flow                         |

## When to Use CLIs (including Multi-CLI)

**One primary writer:** the active workspace agent decides when to use a CLI or
team. Parallelize independent read-only discovery/review, keep one writer per
phase, and aggregate one result packet before changes. CLI outputs are proposals
until the primary writer applies and verifies them. Use
`/clis-team` for predefined teams.

**Competition:** For non-escalation work, CLIs can be compared over time (see `CLI_USAGE_AND_RESULTS.md` and `CLI_TOOL_MEMORY.md`). Prefer the tool with better outcomes for that task type, subject to the 80% rule.

**Claude escalation-only:** Suggest or use **Claude CLI** only for the **hardest** tasks (security audit, architecture deep-dive, high-risk refactors). Claude is **excluded from competition scoring**; it is the specialist for when other tools are not enough.

**Mandatory limits + permission rule (80%):**

- Load `.agents/skills/cli-limits/SKILL.md` and check:
  - `docs/development/learning/GUIDE_PREFERENCES.md`
  - `docs/development/learning/CLI_LIMITS_TRACKING.md` (if present)
- If a CLI is at **80%+** of its limit, **do not use or recommend it** unless the user has given **explicit permission**. Prefer free-tier CLIs or Cursor.

**Mandatory learning (after any CLI usage):**

- Append one entry to `docs/development/learning/CLI_USAGE_AND_RESULTS.md` (date | CLI | task/phase | outcome | notes).
- For durable “what we learned”, optionally update `docs/development/learning/CLI_TOOL_MEMORY.md` (or use `.agents/skills/cli-memory/SKILL.md`).

| Use multi-CLI when                              | Skip when        |
| ----------------------------------------------- | ---------------- |
| Security-critical phase (auth, RBAC, QR)        | Routine CRUD     |
| Architectural decision                          | Simple UI tweak  |
| Complex business logic (offline sync, conflict) | Config change    |
| High-risk refactor                              | Standard pattern |

**Claude Pro limits:** Reserve multi-CLI for phases where a second opinion materially reduces risk.

## Role Assignment (Phase → Agent)

| Phase domain           | Adopt agent      | From                        |
| ---------------------- | ---------------- | --------------------------- |
| Plan, phases           | planning         | `roles/planning.md`         |
| Cross-app, conventions | architecture     | `roles/architecture.md`     |
| Auth, RBAC, QR         | security         | `roles/security.md`         |
| Schema, migrations     | backend-database | `roles/backend-database.md` |
| API routes             | backend-api      | `roles/backend-api.md`      |
| UI, components         | frontend         | `roles/frontend.md`         |
| Scanner, offline       | mobile           | `roles/mobile.md`           |
| Tests                  | qa               | `roles/qa.md`               |
| AR/EN, RTL             | i18n             | `roles/i18n.md`             |
| Build, migrate         | devops           | `roles/devops.md`           |
| Discovery              | explore          | `roles/explore.md`          |

## Flow

1. User starts phase or task
2. Identify primary domain → adopt role agent
3. If phase specifies subagents → invoke with prompts from `.antigravity/templates/subagents/`
4. If schema/DB → use Prisma-Local MCP
5. If docs needed → use Context7 MCP
6. If complex/high-risk → consider multi-CLI
7. After implementation → shell subagent for preflight
