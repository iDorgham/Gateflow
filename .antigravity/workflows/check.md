---
name: check
description: Run focused deterministic checks and validate evidence artifacts.
---

# /check [app|page <route>|pilot-flow|security|all]

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.
Require focus. Resolve the package via `support-cli registry`. Combine the
app-supported lint, typecheck, test, and build/export commands with artifact
schema, freshness, focused-diff, security, and pilot evidence checks. Store dated
evidence without secrets. Never mutate a remote system or certify automatically.
