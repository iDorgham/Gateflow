# Tasks — audit_remediation_2026

## Phase 1 — P0 containment

- [x] Confirm reset-route exposure using non-sensitive evidence.
- [x] Remove deployable route and fallback credentials; add local interactive bootstrap only if required.
- [ ] Rotate affected secrets/credentials and record an operational receipt. _(Pending ops receipt — see phase log Residual Risks / Operational follow-up.)_
- [x] Sanitize CMS HTML at trust boundaries and constrain branding CSS tokens.
- [x] Add endpoint-absence, stored-XSS, unsafe-URL/SVG, and CSS-injection tests.
- [x] Add CI guard against production bootstrap routes/default credentials.
- [x] Run targeted checks, preflight, and write `phase_logs/PHASE_LOG_phase_01.md`.

## Phase 2 — Tenant isolation

- [ ] Inventory tenant models, Prisma operations/imports, and privileged exceptions.
- [ ] Replace global state with request-local context; fail closed when absent.
- [ ] Enforce organization scope and soft deletes on reads/writes/transactions.
- [ ] Add an explicit privileged client and migrate unjustified raw Prisma callers.
- [ ] Add concurrent, cross-tenant, missing-context, and soft-delete tests.
- [ ] Document the RLS decision; run checks/preflight and write phase 2 log.

## Phase 3 — Trustworthy CI

- [ ] Audit/fix root resolution across check scripts and same-family defects.
- [ ] Report mode/scope/count; fail unexpected zero-file and unavailable scans.
- [ ] Add scanner smoke tests and mature full-tree/history secret scanning.
- [ ] Harden dependency scan state handling.
- [ ] Restore dashboard typecheck enforcement or an approved decreasing ratchet.
- [ ] Add warning/skipped-test budgets and resolve/document pnpm runtime drift.
- [ ] Run scanner gates/preflight and write phase 3 log.

## Phase 4 — API certification

- [ ] Inventory high-risk routes and required auth/RBAC/tenant/schema/rate/audit controls.
- [ ] Consolidate composable controls and add negative/cross-tenant/replay tests.
- [ ] Verify CSP/security headers across web apps.
- [ ] Resolve Jest open handles and remove `--forceExit`, or approve dated exceptions.
- [ ] Align architecture/security docs with actual stack and controls.
- [ ] Run clean full typecheck, scanner gates, preflight, and re-test P0/P1 findings.
- [ ] Reconcile related-plan duplication/backlog; write phase 4 log and final summary.

## Final gate

- [ ] Every deferral has an owner, reason, expiry, and follow-up.
- [ ] `pnpm typecheck:all` and `pnpm preflight` pass.
- [ ] No verified P0/P1 finding remains reproducible.
- [ ] Backlog path/status matches lifecycle.
