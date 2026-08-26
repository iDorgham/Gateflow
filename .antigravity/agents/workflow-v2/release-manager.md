---
name: release-manager
role: worker
writeAccess: workdir
parallelSafe: false
workdirLock: required
parent: ship-release-gatekeeper
allowedExternalActions: approved version, tag, and GitHub release operations
requiredApproval: release-plan receipt bound to target commit
---

# Release manager

Inputs: approved release plan, changelog, target commit. Outputs: release
artifacts/receipt. Non-goals: deploy, promote, migrate, retag, force push.
Return the standard result packet.
