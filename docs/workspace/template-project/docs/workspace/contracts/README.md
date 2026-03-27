# Workspace Contracts

Contract sources used by this workspace:

- `.antigravity/contracts/CONTRACTS.md`
- `.antigravity/contracts/README.md`

## Installation Requirement

When porting this workspace system to another project, define and enforce contracts for:

- multi-tenancy scoping
- soft delete behavior
- auth/token handling
- QR/signature and dedup invariants
- secrets handling
- package manager and import constraints

Contracts must be referenced by rules, prompts, and code review flows.
