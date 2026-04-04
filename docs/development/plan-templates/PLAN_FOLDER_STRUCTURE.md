# GateFlow plan folder structure — canonical reference

Every new plan created by **`/plan`** follows this structure. Matches **`resident_portal_responsive`**, **`scanner_onboarding_session`**, **`org_types_dashboard`**, **`gateflow_design_system`**.

Lifecycle folders: `Draft/<slug>/` → `Ready/<slug>/` → `Active/<slug>/` → `Complete/<slug>/` (see `docs/development/PLAN_LIFECYCLE.md`).

---

## Folder layout

```
docs/plan/<lifecycle>/<slug>/
├── PLAN_<slug>.md                 # Master: phases, deps, risks, roadmap table
├── TASKS_<slug>.md                # Flat checkbox list; tick per phase/part
├── PLAN_FEEDBACK.md               # Plan improvements; skills/agents to add (see templates/PLAN_FEEDBACK_template.md)
├── CONTEXT_<slug>.md              # Frozen snapshot: schema excerpt, types, env (L4 load)
├── SESSION_MEMORY.md              # Optional until first /dev; template: templates/SESSION_MEMORY_template.md
├── context/                       # Plan-local working references (populate during planning / dev)
│   ├── README.md                  # Index of context files
│   ├── api.md                     # API routes, payloads, links to handlers
│   ├── contracts.md               # Security, tenancy, Zod, auth checklist pointers
│   ├── database.md                # Prisma models, migrations, seeds
│   ├── design.md                  # UI/UX, tokens, motion, RTL
│   ├── structure.md               # Monorepo paths, package boundaries
│   └── documentation.md           # PRD paths, guides, external docs
├── phase_logs/                    # Mandatory after each /dev phase
│   ├── README.md                  # What to capture
│   └── PHASE_LOG_phase_NN.md      # One file per phase (errors, fixes, flaky tests)
├── phases/
│   ├── 01_<phase-title>/
│   │   ├── PROMPT_phase_01.md              # or PROMPT_phase_01_part_a.md …
│   │   └── files/                          # Scaffolds (schema patch, types, templates)
│   ├── 02_<phase-title>/
│   │   └── PROMPT_phase_02.md
│   └── 03_<phase-title>/
│       ├── PROMPT_phase_03_part_a.md
│       └── PROMPT_phase_03_part_b.md
└── assets/
    ├── README.md                  # Optional ADRs, diagrams
    └── ARCH_NOTES.md              # Architecture decisions (complex initiatives)
```

**Do not** place phase prompts at the plan root (legacy `PROMPT_<slug>_phase_N.md` is deprecated). `/dev` resolves `phases/NN_<title>/PROMPT_phase_NN.md` first.

---

## File responsibilities

| Path                               | Purpose                                        | Required?                           |
| ---------------------------------- | ---------------------------------------------- | ----------------------------------- |
| `PLAN_<slug>.md`                   | Phases, roles, deps, prompt path table         | Always                              |
| `TASKS_<slug>.md`                  | Execution checklist                            | Always                              |
| `PLAN_FEEDBACK.md`                 | Plan edits + workspace skill/agent suggestions | Always (may be stub)                |
| `CONTEXT_<slug>.md`                | Compact frozen context for AI (L4)             | Strongly recommended                |
| `context/*`                        | Deep links + notes by concern (api, db, …)     | Create at `/plan`; refine in `/dev` |
| `phase_logs/PHASE_LOG_phase_NN.md` | Post-phase errors & resolutions                | **After every `/dev` phase**        |
| `phases/NN_<title>/`               | One folder per phase, zero-padded              | Always                              |
| `PROMPT_phase_NN.md`               | Phase pro prompt from template                 | Per phase (or parts)                |
| `phases/.../files/`                | Patches/scaffolds                              | When phase needs them               |
| `assets/ARCH_NOTES.md`             | ADRs                                           | When architecture is non-trivial    |

---

## Scaffold commands (`/plan`)

```bash
SLUG=<slug>
BASE=docs/plan/Draft/$SLUG
mkdir -p "$BASE/context" "$BASE/phase_logs" "$BASE/assets" "$BASE/phases"
# For each phase:
mkdir -p "$BASE/phases/NN_<title>/files"
touch "$BASE/context/README.md" "$BASE/phase_logs/README.md"
```

Copy context stubs from an existing plan or from this doc’s table. Seed `phase_logs/README.md` with the standard instructions (see `org_types_dashboard/phase_logs/README.md`).

---

## Phase splitting rules

(Same as before.)

| Condition                                  | Action                     |
| ------------------------------------------ | -------------------------- |
| Phase has **> 5** implementation steps     | Split at logical boundary  |
| **> 3** distinct areas (schema + API + UI) | Split by concern           |
| Prompt **> ~700 words**                    | Split into ~600-word parts |
| Spans **multiple** apps/packages           | Split by package           |

Part naming: `part_a` foundation → `part_b` core → `part_c` UI → `part_d` tests (if huge).

---

## Tool selection matrix (quality vs cost)

Every phase prompt specifies **Tool 1** (best quality) and **Tool 2** (free/cheaper fallback).

| Phase domain             | Tool 1              | Tool 2 (free/cheaper) | Switch to T2 when        |
| ------------------------ | ------------------- | --------------------- | ------------------------ |
| Security / Auth / RBAC   | Claude Code CLI     | Cursor                | Claude at 80%+ limit     |
| DB schema / Prisma       | Cursor              | Gemini CLI (free)     | Second opinion on schema |
| API routes (complex)     | Claude Code CLI     | Cursor                | Claude at limit          |
| API routes (routine)     | Cursor              | OpenCode CLI (free)   | Budget day               |
| Frontend / UI            | Cursor              | OpenCode CLI (free)   | Simple UI                |
| Architecture / reasoning | Claude Code CLI     | Gemini CLI (free)     | Claude at limit          |
| Test generation          | Gemini CLI (free)   | Cursor                | —                        |
| Mobile / Expo            | Cursor              | Qwen CLI (free)       | Large scan               |
| DevOps / CI              | Kilo CLI (free)     | Cursor                | —                        |
| Code review / audit      | Claude Code CLI     | Kiro CLI (free)       | Claude at limit          |
| Large codebase scan      | Kiro CLI (free)     | Qwen CLI (free)       | —                        |
| i18n / RTL               | Cursor              | Kiro CLI (free)       | Budget day               |
| Refactoring              | OpenCode CLI (free) | Cursor                | —                        |

**Cost tiers:** Free — Kiro, Kilo, Qwen, OpenCode, Gemini (free tier). Paid — Claude Code, Cursor Pro, Gemini paid.

---

## CONTEXT\_<slug>.md template

```markdown
# Context snapshot — <slug>

> Frozen at: <date>. Update when schema or contracts change.

## Relevant schema / types

...

## Environment variables

...

## Key file paths

...

## External APIs

...
```

---

## TASKS\_<slug>.md template

```markdown
# Tasks — <slug>

## Phase 1: <title>

- [ ] …
- [ ] phase_logs/PHASE_LOG_phase_01.md updated

## Final

- [ ] All phases green; pnpm preflight
- [ ] CONTEXT\_<slug>.md refreshed if needed
```

---

## Lifecycle

`/plan` → `Draft/`  
`/plan ready` → `Ready/`  
`/dev` start → `Active/`  
Last phase done → `Complete/`

The **whole directory** (including `context/`, `phase_logs/`, `phases/`) moves together. See `.antigravity/commands-ref/plan-move.md`.

---

## Pre-plan capture

- **`/draft <slug>`** — `DRAFT_<slug>.md` under `Draft/<slug>/`
- **`/prompt <slug>`** — `FOR_PLAN_PROMPT.md` handoff for `/plan`

---

## Archived plans

Under **`Complete/<slug>/`**, some older initiatives keep flat `PROMPT_<slug>_phase_N.md` next to `PLAN_<slug>.md`. **New** plans must use `phases/NN_<title>/PROMPT_phase_NN.md` only.
