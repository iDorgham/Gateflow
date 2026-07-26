# Phase 02 security and privacy ledger

**Date:** 2026-07-26
**Status:** IN PROGRESS

## Batch 01 — Access-event retention and credential revocation

### ScanLog privacy field map

| Field group                                                      | Purpose                                       | Retention decision           |
| ---------------------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| `status`, `scannedAt`, `gateId`, `qrCodeId`, `scanUuid`          | Access decision and deduplication evidence    | Preserve                     |
| `userId`, `deviceId`                                             | Operator/device attribution and investigation | Preserve                     |
| `auditTrail`, `auditNotes`                                       | Decision reasoning and authorized notes       | Preserve                     |
| `incidents`, `attachments`                                       | Linked security evidence                      | Preserve                     |
| `arrivalNotifiedAt`                                              | Notification idempotency evidence             | Preserve                     |
| `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm` | Optional marketing attribution                | Redact after approved cutoff |

The legacy `/api/danger/purge-scans` path remains for client compatibility but
no longer deletes ScanLog rows. It requires the explicit phrase
`REDACT SCAN METADATA`, updates only non-null UTM fields for the authenticated
organization before the selected cutoff, and records
`SCAN_LOG_METADATA_REDACTED`.

### API-key revocation receipt

Revocation requires `workspace:manage`. The key is resolved by ID and
organization inside a transaction. The receipt stores key ID, name, display
prefix, scopes, creator, creation/last-use/expiry timestamps, actor, and tenant.
The credential is deleted only after the receipt write succeeds.

The route never selects or records `keyHash` or the original key material.
Foreign and missing IDs share the same 404 response.

## Batch 02 — AI transcript privacy

Client Dashboard AI conversations are memory-only. The assistant neither reads
nor writes full messages in browser storage, and it no longer logs message
objects to the browser console. On mount and on explicit clear, it removes the
legacy `gateflow-ai-chat-v1` value so older transcripts do not remain exposed
on shared devices. The UI states that chat history clears on reload.

Durable AI action logs retain their operational purpose while filtering email
addresses, phone numbers, bearer credentials, GateFlow credential values,
JWT-like values, and common API-key/token/secret assignments. Raw credentials
are never intentionally written to the action log.

## Batch 03 — QR email delivery receipts

The QR email endpoint now renders only the tenant-scoped credential read from
the database; caller-provided QR strings and short URLs are ignored. Both
existing recipient field shapes are accepted so single and bulk creation use
the same endpoint contract. Foreign or missing QR IDs share a 404 response.

Delivery is limited to 10 attempts per tenant actor per minute. Each delivery
appends an attempted receipt followed by a succeeded or failed receipt linked
to the attempt. Receipts contain the organization, actor, QR entity ID, channel,
and sanitized error type where applicable. They do not contain the recipient
address/name, raw QR credential, short URL, SMTP error message, or provider
credentials. API responses likewise omit recipient PII and raw provider errors.

## Batch 04 — Public UTM attribution integrity

The orphan `/api/marketing/utm-track` endpoint is retired with HTTP 410 before
reading a request body or querying/mutating a QR record. It had no repository
caller and previously allowed anyone with a QR database ID to rewrite durable
campaign fields.

The supported short-link path treats UTM values as untrusted analytics labels,
not authorization or credential data. Organization, project, and QR linkage
come only from the stored short link. Each label is trimmed, limited to 128
characters, and rejected when it contains control characters. Click records
remain append-only.

Attribution writes are limited to 60 per short link and hashed network
fingerprint per minute. The fingerprint is used only as a rate-limit key; the
client IP is not stored. User-agent metadata is optional, control-character
checked, and limited to 256 characters. Throttling or analytics failure does
not block access to a valid visitor pass.

## Test evidence

- `apps/client-dashboard/src/app/api/danger/purge-scans/route.test.ts`
- `apps/client-dashboard/src/app/api/api-keys/[id]/route.test.ts`
- `apps/client-dashboard/src/lib/ai/transcript-privacy.test.ts`
- `apps/client-dashboard/src/app/api/qr/send-email/route.test.ts`
- `apps/client-dashboard/src/app/api/marketing/utm-track/route.test.ts`
- `apps/client-dashboard/src/app/[locale]/s/[shortId]/route.test.ts`
- `apps/client-dashboard/src/lib/utm-attribution.test.ts`
- Focused AI privacy/authorization: 3 suites, 13 tests passed.
- Focused QR delivery: 1 suite, 6 tests passed.
- Focused UTM attribution: 3 suites, 6 tests passed.
- Full Client Dashboard: 73 suites and 391 tests passed; 1 suite and 25 tests
  remain skipped.
- Lint passed with the existing 278-warning baseline; typecheck passed.
- Production build passed with the known middleware deprecation and Prisma
  CommonJS export warning.

## Remaining Phase 02 ledger

- Credential-rotation operations receipt without secret values.

Fresh local evidence is recorded in
`evidence/PHASE_02_SECURITY_SCAN_2026-07-26.md`. The bootstrap guard, recent
history secret scan, workflow contract tests, API register, tenant
reconciliation, and high-severity dependency advisory gate are green.
Credential rotation/revocation remains the sole blocker. An archived
credential-shaped Upstash example was redacted during candidate review and must
be treated as potentially exposed until operations records
revocation/rotation.
