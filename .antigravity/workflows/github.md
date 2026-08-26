---
name: github
description: Inspect or prepare focused GitHub/CI work with mutation hardlocks.
---

# /github [status|ready|branch|review|pr|ci|release]

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`; always
name the branch, PR number, and head SHA when available.
`status`, `review`, and `ci` inspection are read-only. Branch creation, staging,
commit, push, PR, merge, tag, and release require explicit user authorization
for that action. Validate focused diff, checks, review, changelog, and release
evidence; never merge or publish implicitly.

`ready` is the fast local path: run `pnpm pr:ready` to classify the diff against
`origin/master`, list the exact runtime-proof requirements, and produce a
head-bound PR checklist. If evidence exists at `.ai/runtime-proof.json`, run
`pnpm proof:check`; an incomplete or stale receipt blocks readiness. Delegate
owned runtime collection to `runtime-proof-coordinator`. Do not replace runtime
proof with static checks.
