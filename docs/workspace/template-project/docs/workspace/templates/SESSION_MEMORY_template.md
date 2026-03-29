# Session Memory — <slug>

> Auto-updated by `/dev` after each phase. Survives context resets.
> **Load this FIRST** at the start of every new session.

Save as: `docs/plan/{in-progress,done}/<slug>/SESSION_MEMORY.md`

---

## Active State

- **Phase:** Phase N — [title] | [in-progress | complete | blocked]
- **Branch:** `feat/<slug>`
- **Last commit:** `<hash>` — [message]
- **Next action:** [exact next step — specific enough to resume without re-reading the full plan]

---

## Cross-Session Decisions

| Phase | Decision               | Why      | Still valid? |
| ----- | ---------------------- | -------- | ------------ |
| N     | [e.g. Used X approach] | [reason] | Yes          |

---

## Discovered Gotchas

- [e.g. `SomeModel` → accessor is `someModel` not `some_model`]
- [e.g. Dialog needs conditional render, not `open` prop]

---

## State Handoff

- **Files modified this session:**
  - `path/to/file.ts` — [what changed]
- **Tests:** [all passing | N failing — describe]
- **Blockers:** [none | exact description with file:line]
- **Resume from:** [exact step from phase prompt]

---

## Context Budget

| Layer | File                 | Est. Tokens | Loaded |
| ----- | -------------------- | ----------- | ------ |
| L0    | git log --oneline -3 | ~50         | ✓      |
| L1    | TASKS\_<slug>.md     | ~150        | [ ]    |
| L2    | PLAN\_<slug>.md      | ~600        | [ ]    |
| L3    | PROMPT_phase_N.md    | ~1,200      | [ ]    |
| L4    | CONTEXT\_<slug>.md   | ~1,800      | [ ]    |
| L5    | SESSION_MEMORY.md    | ~400        | ✓      |

**Baseline:** L0+L1+L2+L5 ≈ 1,200t · **Phase:** +L3 ≈ 2,400t · **Schema:** +L4 ≈ 4,200t
