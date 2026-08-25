# CONTEXT — client_dashboard_readiness_2026

## Audit baseline

Source evidence is the 2026-07-25 Client Dashboard audit. At commit
`52f26767da499e584a29ba01e99eb66ef92b8241`, lint, typecheck, tests, and build
passed, but certification was blocked.

Material findings:

- `purge-scans` permanently deletes append-only `ScanLog` evidence.
- 73 tenant-query candidates need manual classification; they are not 73
  confirmed vulnerabilities.
- Full AI assistant messages persist in browser `localStorage`.
- Production `/health` returns 404.
- Jest uses `--forceExit`; 25 tests are skipped, including a QR validation suite.
- Lint reports 282 warnings.
- API heuristics found uneven recognizable validation and rate limiting; each
  route must be classified by method and risk.
- RTL static scan found 248 physical-direction versus 34 logical-direction
  utility occurrences.
- CSP allows `unsafe-inline` and `unsafe-eval`.
- API-key revocation hard-deletes its primary record.
- Middleware/proxy and Prisma module warnings remain.
- Pilot coverage is 0/9 and representative page scores are capped at 49 because
  browser/security evidence is absent.

## Canonical sources

- Workflow state: `.ai/workflow-v2/state.json`
- Audit: `docs/audits/client-dashboard/AUDIT_2026-07-25.md`
- Page scores: `docs/audits/client-dashboard/PAGE_SCORES_2026-07-25.json`
- Existing remediation: `docs/plan/Active/audit_remediation_2026/`
- Bootstrap history: `docs/plan/Draft/gateflow_workflow_bootstrap/`
- Workspace guidance: `docs/workspace/WORKFLOW_V2.md`

## Execution convention

Read the phase prompt completely before work. Do not edit the PLAN during
execution. Update TASKS, SESSION_MEMORY, and a phase log with decisions,
commands, evidence paths, and remaining risk. One primary writer owns a phase.
