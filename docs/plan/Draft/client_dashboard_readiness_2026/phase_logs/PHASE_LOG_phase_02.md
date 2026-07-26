# Phase log — Phase 02

**Started:** 2026-07-26
**Status:** IN PROGRESS
**Product code changed:** yes — test-first security/data invariants

## Batch 01

- Replaced destructive ScanLog deletion with organization-scoped redaction of
  expired optional UTM attribution fields.
- Preserved access decisions, timestamps, gate/QR/operator attribution,
  deduplication IDs, audit trail/notes, linked incidents/attachments, and
  arrival notification evidence.
- Replaced the destructive confirmation/UI language with an explicit metadata
  redaction contract.
- Added permission-gated, tenant-scoped, atomic API-key revocation history.
- Excluded `keyHash` and raw credential material from reads, receipts, logs, and
  evidence.
- Reconciled the deterministic API-control matrix; three carried gaps remain.

## Errors and root causes

- A focused Jest path containing `[id]` was interpreted as a regex and matched
  no tests. `--runTestsByPath` is required for literal dynamic-route paths.
- A build verification retry encountered the active Next build lock because the
  original build continued after output capture ended. The existing build was
  allowed to release its lock before a clean network-enabled rerun.
- The first Batch 02 production build could not fetch configured Google Fonts
  inside the network sandbox. A network-enabled rerun compiled successfully.
- Batch 04 lint rejected a control-character regular expression. Replacing it
  with an explicit code-point check preserved validation without a rule bypass.

## Batch 02

- Removed browser persistence and console logging of full AI conversations.
- Added automatic removal of the legacy transcript key for shared-device
  safety; explicit clear uses the same cleanup path.
- Made the memory-only, reload-clears retention behavior visible in English and
  Arabic.
- Centralized AI durable-log filtering for emails, phone numbers, bearer
  credentials, GateFlow credential values, JWT-like values, and common secret
  assignments.
- Reconciled the deterministic API-control matrix; two carried gaps remain.

## Batch 03

- Fixed the incompatible single-create and bulk-create QR email request shapes
  without trusting either caller-provided QR content or short URLs.
- Made the tenant-owned database QR credential the only attachment source.
- Added per-tenant-actor email rate limiting and generic, non-PII responses.
- Added append-only attempted/succeeded/failed delivery receipts with no
  recipient identity, credential, URL, provider error message, or secret.
- Kept delivery failure distinct from success-receipt persistence failure so a
  delivered email is never falsely classified as failed.
- Reconciled the deterministic API-control matrix; one carried gap remains.

## Batch 04

- Retired the unauthenticated, ID-only QR campaign mutation endpoint; it had no
  repository caller and now returns 410 before input or database access.
- Kept UTM capture on the stored short-link path, where tenant/project scope is
  derived rather than caller supplied and click evidence is append-only.
- Bounded and control-character-checked all UTM labels and user-agent metadata.
- Removed client IP persistence and used a hashed network fingerprint only for
  per-link attribution rate limiting.
- Kept valid pass rendering available when attribution is throttled or logging
  fails.
- Reconciled the deterministic API-control matrix; zero explicit gaps remain.

## Batch 05 — Fresh security evidence

- Confirmed the removed bootstrap/reset route remains absent.
- Re-ran current-tree and recent-history secret scans. Candidate review found
  and redacted a credential-shaped Upstash example in an archived audit
  document; no value is copied into plan evidence.
- Re-ran the tenant heuristic: 70 candidates remain, with no new route family
  outside the existing disposition register.
- Passed all 58 Workflow v2 contract tests.
- Dependency advisory scanning remained unavailable because the sandbox could
  not fetch advisories and two network-approval retries timed out.
- Confirmed the inherited credential-rotation receipt is still pending in the
  approved operations system. Phase 02 remains in progress.

## Batch 06 — Dependency advisory remediation

- Re-ran the high-severity advisory gate with registry access. It identified
  `brace-expansion` 5.0.7 under GHSA-mh99-v99m-4gvg.
- Raised the root transitive override to `brace-expansion >=5.0.8` and updated
  the lockfile references without changing direct application dependencies.
- Re-ran `pnpm check:security:fail`: no high+ vulnerabilities across 1,742
  lockfile packages.
- Kept Phase 02 in progress because dependency cleanliness does not substitute
  for the approved credential-rotation/revocation receipt.

## Batch 07 — Operations evidence recheck

- Rechecked plan, audit, operations-documentation, and Workflow v2 evidence
  locations for a non-sensitive credential-rotation receipt.
- No completed receipt was found; the inherited audit-remediation records and
  current security evidence continue to mark it pending.
- Made no credential, deployment, environment, or production mutation because
  Phase 02 explicitly excludes those actions.
- Phase 02 remains stopped at its sole external gate.

## Batch 08 — Machine-readable gate and credential inventory

- Added a Workflow v2 `externalGates` contract and regression test so pending
  operations evidence appears in `/guide --json`.
- Recorded the credential-rotation receipt gate in the focused application
  state with names and environments only.
- Verified all 59 Workflow v2 tests and confirmed the guide now reports the
  receipt blocker.
- Used read-only Vercel CLI inventory for `gateflow-client-dashboard`;
  retrieved no secret values.
- Confirmed `SETUP_SECRET` and `JWT_SECRET` are absent. Confirmed
  `NEXTAUTH_SECRET`, `ADMIN_ACCESS_KEY`, and both Upstash variables exist in
  Production, Preview, and Development.
- Stopped before mutation: Upstash must issue/revoke its credential first, and
  live session-secret rotation requires a coordinated Vercel update and
  redeploy.

## Batch 09 — `/check all`

- Verified the replacement local Upstash credentials with a live read-only
  `PING`; no values were printed.
- Fixed a flaky invalid-signature test whose mutation had a 1-in-16 chance of
  producing the original valid HMAC.
- Passed Client Dashboard lint with zero errors/278 baseline warnings,
  typecheck, 73 active suites/391 tests, and the production build.
- Passed all 59 Workflow v2 tests, bootstrap route guard, reviewed secret scan,
  and high-severity advisory scan across 1,742 packages.
- Validated all nine page-score records and freshness.
- Recorded `/check all` as blocked: the operations receipt is still missing,
  and focused-diff rejects the justified root dependency override paths.
- Reconciled focused-diff with a narrow rule permitting only root
  `package.json` and `pnpm-lock.yaml` dependency manifests. Arbitrary root
  files remain rejected; the focused-diff gate now passes.

## Verification

- Red tests reproduced legacy ScanLog deletion and unaudited/unpermissioned
  API-key deletion.
- Focused green: 2 suites, 7 tests.
- Focused Batch 02 green: 3 suites, 13 tests.
- Focused Batch 03 green: 1 suite, 6 tests.
- Focused Batch 04 green: 3 suites, 6 tests.
- Full green: 73 suites, 391 tests; 1 suite/25 tests skipped.
- Lint passed with 278 existing warnings; typecheck passed.
- Production build passed; known middleware and Prisma warnings remain.
- Root `pnpm preflight` passed on 2026-07-26 after focused-diff reconciliation,
  covering changelog and policy checks, lint, typecheck, and workspace tests.
- Fresh `/check all` after the credential cutover passed lint, typecheck, all
  391 active tests, production build, Workflow v2, bootstrap, secret/advisory,
  page-evidence, and operations-evidence gates. It remains blocked only because
  focused-diff rejects the commit-hook-required root `CHANGELOG.md` entry.

## Resume

Reconcile the narrow `CHANGELOG.md` focused-diff exception, rerun `/check all`,
and do not mark Phase 02 complete until the resulting evidence is green.
