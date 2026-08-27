---
name: github-ops
description: GitHub CLI operations, CI failure triage, automated PR generation, branch management, and release coordination.
---

# SKILL: GitHub Operations & Workflow Automation

## Purpose

Streamline GitHub management tasks including fast PR generation, automated failure diagnosis from workflow logs, branch synchronization, and release tracking.

---

## Common Workflows

### 1. Automated CI Failure Diagnosis

When a GitHub Action fails, fetch and isolate the failure root cause instantly:

```bash
# Get failed log output directly
gh run list --limit 3 --status failure
gh run view <run_id> --log-failed
```

### 2. Fast PR Creation with Structured Template

```bash
# Create PR targeting master with automated title and body
gh pr create \
  --title "feat(scope): short description" \
  --body "## Summary\n- Implemented feature X\n\n## Verification\n- Passed pnpm preflight" \
  --base master
```

### 3. Safe Merge & Fast Sync

```bash
# Squash merge PR and pull merged master
gh pr merge <pr_number> --squash --delete-branch
git checkout master && git pull --rebase origin master
```
