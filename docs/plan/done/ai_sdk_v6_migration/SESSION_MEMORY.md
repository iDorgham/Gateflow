---
name: AI SDK v6 Migration — Session Memory
type: session
---

## Active State

- **Phase:** 5 — COMPLETED (ALL PHASES DONE)
- **Status:** Green (lint ✓, typecheck ✓, tests 284 passed ✓)
- **Last commit:** `35366e9` — feat(ai): fix server-side message conversion for AI SDK v6 (phase 4)
- **Next action:** Plan moved to done/ — migration complete

---

## Cross-Session Decisions

1. **`toUIMessageStreamResponse()`** — AI SDK v6 `streamText` result exposes `toUIMessageStreamResponse()` (not `toDataStreamResponse()` which was v4/v5). All three AI routes updated.

2. **`@ai-sdk/google` must be v3.x for `ai@6`** — v1.x returns `LanguageModelV1` which is incompatible with `ai@6` (`LanguageModelV2/V3` required). Updated both apps to `^3.0.53`.

3. **`google(model)` takes 1 arg in v3** — `createGoogleGenerativeAI()('model', options)` no longer accepts a second options arg in v3. Removed `{ structuredOutputs: false }`.

4. **`message.content` is now `string | Part[]`** — in AI SDK v6 `ModelMessage`, `.content` can be a `TextPart[]` array. Use `typeof content === 'string' ? content : ''` for safe string extraction.

5. **Route mapping confirmed:**
   - `ai/page.tsx` (GateAI full page) → `/api/ai/chat` route (automationTools, rate-limit, action logging)
   - `ai-assistant.tsx` (sidebar widget) → `/api/ai/assistant` route (simpler, no rate-limit)
   - Admin → `/api/admin/ai/assistant`

---

## Discovered Gotchas

- `@ai-sdk/react` was already at v3.0.140 (compatible) — only `@ai-sdk/google` needed upgrade
- `streamText` result type: the `as unknown as LanguageModel` casts were masking provider version mismatches
- Phases 2–5 prompts were all empty templates — had to infer scope from code inspection

---

## State Handoff

**Files modified in phases 1+2 (all committed):**

- `apps/client-dashboard/src/app/[locale]/dashboard/ai/page.tsx`
- `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx`
- `apps/client-dashboard/src/components/dashboard/ai/ChatPanel.tsx`
- `apps/client-dashboard/src/components/dashboard/ai/ChatHistorySidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/ai/AIChartRenderer.tsx`
- `apps/admin-dashboard/src/components/admin-ai-assistant.tsx`
- `apps/client-dashboard/src/app/api/ai/assistant/route.ts`
- `apps/client-dashboard/src/app/api/ai/chat/route.ts`
- `apps/admin-dashboard/src/app/api/admin/ai/assistant/route.ts`
- `apps/client-dashboard/package.json` (→ `@ai-sdk/google: ^3.0.53`)
- `apps/admin-dashboard/package.json` (→ `@ai-sdk/google: ^3.0.53`)

**Remaining (not committed, from other work in progress):**

- `apps/client-dashboard/src/components/dashboard/gateai/CanvasEditor.tsx`
- `apps/client-dashboard/src/components/dashboard/gateai/TagSidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/gateai/live-chart/LiveChartComponent.tsx`
- Scanner app components (unrelated to AI SDK migration)
- Maintenance hub changes (different branch work)

---

## Phase 6 Discovered: convertToModelMessages

`DefaultChatTransport` in v6 sends `UIMessage[]` (not `ModelMessage[]`) to the server. The conversion function `convertToModelMessages(uiMessages)` is async and returns `Promise<ModelMessage[]>`. Must `await` it before `streamText`.

For extracting text from UIMessage for logging: use `isTextUIPart` guard from `ai`:

```ts
const text = msg.parts
  .filter(isTextUIPart)
  .map((p) => p.text)
  .join('');
```

## Phase 3 Scope (proposed — skipped by user)

`ChatPanel.tsx` still uses `parseMessageContent(messageText(m))` — regex-parsing text for JSON chart/report/schedule/confirm blocks. In v6, `UIMessage.parts` are natively typed; the panel could read parts directly instead of extracting text first.

**Context budget:** L0+L2+L5 loaded this session.
