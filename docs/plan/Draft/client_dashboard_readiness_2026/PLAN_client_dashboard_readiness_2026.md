# PLAN — client_dashboard_readiness_2026

**Status:** Draft
**Date:** 2026-07-25
**Focused app:** `apps/client-dashboard`
**Primary branch:** `fix/client-dashboard-readiness-2026`
**Evidence:** `docs/audits/client-dashboard/AUDIT_2026-07-25.md`
**Page scores:** `docs/audits/client-dashboard/PAGE_SCORES_2026-07-25.json`

## Outcome

Make Client Dashboard safe and predictable for continued development and ready
for pilot certification. Close the audit's security and operational blockers,
establish measured performance budgets, restore trustworthy test behavior, and
produce browser evidence for the nine pilot outcomes.

This plan creates no production deployment authorization. Preview deployment
and production promotion remain explicit gated actions.

## Ownership and overlap

- This plan is the single implementation owner for Client Dashboard readiness.
- Completed work in `audit_remediation_2026` Phases 1–3 remains accepted
  evidence; its open Phase 4 items and credential-rotation receipt must be
  reconciled into Phase 01 here before either plan is closed.
- `gateflow_workflow_bootstrap` Phase 00 remains complete. Its proposed Phases
  01–06 are superseded by this evidence-based plan; its Resident Portal focus
  transition remains out of scope until Client Dashboard certification.
- Use one primary writer per phase. Parallel agents may review or investigate
  read-only, but must not edit the same phase.

## Locked pilot journey

```text
Admin creates/imports a resident contact
→ invitation is sent
→ resident activates
→ resident creates a guest QR permission
→ permission appears in Client Dashboard
→ security scans the QR
→ scanner accepts or denies deterministically
→ security adds an optional note
→ event appears in Client Dashboard access log
```

Required denial evidence: expired, revoked, tampered signature, wrong gate,
wrong tenant/project, already used/replayed, not active yet, usage limit
reached, and offline/interrupted policy.

## Phases

| Phase | Title                                     | Outcome                                                                                                            |
| ----- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 01    | Scope, ownership, and risk classification | Reconcile active plans; lock route/API/pilot inventory; manually disposition security scan candidates              |
| 02    | Security and data invariants              | Preserve access evidence, revocation history, tenant isolation, validation, abuse controls, and privacy boundaries |
| 03    | Development and test reliability          | Remove hidden test leaks/skips, ratchet warnings, and keep focused checks reproducible                             |
| 04    | Performance and runtime readiness         | Establish baselines/budgets, fix measured bottlenecks, health/runtime/build warnings, and remeasure                |
| 05    | Accessibility, RTL, and page readiness    | Validate P0 pages in English/Arabic across keyboard, mobile, and desktop workflows                                 |
| 06    | Pilot and deployment certification        | Prove nine pilot outcomes, focused/root gates, preview health, rollback readiness, and certification evidence      |

## Global guardrails

- App scope is `apps/client-dashboard`. Shared package or Prisma changes require
  a written impact note and focused tests for every affected consumer.
- Never weaken authentication, permission, tenant, signature, replay, audit, or
  retention controls to make a check pass.
- `ScanLog` decisions are append-only evidence. Any retention behavior must use
  an approved archival/redaction model rather than destructive deletion.
- Never log or persist secrets, tokens, raw credentials, or unnecessary
  resident/QR/scan content.
- Prisma operations must be classified against actual model ownership; do not
  add `deletedAt` filters to models that do not define that field.
- Use Node.js/Fluid Compute defaults on Vercel; do not introduce Edge runtime
  merely for streaming or middleware.
- Run Vercel CLI from the repository root. Do not deploy, migrate, push, merge,
  or rotate credentials without explicit authorization.
- Branches must satisfy the repository pre-push convention, for example
  `fix/client-dashboard-readiness-phase-02`; do not use `codex/`.

## Quality gates

Each phase must run its focused tests. Before Phase 06 can pass:

```bash
pnpm --filter client-dashboard lint
pnpm --filter client-dashboard typecheck
pnpm --filter client-dashboard test
pnpm --filter client-dashboard build
pnpm preflight
pnpm workflow:v2:check
```

`pnpm preflight` takes no extra flags. Security-critical negative tests,
cross-tenant tests, and browser evidence are mandatory; green compilation alone
is not certification.

## Exit criteria

- No unresolved P0/P1 security finding.
- All 73 tenant-scan candidates have reviewed dispositions and tests/evidence
  for unsafe or privileged cases.
- Scan events and API-key revocation retain auditable history.
- AI transcript retention and shared-device behavior are explicit and tested.
- Focused tests exit naturally without `--forceExit`; security-relevant skips
  are resolved or approved with owner and expiry.
- Performance budgets are measured before and after; regressions fail a gate.
- Health endpoint and preview probes pass.
- Nine pilot outcomes have fresh English/Arabic, mobile/desktop evidence where
  UI is involved.
- Page scores are refreshed without the static-review-only cap.
- Workflow v2 certification receipt is recorded before focus changes.

## Stop conditions

Stop and escalate on confirmed cross-tenant access, signature/replay bypass,
destructive audit-event loss, exposed credentials, destructive migration, or a
required production-only action. Do not continue to later phases while a
critical/high security finding remains unresolved.
