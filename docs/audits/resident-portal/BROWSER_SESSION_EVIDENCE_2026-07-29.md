# Resident Portal — Browser session evidence (2026-07-29)

**Run ID:** `RP_BROWSER_SESSION_2026_07_29`  
**Mode:** live browser (Cursor IDE browser)  
**Actor:** pilot `admin@selenadev.com` on Client Dashboard  
**Do not certify:** packet remains `valid:false`

## Hosts

| Host                             | Result                                              |
| -------------------------------- | --------------------------------------------------- |
| `https://app.gateflow.site`      | Live; login succeeds                                |
| `https://portal.gateflow.site`   | Live; unauthenticated `/` → `/login`                |
| `https://resident.gateflow.site` | Not used for this run (portal is the resident host) |

## Cross-subdomain session (Resident activation)

### Steps

1. Opened `https://app.gateflow.site/en/login` (EN).
2. Signed in as pilot dashboard user.
3. Confirmed dashboard session: URL `https://app.gateflow.site/en`, title Dashboard.
4. Navigated to `https://portal.gateflow.site/` **without** signing out of app.

### Observed

| Check                             | Result                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| App session after login           | **passed** — dashboard loaded                                                            |
| Portal receives `gf_access_token` | **failed** — redirected to `/login`                                                      |
| Portal `document.cookie` names    | `[]` (httpOnly auth cookie not visible to JS; no shared non-httpOnly auth cookie either) |

### Root cause (source + live)

- `apps/client-dashboard/src/lib/auth-cookies.ts` historically set `gf_access_token` / `gf_refresh_token` **without** `domain`, so cookies are **host-only** for `app.gateflow.site`.
- Sibling host `portal.gateflow.site` cannot read them. Portal correctly redirects to `/login`.

### Remediation landed in repo (not yet proven live)

- `resolveAuthCookieDomain()` + `AUTH_COOKIE_DOMAIN` (e.g. `.gateflow.site`) on set/clear of auth + CSRF cookies.
- Docs: `docs/guides/ENVIRONMENT_VARIABLES.md`.
- Unit tests: `auth-cookies.test.ts` (15 passed).
- **Still required:** set `AUTH_COOKIE_DOMAIN=.gateflow.site` on Client Dashboard production, deploy CD, re-login, re-probe portal.

### Screenshots

- `docs/audits/resident-portal/evidence/2026-07-29-browser/01-portal-login-no-session-after-cd-login.png`
- `docs/audits/resident-portal/evidence/2026-07-29-browser/02-app-session-ok-residents-zero.png`

## Create guest / QR / offline (EN)

**Not collected** — blocked by portal session failure.

Additional fixture blocker from live app dashboard (same session):

- Metric **Residents: 0** (with linked units) on mediaBubble workspace.
- Pilot user is a dashboard admin, not a `RESIDENT` with a linked unit.
- Even after cookie Domain ships, need a RESIDENT (+ unit) fixture before portal create/QR/offline can pass.

## Verdict

| Owned P0 step                            | Status after this run                                                                    |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Resident activation                      | `partial` — browser **fail** proven; code fix staged; prod Domain env + redeploy pending |
| Resident creates guest permission        | `partial` — no portal session; no resident fixture                                       |
| Permission QR display in Resident Portal | `partial` — blocked on create/session                                                    |
| Resident-facing denial/offline QR        | `partial` — blocked on session                                                           |

**`/certify` still forbidden.**
