# Phase 1: AI SDK v6 compile + UI migration

---

## Phase 1: AI SDK v6 compile + UI migration

### Primary role

BACKEND | FRONTEND | SECURITY

### Preferred tool

- [x] Claude CLI
- [ ] Gemini CLI
- [ ] Opencode CLI
- [ ] Kilo CLI
- [ ] Qwen CLI
- [ ] Cursor CLI
- [ ] Kiro CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard, admin-dashboard, scanner-app, marketing
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `packages/db/src/tenant.ts`

### Goal

> Upgrade to Vercel AI SDK v6 + `@ai-sdk/react` v3 and migrate the existing GateAI UI to the v3 `useChat` API (transport/sendMessage/status/messages parts).

### Scope (in)

- Update dependency versions: `ai` -> v6, `@ai-sdk/react` -> v3 (client-dashboard + admin-dashboard).
- Refactor GateAI chat UI to `useChat` v3:
  - `apps/client-dashboard/src/app/[locale]/dashboard/ai/page.tsx`
  - `apps/client-dashboard/src/components/dashboard/ai/ChatPanel.tsx`
  - `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx`
  - `apps/admin-dashboard/src/components/admin-ai-assistant.tsx`
- Update AI API route typing where `CoreMessage` no longer exists (`CoreMessage` -> `ModelMessage`).
- Ensure Next build/typecheck/test pass for `client-dashboard` and `admin-dashboard`.

### Scope (out)

- Deep “Agentic” UX changes beyond initial compile/UI migration (tool execution confirmation lifecycle updates, richer parts rendering, etc.) are deferred.

### Steps (ordered)

1. Update package versions and update lockfile via `pnpm install --no-frozen-lockfile`.
2. Refactor `useChat` usage to v3:
   - `transport: new DefaultChatTransport({ api })`
   - manage input locally
   - `sendMessage({ text })`
   - render from `message.parts` via a text extraction helper
3. Update server route message typing (`CoreMessage` -> `ModelMessage`).
4. Fix any build/typecheck failures surfaced by Next + tsc.
5. Run `pnpm turbo lint --filter=client-dashboard --filter=admin-dashboard`.
6. Run `pnpm turbo typecheck --filter=client-dashboard --filter=admin-dashboard`.
7. Run `pnpm turbo test --filter=client-dashboard --filter=admin-dashboard` and `pnpm turbo build --filter=client-dashboard --filter=admin-dashboard`.

### Acceptance criteria

- [x] `pnpm turbo typecheck --filter=client-dashboard --filter=admin-dashboard` passes.
- [x] `pnpm turbo test --filter=client-dashboard --filter=admin-dashboard` passes.
- [x] `pnpm turbo build --filter=client-dashboard --filter=admin-dashboard` passes.
