# Definition of Done — GateFlow

Use for phase completion or PR review. All items must pass before merge.

## Correctness

- [ ] Works for intended role(s) (TENANT_ADMIN, TENANT_USER, RESIDENT, etc.)
- [ ] Tenant scope correct: `organizationId` on all org-scoped queries
- [ ] Edge cases handled (empty state, 404, validation errors)

## Security

- [ ] No secrets in git (`.env` not committed)
- [ ] Auth checked before tenant operations
- [ ] QR payloads HMAC-SHA256 signed (if touching QR flow)
- [ ] No unsafe defaults

## Quality

- [ ] `pnpm preflight` passes (lint + typecheck + test)
- [ ] Critical paths have tests
- [ ] No `console.log` or debug code left

## Data

- [ ] Soft delete used: `deletedAt` not hard delete
- [ ] `deletedAt: null` in queries for tenant models
- [ ] Migration created if schema changed

## Docs

- [ ] `docs/` updated if behavior or setup changed
- [ ] API changes documented if external

## References

- `.cursor/contracts/CONTRACTS.md` — invariants
- `docs/plan/guidelines/DEVELOPMENT_WORKFLOWS.md` — workflows
