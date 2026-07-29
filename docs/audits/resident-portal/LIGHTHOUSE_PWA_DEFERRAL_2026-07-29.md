# Resident Portal — Lighthouse / PWA evidence deferral

**App:** `resident-portal` (`apps/resident-portal`)  
**Plan phase:** 09 (`resident_portal_responsive`)  
**Created:** 2026-07-29  
**Owner:** `resident-portal-pilot`  
**Expiry:** 2026-08-31

## Decision

Defer fresh Lighthouse CI / production PWA score capture (≥90 target) until
Phase 10 pilot gate refresh, when browser evidence is collected for owned
pilot steps on a stable preview or production host.

## Why defer now

- Phase 09 prioritizes i18n/`dir` strategy, logical CSS on P0 routes, and
  automated regression coverage for Phases 06–07.
- Live Lighthouse against `resident.gateflow.site` / preview requires deploy
  authorization and a session-capable host; Workflow v2 does not authorize
  deploy from `/dev`.
- Existing PWA assets (`public/manifest.json`, `public/sw.js`, offline banner,
  IndexedDB QR path) remain in source; scores are not claimed green without
  fresh measurement.

## Acceptance for lifting deferral

Still open after Phase 10 packet (browser/deploy not authorized in `/dev`):

1. Run Lighthouse (mobile) on Home, Visitors, and Profile P0 routes.
2. Record JSON + summary under `docs/audits/resident-portal/`.
3. Note PWA installability / offline QR read result (pass, fail, or blocker).
4. Update `PILOT_GATE_*phase10.json` and clear this deferral row in
   `DEFERRALS_2026-07-29.json` (or extend expiry with owner sign-off).

**Phase 10 note:** Deferral retained with same owner/expiry; listed in
certification packet as non-blocking for source readiness, still required for
performance claims.

## Related

- Certification packet: `docs/audits/resident-portal/CERTIFICATION_PACKET_2026-07-29.md`
- Deferrals registry: `docs/audits/resident-portal/DEFERRALS_2026-07-29.json`
- i18n interim policy: `apps/resident-portal/src/lib/portal-i18n.ts`
- Audit baseline: `docs/audits/resident-portal/AUDIT_2026-07-29.md`
