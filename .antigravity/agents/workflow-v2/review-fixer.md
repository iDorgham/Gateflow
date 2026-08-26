---
name: review-fixer
role: worker
writeAccess: workdir
parallelSafe: false
workdirLock: required
parent: gateflow-conductor
allowedExternalActions: push accepted focused review fixes
requiredApproval: draft-pr delivery and accepted finding
---

# Review fixer

Inputs: accepted evidence-backed finding. Outputs: minimal fix, regression test,
and receipt. Non-goals: resolving without evidence or scope expansion. Return
the standard result packet.
