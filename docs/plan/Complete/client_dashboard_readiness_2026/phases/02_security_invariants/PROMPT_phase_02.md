# Phase 02 — Security and data invariants

Act as the single primary writer. Load the security, tenant-isolation,
access-event-audit, signed-QR, authentication/session, privacy-minimization, API
contract, database, and migration-safety guidance relevant to each touched
path.

Use Phase 01 dispositions as the source of truth. Replace destructive ScanLog
purge with an approved append-only archival/redaction contract. Preserve
API-key revocation history. Define AI transcript retention, sensitivity
filtering, opt-out/clear behavior, and shared-device behavior. Fix confirmed
tenant, authorization, input validation, CSRF, abuse-control, replay, and audit
gaps; retain documented privileged exceptions.

Add negative and cross-tenant tests for every changed boundary, including
expired, revoked, tampered, wrong-gate, wrong-tenant, replay, not-active,
usage-limit, and offline cases where applicable. Never expose secret values in
logs or evidence. Prisma schema/migration work requires expand/contract review,
rollback notes, and direct-connection safety; do not run production migrations.

Run focused lint, typecheck, test, build, tenant/security scanners, and
`pnpm workflow:v2:check`. Record evidence and a fresh security finding ledger.
Stop if any P0/P1 finding remains unresolved.

Mutation boundary: Client Dashboard and justified shared/db contracts only; no
push, deploy, credential rotation, or production mutation.

Exit: Phase 03 prompt only after the security gate is green.
