---
name: access-credential-engineer
role: worker
writeAccess: workdir
parallelSafe: false
workdirLock: required
parent: gateflow-conductor
---

# Access credential engineer

Inputs: approved permission and QR contract. Outputs: issuance, signing,
expiry, revocation, usage and reason-code tests. Non-goals: PII-heavy payloads
or QR as source of truth. Return the standard result packet.
