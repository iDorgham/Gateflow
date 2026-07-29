# PLAN: Resident Portal — Responsive & Pilot Readiness

**Slug:** `resident_portal_responsive`  
**Primary app:** `apps/resident-portal` (Workflow v2 focused)  
**Status:** Complete (2026-07-29) — Workflow app stage remains `checking` (not certified)  
**Branch:** `feat/resident-portal-phase-09`  
**Baseline evidence:** `docs/audits/resident-portal/AUDIT_2026-07-29.md`, `PAGE_MAP_2026-07-29.md`, `PAGE_SCORES_2026-07-29.json`, `PILOT_GATE_2026-07-29-phase10.json`, `CERTIFICATION_PACKET_2026-07-29.json`

## Outcome

Ship a Resident Portal that can enter the pilot loop: authenticated unit-scoped
sessions, production-safe visitor/QR APIs, scannable HMAC QR display, offline QR
read path, and fresh EN browser evidence for resident-owned pilot steps.

Phases **01–05** (responsive shell / PWA / page redesign / polish) are **UI
baseline** — largely present in source per TASKS, but **not pilot-certified**.
Phases **06–10** convert 2026-07-29 audit/page-map P0–P1 gaps into ordered work.
Do not re-implement shell/nav unless a phase acceptance criterion fails.

## Hard invariants

- App scope: `apps/resident-portal` (+ shared packages only when required).
- Tenant: every resident data path uses real session `orgId` / `sub`; no
  `dev-resident-id` / `dev-org-id` fallbacks.
- Soft deletes: `deletedAt: null` where the model defines it.
- QR: never mint unsigned payloads in the portal; render server-signed code as a
  real scannable QR.
- Secrets: JWT signing secret fail-closed (no insecure default).
- pnpm only; root `pnpm preflight` before phase complete.
- Load `gf-security` + `.agents/contracts/CONTRACTS.md` for Phases 06–07.

## Non-goals

- Client Dashboard or Scanner App product mutations (unless a shared package
  contract is explicitly required and scoped).
- Scaffolding empty pages for `/settings/privacy` or `/settings/help`.
- Broad redesign of already-shipped responsive shell.

## Phased roadmap

| #      | Phase                                           | Role                   | Tool 1     | Tool 2   | Status                                |
| ------ | ----------------------------------------------- | ---------------------- | ---------- | -------- | ------------------------------------- |
| 01–05  | Responsive baseline (shell, PWA, pages, polish) | FRONTEND               | Cursor     | Opencode | Baseline present — backfill logs only |
| **06** | Auth, session, tenant containment               | SECURITY               | Claude CLI | Cursor   | **Done**                              |
| **07** | API proxy, scannable QR, offline read           | BACKEND-API + FRONTEND | Claude CLI | Cursor   | **Done**                              |
| **08** | Pilot UX completion                             | FRONTEND               | Cursor     | Opencode | **Done**                              |
| **09** | i18n/RTL, tests, PWA/Lighthouse evidence        | QA / i18n              | Cursor     | Opencode | **Done**                              |
| **10** | Pilot gate refresh & certification packet       | QA                     | Cursor     | —        | **Done** (packet `valid:false`)       |

## Phase details (06–10)

### Phase 06 — Auth, session, tenant containment

- Redirect unauthenticated portal users to `/login`; remove identity fallbacks.
- Use `claims.orgId` (with layout-style `org`/`orgId` fallback) on all data pages.
- Fail closed when `NEXTAUTH_SECRET` / `JWT_SECRET` missing.
- Negative tests: unauthenticated access, wrong/missing org claim.
- **Pilot steps:** Resident activation gate; all P0 authenticated routes.
- **Pages:** `/`, `/visitors*`, `/open-qr/new`, `/profile`, `/history`, `/maintenance`.

### Phase 07 — API proxy, scannable QR, offline read

- Replace `localhost:3001` rewrite with env-based upstream (or BFF) for
  `/api/resident/*` visitor create.
- Render HMAC payload with real QR component on visitor/open-QR cards.
- Wire IndexedDB **read** path for offline QR viewing.
- Forward session cookies (or authenticated BFF) for history/maintenance RSC.
- **Pilot steps:** Create guest permission; QR display; denial/offline.

### Phase 08 — Pilot UX completion

- Wire revoke / share / download where APIs exist; Sign Out on profile.
- Remove or defer dead `/settings/privacy` and `/settings/help` links (no empty pages).
- Replace `return null` unit-missing mid-flows with explicit empty/error UI.
- **Pages:** `/visitors/[id]`, `/profile`, `/visitors/new`, `/open-qr/new`.

### Phase 09 — i18n/RTL, tests, measurable evidence

- `lang`/`dir` strategy (or documented interim EN-only with logical CSS pass).
- Prefer logical CSS on touched layout; RTL spot-check P0 routes.
- Add focused Jest/Playwright coverage for Phase 06–07 security and QR render.
- Capture PWA/Lighthouse or explicit dated deferral with owner/expiry.
- Backfill missing `phase_logs/PHASE_LOG_phase_01..05.md` if still absent.

### Phase 10 — Pilot gate & certification packet

- Refresh `PILOT_GATE` with browser-verified resident-owned steps where possible.
- Mark remaining gaps with owner/reason/expiry.
- Produce certification evidence packet for Workflow v2 `/check` → `/pilot` → `/certify`.
- No production deploy/migrate without separate authorization.

## Acceptance overview

- No P0 audit finding remains reproducible on focused commit.
- Owned pilot steps: activation path decided; create + QR display + offline/denial
  have source + test evidence (browser where claimed).
- Page scores may remain capped until `securityBoundaryProven` is true.
- `pnpm preflight` green for touched packages.

## After each phase

- Update `TASKS_resident_portal_responsive.md` and `phase_logs/PHASE_LOG_phase_NN.md`.
- Update `SESSION_MEMORY.md`.
- One reviewable commit per phase; `/github` when authorized.

## Dependencies & risks

- Cross-subdomain `gf_access_token` cookie sharing with `app.gateflow.site` may
  block activation proof (Phase 06/10 external gate).
- Visitor create depends on client-dashboard resident APIs — proxy must target
  the correct environment URL.
- Responsive plan checkboxes overstated certification; trust audit over TASKS UI ticks.

_Updated: 2026-07-29 | Workflow v2 plan refresh from audit + page-map_
