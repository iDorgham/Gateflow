---
name: review
description: Inspect pull request, run 5-gate security and performance audit, verify CI checks, and optionally merge.
---

# /review `[pr_number]` `[--merge]`

Deep code review and quality verification for GateFlow pull requests.

---

## Workflow Steps

1. **Fetch PR & Diff**:
   - `gh pr view <pr_number>`
   - `gh pr diff <pr_number>`

2. **Run 5-Gate Review Audit (`github-pr-review`)**:
   - Multi-tenancy & AES-256-GCM PII encryption check
   - TypeScript strictness and Prisma schema backward-compatibility
   - ADS token semantics and Arabic RTL compliance
   - Performance, CLS ($0.00$), and bundle size check
   - CI check status (`gh pr checks <pr_number>`)

3. **Output Review Summary**:
   - Post structured markdown review with clear Approved / Changes Requested verdict.

4. **Optional Merge (`--merge`)**:
   - When CI is 100% green and user requested merge, execute:
     `gh pr merge <pr_number> --squash --delete-branch`
