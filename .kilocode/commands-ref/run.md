# Run

**Execute phased development** — one phase or all phases. Two modes:

---

## Before running

Run **`/ready`** first: push everything, run preflight, confirm clean state. Do not start development until `/ready` passes.

## Mode 1: Single phase (default)

**When:** `/run` or `/run phase N`

**What:** Execute ONE phase: develop + test + github, then stop.

### Flow

1. Load phase prompt: `docs/plan/Complete/PROMPT_<plan>_phase_<N>.md` (default plan: mvp_resident; N from context or next incomplete phase)
2. Implement — follow prompt steps, use subagents (explore, shell, browser-use) and MCP (Prisma-Local, Context7) as specified
3. Test — run `pnpm preflight` via shell subagent; fix until pass
4. Github — `git add -A`, `git commit -m "feat(scope): Phase title (phase N)"`, `git pull --rebase origin main`, `git push`
5. **STOP** — one phase done. User can run `/run` again for next phase.

---

## Mode 2: Full automation (all phases)

**When:** `/run all` or `/run all <plan>`

**What:** **Never stop** until ALL phases are done. Loop through every phase: implement, test, github, next. Continue until the plan is complete.

### Flow

1. Read plan: `docs/plan/Complete/PLAN_<name>.md` (default: mvp_and_resident). Count phases.
2. For each phase N (1, 2, 3, ...):
   - Load `PROMPT_<plan>_phase_N.md` (create from template if missing)
   - Implement the phase
   - Run `pnpm preflight` — fix failures
   - Github: add, commit, pull, push
   - **Continue to next phase** — do not stop
3. When last phase is done → **STOP**. Plan complete.

### Rules for full mode

- Do not ask for confirmation between phases — continue automatically
- If a phase prompt does not exist, create it from `.antigravity/templates/TEMPLATE_PROMPT_phase.md` using the plan
- If preflight fails, fix the errors and re-run until pass, then continue
- Track which phases are done (check git history or plan file) to resume if interrupted

---

## Plan detection

- Default plan: `mvp_resident` (from PLAN_mvp_and_resident.md)
- Plans live in `docs/plan/Complete/PLAN_*.md`
- Phase prompts: `PROMPT_<plan>_phase_<N>.md`

---

## Example

- `/run` → One phase, then stop
- `/run phase 2` → Phase 2 only, then stop
- `/run all` → All phases in sequence, until plan complete

