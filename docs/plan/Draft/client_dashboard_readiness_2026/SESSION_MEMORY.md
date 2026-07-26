# SESSION MEMORY — client_dashboard_readiness_2026

## Active state

- Plan status: Draft; Phase 02 in progress
- Focused app: `client-dashboard`
- Workflow stage: `developing`
- Last commit: `52f26767da499e584a29ba01e99eb66ef92b8241`
- Product code changed: yes — Phase 02 security/privacy invariants
- Exact next action: obtain and verify the non-sensitive ops rotation receipt

## Durable decisions

- The 2026-07-25 audit is the baseline; do not silently recalculate or discard it.
- This plan becomes the single writer path for Client Dashboard readiness.
- Existing completed remediation evidence is reused, not reimplemented.
- Static scanner counts are triage queues, not vulnerability counts.
- Security invariants and trustworthy tests precede performance/UI polish.
- Performance work must be measured before and after.
- Preview/production changes require their own authorization.
- Current route truth is 44 pages (43 production-intended plus one fixture),
  123 API routes, and 170 HTTP handlers with exact build parity.
- Current tenant scan returns 72 candidates: 32 safe relation/precheck, 18
  request-local/self/token, 18 regex false positives, 3 privileged/signed, and
  1 confirmed candidate defect.

## Discovered gotchas

- Valid authenticated claims may have a null `orgId`; tenant checks must reject
  missing organization context rather than conditionally skipping comparison.
- Scoping a parent Contact does not scope caller-supplied Unit IDs.
- The deterministic scanner truncates nested Prisma `where` objects and can
  report safe calls; every candidate needs source review.
- Resident activation and general optional scan notes are not implemented by
  the Client Dashboard seams described in the original pilot prose.
- Nested relation validation must deduplicate IDs and match an organization-
  and soft-delete-scoped result exactly; silently filtering IDs is unsafe.
- Middleware comments can describe a control that never runs when its matcher
  excludes the affected route family.
- A matcher-only CSRF fix breaks legacy raw fetches; the compatibility bridge
  accepts a missing token header only with a verified same-origin Origin.
- `resident/push/send` had no repository caller and duplicated push behavior in
  trusted flows, so it is disabled instead of receiving a new public contract.
- AI action execution must accept only the action ID; action type and intent are
  read from a tenant/user-owned pending record and claimed atomically.
- A resident-arrival QR ID is not authority. The short-link renderer mints a
  five-minute purpose-bound HMAC capability; the API also requires a successful
  scan in the last 15 minutes, throttles requests, and atomically claims the
  notification timestamp.
- A durable webhook replay marker cannot be consumed before business processing:
  a downstream failure would permanently suppress a legitimate retry. Replay
  consumption and business writes must commit or roll back together.
- Perimeter and WhatsApp now sign `${timestamp}.${eventId}.${rawBody}`, accept
  only a ±5-minute window, and use an advisory-locked AuditLog marker in the
  same transaction as business writes. External notifications run only after a
  new event transaction commits.
- The API-control register is deterministically reproducible from source and
  contains 170 unique rows, zero `needs-review`, and five explicit lower-risk
  gaps assigned to Phase 02/P2.
- ScanLog retention now redacts only expired UTM attribution fields. Decision,
  time, gate, QR, operator, device, audit trail, notes, incidents, attachments,
  and arrival evidence remain intact.
- API-key revocation requires `workspace:manage` and atomically writes a
  non-secret AuditLog receipt before deleting the credential. `keyHash` is
  neither selected nor persisted in audit metadata.
- AI conversations are memory-only in the Client Dashboard. The assistant
  removes the legacy localStorage transcript on mount/clear, does not log full
  messages to the browser console, and states that reload clears history.
- Durable AI action prompts/results filter contact identifiers and common
  credential shapes before persistence.
- QR email delivery resolves the signed credential from the tenant-owned
  database record, rate-limits per tenant actor, and writes linked append-only
  attempted/outcome receipts without recipient PII or credential values.
- Single-create and bulk-create recipient payload shapes are both accepted;
  caller QR strings and short URLs are ignored.
- External email delivery and AuditLog writes cannot be atomic. The route
  appends an attempt before sending, then a distinct outcome; failure to persist
  a success receipt is not reclassified as delivery failure.
- The orphan public UTM POST route is retired. Supported attribution is an
  append-only ShortLinkClick derived from the stored link's tenant/project
  scope; labels are bounded, IP is not persisted, and writes are rate-limited
  using a hashed network fingerprint.
- The deterministic 170-method API register now has zero explicit carried gaps.
- Fresh local gates: bootstrap guard clean, recent 100-commit secret scan clean,
  Workflow v2 58/58, and tenant heuristic 70 reviewed candidates with no new
  route family.
- Candidate review found and redacted a credential-shaped Upstash example in an
  archived audit document. Treat it as potentially exposed until operations
  confirms rotation/revocation in the approved receipt.
- The high-severity advisory gate initially found `brace-expansion` 5.0.7
  (GHSA-mh99-v99m-4gvg). The root override and lockfile now resolve 5.0.8;
  `pnpm check:security:fail` reports no high+ vulnerabilities across 1,742
  lockfile packages.
- The 2026-07-26 Batch 07 repository/evidence recheck found no completed
  non-sensitive credential-rotation receipt. Phase 02 remains stopped without
  performing any provider, environment, deployment, or credential mutation.
- Workflow v2 now supports machine-readable application `externalGates`; the
  pending rotation receipt is surfaced by `/guide --json`. All 59 workflow
  tests pass.
- Read-only Vercel inventory found no configured `SETUP_SECRET` or
  `JWT_SECRET`. `NEXTAUTH_SECRET`, `ADMIN_ACCESS_KEY`,
  `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` exist across
  Production, Preview, and Development. No values were retrieved.
- Upstash provider rotation must precede the Vercel variable update. Rotating
  `NEXTAUTH_SECRET` also requires an affected-environment redeploy to invalidate
  live sessions. `QR_SIGNING_SECRET` is outside the incident scope because
  changing it invalidates signed QR credentials.
- The replacement local Upstash REST configuration is gitignored, matches
  between root `.env` and Client Dashboard `.env.local`, and passed a live
  read-only Redis `PING`. Vercel values remain unchanged/unverified.
- `/check all` on 2026-07-26 is recorded in
  `evidence/CHECK_ALL_2026-07-26.json`: lint/typecheck/tests/build, Workflow v2,
  bootstrap, secret/advisory, and page evidence gates passed. A flaky webhook
  signature test was repaired. The check remains blocked by the missing
  operations receipt. Focused-diff now narrowly permits root `package.json`
  and `pnpm-lock.yaml` while continuing to reject arbitrary root files.
- Root `pnpm preflight` passed after that reconciliation, covering changelog
  and policy checks, lint, typecheck, and all workspace tests. The verified
  Phase 02 diff is ready to commit before Vercel cutover.
- The workspace owner confirmed the old Upstash database/token was deleted.
  Replacement values were applied to Client Dashboard Production, Preview, and
  Development in Vercel and verified against temporary environment pulls
  without recording values. The receipt remains partial until the rotated
  authentication and administrator credentials are activated by redeployment
  and session invalidation is verified.
- New high-entropy `NEXTAUTH_SECRET` and `ADMIN_ACCESS_KEY` values were
  generated in process memory and installed across the same Vercel targets.
  Structural verification passed. Vercel stores each as one shared variable
  targeting all three environments. Redeployment and session invalidation
  verification completed on production deployment
  `dpl_9639HfY4Arjx881gVe4GzXH6oTLD`. Root/login returned 200, stale-format
  session cookies were redirected to login, and Vercel reported no runtime
  errors. The credential-rotation external gate is complete.
- The production redeploy used existing master source commit
  `52f26767da499e584a29ba01e99eb66ef92b8241`. Phase 02 branch commits are not
  deployed yet. `/health` returns 404 because the configured rewrite targets a
  route absent from that source; track this as development reliability work.

## Handoff

Resume Phase 02 by rerunning `/check all`, then continue only after its current
evidence is green. Read `evidence/PHASE_01_SECURITY_CLASSIFICATION.md` and the
Phase 01 log first.

## Context budget

- Loaded L0–L3 and L5–L6: git history/status, TASKS, PLAN quality gates,
  Phase 02 prompt, SESSION_MEMORY, Phase 02 ledger/log, inherited remediation
  rotation requirements, secret/tenant/bootstrap scanners, workflow checks,
  archived candidate evidence, and operations receipt policy.
- Phase log updated: `phase_logs/PHASE_LOG_phase_02.md`.
