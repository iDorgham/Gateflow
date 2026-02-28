# Progress dashboard — core_security_v6

**Open this file to decide:** repeat dev loop vs start Phase 4 before sleep, and what to do when you wake up.

---

## Quick status

| Item | Status |
|------|--------|
| **Plan** | core_security_v6 (Phases 1–3 done, 4–6 remaining) |
| **Next phase** | **Phase 4** — Location rule (optional) |
| **Last completed** | Phase 3 — Gate-assignment dashboard UI + scanner UX |
| **Branch** | master (keep pushed and clean before starting loop) |

---

## Before you sleep — decide

### Option A: Start Phase 4 now (one phase tonight)

- Run **`/dev`** in Cursor and say: **"Execute Phase 4 of plan core_security_v6"** (or "Phase 4").
- Cursor will use `PROMPT_core_security_v6_phase_4.md`, implement, run checks, commit and push.
- **Before sleep:** Either wait for Phase 4 to finish, or leave it running and check in the morning.

**Choose this if:** You want exactly one phase done tonight and to continue with Phase 5 after you wake.

---

### Option B: Start the automated dev loop (repeat until plan done)

- Run **`/ready`** once (or `pnpm preflight`) so the repo is clean and green.
- In Cursor chat, paste this and send:

```
Follow plan core_security_v6. Run /dev for the next incomplete phase (Phase 4).
When that phase is done (acceptance criteria met, committed, pushed), run /dev again for the next phase.
Repeat until the plan is complete or a phase is blocked. If blocked, list the blocker and stop.
```

- **Leave Cursor open** (and machine on if you want it to keep running).
- The agent will run Phase 4 → Phase 5 → Phase 6 until done or blocked.

**Choose this if:** You want the maximum progress overnight without coming back between phases.

---

### Option C: Don’t start anything — just continue when you wake

- Do nothing tonight.
- When you wake, open this file and go to **When you wake up** below.

---

## When you wake up

1. **Open this file** and the **task list**:
   - `docs/plan/execution/TASKS_core_security_v6.md`

2. **Check git and dashboard:**
   - `git status` — any uncommitted work?
   - `git log -1 --oneline` — last commit (e.g. Phase 4 or 5).

3. **Decide:**
   - **If Phase 4 is done** (see TASKS: Phase 4 all checked): Run **`/dev`** and say **"Execute Phase 5"** (or run the loop instruction again so it continues with Phase 5).
   - **If Phase 4 (or 5/6) is in progress or failed:** Check Cursor chat or terminal for errors. Fix any blocker, then run **`/dev`** again for that same phase.
   - **If the loop stopped with a blocker:** Read the agent’s last message for the blocker; fix it, then run **`/dev`** for the same phase number or re-paste the loop instruction.

4. **Optional:** Run **`/guide`** for “what should I do now?” and next steps.

---

## File references

| Purpose | File |
|--------|------|
| Full plan (phases, scope) | `docs/plan/execution/PLAN_core_security_v6.md` |
| Phase task checklist | `docs/plan/execution/TASKS_core_security_v6.md` |
| Phase 4 prompt | `docs/plan/execution/PROMPT_core_security_v6_phase_4.md` |
| Phase 5 prompt | `docs/plan/execution/PROMPT_core_security_v6_phase_5.md` |
| Phase 6 prompt | `docs/plan/execution/PROMPT_core_security_v6_phase_6.md` |
| Automation (run all) | `.cursor/commands-ref/automate.md` |
| Dev workflow | `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` |

---

## One-line reminder

- **Before sleep:** Either run `/dev` for Phase 4 only, or paste the “repeat /dev until plan complete” message and leave Cursor open.
- **When you wake:** Open this dashboard and TASKS; if next phase is done, run `/dev` for the next one; if blocked, fix and re-run `/dev` for that phase.
