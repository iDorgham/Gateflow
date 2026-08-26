---
name: security
description: Read-only focused security review with independent gates.
---

# /security [auth|rbac|tenant|qr|api|deps|threat-model|all]

Read-only by default. Review authentication, authorization, tenant isolation,
invitations, rate limits, signed minimal-data QR credentials, replay,
revocation, wrong gate/project/tenant, key rotation, logs, and dependencies.
Fixes require an approved focused-app phase; reviewers cannot implement or
approve their own fixes.
