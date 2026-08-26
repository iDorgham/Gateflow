---
description: '/deploy [<app>] [<subcommand>] - Specialized GateFlow deployment workflow.'
---

# /deploy (GateFlow Deployment Command Center)

This workflow implements the manual deployment strategy for the GateFlow monorepo, replacing automatic push-to-deploy hooks to ensure 100% build health and clean GitHub Action tracking.

## Sub-commands

| Command          | Action                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `/deploy <app>`  | Deploy a specific application (marketing, client, admin, resident, design-system).                |
| `/deploy all`    | Deploy all changed applications in parallel.                                                      |
| `/deploy fix`    | Re-scan the last failed deployment logs and propose a fix from `.ai-memory/deployment_errors.md`. |
| `/deploy status` | Check current deployment status on Vercel and GitHub.                                             |
| `/deploy check`  | Run all pre-deployment checks (lint, types, memory patterns) WITHOUT deploying.                   |

## Workflow Steps

1. **Pre-flight Check**:
   - Read `.ai-memory/deployment_errors.md` for known patterns.
   - Scan current diffs in `apps/` and `packages/` for matching errors.
   - Verify `git status` (must be clean and local branch must be pushed to origin).
   - Run `pnpm turbo lint typecheck --filter=<app>`.

2. **Trigger Deployment**:
   - If pre-flight passes:
     - **GitHub**: Invoke `gh workflow run deploy.yml -f app=<app>`.
     - **Vercel**: (Optional fallback) `vercel deploy --prod` within the app folder.
   - If pre-flight fails: Block and report the specific error pattern found in memory.

3. **Monitor & Result**:
   - Monitor the GitHub Action run status.
   - If SUCCESS:
     - Post the Vercel Preview/Production URL.
     - **Update Tracker**: Execute `node scripts/update-deployment-tracker.js <app> <commit_hash> success`.
   - If FAILURE:
     - Trigger the `/deploy fix` logic immediately.
     - **Update Tracker**: Set status to `Failed` in `.ai-memory/deployment_tracker.md`.

4. **Learning Loop**:
   - On success: Record the successful deployment in `CHANGELOG.md`.
   - On failure: Append the new error log to `.ai-memory/deployment_errors.md` if it's a new pattern.

## Safety Mandates

- `/turbo`
- **Confirmation needed** before deploying to `production` via GitHub `main` or `master` branch.
- **Git Sync required**: Ensure the branch is pushed to `origin` before dispatching the workflow.
