# AI Context Block (Compressed)

Use this as a low-token copy/paste context block for external AI tools.

## Copy-Paste Block

```text
PROJECT: GateFlow monorepo (Turborepo + pnpm)
PRIMARY CONTEXT ROOT: docs/reference/apps

LOAD ORDER (strict, stop when enough context):
1) GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md
2) PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md
3) FILES_AND_STRUCTURE_REFERENCE.md
4) DATABASE_BACKEND_AND_TECH_REFERENCE.md
5) API_GATEWAY_AND_CONTRACTS_REFERENCE.md
6) FUNCTIONS_AND_SERVICES_INDEX_REFERENCE.md
7) PAGES_AND_ROUTES_INDEX_REFERENCE.md
8) UI_UX_AND_DESIGN_REFERENCE.md
9) WORKSPACE_AI_ENVIRONMENT_REFERENCE.md
10) MEMORY_AND_LEARNED_DATA_REFERENCE.md

APP-SPECIFIC CONTEXT (load only relevant app):
- DESIGN_SYSTEM_REFERENCE.md
- MARKETING_APP_REFERENCE.md
- CLIENT_DASHBOARD_REFERENCE.md
- ADMIN_DASHBOARD_REFERENCE.md
- SCANNER_APP_REFERENCE.md
- RESIDENT_PORTAL_REFERENCE.md

SYMBOL-LEVEL CONTEXT (only if function-level impact needed):
- symbols/README.md
- symbols/CLIENT_DASHBOARD_SYMBOLS_REFERENCE.md
- symbols/ADMIN_DASHBOARD_SYMBOLS_REFERENCE.md
- symbols/MARKETING_SYMBOLS_REFERENCE.md
- symbols/RESIDENT_PORTAL_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_DB_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_TYPES_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_UI_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_API_CLIENT_SYMBOLS_REFERENCE.md
- symbols/PACKAGES_UTILS_SYMBOLS_REFERENCE.md

SYSTEM INVARIANTS (must preserve):
- Multi-tenancy: scope tenant data by organizationId.
- Soft deletes: respect deletedAt filtering when applicable.
- Security: no secrets in repo, enforce auth/RBAC boundaries.
- QR/security contracts: signed QR payload and scan integrity flows.
- Package manager: pnpm only.

PLANNING EXECUTION RULES:
- Use phased plans (Draft -> Ready -> Active -> Complete).
- Prefer one concern per phase (DB/API/UI split for risky work).
- Include acceptance criteria and verification commands per phase.
- Update tasks/phase logs/session memory when executing phases.

TASK ROUTING:
- Architecture/cross-cutting: GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md
- Plan orchestration: PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md
- Backend/API changes: DATABASE_BACKEND_AND_TECH_REFERENCE.md + API_GATEWAY_AND_CONTRACTS_REFERENCE.md
- UI/page changes: PAGES_AND_ROUTES_INDEX_REFERENCE.md + UI_UX_AND_DESIGN_REFERENCE.md
- Function-level impact: relevant symbols/*_SYMBOLS_REFERENCE.md
```

## Ultra-Short Variant (Minimal Tokens)

```text
GateFlow context root: docs/reference/apps
Load: COMPLETE_CONTEXT -> PLANNING -> STRUCTURE -> DB/BACKEND/TECH -> API -> FUNCTIONS -> PAGES -> UI_UX -> AI_ENV -> MEMORY
Then load target app doc (CLIENT/ADMIN/MARKETING/SCANNER/RESIDENT/DESIGN).
For symbol-level edits, load symbols/README.md + relevant *_SYMBOLS_REFERENCE.md.
Preserve invariants: organizationId, deletedAt, auth/RBAC, signed QR/security contracts, pnpm-only.
```
