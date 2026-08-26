---
name: deploy
description: Specialized workflows and patterns for deploy.
---

# gf-deploy (GateFlow Deployment Intelligence)

This skill provides the logic and commands to orchestrate best-in-class deployments for GateFlow on Vercel.
It ensures all pre-deployment checks pass, maintains clean GitHub Action runs, and provides automated error analysis and fixing.

## Mandates

1. **Manual Only**: Automations MUST BE disabled on GitHub `push` (only use /deploy).
2. **Pre-flight Checks**: Lint, typecheck, and error-memory scan are MANDATORY.
3. **Log Analysis**: If a build fails, immediately run `subagent:browser-use` to fetch Vercel logs and propose a fix.
4. **App Isolation**: Only deploy the app that has changes (or chosen).
5. **Memory Loop**: Always append new deployment errors to `.ai-memory/deployment_errors.md`.

## Sub-commands

- `/deploy status`: Fetches current deployment state from Vercel/GitHub.
- `/deploy <app>`: Forces a production deploy for a specific app.
- `/deploy all`: Deploys entire monorepo fleet (use sparingly).
- `/deploy fix`: Re-analyzes the last failed deploy logs and attempts an automated fix.
- `/deploy health`: Checks the production health (heartbeat, bundles, logs) after a deploy.

## Usage Guide (from Cursor/Antigravity)

1. Load `.ai-memory/deployment_errors.md`.
2. Compare current changes against known error patterns.
3. If errors are found, BLOCK the deployment and report to USER.
4. If clean, execute `gh workflow run deploy.yml -f app=<target_app>`.
5. Observe the run and report the result.

## Best Practices

- **Atomic commits**: Ensure the local state is committed before deploying.
- **Tagged Releases**: Tag the branch with `v<X.Y.Z>-deploy-<app>` for traceability.
- **Rollback first**: If a deploy fails, propose a rollback before attempting multiple risky fixes.
