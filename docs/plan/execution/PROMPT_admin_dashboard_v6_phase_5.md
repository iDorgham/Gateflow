# Phase 5: Admin AI Assistant

## Primary role
FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/components/admin-side-panel.tsx` — panel stub from Phase 1
  - `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx` — full AI component to adapt
  - `apps/client-dashboard/src/app/api/ai/assistant/route.ts` — AI route with tools to adapt
  - `apps/admin-dashboard/src/lib/admin-auth.ts`
  - `@gate-access/ui` — Button, cn

## Goal
Implement the AI assistant in the admin side panel. Admin-specific tools: `getOrgStats`, `listRecentOrgs`, `getPlatformMetrics`, `listRecentScans`, `searchUsers`. Uses the same `useChat` + `ai` SDK + `streamText` pattern as client-dashboard.

## Scope (in)
- **Install packages** in `apps/admin-dashboard/package.json`:
  - `ai: "^4.3.0"`
  - `@ai-sdk/anthropic: "^1.1.0"`
  - `zod: "^3.22.4"`
- **New API route** `src/app/[locale]/api/admin/ai/assistant/route.ts`:
  - Auth: `isAdminAuthenticated()` — return 503 if `ANTHROPIC_API_KEY` missing, 401 if not admin
  - Tools (use `zod` schemas):
    - `getPlatformMetrics` — returns totalOrgs, totalUsers, scansToday, scansThisMonth
    - `listRecentOrgs` — `{ limit: number }` → last N orgs with name, plan, createdAt
    - `getOrgStats` — `{ orgId: string }` → org detail (users, gates, scans, plan)
    - `listRecentScans` — `{ limit: number }` → last N scan logs (status, gate, scannedAt)
    - `searchUsers` — `{ query: string }` → users matching name/email (limit 10)
  - Model: `claude-haiku-4-5-20251001`
  - System prompt: "You are the GateFlow platform administrator AI assistant. You have read-only access to platform data. You can answer questions about organizations, users, scan activity, and platform health."
- **`AdminAIAssistant` component** (`src/components/admin-ai-assistant.tsx`):
  - Port from `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx`
  - Change API endpoint to `/api/admin/ai/assistant` (with locale prefix: `/${locale}/api/admin/ai/assistant`)
  - Update welcome message and example prompts to admin context:
    - "Show platform metrics"
    - "List recent organizations"
    - "Show scan activity today"
    - "Search for user [name]"
    - "How many PRO orgs?"
  - Keep same UI pattern (welcome card, messages, input, clear button)
  - Storage key: `gateflow-admin-ai-chat-v1`
- **Wire into `AdminSidePanel`**:
  - Import `AdminAIAssistant` and render it in the "AI" tab content
  - Pass `locale` prop from parent

## Steps (ordered)
1. Add `ai`, `@ai-sdk/anthropic`, `zod` to `apps/admin-dashboard/package.json`. Run `pnpm install`.
2. Create `src/app/[locale]/api/admin/ai/assistant/route.ts` with the 5 tools.
3. Create `src/components/admin-ai-assistant.tsx` (adapt from client-dashboard version).
4. Update `src/components/admin-side-panel.tsx` to accept `locale` prop and render `<AdminAIAssistant locale={locale} />` in the AI tab.
5. Update `src/components/admin-shell.tsx` to pass `locale` to `AdminSidePanel`.
6. Run `pnpm turbo lint --filter=admin-dashboard`.
7. Run `pnpm turbo typecheck --filter=admin-dashboard`.
8. Commit: `feat(admin): AI assistant panel with platform admin tools (phase 5)`.

## Scope (out)
- Write/mutation tools for AI (read-only in Phase 5)
- Streaming partial rendering (basic streaming via `useChat` is sufficient)

## Acceptance criteria
- [ ] `ai` and `@ai-sdk/anthropic` are in `package.json`.
- [ ] AI assistant renders in the side panel AI tab.
- [ ] "Show platform metrics" tool call returns real data.
- [ ] "List recent organizations" tool call returns org list.
- [ ] Panel returns 503 if `ANTHROPIC_API_KEY` is not set.
- [ ] Panel returns 401 if admin session is not valid.
- [ ] Messages persist to `localStorage` under `gateflow-admin-ai-chat-v1`.
- [ ] Clear chat button resets to welcome state.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): AI assistant panel with platform admin tools (phase 5)
```
