# Session Memory — <slug>

> Auto-updated by `/dev` after each phase. Survives context resets.
> **Load this FIRST** at the start of every new session — before reading any other plan file.

Save as: `docs/plan/{in-progress,done}/<slug>/SESSION_MEMORY.md`

---

## Active State

- **Phase:** Phase N — [title] | [in-progress | complete | blocked]
- **Branch:** `feat/<slug>`
- **Last commit:** `<hash>` — [commit message]
- **Next action:** [exact next step — specific enough to resume without re-reading the full plan]

---

## Cross-Session Decisions

> Architectural, tooling, or pattern decisions made during this plan. Reference before starting any phase.

| Phase | Decision                                         | Why                                         | Still valid? |
| ----- | ------------------------------------------------ | ------------------------------------------- | ------------ |
| N     | [e.g. Used `prisma.qRCode` casing]               | Prisma model name casing rule               | Yes          |
| N     | [e.g. Importing UnitType from `@gate-access/db`] | Re-exports Prisma enums via db/src/index.ts | Yes          |

---

## Discovered Gotchas

> Non-obvious behaviours, deviations from templates, patterns that burned us.

- [e.g. `QRCode` model → `prisma.qRCode` (not `prisma.qrCode`)]
- [e.g. Dialog from `@gate-access/ui` is a plain div — use conditional rendering, not `<Dialog open={open}>`]
- [e.g. Test files need `export {}` at top to avoid TS2451 redeclare errors]

---

## State Handoff

> Precise state so a new session (or new context window) can continue without confusion.

- **Files modified this session:**
  - `path/to/file1.ts` — [what changed]
  - `path/to/file2.tsx` — [what changed]
- **Tests:** [all passing | N failing — describe which and why]
- **Blockers:** [none | exact description with file:line]
- **Resume from:** [exact step number from phase prompt, or specific file:line to continue at]

---

## Context Budget (this session)

> Track what was loaded to avoid re-loading in the same session or over-loading in the next.

| Layer | File                                | Est. Tokens | Loaded |
| ----- | ----------------------------------- | ----------- | ------ |
| L0    | `git log --oneline -3` + phase name | ~50         | ✓      |
| L1    | `TASKS_<slug>.md`                   | ~150        | [ ]    |
| L2    | `PLAN_<slug>.md`                    | ~600        | [ ]    |
| L3    | `PROMPT_phase_N.md`                 | ~1,200      | [ ]    |
| L4    | `CONTEXT_<slug>.md`                 | ~1,800      | [ ]    |
| L5    | `SESSION_MEMORY.md` (this file)     | ~400        | ✓      |

**Baseline (always load):** L0 + L1 + L2 + L5 ≈ 1,200 tokens
**Phase execution (add):** + L3 ≈ 2,400 tokens total
**Schema/types work (add):** + L4 ≈ 4,200 tokens total
