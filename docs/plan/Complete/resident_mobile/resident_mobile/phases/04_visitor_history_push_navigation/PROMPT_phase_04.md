# Phase 4: Visitor History & Push Deep-Linking

## Primary Role

FRONTEND / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Push notification handling & history feed)
- **Tool 2**: Qwen CLI (History sorting and filtering helpers)

## Context

- **Focused App**: `apps/resident-mobile`
- **Scope**: `app/(tabs)/history/` tab, `lib/push-notifications.ts`, and `lib/history-cache.ts`.
- **Packages**: `expo-notifications`, `expo-router`, `@gate-access/ui/tokens`.

## Goal

Implement the real-time visitor access history feed, register Expo push notification listeners, and enable seamless deep-linking to specific scan logs upon notification tap.

## Scope (In)

1. History Feed (`app/(tabs)/history/index.tsx`):
   - Fetch scan history from `GET /api/resident/history`.
   - Render timestamped entry logs with status indicators (Granted / Denied / Overstay).
   - Filter chips: "All", "Granted", "Denied".
   - Pull-to-refresh and infinite scroll pagination.
2. Push Notification Listener (`lib/push-notifications.ts`):
   - Register notification received and response listeners (`expo-notifications.addNotificationResponseReceivedListener`).
   - Parse payload `{ type: "gate_scan", scanId: "...", tab: "history" }`.
   - Use `expo-router` to switch to History tab and highlight/open the matching scan entry.
3. Offline History Cache (`lib/history-cache.ts`):
   - Save last 50 history entries to local storage for offline browsing.
4. Unit tests:
   - Push payload parser tests.
   - History filtering and status formatting tests.
5. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] History feed displays accurate gate scan entries.
- [ ] Tapping a simulated or real push notification navigates directly to the target history entry.
- [ ] Offline access displays cached history entries cleanly.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
