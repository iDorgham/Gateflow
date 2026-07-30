# Resident Portal — Certification packet

**Packet ID:** `RESIDENT_PORTAL_CERTIFICATION_PACKET_2026_07_29`  
**App:** `resident-portal`  
**Commit:** `ebfc99f4` (master)  
**Updated:** 2026-07-30T00:09:00Z  
**Expires:** 2026-08-31  
**`valid`:** `true`  
**`certifyReady`:** `true`  
**Review mode:** `browser-evidence`

## Verdict

Owned P0 pilot steps are **passed** with live EN browser evidence after:

- CD `AUTH_COOKIE_DOMAIN=.gateflow.site` + Domain cookie deploy
- Portal `NEXTAUTH_SECRET` aligned to CD + API upstream env + portal deploy
- Fixture: `pilot.resident@selenadev.com` + `Pilot Unit A1`
- Create guest + pass details QR + offline reload

Explicit `/certify` confirmation received 2026-07-30. Fresh check: `CHECK_ALL_2026-07-30.json`. Gatekeeper: `GATEKEEPER_REVIEW_2026-07-30.json`.

## Browser probe summary

| Gate                | Result                               |
| ------------------- | ------------------------------------ |
| Cross-subdomain SSO | passed                               |
| Create guest (EN)   | passed (`cms6r96bw000a50gp1agjo3sh`) |
| QR display          | passed                               |
| Offline pass read   | passed                               |

Artifact: `BROWSER_SESSION_EVIDENCE_2026-07-29.md`

## Pilot coverage

| Scope      | Result       |
| ---------- | ------------ |
| Owned (4)  | **4 passed** |
| CD/Scanner | 5 n/a        |

## Non-blocking deferrals

Lighthouse/PWA scores; full AR content pack (expiry 2026-08-31).

## Next

1. `/pilot` — confirm readiness
2. `/certify` — only with explicit authorization
3. Do not `/next-app` until certified
