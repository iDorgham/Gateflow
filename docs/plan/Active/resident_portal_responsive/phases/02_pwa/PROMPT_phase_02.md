# Phase 2: PWA – Install, Offline & Push

## Primary role

BACKEND-API

## Preferred tool

- [x] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [ ] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: resident-portal (the primary target)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `docs/development/initiatives/IDEA_resident_portal_responsive.md`, `PLAN_resident_portal_responsive.md` (plan folder root), `CONTEXT_resident_portal_responsive.md`, `context/`

## Goal

> Transform the resident-portal into a Progressive Web App with service worker
> support, manifest installation, offline QR display, and Web Push registration.

## Scope (in)

- `manifest.json` and PWA meta tags in `(portal)/layout.tsx`.
- Service worker registration with `next-pwa` or custom script.
- `offline-cache.ts` using IndexedDB to store active QR payloads.
- UI indicator for "Offline" status.
- Web Push registration logic (VAPID key setup + registration endpoint).
- Background sync handler for visitor creation (if network lost during submit).

## Scope (out)

- Deep redesigns for Desktop layout (Phase 3).
- Advanced notification settings in Profile (Phase 4).

## Steps (ordered)

1. Create `public/manifest.json` with app identity, icons, and theme colors.
2. Configure `next-pwa` in `next.config.js` or implement a custom service worker
   registration in `apps/resident-portal/src/lib/sw-register.ts`.
3. Build `apps/resident-portal/src/lib/offline-cache.ts` (IndexedDB wrapper).
4. Update `apps/resident-portal/src/app/(portal)/[id]/page.tsx` (the QR detail
   page) to cache the payload upon load.
5. Create `apps/resident-portal/src-components/common/offline-banner.tsx`.
6. Implement `apps/resident-portal/src/lib/push-notifications.ts` (subscription
   logic).
7. Create `/api/resident/push/register` in `resident-portal/src/app/api/`
   (proxied to db layer).
8. Run `pnpm turbo lint --filter=resident-portal`
9. Run `pnpm turbo typecheck --filter=resident-portal`
10. Commit: `git commit -m "feat(pwa): installable manifest, service worker, and
offline QR cache"`

## Acceptance criteria

- [ ] Chrome DevTools Lighthouse PWA Audit passes (or scores 90+).
- [ ] `manifest.json` is correctly linked and detectable.
- [ ] Active QR codes are viewable while in airplane mode (offline cache).
- [ ] Service worker registration endpoint for Web Push is active.
- [ ] All tests pass (`pnpm turbo test --filter=resident-portal`)
- [ ] Build green (`pnpm turbo build --filter=resident-portal`)
- [ ] No PII leakage in IndexedDB cache.
