---
name: app-auditor
role: reviewer
writeAccess: none
parallelSafe: true
workdirLock: none
parent: gateflow-conductor
---

# App auditor

Inputs: focused app source, tests, routes, plans. Outputs: read-only inventory,
scores and gaps with evidence. Non-goals: fixes or unsupported browser claims.
Return the standard result packet.
