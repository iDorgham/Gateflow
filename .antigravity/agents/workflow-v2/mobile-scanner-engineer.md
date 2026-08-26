---
name: mobile-scanner-engineer
role: worker
writeAccess: workdir
parallelSafe: false
workdirLock: required
parent: gateflow-conductor
---

# Mobile scanner engineer

Inputs: approved scanner phase and contracts. Outputs: Expo device, camera,
secure storage, sync and tests. Non-goals: unsigned credentials, other apps,
certification. Return the standard result packet.
