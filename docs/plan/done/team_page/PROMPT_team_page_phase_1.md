# Pro Prompt Phase 1: Schema & API (Team & Messaging)

### Primary role
[BACKEND-Database | BACKEND-API | SECURITY]

### Preferred tool
- [x] Gemini CLI — Schema work & structural API scaffold
- [ ] Claude CLI — (for complex logic)

### Context
- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard (3001) for API routes
- **Package**: db for Prisma schema
- **Rules**: pnpm only; strict multi-tenant (`organizationId`); soft deletes (`deletedAt: null`).
- **Refs**: `CLAUDE.md`, `packages/db/prisma/schema.prisma`

### Goal
Implement the core data model and API endpoints to support multi-tenant team management and real-time messaging.

### Scope (in)
- **Database (Prisma):** Add `ChatMessage` model with `id`, `text`, `senderId`, `organizationId`, and `createdAt`.
- **Database (Prisma):** Expand `User` relations to link with `ChatMessage` and ensure `Organization` links to messages.
- **API (Next.js):** 
  - `GET /api/team/members`: Fetch all non-deleted users in the current organization.
  - `GET /api/team/messages`: Fetch the last 50 messages for the current organization.
  - `POST /api/team/messages`: Persist a new message and prepare for SSE broadcast.
- **Security:** Ensure all 3 endpoints strictly check `organizationId` from auth session cookies.

### Scope (out)
- No UI components or frontend work in this phase.
- No real-time SSE broadcast implementation yet (just the persistence).

### Steps (ordered)
1. **Schema Update:** Modify `packages/db/prisma/schema.prisma`. Add the `ChatMessage` model. Map it to `User` (sender) and `Organization`.
2. **Migration:** Run `pnpm prisma migrate dev --name add_team_chat` inside `packages/db`.
3. **API Scaffold:** Create `apps/client-dashboard/src/app/api/team/members/route.ts`. Fetch users where `organizationId` matches and `deletedAt` is null.
4. **API Scaffold:** Create `apps/client-dashboard/src/app/api/team/messages/route.ts`. Implement `GET` (history) and `POST` (save).
5. **Logic:** In `POST /api/team/messages`, ensure the `senderId` is pulled from the authenticated session, and `organizationId` is enforced.
6. **Tests:** Create a simple Jest test in `apps/client-dashboard` to verify these endpoints return 401/403 if unauthorized or unscoped.
7. Run `pnpm turbo lint --filter=db --filter=client-dashboard` and `pnpm turbo typecheck --filter=@gate-access/db --filter=client-dashboard`.

### Acceptance criteria
- [ ] `npx prisma migrate status` is clean.
- [ ] `GET /api/team/messages` returns a valid JSON array scoped to the current Org.
- [ ] `POST /api/team/messages` persists to DB correctly.
- [ ] Every query includes `{ organizationId: session.user.organizationId }`.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.

### Files likely touched
- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/team/members/route.ts`
- `apps/client-dashboard/src/app/api/team/messages/route.ts`
