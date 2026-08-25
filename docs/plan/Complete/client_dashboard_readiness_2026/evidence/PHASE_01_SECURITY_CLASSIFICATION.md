# Phase 01 security classification

**Date:** 2026-07-25
**Scope:** `apps/client-dashboard/src/app/api/**/route.ts`
**Status:** COMPLETE — P1 findings contained and method matrix reconciled

## Deterministic tenant scan

The current source reproduces **72** findings, not the audit baseline's 73.
This is recorded as source/input-set drift, not silently normalized.

| Disposition                                             |  Count |
| ------------------------------------------------------- | -----: |
| Safe relation/precheck scoped                           |     32 |
| Request-local, self, or public-token scoped             |     18 |
| Scanner false positive caused by nested `where` parsing |     18 |
| Documented privileged/signed webhook                    |      3 |
| Confirmed scanner-candidate defect                      |      1 |
| **Total**                                               | **72** |

## Contained high-severity defects

### GF-CD-SEC-001 — Org-less token can deny an arbitrary scan

- File: `apps/client-dashboard/src/app/api/scans/[scanId]/deny/route.ts`
- Evidence: the scan is loaded by global ID at lines 43–46. The tenant rejection
  at line 52 only runs when `claims.orgId` is truthy. A valid token with a null
  organization can therefore reach the ID-only update at lines 73–79.
- Impact: cross-tenant/IDOR mutation of immutable access-decision evidence from
  `SUCCESS` to `DENIED`.
- Required containment: reject missing organization context, verify the scan
  through its QR/gate organization, enforce the operator's gate/role permission,
  bound and validate the reason, and add org-less/cross-org/unauthorized tests.
- Resolution: implemented on 2026-07-25. The route now requires organization
  context and `scans:override`, uses a tenant-scoped lookup, checks gate
  assignment, bounds the reason, and has focused negative tests.

### GF-CD-SEC-002 — Contact create/update links foreign-tenant units

- File: `apps/client-dashboard/src/app/api/contacts/[id]/route.ts`
- Evidence: the contact is scoped at lines 32–34, but caller-controlled
  `unitIds` are inserted at lines 56–63 without checking each unit belongs to
  `claims.orgId`. The response includes unit ID/name at lines 81–104.
- Impact: cross-tenant `ContactUnit` relation creation and potential foreign unit
  metadata disclosure.
- Required containment: resolve all requested units with
  `organizationId: claims.orgId`, require an exact ID-count match before the
  transaction mutation, preserve the contact scope inside the transaction, and
  add foreign/mixed/nonexistent-unit tests.
- Resolution: implemented on 2026-07-25 for both POST and PATCH. Requested IDs
  are deduplicated, scoped by organization and `deletedAt: null`, and rejected
  generically unless every requested unit exists in the tenant.

## Additional P1 findings

1. **GF-CD-SEC-003 — API CSRF middleware is not active.** The middleware
   contains double-submit enforcement, but its matcher excludes `api`. Most
   cookie-authenticated mutations therefore do not pass through that control.
2. **GF-CD-SEC-004 — Unauthenticated resident push abuse/IDOR.**
   `resident/push/send` accepts a global VisitorQR ID, resolves resident and gate
   data, and sends a notification without authentication, signed capability, or
   rate limit.
3. **GF-CD-SEC-005 — Cross-tenant AI feedback.**
   `ai/actions/[id]/feedback` authenticates the session but updates an action
   globally by ID without organization/user ownership.
4. **GF-CD-SEC-006 — Cross-tenant AI execution and confused deputy.**
   `ai/actions/execute` gets and updates an action globally by ID and executes
   caller-supplied action type/intent instead of the stored tenant-owned action.
5. **GF-CD-SEC-007 — Webhook replay gaps.** Perimeter and WhatsApp HMACs include
   a timestamp but do not enforce freshness or consume an event ID/nonce.
6. **GF-CD-SEC-008 — Resident arrival capability needs review.**
   `resident/arrived` treats a raw VisitorQR ID as authority and associates the
   latest successful scan without a freshness window or rate limit.

### Containment update — 2026-07-25

- GF-CD-SEC-003 is contained. The matcher includes APIs; cookie-authenticated
  mutations require an exact double-submit token or verified same-origin Origin
  compatibility. Explicit invalid tokens cannot fall back, API requests cannot
  use the Server Action exemption, and Bearer exemptions require a token.
- GF-CD-SEC-004 is contained. No application caller exists, and trusted scan
  and WhatsApp flows already own push delivery. The orphan endpoint now returns
  HTTP 410 before parsing IDs, querying data, or sending a notification.
- GF-CD-SEC-005 is contained. Feedback uses organization-and-user-scoped
  single-write semantics and returns a non-enumerating 404 when ownership or
  feedback state does not match.
- GF-CD-SEC-006 is contained. Execution accepts only an action ID, claims a
  tenant/user-owned pending action with compare-and-set semantics, derives
  permission and validated intent from the stored action, bounds bulk creation,
  scopes project/gate targets, and records scoped completion/failure.
- GF-CD-SEC-008 is contained. The landing page mints a five-minute,
  purpose-bound HMAC capability instead of exposing a raw VisitorQR ID as
  authority. The arrival API verifies it fail-closed, applies a five-request
  per-minute capability/IP limit, requires a successful scan within 15 minutes,
  and uses an atomic conditional update to suppress concurrent duplicate push
  delivery.
- GF-CD-SEC-007 is contained for Perimeter and WhatsApp. Both require an
  `x-gf-event-id` matching `[A-Za-z0-9:_-]{8,128}`, cover that ID with the
  timestamp and raw body in HMAC-SHA256, and enforce a ±5-minute timestamp
  window. A PostgreSQL transaction-level advisory lock serializes the
  provider/organization/event key. The `AuditLog` replay marker is written only
  after business work and in the same transaction, so failures roll back and
  legitimate retries remain possible. Durable duplicates return idempotent
  success without repeating database writes or post-commit notifications.

## All 72 scanner dispositions

### False positives (18)

`analytics/operators:106`, `analytics/visitor-type:66`,
`contacts/[id]/tags:61`, `contacts/bulk-delete:51`, `contacts/route:274`,
`contacts/tags/bulk:47,56,67`, `crm/contacts/route:79`,
`gates/assignments:160`, `perimeter/webhook:131`,
`resident/express-invite:35`, `resident/visitors/approve:71`,
`resident/visitors/route:50`, `scans/bulk:51`, `units/[id]:71`,
`units/bulk-delete:51`, `units/route:209`.

In each case the regex stops at a nested brace before a literal
`organizationId` later in the same Prisma call.

### Privileged, signature-scoped (3)

`webhooks/stripe/route.ts:36,52,68`. Stripe signature verification occurs before
the operations; organization resolution is intentionally derived from signed
event metadata/customer identity.

### Request-local, self, or public-token scoped (18)

`auth/login:56`, `auth/refresh:96`, `danger/delete-workspace:30,62`,
`danger/export:29`, `gates/assigned:32`, `integrations:24,53`,
`marketing/utm-track:44`, `notification-prefs:14,35`, `qr/send-email:68`,
`scanner-rules:57`, `team/messages:94`, `users/me/preferences:97`,
`workspace/export:92`, `workspace/restore:82`, `workspace/settings:45`.

These are scoped by pre-auth identity, stored token, guarded claim, self ID, or
public capability. Their other controls remain part of the method-level review.

### Safe relation/precheck scoped (32)

`artifacts:69`, `contacts/[id]:130`, `contacts/[id]/tags:26,70,167`,
`contacts/tags/bulk:89`, `crm/contacts/[id]:83`, `crm/units/[id]:87`,
`gates/assignments:188,292`, `gates/route:273,351`, `incidents:228`,
`override/log:82`, `projects/[id]:143`, `resident/arrived:46,63`,
`resident/visitors/[id]:15,57,72`, `resident/visitors/route:131`,
`tags/[id]:45,81`, `tasks/[id]:43,66`, `team/members:84,124`,
`units/[id]:165`, `watchlist/[id]:67`, `watchlist/route:154`,
`webhooks/[id]:59,91`.

These candidates are scoped by an organization-owned parent/relation, prior
organization lookup, creator ownership, or derived organization-owned ID.
`contacts/[id]:130` is safe for the contact update itself but the adjacent
foreign-unit relation defect is separately recorded as GF-CD-SEC-002.

### Scanner candidate contained after classification (1)

`scans/[scanId]/deny` — GF-CD-SEC-001 now has organization context,
permission, tenant-owned QR lookup, and gate-assignment prechecks before its
ID-only update. A future phase should still consider a conditional update to
close the read/update status race.

## Gate decision

GF-CD-SEC-001 through GF-CD-SEC-008 have test-first containment. No confirmed
P0/P1 from this classification remains open. The final API-control matrix has
170 unique method rows, zero `needs-review`, and five explicit lower-severity
gaps owned by Phase 02/P2.
