# PHASE LOG — Phase 07 API proxy, scannable QR, offline read

**Plan:** `resident_portal_responsive`  
**Date:** 2026-07-29  
**Branch:** `feat/resident-portal-phase-06`  
**App:** `apps/resident-portal`

## Goal

Env-configured API upstream; scannable QR from server-signed payloads; IndexedDB
offline read; cookie-forwarded history/maintenance fetches.

## What changed

- `api-upstream.cjs` + `src/lib/api-upstream.ts` — `RESIDENT_API_UPSTREAM` /
  `NEXT_PUBLIC_API_URL`; fail-closed in production (no localhost default)
- `next.config.js` — rewrite destination via `resolveResidentRewriteDestination()`
- Push register route — `resolveResidentApiBase()` (503 if misconfigured in prod)
- `visitor-qr-card.tsx` / `open-qr-card.tsx` — `react-qr-code` render (no unsigned mint)
- `offline-aware-visitor-qr.tsx` — write cache + `getCachedQrPayload` offline read;
  `resolveDisplayedQrCode` selects live vs cache
- `resident-api-fetch.ts` — cookie header forward for RSC history/maintenance
- History + maintenance pages — distinguishable empty vs error alerts
- Tests — `src/lib/phase07.test.ts` (upstream + offline display selection)
- `.env.example` — documents `RESIDENT_API_UPSTREAM`

## Commands

```bash
pnpm --filter resident-portal test      # 16 pass
pnpm --filter resident-portal typecheck # pass
pnpm --filter resident-portal lint      # pass
```

## Residual / external gates

- Cross-subdomain cookie sharing with CD login still unproven (Phase 10).
- Share/download/revoke UI still stubs (Phase 08).
- Offline IndexedDB requires browser; unit coverage is display-selection + config.

## Next

`/github` then Phase 08 — pilot UX (revoke/share, sign out, dead settings links).
