# Phase 4: Push Notifications — Token Registration + Scan Event

## Primary role
MOBILE + BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **Apps**: `apps/resident-mobile` + `apps/client-dashboard`
- **Refs**:
  - `apps/resident-mobile/app/login.tsx` — auth flow (register token here)
  - `apps/client-dashboard/src/app/api/resident/push-token/route.ts` — Phase 1 output
  - `apps/client-dashboard/src/app/api/resident/arrived/route.ts` — Phase 1 output
  - `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` — extend to fire push
  - Expo docs: `expo-notifications`

## Goal
Register the resident's Expo push token when they log in, then send a real-time push notification when their visitor scans at the gate. Handle foreground and background push receipt.

## Scope (in)

**New dependency** (add to `apps/resident-mobile/package.json`):
- `expo-notifications`

**`lib/push.ts`** — push notification helper:
```ts
export async function registerForPushNotifications(): Promise<string | null>
// 1. Check/request permissions
// 2. Get Expo push token via Notifications.getExpoPushTokenAsync()
// 3. Return token string or null if denied
```

**Update `app/login.tsx`**:
- After successful login + token stored in SecureStore:
  - Call `registerForPushNotifications()`
  - POST token to `/api/resident/push-token`
  - Store token in AsyncStorage for reference (`resident_push_token_v1`)

**`lib/notifications.ts`** — notification handler setup:
```ts
export function setupNotificationHandlers(router)
// Notifications.addNotificationReceivedListener → in-app banner
// Notifications.addNotificationResponseReceivedListener → deep link to History tab
```

**Update `app/_layout.tsx`**:
- Call `setupNotificationHandlers(router)` on mount
- Configure notification channel (Android)

**Backend: extend `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts`**:
- After a scan is recorded as SUCCESS and the QR is a `VisitorQR`:
  - Find the `VisitorQR` → get `Unit` → get `User` (resident)
  - If `user.expoPushToken` is set:
    - POST to `https://exp.host/--/api/v2/push/send`:
      ```json
      {
        "to": "<expoPushToken>",
        "title": "Visitor arrived",
        "body": "<visitorName> just scanned in at <gateName>",
        "data": { "type": "visitor_scan", "visitorQrId": "..." }
      }
      ```
  - This should be fire-and-forget (don't fail the scan response if push fails)
  - Use `fetch` with a 3-second timeout; log errors but do not throw

**Deep link**: Notification `data.type === 'visitor_scan'` → navigate to `/(tabs)/history` filtered by visitorQrId

## Steps (ordered)
1. Run `pnpm add expo-notifications --filter=resident-mobile`.
2. Add notification permissions to `apps/resident-mobile/app.json` (iOS + Android).
3. Create `apps/resident-mobile/lib/push.ts` — `registerForPushNotifications`.
4. Create `apps/resident-mobile/lib/notifications.ts` — `setupNotificationHandlers`.
5. Update `apps/resident-mobile/app/login.tsx` — call `registerForPushNotifications` + POST token after login.
6. Update `apps/resident-mobile/app/_layout.tsx` — call `setupNotificationHandlers` on mount.
7. Update `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` — add fire-and-forget push after SUCCESS scan of VisitorQR.
8. Test push manually: use Expo Push Notification Tool with a valid Expo push token.
9. Run `pnpm --filter=resident-mobile typecheck`.
10. Run `pnpm turbo typecheck --filter=client-dashboard`.
11. Run `pnpm turbo lint --filter=client-dashboard`.
12. Commit: `feat(resident-mobile): push notification on visitor scan — token + scan event (phase 4)`.

## Scope (out)
- GPS guide (Phase 5)
- Arrival notification (Phase 5)
- Notification preference toggles (Phase 6)

## Acceptance criteria
- [ ] Login registers push token and POSTs to `/api/resident/push-token`
- [ ] Scan of a VisitorQR triggers Expo push to resident (testable via Expo Push Tool)
- [ ] Push received when app is backgrounded: tapping opens History tab
- [ ] Push received when app is foregrounded: in-app banner shown
- [ ] Scan response not delayed/failed if push fails (fire-and-forget)
- [ ] `pnpm --filter=resident-mobile typecheck` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes
- [ ] `pnpm turbo lint --filter=client-dashboard` passes

## Files likely touched
- `apps/resident-mobile/package.json`
- `apps/resident-mobile/app.json` (notification permissions)
- `apps/resident-mobile/lib/push.ts` (new)
- `apps/resident-mobile/lib/notifications.ts` (new)
- `apps/resident-mobile/app/login.tsx` (updated)
- `apps/resident-mobile/app/_layout.tsx` (updated)
- `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` (updated)

## Git commit
```
feat(resident-mobile): push notification on visitor scan — token + scan event (phase 4)
```
