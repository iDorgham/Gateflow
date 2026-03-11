# PLAN: AI Assistant v2 — Refined UI, Expanded Tools, Tasks, Team Chat & Header Notifications

**Slug:** `ai_assistant_v2`
**Apps:** `client-dashboard`
**Status:** Ready

---

## Problem

The current AI Assistant is a basic chat panel with 4 tools (createProject, createUnit, createQR[stub only], getProjectStats[stub only]), no way to query the system, no team collaboration, and notifications buried in the side panel.

---

## Goal

1. **Move notifications** from the side panel into the header bar (bell icon with dropdown).
2. **Refine the AI panel UI/UX** — polished chat bubbles, quick-action chips, better header.
3. **Expand AI tools** — real QR creation, QR sets (bulk), and rich system queries (list/search anything in the org).
4. **Tasks tab** — lightweight task manager in the side panel backed by a new `Task` model.
5. **Team chat tab** — org-scoped real-time team messaging backed by a new `ChatMessage` model.

---

## Phases

### Phase 1 — Header Notifications + Side Panel Shell Refine
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- Remove the Notifications tab from `SidePanel`. The side panel becomes AI-only (or AI + Tasks + Chat tabs).
- Add a **Notification Bell** to the header bar (`shell.tsx`): bell icon with a red badge when `expiredQRs.length > 0`.
- Replace the current text notification with a **`NotificationDropdown`** component: popover/dropdown showing expired QRs inline, links to QR codes page.
- Refine AI panel shell: bigger header with Sparkles icon, model badge ("Gemini"), context-aware subtitle.
- UI polish to `ai-assistant.tsx`: better message bubble padding, `whitespace-pre-wrap` for multi-line AI responses, improved example prompt chips.

**Files:**
- `components/dashboard/shell.tsx` — add bell + dropdown, remove notifications from side panel
- `components/dashboard/side-panel.tsx` — remove notifications tab
- `components/dashboard/ai-assistant.tsx` — UI polish
- `components/dashboard/notification-dropdown.tsx` (new)

**Acceptance criteria:**
- [ ] Notification bell visible in header with badge count.
- [ ] Clicking bell opens a dropdown with expired QR list.
- [ ] Side panel no longer has a Notifications tab.
- [ ] `pnpm turbo lint` passes.

---

### Phase 2 — Expand AI Tools (Real QR, QR Sets, System Queries)
**Role:** BACKEND-API | **Tool:** Cursor

**Scope:**
- **Fix `createQR`** — use real QR signing + Prisma create (mirror `qrcodes/create/actions.ts`). Accept `gateId?`, `expiresAt?`, `maxUses?`, `guestName?`, `guestEmail?`, `count` (1–20 for sets).
- **Add `createQRSet`** — loop `count` times calling the same signing logic, return array of `{ qrId, shortUrl }`.
- **Add query tools:**
  - `listProjects` — returns org projects (id, name, gateCount)
  - `listGates` — returns active gates (id, name, projectName)
  - `listContacts` — search contacts by name/email (top 10)
  - `listRecentScans` — last 20 scans (gate, status, timestamp)
  - `listUnits` — list units by project or type (top 20)
  - `getOrgStats` — real counts: projects, gates, qrCodes, contacts, units, scans (replaces stub)
- **Remove stub** `getProjectStats` and replace with real `getOrgStats`.
- Update system prompt to describe all tools.

**Files:**
- `app/api/ai/assistant/route.ts` — add 6 new tools, fix createQR, fix getOrgStats

**Acceptance criteria:**
- [ ] `createQR` with `count=1` creates a real signed QR and returns `shortUrl`.
- [ ] `createQR` with `count=5` creates 5 QRs and returns an array.
- [ ] `listProjects`, `listGates`, `listContacts`, `listRecentScans`, `listUnits`, `getOrgStats` all return real Prisma data.
- [ ] Typecheck passes.

---

### Phase 3 — Tasks Tab (Schema + API + UI)
**Role:** BACKEND-API + FRONTEND | **Tool:** Cursor

**Scope:**
- **Schema**: Add `Task` model to `packages/db/prisma/schema.prisma`:
  ```prisma
  model Task {
    id             String    @id @default(cuid())
    title          String
    description    String?
    status         TaskStatus @default(TODO)
    dueDate        DateTime?
    organization   Organization @relation(...)
    organizationId String
    createdBy      String?   // userId
    assignedTo     String?   // userId
    createdAt      DateTime  @default(now())
    updatedAt      DateTime  @updatedAt
    deletedAt      DateTime?
    @@index([organizationId])
  }
  enum TaskStatus { TODO IN_PROGRESS DONE }
  ```
- **API**: `GET /api/tasks` (list, org-scoped), `POST /api/tasks` (create), `PATCH /api/tasks/[id]` (update status/title), `DELETE /api/tasks/[id]` (soft-delete).
- **AI tool**: `createTask(title, description?, dueDate?, assignedTo?)` — creates a task and returns the ID.
- **Tasks tab UI**: New tab in the side panel. Simple list of tasks with title, status badge, due date. Inline status toggle (checkbox). "Add task" input field at the bottom. Filter by status (All / To do / In progress / Done).

**Files:**
- `packages/db/prisma/schema.prisma` — Task model + TaskStatus enum
- `app/api/tasks/route.ts` (new)
- `app/api/tasks/[id]/route.ts` (new)
- `components/dashboard/tasks-panel.tsx` (new)
- `components/dashboard/side-panel.tsx` — add Tasks tab
- `app/api/ai/assistant/route.ts` — add createTask tool

**Acceptance criteria:**
- [ ] Task model in DB after `prisma db push`.
- [ ] GET/POST/PATCH/DELETE API routes work with org scoping.
- [ ] Tasks tab renders in side panel with list + add form + status toggle.
- [ ] AI can create tasks via `createTask` tool.
- [ ] Typecheck and tests pass.

---

### Phase 4 — Team Chat Tab (Schema + API + UI)
**Role:** BACKEND-API + FRONTEND | **Tool:** Cursor

**Scope:**
- **Schema**: Add `ChatMessage` model:
  ```prisma
  model ChatMessage {
    id             String    @id @default(cuid())
    content        String
    organization   Organization @relation(...)
    organizationId String
    userId         String
    user           User @relation(...)
    createdAt      DateTime  @default(now())
    @@index([organizationId])
    @@index([createdAt])
  }
  ```
- **API**:
  - `GET /api/chat?cursor=` — paginated (last 50 messages, org-scoped, newest first)
  - `POST /api/chat` — send a message (content, org-scoped to sender's org)
- **Team Chat UI**: New "Chat" tab in the side panel.
  - Messages list (similar bubble style to AI chat but with user avatars + names)
  - Auto-refresh every 10 seconds (polling, no WebSocket needed for MVP)
  - "Send" input at the bottom (Enter to send)
  - Scrolls to bottom on new message
  - Shows sender name + timestamp + avatar initials
- Side panel now has 3 tabs: **AI** | **Tasks** | **Chat**

**Files:**
- `packages/db/prisma/schema.prisma` — ChatMessage model
- `app/api/chat/route.ts` (new)
- `components/dashboard/team-chat.tsx` (new)
- `components/dashboard/side-panel.tsx` — add Chat tab

**Acceptance criteria:**
- [ ] ChatMessage model in DB after `prisma db push`.
- [ ] GET/POST API work with org scoping.
- [ ] Chat tab renders in side panel with message history + send form.
- [ ] Messages auto-refresh every 10s.
- [ ] Typecheck and lint pass.

---

## Key Files Summary

| File | Phase | Change |
|------|-------|--------|
| `components/dashboard/shell.tsx` | 1 | Bell icon + dropdown, remove notifications tab |
| `components/dashboard/notification-dropdown.tsx` | 1 | New — popover with expired QR list |
| `components/dashboard/side-panel.tsx` | 1, 3, 4 | Remove notifications tab; add Tasks + Chat tabs |
| `components/dashboard/ai-assistant.tsx` | 1 | UI polish |
| `app/api/ai/assistant/route.ts` | 2, 3 | Real tools + createTask |
| `packages/db/prisma/schema.prisma` | 3, 4 | Task + ChatMessage models |
| `app/api/tasks/route.ts` | 3 | New CRUD |
| `components/dashboard/tasks-panel.tsx` | 3 | New Tasks tab UI |
| `app/api/chat/route.ts` | 4 | New GET/POST |
| `components/dashboard/team-chat.tsx` | 4 | New Chat tab UI |

## Dependencies

- Gemini API already wired (`GEMINI_API_KEY`)
- `signQRPayload` from `@gate-access/types` for real QR creation
- `ai/react` `useChat` already in use
- `@tanstack/react-query` available for polling
</content>
