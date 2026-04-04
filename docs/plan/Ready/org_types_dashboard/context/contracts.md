# Contracts — org_types_dashboard

- **Multi-tenancy:** `organizationId` on every tenant query; `deletedAt: null` for soft-deleted models.
- **Auth:** No org data without session; `orgType` must match server-side org record if carried in JWT.
- **Reference:** `.antigravity/contracts/CONTRACTS.md`, `.cursor/rules/00-gateflow-core.mdc`, `.cursor/rules/gateflow-security.mdc`.
