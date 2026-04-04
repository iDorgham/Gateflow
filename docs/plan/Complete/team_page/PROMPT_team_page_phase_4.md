# Pro Prompt Phase 4: Real-time & Polish (SSE Chat & Presence)

### Primary role

[BACKEND-API | FRONTEND | i18n]

### Preferred tool

- [x] Claude CLI — Complex SSE & presence logic
- [ ] Cursor — Final RTL/Polish review

### Context

- **Project**: GateFlow — Zero-Trust platform (Turborepo)
- **App**: client-dashboard (3001) for SSE route & hook
- **Rules**: pnpm only; strict multi-tenant; use desaturated grays (#18191a / #1f1f21).
- **Refs**: `CLAUDE.md`, `apps/client-dashboard/src/app/api/analytics/live/route.ts` (SSE sample)

### Goal

Enable bidirectional, real-time message broadcasting for the team chat and add finishing touches (presence, RTL audit, and performance).

### Scope (in)

- **SSE Broadcast:** Expand the existing SSE endpoint to emit `TEAM_CHAT_MESSAGE` events when `POST /api/team/messages` is called.
- **Frontend Hook:** Update `TeamSidebarChat.tsx` to listen for these events and append messages optimistically or via cache invalidation.
- **Presence:** Implement a simple `lastActiveAt` update on every request or specifically for the Team page to show "Online" status.
- **Micro-Animations:** Added Framer Motion "sliding/fade-in" for new messages.
- **Polish:** Final audit of the Team Page and Chat Sidebar in RTL (Arabic) with perfect alignment.
- **Audio:** OPTIONAL — simple notification sound for new messages.

### Scope (out)

- No complex "Read Receipts" in this phase.
- No historical data migration.

### Steps (ordered)

1. **SSE Backend:** Modify `apps/client-dashboard/src/app/api/events/sse/route.ts` (or equivalent) to support a `chat` event type.
2. **Broadcast:** In `POST /api/team/messages`, trigger the SSE broadcast after the message is saved to the database.
3. **Frontend Sync:** Use `useEffect` or `@tanstack/react-query`'s `setQueryData` to handle incoming SSE messages in `TeamSidebarChat.tsx`.
4. **Presence:** Update `User` model's `lastActiveAt` (or similar) on every message send/fetch.
5. **UI Polish:** Add `PresenceIndicator` (green dot) next to avatars in the chat list and management table.
6. **RTL Audit:** Launch the browser at `localhost:3001/ar` and verify the message input, bubble directions, and member table flow.
7. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.

### Acceptance criteria

- [ ] Sending a message from one browser tab appears instantly in another.
- [ ] New messages have subtle entry animations.
- [ ] Members in the management table show an "Online" status if active recently.
- [ ] RTL layout is pixel-perfect in Arabic mode.
- [ ] All tests pass; 0 raw hex codes.

### Files likely touched

- `apps/client-dashboard/src/app/api/events/sse/route.ts`
- `apps/client-dashboard/src/components/dashboard/team/TeamSidebarChat.tsx`
- `apps/client-dashboard/src/components/dashboard/team/TeamMembersTable.tsx`
- `packages/db/prisma/schema.prisma` (for presence field)
