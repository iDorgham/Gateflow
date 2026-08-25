# Command Runbook — GateFlow Readiness and Egypt/MENA Market Leadership

This runbook is the copy-paste path for Cursor, Claude, and `.agents` command surfaces. `/guide` only directs work; `/dev` executes exactly one approved phase. Do not use `/run all` for this plan: every phase has production/security decision gates.

## One-time plan preparation

Run these in the workspace command chat, in order:

```text
/guide ready
/draft gateflow_readiness_market_leadership_2026 continue
/prompt gateflow_readiness_market_leadership_2026
/plan gateflow_readiness_market_leadership_2026
```

Review the generated `PLAN_...md` and each `phases/NN_*/PROMPT_phase_NN.md`. Do not start development until the P0 owners, dates, release-hold decision, and discovery budget are approved. Then:

```text
/ready
/dept security
/dev gateflow_readiness_market_leadership_2026 1
```

When a phase is in `Ready`, `/dev` moves it to `Active`. Update the backlog whenever a plan is moved between lifecycle directories.

## Shared operating rules for every phase

- Use pnpm only. Preserve existing user changes; do not reset or discard unrelated work.
- Start with the plan/session context, then inspect exact code before deciding a fix.
- For behavior changes: write a failing focused test first, implement, then run targeted checks before broad checks.
- Scope all tenant reads/writes by `organizationId`; use `deletedAt: null`; preserve QR signing and offline replay protections.
- Never put secrets in source, docs, tests, logs, issue text, or commits.
- Record commands, results, decisions, and blockers in the phase log and `SESSION_MEMORY.md` after each phase.
- Stop if a required external authority is missing: credential rotation approval, production log access, legal review, staging database access, or customer/pilot commitment.

## Phase 1 — Release hold and evidence baseline

**Department:** security + release engineering  
**Preferred command path:**

```text
/dept security
/dev gateflow_readiness_market_leadership_2026 1
```

**Paste as the phase instruction if the generated phase prompt needs refinement:**

```text
Implement Phase 1 only: establish GateFlow's release hold and evidence baseline. Do not change product behavior yet.

Read the deep audit, the generated plan, TASKS, SESSION_MEMORY, current git status, CI workflows, and deployment/check scripts. Create durable release evidence and a P0/P1 ownership matrix. Confirm whether api/setup/reset-admin could have been deployed; do not expose secrets or credentials. Define the incident-response decision path, deployment-hold rule, and rollback owner.

Use pnpm only. Preserve unrelated changes. Do not claim production exposure has been checked unless the required log/deployment access exists.

Acceptance criteria:
- P0/P1 findings each have a DRI, due date, remediation, verification, rollback, and dependency.
- Release-hold and exception process is documented.
- Evidence captures current dependency/security, CI, environment, migration, and deployment status without secrets.
- TASKS, phase log, and SESSION_MEMORY are updated.

Validation: pnpm plan:status; pnpm check:env; pnpm check:secrets; pnpm check:security; pnpm check:pre-deploy; pnpm docs:changelog:check.
```

## Phase 2 — P0 security remediation

**Department:** security + backend API  
**Preferred command path:**

```text
/dept security
/dev gateflow_readiness_market_leadership_2026 2
```

```text
Implement Phase 2 only: remove the P0 access-control paths found in the GateFlow deep audit.

Delete the deployable reset-admin setup route and replace any legitimate development bootstrap need with a local-only, interactive workflow that has no default secret or password. Make the AI cron route fail closed if CRON_SECRET is missing, malformed, or invalid; protect it against replay/concurrent execution. Require explicit workspace-management/tenant-admin authorization for workspace deletion and return 403 for insufficient roles. Review all related dangerous/admin/cron routes for the same authorization pattern.

Use TDD: first add focused regression tests for unauthenticated, missing-secret, wrong-secret, low-privilege, valid privileged, and concurrent/replay paths. Maintain organizationId and deletedAt invariants. Do not log secrets or raw credentials. If credential rotation/log review needs external access, document the required action rather than pretending it happened.

Acceptance criteria:
- reset-admin route is absent from production route/build surface.
- cron fails closed and is tested.
- workspace deletion denies low-privilege users and is tested.
- every changed destructive route validates input and records an appropriate audit event.
- targeted tests, lint, typecheck, security checks, and preflight pass or blocking failures are documented.
```

## Phase 3 — CI, dependency, quality, and deploy gates

**Department:** DevOps + platform engineering  
**Preferred command path:**

```text
/dept devops
/dev gateflow_readiness_market_leadership_2026 3
```

```text
Implement Phase 3 only: repair GateFlow's release guardrails so CI outcomes are trustworthy.

Fix check-imports, todos, check-db-drift, and check-bundle-size repository-root resolution. Extract a shared robust root resolver if that avoids future drift. Add tests/smoke assertions proving source/build scanners report expected non-zero input when relevant artifacts exist. Upgrade/lock vulnerable dependencies through a focused branch with a compatibility matrix; do not use a blind mass update. Make critical advisories, full-tree secret scans, migration checks, bundle budgets, and pre-deploy checks meaningful CI gates with time-bounded approved exceptions only.

Do not alter root package scripts contrary to workspace conventions. Keep ai:sync and ai:check inside docs/workspace/template-project only.

Acceptance criteria:
- all repaired scripts find the repo root and report credible scan counts.
- CI invokes the repaired checks in blocking mode.
- critical dependency exceptions are owned, justified, and expiry-bound.
- clean install/build/test/deploy evidence is documented.
- changelog/backlog/phase log/session memory are updated.
```

## Phase 4 — Migration, privacy, and tenant-isolation foundation

**Department:** database + security/compliance  
**Preferred command path:**

```text
/dept database
/dev gateflow_readiness_market_leadership_2026 4
```

```text
Implement Phase 4 only: make GateFlow's data layer deployable, tenant-safe, and privacy-governed.

First determine the production-authoritative Prisma schema and migration history. Do not create/apply migrations against unknown production state. Build a baseline migration plan and staging restore/migrate/rollback drill using DIRECT_DATABASE_URL for Prisma CLI operations. Define retention, data classification, export/deletion, audit, encryption, and legal-hold requirements for identity, visitor, resident, QR, scan, device, payment, and AI-related data. Expand automated tenant-isolation tests for high-risk models and destructive operations.

Compliance output must be a readiness pack for counsel review, not a claim of legal compliance. Preserve soft deletes unless an approved retention/purge policy explicitly requires otherwise.

Acceptance criteria:
- staging migration and rollback/restore evidence exists.
- tenant-isolation negative tests cover core records and destructive actions.
- privacy/data-governance pack has clear owners and legal-review dependencies.
- migration/deploy/runbook changes are documented and verified.
```

## Phase 5 — Reliability, performance, and observability

**Department:** platform reliability + performance  
**Preferred command path:**

```text
/dept performance
/dev gateflow_readiness_market_leadership_2026 5
```

```text
Implement Phase 5 only: establish measurable GateFlow reliability and performance controls.

Repair/enforce bundle baselines and define route/API/database SLOs for QR validation, scan ingestion, offline sync, webhooks, exports, analytics, and dashboard access. Add structured privacy-safe logs, correlation IDs, error reporting/tracing hooks, health/uptime signals, queue metrics, and alert runbooks. Build load/reliability tests for peak gate traffic, QR replay, offline reconciliation, webhook retry, exports, and high-cardinality analytics. Move request-bound long-running AI/export work into durable workers only where required by measured evidence.

Use actual profiles/query plans before adding indexes, caches, or infrastructure. Do not report a performance improvement without before/after measurement.

Acceptance criteria:
- baseline bundle/API/database metrics and SLOs are stored.
- alerts and runbooks are actionable without revealing PII/secrets.
- peak and offline reliability tests meet approved targets or clearly block the next phase.
- all performance changes have measured evidence and regression coverage.
```

## Phase 6 — Dashboard analytics and security intelligence

**Department:** analytics + performance + product design  
**Preferred command path:**

```text
/dept analytics
/dev gateflow_readiness_market_leadership_2026 6
```

```text
Implement Phase 6 only: improve GateFlow dashboards as high-density, decision-first operational intelligence.

Start with the KPI dictionary and decision map in RELEASE_AND_DASHBOARD_SPEC.md. For each chart, name the user decision, formula, source, organizationId/permission boundary, timezone, time grain, freshness, drill-down, empty/error state, and success metric. Prioritize security command center, gate operations, visitor/contractor trust, and site-health views. Aggregate on the server; do not send raw unbounded scan data to clients. Preserve deletedAt filtering and add tenant-isolation tests for APIs, exports, drill-downs, and caches.

Use ADS tokens, high-density layouts, fixed-height responsive containers, RTL validation, keyboard/text/table alternatives, and URL-backed filters. Measure API/query/client/bundle impact before and after. Avoid decorative charts and unverified KPIs.

Acceptance criteria:
- each chart answers a named decision and leads to a permission-safe drill-down.
- KPI contracts and data-quality states are documented and tested.
- charts are responsive, accessible, RTL-safe, and stable without CLS.
- dashboard performance baselines and regressions are recorded.
```

## Phase 7 — Egypt pilot wedge and integration enablement

**Department:** product + Arabic UX + partnerships  
**Preferred command path:**

```text
/dept product
/dev gateflow_readiness_market_leadership_2026 7
```

```text
Implement Phase 7 only: turn GateFlow's readiness work into an Egypt-first paid-pilot offering.

Do discovery with target compounds, commercial facilities, and security/facility integrators before committing features. Convert validated needs into scoped pilot workflows: Arabic/English guard and resident operations, signed offline QR validation/revocation, visitor pre-approval, contractor credentials/expiry, access zones/time windows, incident/audit evidence, and an integration-certification path. Define paid pilot package, onboarding checklist, hardware compatibility boundaries, support model, success metrics, and reference-permission process.

Do not build speculative integrations or make market/compliance claims without evidence. Preserve accessibility, RTL, and privacy requirements in every pilot workflow.

Acceptance criteria:
- discovery evidence and a ranked problem list exist.
- at least one paid-pilot proposal/playbook is ready with measurable success criteria.
- integration contract/certification scope is documented.
- product changes are gated by security, offline reliability, and Arabic UX tests.
```

## Phase 8 — GCC/MENA expansion readiness

**Department:** strategy + enterprise platform + partnerships  
**Preferred command path:**

```text
/dept strategy
/dev gateflow_readiness_market_leadership_2026 8
```

```text
Implement Phase 8 only: define a controlled GCC/MENA expansion readiness gate after Egypt pilot evidence exists.

Assess Saudi and UAE entry in order of verified partner demand, procurement fit, data-hosting/transfer requirements, support capacity, pricing, tax, and legal review. Specify the platform capabilities required before any sale: enterprise identity/SSO, delegated administration, audit exports, data residency configuration, subprocessors, Arabic/English support, device connector compatibility, partner certification, SLA, incident communication, and deployment playbooks.

Do not announce a country launch or claim regulatory compliance. Produce a decision memo: proceed, defer, or decline, with evidence and costed gaps.

Acceptance criteria:
- Egypt pilot results are measured and reviewed before expansion decision.
- each target country has legal, partner, data, support, and commercial gates.
- enterprise capability gaps have owners and sequenced delivery work.
- final decision memo and next-plan recommendation are complete.
```

## Per-phase closeout

After every green phase:

```text
/test
/github
/guide phase <next-number>
```

If the phase is not green, stay in the same phase and use `/security`, `/perf`, or `/clis` for focused diagnosis. Do not advance merely because a partial implementation exists.
