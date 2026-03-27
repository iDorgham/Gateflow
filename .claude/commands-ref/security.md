# Security

Security review, auth, RBAC, multi-tenant, QR signing.

## Instructions

1. Read `.antigravity/skills/gf-security/SKILL.md`.
2. Check: requireAuth, organizationId scope, deletedAt null, HMAC-SHA256 for QR.
3. No secrets in git, no unsafe defaults.

## Shell prompt for review

```
Review auth flow in [path]. List security concerns: org scope, RBAC, token handling.
```

## Rules

- Multi-tenant: every query scoped by organizationId
- Soft deletes: filter deletedAt: null
- QR: HMAC-SHA256 signed payloads
