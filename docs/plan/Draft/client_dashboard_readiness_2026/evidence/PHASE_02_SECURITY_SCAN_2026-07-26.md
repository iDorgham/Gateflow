# Phase 02 fresh security scan — 2026-07-26

**Status:** PARTIAL — code, dependency, and local containment gates are green;
the operations receipt remains open.

## Results

| Gate                              | Result      | Evidence                                                                                                                                               |
| --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bootstrap/reset route             | PASS        | `pnpm check:bootstrap-routes` reports clean                                                                                                            |
| Current-tree secret scan          | REVIEWED    | 3 medium false positives remain: one scanner test mock and two archived documentation placeholders                                                     |
| Recent-history secret scan        | PASS        | `pnpm check:secrets:history` reports zero findings across the configured 100-commit window                                                             |
| Workflow v2 contract              | PASS        | 58 tests passed                                                                                                                                        |
| API method register               | PASS        | 170 unique methods, zero `needs-review`, zero explicit carried gaps                                                                                    |
| Tenant heuristic                  | REVIEWED    | 70 candidates; no new route family outside the existing manually dispositioned register                                                                |
| High-severity dependency advisory | PASS        | `pnpm check:security:fail` reports no high+ vulnerabilities across 1,742 lockfile packages after upgrading the `brace-expansion` override to `>=5.0.8` |
| Credential rotation receipt       | PENDING OPS | approved operational receipt has not been provided                                                                                                     |

## Containment finding

Review of the secret-scan candidates found an archived audit document containing
an unredacted credential-shaped Upstash endpoint/token example. The values were
removed from the repository document and replaced with `[REDACTED]`. Because
the document described them as live credentials, operations must treat that
credential as potentially exposed: rotate/revoke it in the provider, verify the
old credential no longer works, and record only a non-sensitive receipt in the
approved operations system.

## Required non-sensitive operations receipt

The receipt must identify the environment and credential names, completion
timestamp, operator/approver reference, old-credential revocation confirmation,
session invalidation where applicable, and post-rotation verification result.
It must not contain old/new secret values, hashes, connection strings, tokens,
passwords, or screenshots exposing them.

At minimum, the inherited audit-remediation gate covers `SETUP_SECRET` (if it
was configured), affected administrator credentials, and JWT/session signing
secrets for environments where the removed reset route may have been live. The
newly contained Upstash credential candidate must also be included.

## Environment-name inventory

A read-only `vercel env ls` inventory of the linked
`gateflow-client-dashboard` project confirmed the following without retrieving
values:

| Credential name            | Environments                     | Rotation disposition                                                                    |
| -------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| `SETUP_SECRET`             | Not configured                   | Record as not configured; no Vercel rotation required                                   |
| `JWT_SECRET`               | Not configured                   | Runtime uses `NEXTAUTH_SECRET`; no separate Vercel rotation required                    |
| `NEXTAUTH_SECRET`          | Production, Preview, Development | Rotate in Vercel, redeploy affected environments, and verify old sessions are invalid   |
| `ADMIN_ACCESS_KEY`         | Production, Preview, Development | Confirm consumer/owner, rotate in Vercel, and verify the old key is rejected            |
| `UPSTASH_REDIS_REST_URL`   | Production, Preview, Development | Update only after provider-side credential rotation identifies the replacement endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Production, Preview, Development | Rotate/revoke at Upstash first, then update Vercel and verify rate limiting             |

`QR_SIGNING_SECRET` is configured but is not included in this incident scope;
rotating it would invalidate signed QR credentials and requires a separate
compatibility/rollout decision.

Workflow v2 now records this receipt as a machine-readable `externalGates`
entry. `/guide --json` reports it as a blocker until its status is changed only
after the approved receipt exists.

Local configuration verification confirms `.env` and
`apps/client-dashboard/.env.local` are gitignored, contain matching non-empty
Upstash REST entries, and pass a live read-only Redis `PING`. No values were
printed or recorded. This does not update or verify Vercel environments.

## Exit blockers

1. Receive the approved non-sensitive operations receipt.

The dependency advisory and fresh tenant reconciliation gates are complete.
Phase 02 remains open solely because the potentially exposed credentials cannot
be considered remediated until operations records rotation/revocation.
