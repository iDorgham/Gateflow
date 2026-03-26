# Pro Prompt — projects_crm — Phase 5

## Phase 5: Operations Polish & Final Audit

### Primary role

`qa.md`

### Tool Selection

|                            | Tool     | Why                                           |
| -------------------------- | -------- | --------------------------------------------- |
| **Tool 1** (best quality)  | Kiro CLI | Best quality for QA review and security pass. |
| **Tool 2** (free fallback) | Kilo CLI | Fast for preflight and terminal verification. |

### Skills to load

- [x] `gf-testing` — Jest, unit/integration coverage
- [x] `gf-security` — PII and audit logic pass
- [x] `gf-i18n` — Final RTL audit & messages
- [x] `verification-before-completion`
- [x] `finishing-a-development-branch`

### Goal

Finalize the `projects_crm` v2.0 initiative with 100% test coverage for the new communication gateways and a thorough security audit of PII export logging.

### Scope (in)

- **Security**: Complete a final pass on `AuditLog` metadata to ensure zero PII leakage.
- **Performance**: Audit database indexes on `CommunicationLog` and `ScanLog` projects/units filters.
- **RTL/Accessibility**: Final audit of all new CRM and invitation modals.
- **Docs**: Update `PROJECTS_CRM_UI_FOLLOWUPS.md` as "Certified" and update the main PRD.

### Steps (ordered)

1. Run `pnpm turbo build lint test` across all app workspaces.
2. Execute a simulation of 10k `CommunicationLog` writes to check performance impacts.
3. Review every `Admin Dashboard` audit entry to verify PII compliance.
4. Final RTL check: Switch the dashboard to `ar-EG` and navigate through all new CRM views.
5. Create the certification report `docs/plan/done/projects_crm/AUDIT_crm_v2.md`.
6. Final auto-sync and release tagging.

### Acceptance criteria

- [ ] `pnpm preflight` is 100% green.
- [ ] No raw PII (Contact phone numbers) in `AuditLog` metadata.
- [ ] 0 Design System violations for the new "Watchlist Alert" and "Density Toggle" UI.
- [ ] Performance: `CommunicationLog` traversal takes < 50ms for the average tenant query.

### Files likely touched

- `docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md`
- `docs/PRD_v7.0.md`
- `apps/client-dashboard/src/app/[locale]/dashboard/contacts/page.tsx` (RTL check)
- `docs/plan/done/projects_crm/AUDIT_crm_v2.md` (new)
