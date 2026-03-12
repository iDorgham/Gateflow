# Phase 2: QRs Tab — List, Create, Delete, Offline Cache

## Primary role
MOBILE + FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/resident-mobile`
- **Refs**:
  - `apps/resident-mobile/app/(tabs)/qrs/index.tsx` — current stub
  - `apps/resident-mobile/app/(tabs)/_layout.tsx` — tab chrome (theme colors set)
  - `apps/resident-mobile/app/login.tsx` — auth pattern reference
  - `apps/scanner-app/src/lib/offline-queue.ts` — AsyncStorage pattern reference
  - `apps/client-dashboard/src/app/api/resident/visitors/route.ts` — API contract (Phase 1 output)
  - `EXPO_PUBLIC_API_URL` env var — base URL for client-dashboard API

## Goal
Wire the QRs tab to the resident API — list visitor QRs, create new ones with access rule selection, delete, render QR code images, and cache the list for offline display.

## Scope (in)

**New dependency**: add to `apps/resident-mobile/package.json`:
- `react-native-qrcode-svg` (QR image rendering)
- `react-native-svg` (peer dep for qrcode-svg)

**`lib/api.ts`** — shared fetch helper for resident-mobile:
```ts
// Reads access token from SecureStore, adds Authorization header
// Handles 401 → clear token + navigate to login
export async function residentFetch(path, options?)
```

**`lib/storage.ts`** — AsyncStorage helpers:
```ts
export async function cacheQRs(qrs: VisitorQR[]): Promise<void>
export async function getCachedQRs(): Promise<VisitorQR[]>
```
Cache key: `resident_qrs_v1`

**`app/(tabs)/qrs/index.tsx`** — rewrite:
- Load from API on mount; on error fall back to cache, show "offline" banner
- FlatList of `QRCard` components
- Pull-to-refresh
- FAB (floating action button) → navigate to create screen
- Swipe-to-delete (with Alert confirmation) → soft-delete via API, remove from cache

**`app/qrs/new.tsx`** — create form screen:
- Fields: visitor name (required), phone (optional)
- Access rule type selector: ONE_TIME | DATE_RANGE | RECURRING | PERMANENT (segmented control)
- Conditional fields: date picker for start/end (DATE_RANGE), day selector for RECURRING
- Submit → POST `/api/resident/visitors` → success → push QRs screen + refresh list

**`components/QRCard.tsx`** — card component:
- Shows visitor name, access rule badge, status chip (active/expired/deleted)
- Taps to `app/visitors/[id].tsx` (visitor detail)
- QR image from `react-native-qrcode-svg` using the short QR link

**`app/visitors/[id].tsx`** — rewrite stub:
- Load single VisitorQR from API
- Show QR code (large, shareable)
- Access rule detail
- Delete button

## Steps (ordered)
1. Add `react-native-qrcode-svg` and `react-native-svg` to `apps/resident-mobile/package.json` with `pnpm add`.
2. Create `apps/resident-mobile/lib/api.ts` — `residentFetch` helper with SecureStore token reading.
3. Create `apps/resident-mobile/lib/storage.ts` — `cacheQRs` + `getCachedQRs`.
4. Create `apps/resident-mobile/components/QRCard.tsx`.
5. Rewrite `apps/resident-mobile/app/(tabs)/qrs/index.tsx` — FlatList + FAB + pull-to-refresh + offline fallback.
6. Create `apps/resident-mobile/app/qrs/new.tsx` — create form.
7. Rewrite `apps/resident-mobile/app/visitors/[id].tsx` — visitor detail + large QR.
8. Add `EXPO_PUBLIC_API_URL` to `apps/resident-mobile/.env` (e.g. `http://localhost:3001`).
9. Run `pnpm --filter=resident-mobile typecheck`.
10. Run `pnpm --filter=resident-mobile lint`.
11. Commit: `feat(resident-mobile): QRs tab — list, create, delete, offline cache (phase 2)`.

## Scope (out)
- Contact picker (Phase 3)
- Share sheet (Phase 3)
- Push notifications (Phase 4)

## Acceptance criteria
- [ ] QRs tab loads from API, shows QR code image for each entry
- [ ] Offline: cache renders with "offline" badge, no crash
- [ ] Create form validates required fields before submit
- [ ] Delete removes item from list with confirmation dialog
- [ ] Visitor detail shows large renderable QR code
- [ ] `pnpm --filter=resident-mobile typecheck` passes
- [ ] `pnpm --filter=resident-mobile lint` passes

## Files likely touched
- `apps/resident-mobile/package.json`
- `apps/resident-mobile/lib/api.ts` (new)
- `apps/resident-mobile/lib/storage.ts` (new)
- `apps/resident-mobile/components/QRCard.tsx` (new)
- `apps/resident-mobile/app/(tabs)/qrs/index.tsx` (rewrite)
- `apps/resident-mobile/app/qrs/new.tsx` (new)
- `apps/resident-mobile/app/visitors/[id].tsx` (rewrite)
- `apps/resident-mobile/.env` (new)

## Git commit
```
feat(resident-mobile): QRs tab — list, create, delete, offline cache (phase 2)
```
