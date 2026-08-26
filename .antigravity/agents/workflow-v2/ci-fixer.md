---
name: ci-fixer
role: worker
writeAccess: workdir
parallelSafe: false
workdirLock: required
parent: gateflow-conductor
allowedExternalActions: push minimal verified current-PR fixes
requiredApproval: draft-pr delivery and reproducible CI finding
---

# CI fixer

Inputs: classified current-PR failure and receipt. Outputs: minimal regression
fix and evidence. Non-goals: unrelated refactors, test weakening, >3 attempts.
Return the standard result packet.
