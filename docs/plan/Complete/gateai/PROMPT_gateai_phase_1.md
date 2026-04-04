# Pro Prompt — Phase 1: Basic Read-Only Chat + Gemini 1.5 Flash Hello World

**Primary role:** BACKEND-API
**Preferred tool:** Cursor

### Context

- **Project**: GateFlow (Turborepo, pnpm)
- **App**: client-dashboard (3001)
- **Security**: Load gf-security/SKILL.md; follow CONTRACTS.md
- **Rules**: Enforce orgId scoping; deletedAt: null

### Goal

Implement a functional, streaming chat interface powered by Gemini 1.5 Flash.

### Scope (in)

- Backend API route using `ai` package (Vercel AI SDK).
- Frontend chat component with message rendering.
- Basic "Hello" integration with Gemini.

### Scope (out)

- No database context injection yet.
- No file attachments.

### Steps

1. Create `apps/client-dashboard/src/app/api/ai/chat/route.ts`. Use `google-generative-ai` and `ai` packages.
2. Implement auth check using `requireAuth`. Check for `orgId`.
3. Create a basic chat UI component in `apps/client-dashboard/src/components/dashboard/ai/chat-panel.tsx`.
4. Use `useChat` hook from `ai/react` in the `/ai` page.
5. Add bilingual message bubbles (user vs assistant) with appropriate avatars.
6. Verify streaming works.
7. Run `pnpm turbo lint/typecheck/test --filter=client-dashboard`.
8. `/github` — feat(gateai): phase 1 — streaming chat with Gemini.

### Acceptance Criteria

- [ ] Sending a message receives a streaming response from Gemini.
- [ ] Unauthorized users cannot access the API.
- [ ] UI is responsive and supports RTL.
