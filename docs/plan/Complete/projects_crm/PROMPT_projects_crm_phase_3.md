# Pro Prompt — projects_crm — Phase 3

## Phase 3: Visitor Watchlist & Security Alerts

### Primary role

`security.md`

### Tool Selection

|                            | Tool            | Why                                            |
| -------------------------- | --------------- | ---------------------------------------------- |
| **Tool 1** (best quality)  | Claude Code CLI | Best for core security reasoning & invariants. |
| **Tool 2** (free fallback) | Cursor          | Schema and UI changes.                         |

### Skills to load

- [x] `gf-security` — Invariants, guards, multi-tenancy
- [x] `gf-mobile` — Scanner app API update
- [x] `gf-api` — SSE (Server-Sent Events) alerts
- [x] `using-superpowers`
- [x] `verification-before-completion`

### Goal

Implement a proactive security layer that detects and alerts property managers when "Watchlisted" visitors attempt to enter a project.

### Scope (in)

- **Status**: Add `WatchlistStatus` enum to `Contact` (NONE, BLOCKED, ESCORT).
- **Scanner Sync**: Update `POST /api/qrcodes/validate` (used by scanner-app) to return the contact's `watchlistStatus`.
- **SSE Alerts**: Emit `WATCHLIST_ALERT` event via `apps/client-dashboard/src/app/api/events/stream/route.ts` upon a BLOCKED scan event.
- **UI**: Display a high-impact alert toast/notification in the dashboard if a session-owner is active.

### Steps (ordered)

1. Add `WatchlistStatus` enum to `packages/db/prisma/schema.prisma` and migrate.
2. Update the `validate` endpoint logic to check the linked `Contact`'s watchlist status.
3. Integrate the SSE alert emission in the scan validation logic.
4. Update the scanner-app logic (mocking the UI if needed) to handle the new status.
5. Implement the dashboard alert toast (Motion.dev) for real-time security feedback.
6. Verify no `organizationId` or `deletedAt` bypasses in the watchlist check.

### Acceptance criteria

- [ ] Scanner displays "BLOCKED" alert for blacklisted visitor scan.
- [ ] Dashboard displays a real-time security toast with the contact's name and project.
- [ ] 0 Security Invariant violations found.
- [ ] Mobile app handles the updated validation payload without crashing (graceful fallback).

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts`
- `apps/client-dashboard/src/app/api/events/stream/route.ts`
- `apps/client-dashboard/src/components/dashboard/realtime/SecurityNotifier.tsx` (UI)
- `apps/scanner-app/src/services/api/validate.ts`
