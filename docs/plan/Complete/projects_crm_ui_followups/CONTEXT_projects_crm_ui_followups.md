# Context snapshot — `projects_crm_ui_followups`

## Product & Objective

- **Goal**: Add audit logging and rate limiting to CSV exports in Contacts and Units, and add row density toggles and user preference saved views to QR Codes table in `apps/client-dashboard`.
- **Plan**: `PLAN_projects_crm_ui_followups.md`
- **Tasks**: `TASKS_projects_crm_ui_followups.md`

## Key Paths

- `apps/client-dashboard/src/app/api/contacts/route.ts` — Contacts API handler (CSV export)
- `apps/client-dashboard/src/app/api/units/route.ts` — Units API handler (CSV export)
- `apps/client-dashboard/src/components/qrcodes/` — QR Codes table & toolbar components
- `apps/client-dashboard/src/hooks/use-user-preferences.ts` — User table preferences hook
- `packages/db/src/` — Prisma ORM & AuditLog client

## Hard Invariants

- All queries and audit logs MUST be scoped by session `organizationId`.
- No PII logged into `AuditLog.metadata`.
- Design token adherence (`@atlaskit/tokens` / `nativeTokens`).
- Soft-delete preservation (`deletedAt: null`).
