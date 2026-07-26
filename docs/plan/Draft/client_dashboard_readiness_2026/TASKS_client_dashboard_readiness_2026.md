# TASKS — client_dashboard_readiness_2026

## Phase 01 — Scope, ownership, and risk classification

- [x] Reconcile open `audit_remediation_2026` Phase 4 tasks and credential receipt
- [x] Mark superseded bootstrap phases without losing completed Phase 00 evidence
- [x] Lock source/build parity: 44 pages (43 production + 1 fixture), 123 API routes, 170 handlers
- [x] Map the nine pilot outcomes to routes, APIs, models, roles, and evidence
- [x] Manually disposition all 72 currently reproduced tenant-scan candidates (audit baseline was 73)
- [x] Classify auth, permission, tenant, Zod, CSRF, rate-limit, and audit controls per API method
- [x] Record Phase 01 verification and ownership decision

### Phase 01 blockers

- [x] Contain GF-CD-SEC-001: org-less token can deny arbitrary scan
- [x] Contain GF-CD-SEC-002: contact create/update can link foreign-tenant units
- [x] Add negative/cross-tenant regression tests for both findings
- [x] Contain GF-CD-SEC-003: API CSRF middleware matcher exclusion
- [x] Contain GF-CD-SEC-004: unauthenticated resident push abuse/IDOR
- [x] Contain GF-CD-SEC-005: cross-tenant AI feedback
- [x] Contain GF-CD-SEC-006: cross-tenant AI execution/confused deputy
- [x] Add webhook timestamp freshness and replay protection (GF-CD-SEC-007)
- [x] Resolve resident-arrival capability/freshness/rate controls (GF-CD-SEC-008)

## Phase 02 — Security and data invariants

- [x] Replace destructive scan purge with approved archival/redaction behavior
- [x] Add auditable API-key revocation history
- [x] Define and enforce AI transcript retention/sensitivity/shared-device behavior
- [x] Fix confirmed tenant-isolation and privileged-scope gaps
- [x] Close validation, CSRF, abuse-control, and audit gaps from Phase 01
- [x] Add negative, cross-tenant, replay, revocation, and retention tests
- [ ] Close credential-rotation evidence without recording secret values
- [ ] Run a fresh security scan and resolve all P0/P1 findings

## Phase 03 — Development and test reliability

- [ ] Identify and close Jest open handles; remove `--forceExit`
- [ ] Restore QR validation coverage and classify every remaining skip
- [ ] Establish lint-warning baseline and ratchet below 282 without blanket disables
- [ ] Replace unsafe `any`, dead imports, and empty blocks in touched risk paths
- [ ] Document reproducible local environment checks without exposing secrets
- [ ] Keep focused lint, typecheck, test, and build green

## Phase 04 — Performance and runtime readiness

- [ ] Capture comparable local/preview performance baselines and methodology
- [ ] Define page, bundle, API latency, database-query, and build budgets
- [ ] Profile first; rank bottlenecks by measured user impact
- [ ] Implement the smallest high-impact fixes and remeasure each one
- [ ] Add and probe the real unauthenticated health endpoint
- [ ] Resolve or explicitly accept middleware/proxy and Prisma build warnings
- [ ] Remove avoidable build-time network dependence where practical
- [ ] Add regression checks for agreed budgets

## Phase 05 — Accessibility, RTL, and page readiness

- [ ] Test P0 pages in English and Arabic at mobile and desktop widths
- [ ] Verify keyboard order, visible focus, labels, contrast, status announcements, and touch targets
- [ ] Replace unsafe physical-direction utilities with logical equivalents
- [ ] Verify identifiers, QR data, codes, and numbers remain bidi-isolated
- [ ] Exercise loading, empty, error, offline, denied, and success states
- [ ] Refresh page scores with screenshots and browser evidence

## Phase 06 — Pilot and deployment certification

- [ ] Prove the happy-path pilot journey end to end
- [ ] Prove all required denial/replay/offline outcomes
- [ ] Run focused quality gates and root `pnpm preflight`
- [ ] Run Workflow v2 checks and refresh audit/security/performance evidence
- [ ] Verify preview build, health, logs, environment references, and rollback runbook
- [ ] Record certification receipt and 9/9 pilot coverage
- [ ] Obtain explicit authorization before any production deployment or migration
