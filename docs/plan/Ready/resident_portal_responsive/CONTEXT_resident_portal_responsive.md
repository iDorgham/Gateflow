# Context snapshot — `resident_portal_responsive`

> Regenerate or extend when PWA, API, or layout contracts change. Deeper notes: `context/` (api, contracts, database, design, structure, documentation).

## Product

- **Goal:** Responsive resident portal with desktop sidebar, mobile bottom nav, PWA install/offline QR viewing.
- **Plan:** `PLAN_resident_portal_responsive.md` (plan folder root).

## Key paths

- `apps/resident-portal/` — Next.js App Router portal routes
- `packages/i18n/src/locales/` — `en`, `ar-EG` for new strings
- `@gate-access/ui` — ADS tokens and shared components

## Contracts

- `.antigravity/contracts/CONTRACTS.md` — `organizationId`, soft deletes, auth-first APIs, no tokens in `localStorage`.

## Env (typical)

- Portal env vars per app `.env.example` (no values here).
