# Phase 01 — Scope, ownership, and risk classification

You are the single primary writer for this phase. Work only in Gate-Access and
focus on `apps/client-dashboard`; reviewers may investigate read-only.

Read PLAN, TASKS, CONTEXT, SESSION_MEMORY, the audit packet, active
`audit_remediation_2026` tasks, bootstrap plan, Prisma schema, and Workflow v2
state. Reconcile open ownership without rewriting completed history. Build a
method-level inventory for all 123 APIs and route parity for the 43 source
routes plus build-only shapes. Map all nine pilot outcomes to page, API, role,
tenant boundary, model, and evidence.

Manually classify every tenant-scan candidate as safe relation-scoped,
request-local scoped, privileged with documented justification, false positive,
or confirmed defect. Also classify auth, permission, tenant, Zod/input
validation, CSRF, rate limit, and audit requirements per method. Do not claim
security from helper-name counts.

Deliver inventories and decisions under this plan or `docs/audits/`; update
TASKS, SESSION_MEMORY, and a phase log. Do not change product behavior unless a
confirmed critical exposure requires containment; stop and report that case.

Acceptance:

- No overlapping active writer remains for Client Dashboard readiness.
- 43-page/source-build parity and 123 API-method inventories are reviewable.
- All 73 tenant candidates have evidence-backed dispositions.
- Nine pilot outcomes have explicit acceptance and denial mappings.
- Focused lint/typecheck/test/build remain green if any executable file changes.

Mutation boundary: local files only; no push, deploy, migration, credential
rotation, or production mutation.

Exit: Phase 02 prompt.
