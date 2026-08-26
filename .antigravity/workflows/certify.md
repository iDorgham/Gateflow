---
name: certify
description: Certify a pilot-ready app from fresh immutable evidence.
---

# /certify

Require `pilot-ready`, complete P0 criteria, no blocking findings, fresh dated
check and pilot-flow evidence, and independent gatekeeper review. Build the
evidence JSON, then use `workflow-v2 certify --evidence <file>`. The receipt is
write-once and hash-bound. Never accept a manual checkbox as evidence.
