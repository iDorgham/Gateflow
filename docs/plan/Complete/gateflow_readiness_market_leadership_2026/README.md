# GateFlow Readiness and Egypt/MENA Market Leadership Plan

**Status:** Draft  
**Owner:** GateFlow product and engineering  
**Created:** 2026-07-16  
**Planning horizon:** Immediate hardening through 24 months  
**Source:** [2026 deep audit](../../../audits/GATEFLOW_DEEP_AUDIT_2026-07-16.md)

## Decision summary

GateFlow should not pursue more feature breadth before the platform is demonstrably secure, deployable, and operable. The next development phase starts with release readiness, then turns the resulting trust posture into a product advantage for Egyptian compounds, commercial facilities, and service operators. The regional offer should be **Arabic-first, offline-resilient, hardware-agnostic, privacy-ready visitor and contractor access control**—not a generic access-control dashboard.

## Outcomes

### Release readiness (first 30 days)

1. No exposed bootstrap, fail-open scheduler, or unguarded destructive operation remains in production code.
2. Every CI guard scans real source/build artifacts and has a non-zero coverage smoke check.
3. Production schema changes use tracked Prisma migrations and an approved rollback/restore procedure.
4. Critical dependency advisories are remediated or have a named, time-limited mitigation.
5. One repeatable deployment runbook can promote staging to production with evidence.
6. Releases follow a repeatable SemVer, changelog, annotated-tag, GitHub Release, deployment, and rollback-verification process.

### Product-market readiness (3–12 months)

1. Three design-partner pilots in Egypt prove the compound, commercial building, and contractor use cases.
2. GateFlow has a local trust/compliance pack, Arabic/English operational UX, and measurable offline scanner reliability.
3. Integrators can connect supported hardware without bespoke code for each site.
4. GateFlow can expand first to GCC customers with an intentionally configured regional data, language, and reseller model.

## Non-negotiable release gate

No production deployment or major feature launch passes until all are true:

- P0 security defects are fixed and regression-tested.
- `pnpm preflight`, `pnpm check:secrets`, `pnpm check:security:fail`, `pnpm check:imports:fail`, `pnpm check:db-drift`, and `pnpm check:pre-deploy:fail` pass after the underlying checks are repaired.
- A clean install/build/test has run in CI using the locked pnpm version.
- Staging has completed smoke tests for login, tenant switching, QR generation/validation, scanner sync, webhook signatures, workspace deletion authorization, backup/restore, and rollback.
- Release owner signs an evidence checklist, including dependency status and migration status.

## Phase 0 — Stabilize scope and establish evidence (Days 0–2)

**Goal:** stop unsafe releases and give every remediation action a verified baseline.

### Tasks

- Create a release-readiness issue board with P0/P1/P2 labels and a named DRI for each item from the deep audit.
- Put a temporary deployment hold on customer-facing production releases until P0 findings are remediated.
- Inventory deployed environments and confirm whether the reset-admin endpoint was ever reachable.
- Record locked versions, CI run links, deploy target, database migration state, and current security-advisory report in `docs/operations/release-evidence/`.
- Create a short incident response decision: if the reset endpoint may have been reachable, rotate setup/admin credentials, invalidate sessions, inspect access logs, and notify affected parties using legal counsel guidance.

### Workspace commands

```bash
pnpm plan:status
pnpm check:env
pnpm check:secrets
pnpm check:security
pnpm check:pre-deploy
pnpm docs:changelog:check
```

### Exit criteria

- P0 ownership, date, and rollback plan are recorded.
- A deployment hold/release exception is visible to the team.
- The evidence folder and release checklist exist.

## Phase 1 — P0 code hardening (Days 1–5)

**Goal:** remove known account-takeover, fail-open, and destructive-authorization paths.

### Tasks

1. Delete `apps/client-dashboard/src/app/api/setup/reset-admin/route.ts` from deployable code. Replace any needed development bootstrap with a local-only, interactive CLI that has no default secret or default production credential.
2. Rotate `SETUP_SECRET`, seeded admin credentials, active sessions, and any related deployment secrets. Review gateway/WAF/application logs for calls to the retired endpoint.
3. Change `api/cron/ai-tasks` to reject when `CRON_SECRET` is absent, malformed, or incorrect. Add constant-time comparison, rate limiting, scheduler identity restrictions where supported, and idempotency/locking.
4. Require `workspace:manage` and tenant-admin authorization in `api/danger/delete-workspace`; make denied roles return 403 and log the decision.
5. Add route tests for missing secret, wrong secret, unauthenticated caller, low-privilege caller, valid caller, and replay/concurrent execution.
6. Check every route under `api/danger`, `api/admin`, `api/cron`, `api/webhooks`, `api/setup`, and all export/delete/bulk endpoints for explicit authorization, tenant scope, validation, rate limit, audit event, and CSRF/Bearer policy.

### Required validation

```bash
pnpm --filter client-dashboard test -- --runInBand
pnpm --filter client-dashboard typecheck
pnpm --filter client-dashboard lint
pnpm check:secrets
pnpm preflight
```

### Exit criteria

- The reset-admin route is absent from the production build output.
- Scheduler and workspace-deletion regression tests pass.
- Security review signs off on all P0 routes.

## Phase 2 — Repair CI, developer checks, and deployment discipline (Days 3–10)

**Goal:** replace false-green local checks with trusted release gates.

### Tasks

1. Fix repository-root resolution in `check-imports.js`, `todos.js`, `check-db-drift.js`, and `check-bundle-size.js`; use a shared root resolver anchored on `pnpm-workspace.yaml`.
2. Add tests that fail if each checker scans zero files when relevant source/build artifacts exist.
3. Ensure CI runs `check:imports:fail`, `check:db-drift`, `check:bundle`, `check:env`, and `check:pre-deploy:fail` after repairs.
4. Upgrade the secret scan from staged-only feedback to full tracked-tree CI scanning and add a release-time git-history scan.
5. Make critical dependency advisories fail the build after a short remediation window. Maintain an exception file with owner, rationale, compensating control, and expiry date.
6. Use a clean, immutable build pipeline: frozen lockfile, pinned Node/pnpm, artifact promotion from CI, environment-scoped secrets, and a post-deploy smoke test.
7. Keep `ai:sync` and `ai:check` limited to `docs/workspace/template-project/package.json`; run the workspace sync/drift validation from its intended template scope only.

### Workspace commands

```bash
pnpm docs:changelog:format
pnpm docs:changelog:check
pnpm check:imports:fail
pnpm check:db-drift
pnpm check:bundle
pnpm check:pre-deploy:fail
pnpm preflight
```

### Exit criteria

- Every repository health script reports a credible non-zero scan count.
- CI blocks a release on a real failure.
- Deployment checklist is rehearsed in staging.

### Release train policy (begins in Phase 2 and gates every production release)

| Decision | Rule |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------------------------- |
| Version type | `patch` for backward-compatible fixes; `minor` for backward-compatible capabilities; `major` only for deliberate breaking contracts/migrations with customer communication. |
| Release candidate | Created from a clean, protected release branch/commit only after all required CI and staging checks are green. |
| Changelog | Update/validate before tagging with `pnpm docs:changelog:format` and `pnpm docs:changelog:check`. |
| Version update | Run `pnpm version:bump <major                                                                                                                                               | minor | patch>` once scope is approved; review the exact metadata diff. |
| Tag | Run `pnpm version:tag "Release vX.Y.Z — summary"` only after release gates and deployment approval. Tags are annotated and trigger the GitHub Release workflow. |
| Post-release | Verify tag/release publication, production health, smoke tests, telemetry, migration state, and rollback route. |
| Rollback | Roll back the deployment first; do not rewrite/delete a published tag. Publish a corrective patch when required. |

Phase commits and implementation traceability tags are not a substitute for approved product release tags.

## Phase 3 — Database, privacy, and compliance foundation (Days 7–21)

**Goal:** make GateFlow deployable and governable for facilities handling visitor, employee, resident, and vehicle data.

### Tasks

1. Create a baseline Prisma migration from the production-authoritative schema. Validate it in a restored staging copy; do not generate a migration blindly against unknown production state.
2. Require `DIRECT_DATABASE_URL` for Prisma migration operations and preserve Accelerate/runtime URLs separately.
3. Define data classes: identity, contact, visitor, QR, scan, audit, payment, device, and AI-derived data. For each specify owner, purpose, retention, deletion/archival rule, encryption, export, and access roles.
4. Implement retention jobs for QR/scan/audit-adjacent data with legal holds and tenant configuration. Verify soft-delete filters and hard-delete exceptions explicitly.
5. Prepare an Egypt PDPL readiness pack: legal basis/notice, data-subject request workflow, processor inventory, breach response, vendor terms, cross-border transfer assessment, and DPO/representative decision with counsel.
6. Add tenant-isolation tests for every high-risk table and a periodic production-safe access-control review.

### Exit criteria

- A rollback-tested migration is applied in staging.
- The privacy/data-governance pack is reviewed by Egypt-qualified counsel.
- Tenant-isolation test coverage protects core records and destructive actions.

## Phase 4 — Reliability, performance, and observability (Days 14–45)

**Goal:** prove that GateFlow can manage access during peak entry periods and degraded connectivity.

### Tasks

1. Repair and enforce the bundle baseline; measure route/server bundle budgets per app.
2. Establish SLOs: QR validation availability/latency, scan-ingestion latency, offline sync success, webhook delivery, dashboard API p95/p99, and incident acknowledgement time.
3. Add structured logs, correlation IDs, privacy-safe error tracking, traces, uptime checks, database slow-query metrics, queue metrics, and alert routing.
4. Load-test morning/evening scan bursts, QR replay, offline-to-online reconciliation, large exports, analytics aggregation, and webhook retries using production-like multi-tenant data volumes.
5. Move report generation, exports, and long-running AI actions into durable workers with idempotency keys, retry/backoff, concurrency limits, and a dead-letter process.
6. Use composite indexes based on observed query plans, especially organization + deletedAt + status/date filters. Track index effectiveness from real slow-query evidence.

### Exit criteria

- Baselines and SLO dashboards exist.
- Peak-scan load test meets the agreed target without tenant leakage or unacceptable data loss.
- On-call has an actionable alert and rollback runbook.

## Phase 5 — Dashboard analytics and security intelligence (Days 21–60)

**Goal:** make GateFlow dashboards fast, trusted decision surfaces for gate security—not collections of decorative charts.

| User                | Decision                                       | Primary view                                                     | Required drill-down                                   |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Guard supervisor    | Where should staff intervene now?              | Access outcome and incident trend by gate/shift                  | Scan/incident list filtered to gate, time, and status |
| Facility operator   | Which gate/device/shift creates risk or delay? | Denial/override rate, scan volume, latency, offline-sync health  | Gate, device, operator, and event timeline            |
| Tenant admin        | Are visitor and contractor rules working?      | Visitor approvals, expiry/replay attempts, contractor compliance | Visitor/contractor record and audit trail             |
| GateFlow operations | Which pilot/site needs support?                | Availability, queue/retry rate, error budget, adoption           | Tenant-safe site health and support incidents         |

### Chart and data requirements

1. Define a KPI dictionary before UI work: owner, formula, inclusion/exclusion, freshness, timezone, time grain, permission model, and source tables/events.
2. Aggregate on the server by `organizationId`; never ship raw large scan datasets to browsers. Use explicit range limits, server-side table pagination, and query-plan-driven indexes.
3. Use time series for trends, stacked bars for outcome composition, heatmaps for gate/shift patterns, and tables for exact records. Avoid charts with no next action.
4. Use ADS tokens and high-density layouts; keep primary status and anomalies visible, with details in permission-safe drill-downs.
5. Every chart has fixed reserved height, responsive rendering, keyboard-readable summary, table/download fallback, and loading/empty/error states. Validate Arabic/English and RTL.
6. Defer heavy chart views, keep filters in URLs, debounce/cancel stale requests, and measure client bundle plus API p95 impact.
7. Test no data, delayed data, deleted records, cross-tenant data, timezone boundaries, partial permissions, and export parity.

### Exit criteria

- Security, gate-operations, tenant-health, and pilot-support dashboards answer named decisions and expose safe drill-downs.
- Every KPI has an approved data contract and tenant-isolation test.
- Charts are responsive, RTL-safe, accessible, and do not cause layout shift.
- Dashboard API p95, render, bundle, and query budgets are baselined; regressions are blocked where practical.

## Phase 6 — Egypt product wedge (Months 2–6)

**Positioning:** GateFlow is the operational security layer for Egyptian compounds and facilities: it unifies visitors, residents, contractors, guards, gate devices, and audit evidence in Arabic and English—even when connectivity is imperfect.

### Ideal customers

1. Residential compounds and mixed-use developers in New Cairo, 6th of October, Sheikh Zayed, the New Administrative Capital, and Alexandria.
2. Commercial offices, business parks, clinics, schools, and logistics facilities with contractor/visitor approval pain.
3. Local security-system integrators and facility-management firms that need software recurring revenue but currently deliver hardware projects only.

### Differentiated product bets

- Arabic-first guard/scanner workflows, RTL, Egyptian names/phone formats, and locally understandable permissions and incident reasons.
- Offline-first scanner with signed QR verification, revocation sync, tamper-evident audit events, and clear conflict resolution.
- Resident-to-guard workflow: pre-approve guest, share bounded QR/pass, arrival/denial notification, emergency override with reason, immutable event trail.
- Contractor/vendor credentialing: documents, expiry, zone/time access, escort requirement, safety checklist, and contractor scorecard.
- Hardware-agnostic integration layer: QR initially, then selected controller/intercom/CCTV/event integrations through documented connectors—not bespoke one-off integrations.
- Trust center: tenant isolation, audit history, local data handling, role-based access, export/delete controls, uptime and incident-status transparency.

### Commercial model

- Sell through a paid pilot: implementation fee plus recurring monthly price per gate/site/unit, with hardware integration scoped separately.
- Offer Starter (single site), Compound (multi-gate/resident), and Enterprise/Integrator (multi-site, API, SLA, SSO, data residency options) packages.
- Give integrators certified deployment training, white-label/partner portal options only after the base platform is stable, and revenue share on recurring subscriptions.

### Proof required before scale

- Three paid pilots, each with a measurable baseline and success target: guest approval time, unauthorized/replayed QR attempts caught, scan latency, offline sync rate, guard training time, resident activation, and support tickets per 1,000 scans.
- At least one integration partner can deploy without GateFlow engineering on-site.
- Customer references are permissioned and evidence-backed; avoid unverified marketing claims.

## Phase 7 — GCC/MENA expansion (Months 6–24)

### Sequencing

1. **Egypt first:** validate use cases, pricing, Arabic operations, offline performance, and partner delivery.
2. **Saudi Arabia and UAE next:** pursue security/facility integrators and multi-site developers only after country-specific legal, hosting, tax, procurement, and support requirements are approved.
3. **Broader GCC selectively:** expand where a partner brings deployments and support capacity; do not launch country-by-country merely because the app is translated.

### Capabilities required before regional sale

- Configurable regional data residency and subprocessors.
- Arabic/English support, timezone/calendar/phone configuration, and local contract templates.
- Enterprise identity: SSO/SAML/OIDC, SCIM where demanded, delegated administration, audit exports, and segregation of duties.
- Device and integration certification matrix; signed connector releases and backward-compatibility policy.
- Regional support SLA, incident communications, partner certification, and implementation playbooks.

## Market evidence and assumptions to validate

- Egypt’s Personal Data Protection Law No. 151/2020 has executive regulations issued under Ministerial Decision No. 816 of 2025; this increases the importance of defensible data governance rather than treating privacy as a future concern. Validate obligations with local counsel before making compliance claims. [Egypt PDPL regulations overview](https://consortiolawfirm.com/egypt-data-protection-law-executive-regulations-2025-english/)
- Smart-city and digitally managed development activity creates a plausible target segment, especially New Administrative Capital and new-city developments, but it is not proof of customer demand. Start with paid discovery and partner interviews. [ACUD smart city](https://acud.eg/)
- Regional access-control demand is growing with urban development and smart-city investment, but market-report numbers alone should not determine product priorities. [Middle East access-control market overview](https://www.researchandmarkets.com/reports/6202965/middle-east-access-control-market-report-size)

## Metrics and decision gates

| Metric                              |                        90-day target |                        12-month target |
| ----------------------------------- | -----------------------------------: | -------------------------------------: |
| P0 security findings open           |                                    0 |                                      0 |
| Critical dependency advisories open | 0 or approved expiry-bound exception |                                      0 |
| Release gates passing on clean CI   |                                 100% |                                   100% |
| QR validation p95                   |      Define after baseline; meet SLO |                   Sustained within SLO |
| Offline scan sync success           |                     Measure baseline | >= 99.5% on supported devices/networks |
| Paid Egypt pilots                   |                             1 signed |           3 live with renewal evidence |
| Integration partners certified      |                                    1 |                                    3–5 |
| Guard onboarding time               |                    Baseline measured |        <= 30 minutes for core workflow |
| Support tickets per 1,000 scans     |                    Baseline measured |     30% reduction quarter over quarter |

## Execution protocol

1. Keep this plan in `Draft` until P0 owners, delivery dates, and discovery budget are approved.
2. Move it to `Ready` with `pnpm plan:ready` only after those approval fields are complete, and update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` in the same change.
3. Move it to `Active` with `pnpm plan:start` only after Phase 0 evidence and release hold are in place.
4. Work one phase at a time. After each phase: add tests, run required commands, record evidence, update tasks/backlog, and then begin the next phase.
5. Use `pnpm plan:status` at every handoff and `pnpm plan:done` only when all exit criteria and release evidence are complete.

## Immediate next action

Approve Phase 0 and Phase 1 as an emergency hardening release. Do not wait for market-discovery work to begin removing the P0 defects.
