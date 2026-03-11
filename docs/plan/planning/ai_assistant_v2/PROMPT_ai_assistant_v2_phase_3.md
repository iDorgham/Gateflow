# Phase 3: Tasks Tab — Schema, API, UI & AI Tool

## Primary role
BACKEND-API + FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db
- **Rules**: Org-scoped; soft deletes; CSRF on mutating API calls.
- **Refs**:
  - `packages/db/prisma/schema.prisma` — existing models for pattern reference
  - `components/dashboard/side-panel.tsx` — add Tasks tab here
  - `app/api/ai/assistant/route.ts` — add `createTask` tool

## Goal
Implement a lightweight task management system inside the side panel. Tasks are org-scoped, can be created manually or via AI, and have a simple TODO → IN_PROGRESS → DONE workflow.

## Scope (in)
- **Prisma**: Add `Task` model and `TaskStatus` enum.
- **API**:
  - `GET /api/tasks` — list org tasks (not deleted), ordered by `createdAt desc`
  - `POST /api/tasks` — create task `{ title, description?, dueDate?, assignedTo? }`
  - `PATCH /api/tasks/[id]` — update `{ title?, description?, status?, dueDate?, assignedTo? }`
  - `DELETE /api/tasks/[id]` — soft-delete
- **AI tool**: `createTask(title, description?, dueDate?)` — creates via Prisma and returns `{ taskId, title }`.
- **`tasks-panel.tsx`** (new client component):
  - Header: "Tasks" title + task count badge + "Add" button (inline input or mini sheet).
  - Filter pills: All | To Do | In Progress | Done.
  - Task list: each row shows title, status badge (TODO=muted, IN_PROGRESS=primary, DONE=success), due date (if set), and a checkbox that toggles DONE.
  - Empty state with checklist icon.
  - Add task: inline input at the bottom, press Enter to create.
  - Uses `csrfFetch` for mutations.
- **Side panel**: Add `Tasks` tab alongside AI tab. Side panel now has 2 tabs: AI | Tasks.

## Scope (out)
- Task assignment (assignedTo resolved to user name — just store userId for now)
- Chat tab (Phase 4)
- Task comments

## Prisma schema to add (in `schema.prisma`):
```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

model Task {
  id             String      @id @default(cuid())
  title          String
  description    String?
  status         TaskStatus  @default(TODO)
  dueDate        DateTime?
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String
  createdBy      String?
  assignedTo     String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  deletedAt      DateTime?

  @@index([organizationId])
  @@index([deletedAt])
}
```
And add `tasks Task[]` to the Organization model.

## Steps (ordered)
1. Add `Task` model and `TaskStatus` enum to `packages/db/prisma/schema.prisma`. Add `tasks Task[]` relation to `Organization`.
2. Run `cd packages/db && npx prisma db push`.
3. Create `apps/client-dashboard/src/app/api/tasks/route.ts` (GET + POST).
4. Create `apps/client-dashboard/src/app/api/tasks/[id]/route.ts` (PATCH + DELETE).
5. Create `apps/client-dashboard/src/components/dashboard/tasks-panel.tsx`:
   - `useEffect` to fetch `/api/tasks` on mount
   - Status filter pills
   - Task list with checkbox toggle (PATCH to toggle DONE/TODO)
   - Bottom add input
6. Add `createTask` tool to `app/api/ai/assistant/route.ts`.
7. Update `side-panel.tsx` to add a Tasks tab with `<TasksPanel />`.
8. Run `pnpm turbo test --filter=client-dashboard` and `pnpm turbo typecheck`.
9. Commit: `feat(tasks): Tasks tab in side panel with AI tool integration (phase 3)`.

## Acceptance criteria
- [ ] `Task` model exists in DB after `prisma db push`.
- [ ] GET/POST/PATCH/DELETE API routes work and are org-scoped.
- [ ] Tasks tab renders in the side panel with list, filter, and add form.
- [ ] Checkbox toggles task status instantly (optimistic update).
- [ ] AI can create a task when asked ("Add a task: review gate assignments").
- [ ] Typecheck and tests pass.
