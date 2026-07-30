# Resident Portal — Browser session evidence (2026-07-29 / 2026-07-30)

**Run IDs:** `RP_BROWSER_SESSION_2026_07_29` (fail) → `RP_BROWSER_SSO_CREATE_2026_07_30` (pass)  
**Mode:** live browser (Playwright + production hosts)  
**Do not `/certify` in this run** — refresh packet only; stage remains `checking` until explicit certify.

## Hosts

| Host                           | Role                   |
| ------------------------------ | ---------------------- |
| `https://app.gateflow.site`    | Client Dashboard login |
| `https://portal.gateflow.site` | Resident Portal        |

## Remediation applied (ops + deploy)

1. Set `AUTH_COOKIE_DOMAIN=.gateflow.site` on CD Production; deployed CD with Domain cookie code (PR #201 / deploy run `30494706212`).
2. Synced portal `NEXTAUTH_SECRET` to CD issuer secret; set non-sensitive `RESIDENT_API_UPSTREAM` / `NEXT_PUBLIC_API_URL`; deployed portal (run `30498837749`).
3. Created pilot fixture in mediaBubble org:
   - Role: `Resident` (seeded)
   - User: `pilot.resident@selenadev.com` / `password123`
   - Unit: `Pilot Unit A1` (`cms6r7gx2000550gpebhq4fpn`) linked to resident

## Cross-subdomain session (Resident activation) — PASSED

| Check                                        | Result                                            |
| -------------------------------------------- | ------------------------------------------------- |
| Login sets `gf_access_token` Domain          | `.gateflow.site` (SameSite=Lax, Secure, httpOnly) |
| Portal `/` without handoff after CD login    | **passed** (`loginHandoff=false`)                 |
| Portal visitors / create routes with session | **passed**                                        |

Evidence: cookie Domain probe (Playwright context); request+navigation to portal home/visitors/new.

## Create guest (EN) — PASSED

POST `https://portal.gateflow.site/api/resident/visitors` as pilot resident:

- `success: true`
- Visitor id: `cms6r96bw000a50gp1agjo3sh`
- `qrCodeId` present
- Name: `Pilot Guest EN`

Screenshot: `evidence/2026-07-29-browser/05-portal-create-guest-form.png`

## Permission QR display — PASSED

Detail `https://portal.gateflow.site/visitors/cms6r96bw000a50gp1agjo3sh`:

- Pass details UI for Pilot Guest EN
- Share / Save Image actions
- Multiple canvas/img/svg elements on page (`hasCanvasOrImg: 17`)

Screenshot: `evidence/2026-07-29-browser/03-portal-sso-pass-details-qr.png`

Note: live Scanner App device decode remains scanner-app owned (`n/a` here).

## Offline QR — PASSED (portal offline read)

With network offline, reload of pass details still rendered Pilot Guest EN pass content (cached document/UI).

Screenshot: `evidence/2026-07-29-browser/04-portal-offline-pass-details.png`

## Earlier fail (kept for audit trail)

Before Domain + JWT sync: app login succeeded, portal stayed on `/login` (host-only cookies + mismatched `NEXTAUTH_SECRET`).

Screenshots: `01-…`, `02-…`

## Verdict

| Owned P0 step                            | Status     |
| ---------------------------------------- | ---------- |
| Resident activation                      | **passed** |
| Resident creates guest permission        | **passed** |
| Permission QR display in Resident Portal | **passed** |
| Resident-facing denial/offline QR        | **passed** |

Packet may be marked `valid: true`. **Do not run `/certify` without explicit confirmation.**
