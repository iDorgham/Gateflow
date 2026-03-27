# GitHub Automation (Workspace)

Source of truth: `.github/workflows/`

## Workflow Inventory

| Workflow              | Purpose                                                      | Trigger                                 |
| :-------------------- | :----------------------------------------------------------- | :-------------------------------------- |
| `ci.yml`              | Monorepo validation gate (lint/typecheck/test/security/perf) | Push + PR                               |
| `deploy.yml`          | Build, optional DB migration, deploy web apps to Vercel      | Push main/master + PR + manual          |
| `release.yml`         | Create GitHub Release from changelog on tag push             | Push `v*`                               |
| `pr-labels.yml`       | Label PR size and comment affected packages                  | PR open/sync/reopen                     |
| `lighthouse.yml`      | Lighthouse audits + PR comment + artifact upload             | PR path filter + schedule + manual      |
| `sync-ai-tools.yml`   | Sync AI tool config/log automation                           | Push path filter + manual               |
| `codeql-analysis.yml` | CodeQL static analysis                                       | Push main/master + PR + weekly schedule |

## Automation Policies

- Use pinned action SHAs in workflows.
- Prefer explicit permissions per workflow/job.
- Keep concurrency groups to avoid duplicate runs.
- Keep release notes generated from `CHANGELOG.md`.
- Keep changelog structure validated via `pnpm docs:changelog:check`.

## Key Repo-Level GitHub Files

- `.github/dependabot.yml`
- `.github/CODEOWNERS`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/README.md`
