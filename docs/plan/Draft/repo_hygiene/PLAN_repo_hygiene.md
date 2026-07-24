# PLAN — repo_hygiene

**Status:** Complete  
**Date:** 2026-07-24  
**Branch:** `chore/repo-hygiene-v0.3.0`  
**Tag target:** `v0.3.0` (tagged)

## Outcome

Clean repository baseline before Client Dashboard `/audit all`: remove tracked clutter, reconcile plan lifecycle, refresh authority docs, close Dependabot alerts via `pnpm.overrides`, land minimal marketing production P0s, and annotated tag `v0.3.0`.

## Scope

- **In:** docs/repo cleanup, backlog truth, security overrides, marketing locale + Prisma packaging P0s
- **Out:** broad product features, QR/auth/tenant changes, Lighthouse score chasing, Workflow focus changes

## Phases

| Phase | Title                 |
| ----- | --------------------- |
| 00    | CI / deploy triage    |
| 00b   | Dependabot vulns      |
| 01    | Cleanup               |
| 02    | Plan lifecycle        |
| 03    | Docs refresh          |
| 04    | Release tag + handoff |
| 05    | Marketing prod P0     |

## Exit handoff

```text
/audit all
```
