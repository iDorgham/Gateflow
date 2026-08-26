# Phase 01 pilot and ownership map

## Single-writer ownership

`client_dashboard_readiness_2026` is the only implementation owner for Client
Dashboard readiness.

- `audit_remediation_2026` Phases 1–3 remain accepted historical evidence. Its
  open Phase 4/API-certification work maps into readiness Phases 01–03 and 06;
  the operations-owned credential-rotation receipt remains an external gate.
- `gateflow_workflow_bootstrap` Phase 00 remains historical evidence. Its
  unstarted Client Dashboard Phases 01–06 are superseded. Phase 07 remains
  gated until Client Dashboard certification.
- Neither prior plan may run a concurrent writer against this focused app.

## Phase 01 ownership decision — 2026-07-26

Phase 01 is complete. `client_dashboard_readiness_2026` remains the sole writer
for Client Dashboard implementation. Phase 02 owns the five explicitly carried
API-control gaps plus the security/data invariants already listed in TASKS.
`audit_remediation_2026` remains evidence-only, and
`gateflow_workflow_bootstrap` remains superseded for this app.

## Nine pilot outcomes

|   # | Outcome                           | Client Dashboard seam                                                       | Boundary and required evidence                                                                                                   |
| --: | --------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
|   1 | Create/import resident contact    | contacts page; `api/contacts`; Contact/ContactUnit/Unit                     | Authenticated org manager, `contacts:manage`; EN/AR create/import, 401/403, cross-org IDs, duplicate/soft-delete, audit evidence |
|   2 | Send invitation/access code       | contacts page; `api/contacts/[id]/invite`; invite service; CommunicationLog | Wrong-org denial, redacted provider state, locale, retry/idempotency                                                             |
|   3 | Resident activation               | No matching Client Dashboard resident-activation route                      | Cross-app contract gate: one-time token, expiry/replay, org/role binding, session issuance                                       |
|   4 | Resident creates guest permission | Client API `api/resident/visitors`; Resident Portal owns UI                 | Own linked unit/org only; signed payload, other-unit/org denial, schedule/usage                                                  |
|   5 | Permission appears                | QR page/hook; `api/qrcodes`; QRCode/VisitorQR/AccessRule                    | `qr:view`; org/project/gate scope; server-truth status/filter evidence                                                           |
|   6 | Security scans                    | `api/qrcodes/validate`; Scanner App client; GateAssignment/ScanLog          | Authenticated assigned operator; signature/gate/tenant checks, 401/403/429                                                       |
|   7 | Deterministic decision            | QR validation and bulk scan APIs                                            | Stable accepted/expired/revoked/tampered/wrong gate/tenant/replay/not-yet-active/usage/offline codes; append-only event          |
|   8 | Optional security note            | Closest seam: `api/scans/[scanId]/deny` and ScanLog audit fields            | Contract gap: no general note UI/API found; authorized scoped operator, bounded sanitized text, immutable attribution            |
|   9 | Access-log visibility             | scans page; recent/export/event-stream APIs; ScanLog                        | `scans:view`; correct decision/note/gate/operator/time, cross-org denial, realtime/refresh and export parity                     |

## Contract gaps

1. Contact “invite” currently delivers an access-code link over WhatsApp/SMS;
   it is not resident account activation and does not implement the planned
   email/WhatsApp activation contract.
2. No general optional scan-note endpoint/UI was found.
3. Resident activation and permission creation cross app boundaries. During
   Client Dashboard focus they are contract/integration evidence only; do not
   mutate Resident Portal or Scanner App without an explicit focus decision.
