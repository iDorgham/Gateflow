# GateFlow — Phased Development Workflow

**Purpose:** Subagent + workflow to create a plan, write comprehensive pro prompts per phase, apply them one by one, test and enhance after each phase, then proceed to the next.

---

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASED DEVELOPMENT CYCLE                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. PLAN     → Create plan + tasks from goal/backlog                         │
│  2. WRITE    → Turn each phase into a comprehensive pro prompt               │
│  3. EXECUTE  → Apply prompt N → Test → Enhance → ✓ Phase N done              │
│  4. REPEAT   → Next phase until all done                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Planning Subagent

### When to use

- User requests a **plan** or **task breakdown** for a feature, Epic, or phase
- Starting a **multi-step initiative** (e.g. Resident Portal, MVP launch)
- Need to **decompose** `ALL_TASKS_BACKLOG.md` into executable phases

### Invocation (copy/paste)

Use a **general-purpose** or **explore** subagent with this prompt:

```
You are the GateFlow Planning Subagent. Your job is to create an executable plan.

CONTEXT:
- Project: GateFlow (Zero-Trust digital gate platform, Turborepo monorepo)
- Docs: CLAUDE.md, docs/plan/backlog/ALL_TASKS_BACKLOG.md
- Stack: Next.js 14, Expo SDK 54, Prisma 5, PostgreSQL, pnpm

TASK:
Create a phased development plan for: [GOAL / EPIC / BACKLOG SECTION]

OUTPUT FORMAT:
1. **Plan summary** (2–3 sentences)
2. **Phases** (ordered, each phase = one executable unit):
   - Phase N: [Title]
   - Scope: [What exactly is in this phase]
   - Deliverables: [Concrete outputs]
   - Depends on: [Prior phases, if any]
   - Test criteria: [How to verify this phase is done]
3. **Dependencies**: Files, packages, APIs touched per phase
4. **Risks / blocking items**: If any

Each phase should be:
- Small enough to implement in one focused session
- Testable independently
- Orderable (phase 2 can start after phase 1 tests pass)

Return the plan as structured markdown.
```

### Planning subagent prompt (alternate – from backlog)

```
Read docs/plan/backlog/ALL_TASKS_BACKLOG.md and docs/plan/phase-2-resident-portal/specs/RESIDENT_PORTAL_SPEC.md.

Create a phased plan for [MVP Launch / Resident Portal Phase 2 / etc.]:
- Break into 4–8 phases
- Each phase: clear scope, deliverables, test criteria
- Order by dependency (schema before API, API before UI)
- Output in markdown suitable for docs/plan/execution/PLAN_<name>.md
```

---

## 2. Pro Prompt Template (per phase)

Each phase is executed by a **comprehensive pro prompt** — self-contained, unambiguous, and actionable.

### Template structure

```markdown
## Phase N: [Title]

### Primary role
[From SUBAGENT_HIERARCHY: SECURITY | BACKEND-API | FRONTEND | etc.]

### Context
- GateFlow monorepo: apps/client-dashboard, admin-dashboard, scanner-app, packages/db, types, ui
- Rules: pnpm only, multi-tenant (organizationId), soft deletes (deletedAt: null), QR HMAC-SHA256
- Reference: CLAUDE.md, packages/db/prisma/schema.prisma

### Goal
[One clear sentence: what this phase must achieve]

### Scope (in)
- [Item 1]
- [Item 2]
- [Item 3]

### Scope (out)
- [Explicitly exclude] — do not touch [X]

### Steps (ordered)
1. [Concrete step with file paths]
2. [Concrete step]
3. [Add/update tests for...]
4. [Run pnpm preflight for affected workspace]

### SuperDesign (optional — for UI phases)
When the phase adds or redesigns UI, add SuperDesign *before* implementation:
- **New page**: `create-design-draft` with intent and `--context-file`
- **Redesign**: `iterate-design-draft` with improvement prompts, `--mode branch`
- Ensure `.superdesign/init/` exists; use draft output to guide implementation.

### Subagents (optional)
When the phase needs exploration or verification, add:
- **explore**: "Trace flow for [X]...", "Find all [symbol] usages..."
- **shell**: "Run pnpm preflight...", "Run prisma migrate dev..."
- **browser-use**: "Login at localhost:3001, verify [behaviors]..."

See `.cursor/skills/gf-planner/SKILL.md` for full prompt templates.

### Acceptance criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] pnpm turbo lint --filter=<workspace> passes
- [ ] pnpm turbo test --filter=<workspace> passes (or no regression)

### Files likely touched
- path/to/file1.ts
- path/to/file2.tsx
```

### Example (Phase 1: Add Unit model)

```markdown
## Phase 1: Add Unit model to Prisma schema

### Context
- packages/db/prisma/schema.prisma
- Reference: docs/plan/phase-2-resident-portal/specs/RESIDENT_PORTAL_SPEC.md
- Rules: soft delete, organizationId, cuid

### Goal
Add `Unit` model and `UnitType` enum to support resident–unit linking.

### Scope (in)
- Unit model with: id, organizationId, name, unitType, deletedAt, timestamps
- UnitType enum: STUDIO, ONE_BEDROOM, TWO_BEDROOM, THREE_BEDROOM, PENTHOUSE
- Indexes: organizationId, deletedAt
- Relation to Organization

### Scope (out)
- No API routes, no UI — schema only

### Steps
1. Edit packages/db/prisma/schema.prisma: add UnitType enum
2. Add Unit model with fields per RESIDENT_PORTAL_SPEC
3. Run pnpm db:generate
4. Run npx prisma migrate dev --name add_unit
5. Run pnpm turbo build to confirm no breakage

### Acceptance criteria
- [ ] Unit model exists with correct fields
- [ ] Migration created and applied
- [ ] pnpm turbo build passes
```

---

## 3. Phased Execution Workflow

### Step-by-step (per phase)

| Step | Action | Command / tool |
|------|--------|----------------|
| 1 | **Get the pro prompt** | From plan doc or `docs/plan/execution/PROMPT_phase_N.md` |
| 2 | **Apply** | Paste prompt into Cursor; execute |
| 2a | **SuperDesign** (if UI phase) | Run design draft first; use output to guide implementation. See `superdesign` skill |
| 2b | **Subagents** (if specified) | Invoke explore/shell/browser-use with prompts from phase |
| 2c | **Multi-CLI** (optional, complex phases only) | Claude Pro has limits — use only for security-critical, architectural, or high-risk phases. See `gf-planner` skill |
| 3 | **Test** | `pnpm turbo test --filter=<workspace>` |
| 4 | **Lint / typecheck** | `pnpm turbo lint --filter=<workspace>` and `pnpm turbo typecheck --filter=<workspace>` |
| 5 | **Enhance** | Fix failures; add missing tests; improve edge cases |
| 6 | **Verify** | `pnpm preflight` if full regression check needed |
| 7 | **Commit** | `git add ... && git commit -m "Phase N: [title]"` |
| 8 | **Next** | Proceed to Phase N+1 |

### Loop (visual)

```
Phase N pro prompt
        │
        ▼
┌───────────────┐
│ Apply prompt  │
└───────┬───────┘
        │
        ▼
┌───────────────┐     fail
│ Run tests     │─────────────┐
└───────┬───────┘             │
        │ pass                 ▼
        │              ┌───────────────┐
        │              │ Enhance       │
        │              │ (fix, tests)  │
        │              └───────┬───────┘
        │                      │
        │                      └──────────► (retry tests)
        │
        ▼
┌───────────────┐
│ Lint/typecheck│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Commit Phase N│
└───────┬───────┘
        │
        ▼
  Phase N+1
```

### Exit conditions (EC rules)

Treat these as **hard gates** for `/dev` phases and `/ship` plans — tools must not mark work complete unless the relevant EC rule is satisfied.

- **Phase done (EC‑phase)**:
  - All items in the phase’s **Acceptance criteria** section are checked off.
  - Required checks are green for the affected workspace(s): tests, lint, typecheck (or `pnpm preflight` when specified).
  - Changes for the phase are committed to git (one reviewable commit per phase is preferred).
- **Plan done (EC‑plan)**:
  - Every phase in `PLAN_<slug>.md` has satisfied **EC‑phase** and is committed.
  - Any follow‑up work discovered during phases is captured in `ALL_TASKS_BACKLOG.md` or a new plan instead of silently skipping it.
- **Blocked (EC‑blocked)**:
  - The reason the phase cannot currently satisfy **EC‑phase** is written down (in the plan, backlog, or a linked doc).
  - Follow‑up todos are created for the blocker.
  - The phase is **not** marked done until EC‑phase can be satisfied; tools should pause or reschedule rather than silently proceeding.

---

## 4. Commands for Phased Workflow

### Create plan (invoke planning subagent)

Use the **Planning subagent** prompt above (Section 1) with your goal. Save output to:

```
docs/plan/execution/PLAN_<initiative>.md
```

### Create pro prompts from plan

For each phase in the plan, create:

```
docs/plan/execution/PROMPT_<initiative>_phase_<N>.md
```

Use the **Pro Prompt Template** (Section 2).

### Execute phase N

1. Open `docs/plan/execution/PROMPT_<initiative>_phase_<N>.md`
2. Copy full content
3. Paste into Cursor (or your AI tool) as the task
4. Let the agent implement
5. Run tests and enhance until pass
6. Commit

### Pre-phase check

```bash
pnpm install          # Ensure deps current
pnpm db:generate     # If schema may have changed
```

### Post-phase check

```bash
pnpm turbo test --filter=<workspace>
pnpm turbo lint --filter=<workspace>
pnpm turbo typecheck --filter=<workspace>
# Or: pnpm preflight
```

---

## 5. Directory Layout

```
docs/plan/
├── backlog/
│   └── ALL_TASKS_BACKLOG.md      # Source of tasks
├── execution/
│   ├── PLAN_<initiative>.md      # Phased plan (output of planning subagent)
│   └── PROMPT_<initiative>_phase_<N>.md   # Pro prompts per phase
├── guidelines/
│   └── PHASED_DEVELOPMENT_WORKFLOW.md   # This doc
└── phase-2-resident-portal/
    └── specs/
        └── RESIDENT_PORTAL_SPEC.md
```

---

## 6. Quick Reference

| I want to… | Do this |
|------------|---------|
| Create a plan from backlog | Use **Planning subagent** prompt (Section 1); save to `docs/plan/execution/PLAN_<name>.md` |
| Write a pro prompt for phase | Use **Pro Prompt Template** (Section 2); save to `PROMPT_<name>_phase_N.md` |
| Execute one phase | Paste pro prompt → implement → test → enhance → commit |
| Run full phased cycle | For each phase: apply → test → enhance → commit → next |

---

## 7. Related

- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — Role definitions for Cursor and all CLIs
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — Commands, workflows, subagent prompts
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — All subagents
- `.cursor/skills/gf-planner/SKILL.md` — Planning skill (SuperDesign, subagents, multi-CLI)
- `.cursor/skills/superdesign/SKILL.md` — UI/UX design before implementation
- `.cursor/skills/multi-cli-cursor-workflow/SKILL.md` — Claude/Opencode/Gemini CLI alongside Cursor
- `.cursor/templates/TEMPLATE_PROMPT_phase.md` — Phase template with subagents section
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — Task source

---

**Last Updated:** February 25, 2026
