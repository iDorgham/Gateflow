# GateFlow Plan Folder Structure — Canonical Reference

Every new plan created by `/plan` follows this structure exactly.

---

## Folder Layout

```
docs/plan/planning/<slug>/
├── PLAN_<slug>.md              # Master overview: phases, deps, risks, timeline
├── TASKS_<slug>.md             # Flat checklist tracking all phases + parts
├── CONTEXT_<slug>.md           # Frozen context snapshot (schema, types, env vars)
├── phases/
│   ├── 01_<phase-title>/
│   │   ├── PROMPT_phase_01.md              # Full prompt (if phase fits in one)
│   │   ├── PROMPT_phase_01_part_a.md       # OR Part A when phase is long
│   │   ├── PROMPT_phase_01_part_b.md       # Part B (continues from A)
│   │   ├── PROMPT_phase_01_part_c.md       # Part C (if needed)
│   │   └── files/                          # Code scaffolds for this phase
│   │       ├── schema.patch.prisma         # Schema additions/changes
│   │       ├── types.patch.ts              # Type definitions
│   │       └── api_route_template.ts       # Route scaffold
│   ├── 02_<phase-title>/
│   │   └── PROMPT_phase_02.md
│   └── 03_<phase-title>/
│       ├── PROMPT_phase_03_part_a.md
│       └── PROMPT_phase_03_part_b.md
└── assets/
    └── ARCH_NOTES.md           # Architecture decisions, diagrams, ADRs
```

---

## File Responsibilities

| File                        | Purpose                                            | Required?           |
| --------------------------- | -------------------------------------------------- | ------------------- |
| `PLAN_<slug>.md`            | All phases with scope, deps, deliverables          | Always              |
| `TASKS_<slug>.md`           | Flat checkbox list, updated as phases complete     | Always              |
| `CONTEXT_<slug>.md`         | Schema excerpt, key types, env vars for AI context | Recommended         |
| `phases/NN_<title>/`        | One folder per phase, numbered 01, 02, ...         | Always              |
| `PROMPT_phase_NN.md`        | Full phase prompt (single part)                    | One or parts        |
| `PROMPT_phase_NN_part_a.md` | Part A of a long phase                             | When phase is split |
| `files/`                    | Scaffolded code, schema patches, templates         | When phase has code |
| `assets/ARCH_NOTES.md`      | Architecture decisions for complex initiatives     | Recommended         |

---

## Phase Splitting Rules

Split a phase into parts when **any** of these are true:

| Condition                                                | Action                         |
| -------------------------------------------------------- | ------------------------------ |
| Phase has **> 5 implementation steps**                   | Split at logical boundary      |
| Phase touches **> 3 distinct areas** (schema + API + UI) | Split by concern               |
| Estimated prompt > **700 words**                         | Split into 600-word parts      |
| Phase spans **multiple apps** or packages                | Split by app/package           |
| Phase mixes **DB work + frontend work**                  | Always split (different tools) |

### Part naming

- `part_a` — Foundation (schema, types, utilities)
- `part_b` — Core logic (API, services, hooks)
- `part_c` — UI & integration
- `part_d` — Tests & verification (if large test suite)

---

## Tool Selection Matrix (Quality vs Cost)

Every phase prompt specifies **Tool 1** (best quality) and **Tool 2** (best value/free fallback).

| Phase Domain                     | Tool 1              | Tool 2 (Free/Cheaper) | Switch to T2 when          |
| -------------------------------- | ------------------- | --------------------- | -------------------------- |
| Security / Auth / RBAC           | Claude Code CLI     | Cursor                | Claude at 80%+ limit       |
| DB Schema / Prisma               | Cursor              | Gemini CLI (free)     | Want 2nd opinion on schema |
| API routes (complex)             | Claude Code CLI     | Cursor                | Claude at limit            |
| API routes (routine CRUD)        | Cursor              | OpenCode CLI (free)   | Budget day                 |
| Frontend / UI / Components       | Cursor              | OpenCode CLI (free)   | Simple/routine UI          |
| Complex reasoning / Architecture | Claude Code CLI     | Gemini CLI (free)     | Claude at limit            |
| Test generation                  | Gemini CLI (free)   | Cursor                | Always try T1 first        |
| Mobile / Expo                    | Cursor              | Qwen CLI (free)       | Large context scan         |
| DevOps / CI / Infra              | Kilo CLI (free)     | Cursor                | N/A (always use T1)        |
| Code review / Audit              | Claude Code CLI     | Kiro CLI (free)       | Claude at limit            |
| Large codebase scan              | Kiro CLI (free)     | Qwen CLI (free)       | N/A (always free)          |
| i18n / RTL                       | Cursor              | Kiro CLI (free)       | Budget day                 |
| Refactoring                      | OpenCode CLI (free) | Cursor                | N/A (always free T1)       |

**Cost tiers:**

- Free: Kiro CLI, Kilo CLI, Qwen CLI, OpenCode CLI, Gemini CLI (free tier)
- Paid ($20): Claude Code CLI, Cursor Pro, Gemini CLI (paid quota)

---

## CONTEXT\_<slug>.md Template

````markdown
# Context Snapshot — <slug>

> Frozen at: <date>. Re-generate with `/plan context <slug>` if schema changes.

## Relevant Schema Models

```prisma
// Paste relevant model definitions here
```
````

## Key Types

```typescript
// Paste key types/interfaces here
```

## Environment Variables (for this feature)

| Variable   | Purpose     | Required |
| ---------- | ----------- | -------- |
| `VAR_NAME` | Description | Yes/No   |

## Key File Paths

- `apps/client-dashboard/src/...` — description
- `packages/db/prisma/schema.prisma` — full schema

## External Dependencies / APIs

- List any 3rd party services this feature touches

````

---

## TASKS_<slug>.md Template

```markdown
# Tasks — <slug>

## Phase 1: <title>
- [ ] Part A: <scope>
- [ ] Part B: <scope>
- [ ] Phase 1 acceptance criteria verified

## Phase 2: <title>
- [ ] <scope>
- [ ] Phase 2 acceptance criteria verified

## Final
- [ ] All phases green
- [ ] pnpm preflight passes
- [ ] PR created and reviewed
````

---

## Lifecycle Transitions

When `/plan` creates files, they go in `planning/<slug>/`.
When user approves: `/plan ready <slug>` → moves to `planned/<slug>/`.
When `/dev` starts: moves to `in-progress/<slug>/`.
When last phase done: moves to `done/<slug>/`.

The entire `phases/` subfolder and `assets/` move with the plan.
