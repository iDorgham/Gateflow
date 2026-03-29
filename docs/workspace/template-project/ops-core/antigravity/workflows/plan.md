# /plan — Create a Phased Implementation Plan

Turn a feature idea or IDEA*<slug>.md into a PLAN*<slug>.md with phase prompts.

## Steps

1. Read the IDEA or user description.
2. Break work into 3–7 phases (each ~1 day of focused work).
3. For each phase write `PROMPT_<slug>_phase_<N>.md` with:
   - Primary role
   - Goal
   - Ordered steps
   - Acceptance criteria (lint ✓, typecheck ✓, tests ✓)
4. Create `PLAN_<slug>.md` with phase table.
5. Create `TASKS_<slug>.md` checklist.
6. Place all files in `docs/plan/planned/<slug>/`.

## Output

- `docs/plan/planned/<slug>/PLAN_<slug>.md`
- `docs/plan/planned/<slug>/TASKS_<slug>.md`
- `docs/plan/planned/<slug>/phases/NN_<title>/PROMPT_phase_NN.md`
