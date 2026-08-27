---
name: merge-gatekeeper
description: Automated merge coordination, CI status polling, conflict resolution, changelog synchronization, and deployment chaining.
---

# SKILL: Merge Gatekeeper

## Purpose

Coordinate frictionless, safe merging of pull requests and automatically transition merged features into production release pipelines.

---

## 4-Step Merge Protocol

```
1. CI Status Polling ──► 2. Conflict Check ──► 3. Squash Merge ──► 4. Deploy Dispatch
```

### Step 1: Check CI Status

```bash
gh pr checks <pr_number>
```

- Ensure all 15+ automated checks pass (CodeQL, Lint, Typecheck, Test, Runtime Proof, Performance Budget, Security Scan).

### Step 2: Auto-Resolve Merge Blockers

- If merge conflict exists:
  ```bash
  git fetch origin master
  git merge origin/master
  # Resolve conflicts, run pnpm preflight, push
  ```

### Step 3: Execute Safe Squash Merge

```bash
gh pr merge <pr_number> --squash --delete-branch
```

### Step 4: Downstream Synchronization & Deployment

```bash
# Pull merged master locally
git checkout master && git pull --rebase origin master

# If feature is production-ready, trigger deploy
gh workflow run deploy.yml -f app=<target_app> -f environment=Production
```
