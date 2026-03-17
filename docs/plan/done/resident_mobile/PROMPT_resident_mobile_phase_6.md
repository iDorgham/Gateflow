# Phase 6: History Tab, Settings, RTL Polish, Tests

## Primary role
QA + i18n

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/resident-mobile` + `apps/client-dashboard`
- **Refs**:
  - `apps/resident-mobile/app/(tabs)/history/index.tsx` — current stub
  - `apps/resident-mobile/app/(tabs)/settings/index.tsx` — current stub
  - `apps/scanner-app/src/components/HistoryTab.tsx` — reference for day-grouped scan list
  - `apps/client-dashboard/src/app/api/resident/history/route.ts` — Phase 1 output
  - `apps/client-dashboard/src/app/api/resident/push-token/route.ts` — Phase 1 output
  - React Native `I18nManager` docs — RTL layout

## Goal
Complete the app: wire History and Settings tabs, audit every screen for RTL correctness in Arabic, and add Jest tests for the resident API routes.

## Scope (in)

**History tab** (`app/(tabs)/history/index.tsx`):
- Fetch `/api/resident/history` on mount + pull-to-refresh
- Group entries by date (same pattern as scanner-app's `HistoryTab`)
- Each entry: visitor name, gate name, scan status badge (SUCCESS / DENIED / EXPIRED), timestamp
- Empty state: "No visitor history yet" illustration
- Loading skeleton while fetching

**Settings tab** (`app/(tabs)/settings/index.tsx`):
- "Scan notifications" toggle — reads from AsyncStorage (`resident_notify_scan_v1`); on change: POST preference to `/api/resident/push-token` with `{ notifyScan: bool }`
- "Arrival notifications" toggle — same pattern, `notifyArrival` field
- "Sign out" button — clear SecureStore tokens + AsyncStorage + navigate to login
- App version display

**Backend**: update `/api/resident/push-token/route.ts`:
- Accept optional `notifyScan: boolean` and `notifyArrival: boolean` in body
- Store on User model (add `residentNotifyScan Boolean @default(true)` + `residentNotifyArrival Boolean @default(true)`)
- Schema update + `prisma db push`
- Validate preferences before dispatching push in scan/arrived routes

**RTL audit** — check every screen with `I18nManager.isRTL = true` (or test on Arabic device):
- QRs tab: card layout, FAB position, swipe direction
- Create form: input alignment, label alignment
- Contact picker: search bar, list items
- History tab: date headers, entry layout
- Settings tab: toggle labels, rows

**Jest tests** (`apps/client-dashboard/src/app/api/resident/`):
- `history.test.ts` — returns scan logs for resident's QRs only; pagination
- `arrived.test.ts` — idempotency (second call returns `already_notified`); 403 without RESIDENT role
- `open-qr.test.ts` — creates isOpenQR QR; respects canCreateOpenQR limit

**TASKS file** — create `docs/plan/execution/TASKS_resident_mobile.md` with all 6 phases marked complete.

## Steps (ordered)
1. Add `residentNotifyScan` + `residentNotifyArrival` to User in schema; `prisma db push`.
2. Update `/api/resident/push-token/route.ts` to persist preference fields.
3. Update scan push dispatch (validate/arrived routes) to respect preferences.
4. Rewrite `app/(tabs)/history/index.tsx` — fetch, group by date, FlatList.
5. Rewrite `app/(tabs)/settings/index.tsx` — notification toggles + sign out.
6. RTL audit: test each screen, fix any `flexDirection`, `textAlign`, `marginLeft/Right` issues.
7. Write `history.test.ts`, `arrived.test.ts`, `open-qr.test.ts` in client-dashboard.
8. Run `pnpm turbo lint && pnpm turbo typecheck` (all workspaces).
9. Run `pnpm turbo test`.
10. Create `docs/plan/execution/TASKS_resident_mobile.md`.
11. Commit: `feat(resident-mobile): history tab, settings, RTL polish, tests — complete (phase 6)`.

## Scope (out)
- Biometric lock
- Smart guest templates
- Quota home widget
- Notification quiet hours UI

## Acceptance criteria
- [ ] History tab loads, groups by date, shows correct scan status badges
- [ ] Settings notification toggles persist and update backend preference
- [ ] Sign out clears all local state and navigates to login
- [ ] RTL: all screens visually correct in Arabic layout
- [ ] Jest: `history.test.ts`, `arrived.test.ts`, `open-qr.test.ts` all pass
- [ ] `pnpm turbo lint` passes (all workspaces)
- [ ] `pnpm turbo typecheck` passes (all workspaces)
- [ ] `pnpm turbo test` passes

## Files likely touched
- `packages/db/prisma/schema.prisma` (User notification prefs)
- `apps/client-dashboard/src/app/api/resident/push-token/route.ts`
- `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` (respect pref)
- `apps/client-dashboard/src/app/api/resident/arrived/route.ts` (respect pref)
- `apps/client-dashboard/src/app/api/resident/history.test.ts` (new)
- `apps/client-dashboard/src/app/api/resident/arrived.test.ts` (new)
- `apps/client-dashboard/src/app/api/resident/open-qr.test.ts` (new)
- `apps/resident-mobile/app/(tabs)/history/index.tsx` (rewrite)
- `apps/resident-mobile/app/(tabs)/settings/index.tsx` (rewrite)
- `docs/plan/execution/TASKS_resident_mobile.md` (new)

## Git commit
```
feat(resident-mobile): history tab, settings, RTL polish, tests — complete (phase 6)
```
