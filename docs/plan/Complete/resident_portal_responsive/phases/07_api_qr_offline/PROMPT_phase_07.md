# Phase 7: API proxy, scannable QR, offline read

## Primary role

BACKEND-API + FRONTEND

## Preferred tool

- [x] Claude CLI — proxy/API contract
- [x] Cursor IDE — QR UI + verify
- Free fallback: Opencode / Qwen

## App scope

`apps/resident-portal` (`next.config.js`, QR cards, offline cache, history/maintenance pages).

## Pilot steps

- Resident creates guest permission
- Permission QR display
- Resident-facing denial/offline QR

## Goal

Visitor create works against env-configured API; QR cards show scannable codes
from server-signed payloads; offline path can read cached QR; history/maintenance
fetch with auth.

## Scope (in)

- Replace hardcoded `http://localhost:3001` rewrite with env-based destination
- `VisitorQRCard` / `OpenQRCard`: real QR render (e.g. existing `react-qr-code` dep)
- Use IndexedDB read (`getCachedQrPayload` or equivalent) when offline
- Forward cookies / auth headers for history + maintenance RSC fetches

## Scope (out)

- Changing HMAC signing algorithm in client-dashboard (consume signed code only)
- Activation invite token product (separate contract)

## Page acceptance

| Route                           | Criterion                                                   |
| ------------------------------- | ----------------------------------------------------------- |
| `/visitors/new`, `/open-qr/new` | Successful create against non-localhost env when configured |
| `/visitors/[id]`                | Scannable QR visible for active permission                  |
| `/history`                      | Authenticated fetch; empty vs error distinguishable         |
| Offline shell                   | Cached QR viewable without network                          |

## Security boundaries

- Do not mint unsigned QR payloads in the portal
- Do not log full QR secrets / tokens
- Tenant scope preserved on all API calls

## Tests

- QR component renders given a payload string
- Config rejects missing upstream URL in production builds (or documented fail-closed)
- Offline read returns cached entry in unit test

## Done when

TASKS Phase 7 checked; phase log written; preflight green.
