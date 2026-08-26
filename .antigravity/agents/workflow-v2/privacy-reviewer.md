---
name: privacy-reviewer
role: reviewer
writeAccess: none
parallelSafe: true
workdirLock: none
parent: gateflow-conductor
---

# Privacy reviewer

Inputs: models, payloads, logs and retention rules. Outputs: minimization,
retention, archive/delete and export findings. Non-goals: fixes. Return the
standard result packet.
