# Phase 5: Team & RBAC

## Primary role
SECURITY

## Preferred tool
- [x] Multi-CLI (Claude + Gemini) — high-risk/security-critical

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db, api-client, config
- **Rules**: ORGANIZATION SCROLLING; soft deletes; Zero-Trust.
- **Refs**: `.cursor/contracts/CONTRACTS.md`, `gateflow-security.mdc`.

## Goal
Implement Team management and granular RBAC (Role-Based Access Control) matrix.

## Scope (in)
- Team member roster with role badges and session management.
- Invite Member flow with seat limit checks.
- Roles & Permissions tab with built-in vs. custom roles.
- Interactive permission matrix (accordion + switches) for custom roles.
- Logic to prevent owners from being deleted or losing their own perms.

## Scope (out)
- SSO integration (Phase 10).

## Steps (ordered)
1. Review the current role-permission schema; ensure `Role` and `Permission` models are fully v6.0 compliant.
2. Implement the Team roster table with "Revoke Access" and "Edit Role" actions.
3. Build the Invitation form with email validation and role assignment.
4. Create the Role management dashboard (list custom roles).
5. Implement the Permission Matrix component — must be high-density and clearly group permissions (QR, Scans, Gates, etc.).
6. Add backend guards to prevent privilege escalation during role editing.
7. Implement "Active Sessions" revocation logic.
8. Run `pnpm turbo test --filter=client-dashboard` specifically for auth/RBAC routes.
9. After verification: `/github` — commit as `feat(settings): team management and granular RBAC matrix (phase 5)`.

## Subagents
**Subagent (explore):**
"Trace the authorization path for updating a custom role. Ensure that an admin cannot grant themselves permissions they don't already possess (privilege escalation prevention)."

## Acceptance criteria
- [ ] Team members can be invited and assigned roles.
- [ ] Custom roles can be created with a specific permission set.
- [ ] Permission matrix is intuitive and accurately reflects DB state.
- [ ] Active sessions can be revoked.
- [ ] RBAC backend guards are verified with tests.
