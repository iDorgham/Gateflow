# Resident Portal — Certification packet (Phase 10 + browser probe)

**Packet ID:** `RESIDENT_PORTAL_CERTIFICATION_PACKET_2026_07_29`  
**App:** `resident-portal`  
**Commit baseline:** `31558779` (PR #201 head at probe start; cookie Domain fix may be uncommitted)  
**Updated:** 2026-07-29T20:45:00Z  
**Expires:** 2026-08-31  
**`valid`:** `false`  
**Review mode:** `browser-evidence`  
**Draft PR:** https://github.com/iDorgham/Gateflow/pull/201

## Verdict

Live EN browser proved **cross-subdomain session failure**: after a successful
`app.gateflow.site` login, `portal.gateflow.site` still shows the login handoff
page. Create guest / QR / offline flows were **not run** (no portal session).
Dashboard also showed **Residents: 0** linked units.

`AUTH_COOKIE_DOMAIN` support was added in Client Dashboard source; production
must set `.gateflow.site` and redeploy before SSO can pass.

**Do not run `/certify`.**

## Browser probe

Artifact: `BROWSER_SESSION_EVIDENCE_2026-07-29.md`

| Gate                      | Result     |
| ------------------------- | ---------- |
| App login session         | passed     |
| Portal SSO after CD login | **failed** |
| Create guest (EN)         | not-run    |
| QR scan                   | not-run    |
| Offline QR                | not-run    |

## Pilot coverage

| Scope                        | Result                                        |
| ---------------------------- | --------------------------------------------- |
| Owned (4 steps)              | 0 passed · 4 partial (browser fail / blocked) |
| Undocumented owned `missing` | **0**                                         |

## Deferrals blocking certify

| ID                      | Owner                 | Notes                                |
| ----------------------- | --------------------- | ------------------------------------ |
| cross-subdomain-session | operations            | Set `AUTH_COOKIE_DOMAIN` + deploy CD |
| resident-unit-fixture   | resident-portal-pilot | Need RESIDENT + unit                 |
| browser-create-guest    | resident-portal-pilot | After SSO + fixture                  |
| browser-qr-scan         | resident-portal-pilot | After create                         |
| browser-offline-qr      | resident-portal-pilot | After QR                             |

## Path to certify

1. Deploy CD with `AUTH_COOKIE_DOMAIN=.gateflow.site`.
2. Re-login on app → open portal home without `/login` redirect.
3. Create RESIDENT + linked unit fixture.
4. EN browser: create guest → QR → offline; mark owned steps `passed`.
5. Set this packet `valid: true` bound to that commit → `/check all` → `/pilot` → `/certify` (explicit auth).
