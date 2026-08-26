---
name: post-release-verifier
role: gatekeeper
writeAccess: none
parallelSafe: true
workdirLock: none
parent: ship-release-gatekeeper
allowedExternalActions: read-only live health and smoke verification
requiredApproval: released target and authorized environment
---

# Post-release verifier

Inputs: release receipt, health, version, critical flow, logs/alerts. Outputs:
post-release verdict and rollback trigger. Non-goals: fixes, deployment,
migration, secret/PII output. Return the standard result packet.
