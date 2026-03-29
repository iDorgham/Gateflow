---
name: AI SDK v6 Migration — Session Memory
type: session
---

## Active State

- **Phase:** All plan phases (1–5) including **Phase 3 (v6 tool part guards)** — COMPLETED in repo
- **Status:** Green for touched apps (lint ✓, typecheck ✓ for client-dashboard + admin-dashboard)
- **Next action:** Commit Phase 3 changes if not yet on main; then PR/merge or close initiative.

---

## Accomplished in Phase 3 (two slices)

**Slice A (earlier): GateAI tool UI + `ui-tools`**

1. **Native Parts Rendering:** `ChatPanel.tsx` iterates `UIMessage.parts`.
2. **UI Tools:** `ui-tools.ts` — `showChart`, `showReport`, `showSchedule`, `requestConfirmation`.
3. **Route:** AI chat uses tool calling for rich UI; regex fallback on text parts for old history.

**Slice B (2026-03-29): AI SDK v6 part shape**

1. **Guards:** `isTextUIPart`, `isToolUIPart`, `getToolName`, `isReasoningUIPart`, `isFileUIPart`, `isDataUIPart`; tool payload from `input` via `toolUiPayload()`.
2. **States:** `output-available` / `output-error` (no legacy `result` / `args`).
3. **Keys:** JSON-in-text confirmations use `actionStates[\`${m.id}-${i \* 100 + j}\`]`to match`handleActionConfirm`; tool `requestConfirmation`uses`${m.id}-${i}`.
4. **Sidebars:** `ai-assistant.tsx` and `admin-ai-assistant.tsx` render assistant turns with tool/reasoning/file/data parts (compact).

## Accomplished in Phases 1, 2, 4, 5 (Previous runs)

1. **Core SDK Update:** Migrated `@ai-sdk/react` and `ai` packages to v3+ / v6.
2. **Unified Transport:** Switched `ChatPanel` and `AIAssistant` to `DefaultChatTransport`.
3. **UIMessage Adoption:** Server now returns `result.toUIMessageStreamResponse()`.
4. **Server-side Conversion:** Fixed `convertToModelMessages` async handling in routes.
5. **Route Mapping:** Updated all three AI routes (`chat`, `assistant`, `admin`).

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

**Context budget:** L0+L2+L5 loaded this session.
