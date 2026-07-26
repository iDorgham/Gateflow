# Phase 01 route and API inventory

**Date:** 2026-07-25
**Status:** COMPLETE — source/build parity and method controls reconciled

## Page parity

- 44 source `page.tsx` routes.
- 44 matching page entries in `.next/app-path-routes-manifest.json`.
- Zero source-only or manifest-only pages after excluding generated error pages.
- The prior 43 count is the production-intended count: it excludes the explicit
  fixture route `/[locale]/qr/create-test`.

## API parity

- 123 source `/api/**/route.ts` files.
- 123 matching build-manifest API paths.
- Zero source-only or manifest-only API paths.
- 170 exported handlers: 69 GET, 63 POST, 20 DELETE, 15 PATCH, and 3 PUT.

## Lexical control signals

These are triage indicators, not enforcement proof:

| Signal                       | Methods |  Files |
| ---------------------------- | ------: | -----: |
| Authentication/authenticity  | 164/170 |      — |
| Tenant identifier            | 164/170 |      — |
| Zod/shared-schema validation | 130/170 | 86/123 |
| RBAC/permission              |  25/170 | 20/123 |
| Rate limiting                |  14/170 | 12/123 |
| Audit behavior               |  15/170 | 13/123 |
| Explicit CSRF/origin         |   4/170 |  4/123 |

Public, credential, signed-webhook, cron-secret, and capability routes must be
classified by their actual authenticity mechanism rather than marked unauthenticated.

### Mutating validation-review queue (21)

`ai/actions/[id]/feedback POST`, `ai/actions/execute POST`,
`ai/actions/log POST`, `ai/chat POST`, `api-keys/[id] DELETE`,
`contacts/[id]/invite POST`, `contacts/[id]/tags/[tagId] DELETE`,
`danger/export POST`, `marketing/utm-track POST`, `project/switch POST`,
`projects/[id]/team POST`, `resident/arrived POST`,
`resident/express-invite POST`, `resident/push-token POST/DELETE`,
`resident/push/send POST`, `resident/visitors/[id] DELETE`,
`scans/[scanId]/deny POST`, `webhooks/[id]/test POST`,
`webhooks/stripe POST`, and `workspace/billing/portal POST`.

Some are input-free, path-only, or use shared verification. Their final
method-level decisions are recorded in
`PHASE_01_API_CONTROL_MATRIX.md`.

## Confirmed matrix gaps

- API CSRF matcher exclusion: GF-CD-SEC-003.
- Unauthenticated resident push: GF-CD-SEC-004.
- AI feedback/action ownership: GF-CD-SEC-005 and GF-CD-SEC-006.
- Perimeter/WhatsApp replay protection: GF-CD-SEC-007, contained with signed
  event IDs, ±5-minute freshness, and transactional durable replay markers.
- Resident arrival capability/freshness: GF-CD-SEC-008.
- Public UTM attribution integrity is tracked as P2: arbitrary database ID,
  distinguishable existence response, and no schema/rate/capability control.

## Final reconciliation

- Matrix: `PHASE_01_API_CONTROL_MATRIX.md`
- 170 rows and 170 unique route/method keys.
- Zero `needs-review` or implicit-gap results.
- Nine contained route/finding rows; GF-CD-SEC-003 applies globally through
  middleware.
- Three explicit lower-severity gaps remain after the first Phase 02 batch: AI
  transcript policy, QR email delivery audit, and public UTM integrity. Scan
  retention and API-key revocation history are resolved.
