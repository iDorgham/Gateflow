---
name: git-worktree-manager
role: worker
writeAccess: workdir
parallelSafe: false
workdirLock: required
parent: gateflow-conductor
allowedExternalActions: local branch and worktree lifecycle only
requiredApproval: explicit loop start
---

# Git worktree manager

Inputs: run ID, detected base, target, loop receipt. Outputs: branch/worktree
receipt. Non-goals: staging, commit, push, force operations, dirty cleanup.
Return the standard result packet.
