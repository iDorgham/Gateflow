# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: **Complete**
- Focused app: `resident-portal`
- Workflow stage: advancing `checking` → `pilot-ready` → `certified` via `/certify` (2026-07-30)
- Exact next action after certify: `/next-app` (scanner-app) when ready — do not unlock until receipt exists
- Browser evidence: SSO + create + QR + offline **passed** (2026-07-30)
- Fixture: `pilot.resident@selenadev.com` / `password123` → Pilot Unit A1
- Visitor proof: `cms6r96bw000a50gp1agjo3sh`
- Fresh check: `CHECK_ALL_2026-07-30.json`
- Gatekeeper: `GATEKEEPER_REVIEW_2026-07-30.json` (PASS)
- Evidence file: `RESIDENT_PORTAL_CERTIFICATION_EVIDENCE_2026_07_30.json`

## Durable decisions

- Cookie Domain via `AUTH_COOKIE_DOMAIN=.gateflow.site` on CD production.
- Portal must share CD `NEXTAUTH_SECRET` (issuer).
- Portal upstream env must be non-sensitive for Vercel CI `vercel build` rewrites.
- Deploy Build Check scopes to selected app (`ci(deploy)` PR #202).
- Do not invent browser proof; live Playwright + request evidence only.
- Product commit for receipt: `ebfc99f4` (master merge #202).

## Gotchas

- Playwright `page.goto('https://portal.gateflow.site/')` can `ERR_FAILED`; `/login` and `waitUntil:'commit'` / `page.request` work.
- Production had no Resident role/units until fixture seed.
- UnitType enum uses `ONE_BR` (not `APARTMENT`).

## State handoff

- Evidence: `docs/audits/resident-portal/BROWSER_SESSION_EVIDENCE_2026-07-29.md`
- Packet: `CERTIFICATION_PACKET_2026-07-29.json` (`valid: true`)
- Pilot gate: `PILOT_GATE_OWNED_2026-07-29-phase10.json` (owned 4/4 passed)
