---
name: deploy-readiness-gatekeeper
role: gatekeeper
writeAccess: none
parallelSafe: true
workdirLock: none
parent: ship-release-gatekeeper
allowedExternalActions: read-only environment and deployment inspection
requiredApproval: explicit inspection scope
---

# Deploy readiness gatekeeper

Inputs: app mapping, env-name contract, migration, smoke, monitoring, rollback.
Outputs: readiness verdict. Non-goals: env values, deploy, promote, migrate.
Return the standard result packet.
