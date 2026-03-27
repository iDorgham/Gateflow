# Ready

**Pre-development prep** — ensure everything is clean and ready before starting any phase.

## When to use

- Before running `/run` or `/run all`
- Before starting a new development session
- When switching to a new task or phase

## Flow (run via shell subagent or terminal)

1. **Check git status** — must be clean or safely stashed.
2. **Sync Base** — ensure local `main` matches `origin/main`.
3. **Preflight** — run `pnpm preflight` to confirm a stable starting point.

## Steps (ordered)

```bash
# 1. Status & Cleanup
git status
git add -A
git commit -m "chore: save progress before phase start" || echo "no changes to commit"
git checkout main
git pull --rebase origin main

# 2. Quality Gate
pnpm preflight

# 3. Done — ready for automated /dev branch
```

## Rules

- **Do not start development** until `/ready` passes
- If preflight fails → fix errors, re-run `/ready`
- If uncommitted work → commit or stash before starting new phase
