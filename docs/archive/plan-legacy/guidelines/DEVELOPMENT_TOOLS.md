# GateFlow — Development Tools Reference

**Purpose:** Single reference for all AI-assisted development tools used with GateFlow.

---

## Quick lookup

| Tool | Type | Primary use |
|------|------|-------------|
| **Cursor** | IDE | Main editor, inline AI, MCP, subagents |
| **Kiro** | IDE | Project-specific skills, steering rules, hooks |
| **Antigravity** | IDE | Alternative AI IDE |
| **Claude CLI** | CLI | Terminal Claude, quick Q&A, scripting |
| **Opencode CLI** | CLI | Code workflows, generation |
| **Gemini CLI** | CLI | Terminal Gemini access |
| **Kilo CLI** | CLI | Terminal AI workflows |

---

## IDEs

### Cursor

- **What:** AI-powered IDE built on VS Code
- **When to use:**
  - Primary coding environment for GateFlow
  - Inline AI edits, completions, and refactoring
  - MCP tool integration and subagents (explore, shell, browser-use)
  - `.cursor/rules/` and `.cursor/skills/` for project context
- **Project config:** `.cursor/rules/00-gateflow-core.mdc`, `01-gateflow-ai-workflow.mdc`
- **Reference:** `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md`

### Kiro

- **What:** AI IDE with skills, steering rules, and automation hooks
- **When to use:**
  - When you want domain-specific skills (architecture, security, database, testing, mobile)
  - Automated lint-on-save, prisma-generate, multi-tenant checks
  - Context-aware steering rules (Prisma, API, components)
- **Project config:** `.kiro/skills/`, `.kiro/steering/`, `.kiro/hooks/`
- **Reference:** `docs/plan/guidelines/REQUIRED_SKILLS_AND_AGENTS.md`

### Antigravity IDE

- **What:** Alternative AI-integrated IDE
- **When to use:**
  - If you prefer its workflow or model selection
  - For parallel work on different tasks
- **Tip:** Do **not** re-implement planning logic here. Instead:
  - Keep `.cursor/rules/` and `CLAUDE.md` in context — they apply across tools.
  - Index the full `docs/plan/` tree (especially `context/IDEA_<slug>.md`, `execution/PLAN_<slug>.md`, and `execution/PROMPT_<slug>_phase_<N>.md`).
  - Treat Cursor’s `/idea`, `/plan`, `/dev`, `/ship` commands as the **single source of truth** for plans and phases, and use Antigravity for additional reviews, experiments, or alternative implementations that still follow those plans and invariants.

---

## CLIs

### Claude CLI

- **What:** Terminal interface to Claude
- **When to use:**
  - Quick questions without opening an IDE
  - Scripting or automation with Claude
  - Batch processing, file analysis from the terminal
  - When you want Claude’s reasoning without editor integration

### Opencode CLI

- **What:** CLI for code-related AI workflows
- **When to use:**
  - Code generation or transformations from the command line
  - Integrations with other tools (scripts, CI, editors)
- **Tip:** Use GateFlow repo context (`CLAUDE.md`, `docs/`) for best results

### Gemini CLI

- **What:** Terminal interface to Gemini
- **When to use:**
  - Alternative model for certain tasks
  - Quick terminal-based prompting
  - When you prefer Gemini’s output style

### Kilo CLI

- **What:** CLI for AI-assisted workflows
- **When to use:**
  - Terminal-based AI tasks and automations
  - Lightweight prompts without starting an IDE

---

## How they fit together

```
┌─────────────────────────────────────────────────────────────────┐
│                        Development flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Primary IDE (Cursor / Kiro / Antigravity)                       │
│  ├── In-editor AI edits                                         │
│  ├── Project rules and skills                                   │
│  └── Subagents (Cursor) / Hooks (Kiro)                          │
│                                                                  │
│  CLIs (Claude / Opencode / Gemini / Kilo)                       │
│  ├── Quick questions and ad-hoc analysis                        │
│  ├── Scripts and automation                                     │
│  └── Alternative models or workflows                            │
│                                                                  │
│  Shared context: CLAUDE.md, docs/, .cursor/rules/, .kiro/       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Slash commands (Cursor chat)

Type `/` in Cursor chat.

- **Master commands (visible surface)**:
  - `/idea` — capture and refine initiatives into `IDEA_<slug>.md` + backlog entries.
  - `/plan` — turn an idea into a multi‑phase plan and phase prompts.
  - `/dev` — implement a single phase end‑to‑end.
  - `/ship` — run all remaining phases for a plan.
- **Internal flows (invoked by master commands; not primary entry points)**:
  - `ready` — preflight (git state + `pnpm preflight`) before `/dev` or `/ship`.
  - `github` — branching, commits, pushes, and PR flow for phases.
  - `docs` — documentation‑focused work.
  - `test` — test‑focused flows.
  - `clis` — coordinate Claude / Opencode / Gemini CLIs with Cursor.
  - `guide` — help navigating commands and workflows.

### Multi-CLI + Cursor workflow

Run Claude CLI, Opencode CLI, and Gemini CLI in separate terminals **while** editing in Cursor. Use for parallel tasks, multi-model consensus, and faster development. See `.cursor/skills/multi-cli-cursor-workflow/SKILL.md`.

### When to prefer which

| Situation | Prefer |
|-----------|--------|
| Day-to-day coding | Cursor or Kiro |
| Design exploration | SuperDesign (via Cursor skill) |
| Quick one-off question | Claude CLI or Gemini CLI |
| Lightweight terminal prompts, quick checks | Kilo CLI |
| Automated checks (lint, prisma, security) | Kiro hooks |
| Terminal-only workflow | Claude CLI, Opencode CLI, Gemini CLI, or Kilo CLI |
| Multi-step UI verification | Cursor browser-use subagent |
| Codebase exploration | Cursor explore subagent or Shell subagent |

---

## CLI Selection (Best Results)

Spread usage across CLIs to avoid rate limits, and pick the CLI that fits the task and model strength.

### By task complexity and model strength

| Task type | Simple | Medium | Complex |
|-----------|--------|--------|---------|
| **Security review** | Gemini | Claude | Claude (detailed audit) |
| **Prisma / DB query** | Gemini | Claude or Gemini | Claude |
| **Code generation** | OpenCode | OpenCode or Claude | Claude |
| **Architecture decision** | — | Claude | Claude |
| **Test generation** | Gemini | Claude | Claude |
| **Quick schema check** | Gemini | — | — |

### By model strength

| CLI | Strengths | Limits |
|-----|-----------|--------|
| **Claude** | Security audit, reasoning, detailed analysis, multi-step logic | Claude Pro quota |
| **Gemini** | Fast schema/query suggestions, code snippets, good at structure | Google One quota, retries on exhaust |
| **OpenCode** | Code workflows, file ops, multi-provider (can use different models) | — |

### Best practice

1. **Spread load** — Don't hammer one CLI. Rotate: Security → Claude; DB query → Gemini; Code gen → OpenCode.
2. **Match complexity** — Simple tasks → Gemini (fast, quota-friendly). Complex → Claude (depth). Code workflows → OpenCode.
3. **Fallback** — If one hits "exhausted capacity" or quota, switch to another. All use the same role prefixes for consistency.
4. **Critical decisions** — Run same prompt on 2 CLIs (e.g. Claude + Gemini), compare, then implement in Cursor.

---

## Repo rules (all tools)

Regardless of which tool you use, follow the same rules:

- **pnpm only** — never npm or yarn
- **Multi-tenancy** — always scope by `organizationId`, filter `deletedAt: null`
- **QR security** — HMAC-SHA256 signed payloads, preserve `scanUuid` dedup
- **Secrets** — never commit `.env` / `.env.local`
- **Shared packages** — use `@gate-access/*` imports

See `CLAUDE.md` and `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` for full details.

---

## Subagent hierarchy (all tools)

GateFlow uses a development-company-style subagent hierarchy. When using **any** CLI, prefix with the role for consistent quality. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

---

## Related docs

- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — Role definitions for Cursor + all CLIs
- `CLAUDE.md` — AI assistant guide, constraints
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — Cursor skills, subagents, rules
- `docs/plan/guidelines/REQUIRED_SKILLS_AND_AGENTS.md` — Human skills, Kiro config, roles

---

**Last Updated:** February 25, 2026
