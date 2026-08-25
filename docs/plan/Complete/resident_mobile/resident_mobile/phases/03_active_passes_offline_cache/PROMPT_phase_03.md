# Phase 3: Passes Management & Offline Cache

## Primary Role

FRONTEND / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Mobile UI & offline storage integration)
- **Tool 2**: OpenCode CLI (Component scaffold & state tests)

## Context

- **Focused App**: `apps/resident-mobile`
- **Scope**: `app/(tabs)/qrs/` tab, pass details, and `lib/qr-cache.ts`.
- **Packages**: `@react-native-async-storage/async-storage`, `expo-secure-store`, `@gate-access/ui/tokens`.

## Goal

Build the active visitor pass management interface in the QRs tab, complete with pass details modal, pass revocation, and offline pass cache.

## Scope (In)

1. QRs Tab Feed:
   - Render horizontal or vertical card list of active visitor passes fetched from `GET /api/resident/visitors`.
   - Each card displays visitor name, validity expiration countdown, pass status (active, used, expired), and quick-share action.
2. Pass Detail Modal:
   - High-contrast scannable QR code display.
   - Visitor information, allowed gates, and revocation button (`DELETE /api/resident/visitors/[id]`).
3. Offline Caching Contract (`lib/qr-cache.ts`):
   - Cache active passes to `AsyncStorage` whenever network requests succeed.
   - On network failure/offline mode, hydrate feed from cache with an "Offline Mode (Cached)" badge.
4. Unit tests:
   - Cache read/write/eviction tests.
   - Pass status badge formatting tests.
5. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Active passes render correctly with expiration countdowns.
- [ ] Tapping a pass displays the full QR detail modal.
- [ ] Pass revocation calls the DELETE endpoint and removes the pass from active state.
- [ ] Disabling network allows browsing cached active passes without crashing.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
