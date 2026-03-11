# Phase 4: Team Chat Tab — Schema, API & Real-Time UI

## Primary role
BACKEND-API + FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db
- **Rules**: Org-scoped; no WebSocket needed — use polling (10s interval) for MVP.
- **Refs**:
  - `packages/db/prisma/schema.prisma` — User model has `id, name, avatarUrl`
  - `components/dashboard/side-panel.tsx` — add Chat tab (Phase 3 already added Tasks)
  - `components/dashboard/ai-assistant.tsx` — reference for bubble style to reuse in team chat

## Goal
Add a team chat tab to the side panel for org-wide messaging. Messages are persisted in the DB, loaded via polling, and rendered in a chat bubble style matching the AI assistant.

## Scope (in)
- **Prisma**: Add `ChatMessage` model.
- **API**:
  - `GET /api/chat?cursor=` — returns last 50 messages for the org (newest first), with sender `{ id, name, avatarUrl }`. Optional `cursor` (message ID) for pagination.
  - `POST /api/chat` — send a message `{ content }`. `userId` from session claims.
- **`team-chat.tsx`** (new client component):
  - Message list: same bubble-style layout as `ai-assistant.tsx` but with:
    - Sender avatar (initials fallback) + sender name above bubble
    - Timestamp below bubble
    - Current user's messages on the right, others on the left
  - Auto-scroll to bottom on new messages
  - Polling: `useEffect` with `setInterval` at 10 000ms, clear on unmount
  - Send form: `<input>` + Send button, Enter to submit, uses `csrfFetch`
  - Empty state: "No messages yet. Start the conversation."
  - Shows last 50 messages; "Load earlier" button for pagination (optional)
- **Side panel**: Adds a 3rd tab — AI | Tasks | Chat.

## Scope (out)
- WebSocket/SSE (can be added later as an upgrade)
- Message reactions or threading
- Read receipts

## Prisma schema to add:
```prisma
model ChatMessage {
  id             String       @id @default(cuid())
  content        String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())

  @@index([organizationId])
  @@index([createdAt])
}
```
Add `chatMessages ChatMessage[]` to `Organization` and `User` models.

## Steps (ordered)
1. Add `ChatMessage` model to schema. Add relations to `Organization` and `User`. Run `prisma db push`.
2. Create `apps/client-dashboard/src/app/api/chat/route.ts` (GET + POST).
3. Create `apps/client-dashboard/src/components/dashboard/team-chat.tsx`:
   - State: `messages`, `newMessage`, `isSending`
   - `useEffect` load on mount + `setInterval` 10s poll
   - Message rendering with avatar initials, name, timestamp, and bubble
   - Send form with `csrfFetch` POST
4. Update `side-panel.tsx` to add Chat tab with `<TeamChat />`.
5. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.
6. Commit: `feat(chat): Team Chat tab in side panel with polling (phase 4)`.

## Acceptance criteria
- [ ] `ChatMessage` model exists in DB after `prisma db push`.
- [ ] GET `/api/chat` returns last 50 org messages with sender info.
- [ ] POST `/api/chat` persists message and returns it.
- [ ] Chat tab renders in side panel with messages + send form.
- [ ] Current user's messages appear on the right; others on the left.
- [ ] Messages auto-refresh every 10 seconds.
- [ ] Typecheck and lint both pass.
