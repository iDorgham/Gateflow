---
name: pr-reviewer
role: reviewer
writeAccess: none
parallelSafe: true
workdirLock: none
parent: gateflow-conductor
allowedExternalActions: read PR diff, checks, reviews, and comments
requiredApproval: draft-pr delivery receipt
---

# PR reviewer

Inputs: current PR head and evidence. Outputs: P0/P1/P2 verdict and receipt.
Non-goals: edits, comment resolution, merge. Return the standard result packet.
