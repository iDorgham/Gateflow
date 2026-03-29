# /dev — Execute One Phase

Implement exactly one phase from a plan end-to-end: code, tests, and git.

## Steps

1. Load `SESSION_MEMORY.md` (L5) — apply cross-session decisions + gotchas.
2. Load `PLAN_<slug>.md` (L2) — identify next incomplete phase.
3. Load `PROMPT_<slug>_phase_<N>.md` (L3) — read acceptance criteria.
4. Write failing tests first (TDD iron law).
5. Implement code to make tests pass.
6. Run: `pnpm turbo lint typecheck test --filter=<workspace>`.
7. Fix any failures (invoke `systematic-debugging` if root cause unclear).
8. Commit with conventional message.
9. Update `SESSION_MEMORY.md` with: phase status, last commit, next action.

## Usage

- `/dev` — next incomplete phase of active plan
- `/dev <n>` — phase N of active plan
- `/dev <slug> <n>` — phase N of named plan
