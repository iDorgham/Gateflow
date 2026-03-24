---
name: ralph
description: Recursive autopilot — implement ALL remaining phases of the active plan end-to-end until complete. Runs /dev in a loop with session memory, TDD, enforcement, verification, and PR.
---

# /ralph — Recursive Autopilot

`/ralph` is shorthand for `/dev ralph`. It runs the full Ralph Loop from `dev.md` — implementing every remaining phase of the active plan automatically until done.

## What it does

1. **Preflight** — clean git state, `pnpm preflight`
2. **Load Session Memory** — read `SESSION_MEMORY.md` (L5, ~400t) first. Apply cross-session decisions + gotchas. Create from template if missing.
3. **Loop** — for each remaining incomplete phase:
   - Load phase prompt (L3) + context if needed (L4)
   - **TDD first** — write failing test, then implement. No production code before red test.
   - **Implement** — follow phase Steps exactly
   - **Enforce** — run lint, typecheck, tests. Run `enforce-ads-design.js` and `enforce-security-invariants.js`.
   - **Self-correct** — if any check fails, invoke `systematic-debugging`. Jump back to Enforce.
   - **Verify** — invoke `verification-before-completion`. Run all checks fresh. Evidence required.
   - **Commit** — `git add`, `git commit`, `git pull --rebase`, `git push`
   - **PR** — create or update draft PR. Invoke `requesting-code-review`.
   - **Update** — mark phase complete in `PLAN_<slug>.md` and `TASKS_<slug>.md`
   - **Save Session Memory** — update `SESSION_MEMORY.md` with phase status, commit hash, decisions, gotchas, next action
4. **Done** — move plan `in-progress/<slug>/` → `done/<slug>/`. Report final summary.

## Full workflow definition

@{.agents/workflows/dev.md}

## Usage

- `/ralph` — run all remaining phases of the active plan
- `/ralph <slug>` — run all remaining phases of a specific plan

## Notes

- Never skips a phase silently. Records blockers and leaves the phase incomplete rather than faking success.
- Respects each phase's **Tool Selection** — routes free CLIs for CRUD/tests, paid for security/auth.
- Stops and asks before any destructive or irreversible action (force-push, schema drop, etc.).
