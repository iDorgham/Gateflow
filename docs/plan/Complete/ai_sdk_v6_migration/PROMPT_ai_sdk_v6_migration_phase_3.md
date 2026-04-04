# Phase 3: Native UIMessage parts rendering (AI SDK v6)

---

## Phase 3: Native UIMessage parts rendering

### Primary role

FRONTEND

### Preferred tool

- Cursor (implementation + verification)

### Context

- **Chat UI:** `apps/client-dashboard/src/components/dashboard/ai/ChatPanel.tsx`
- **Assistants:** `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx`, `apps/admin-dashboard/src/components/admin-ai-assistant.tsx`
- **SDK:** `ai` package v6 — `isTextUIPart`, `isToolUIPart`, `getToolName`, `isReasoningUIPart`, `isFileUIPart`, `isDataUIPart`
- **UI tools:** `showChart`, `showReport`, `showSchedule`, `requestConfirmation` — payloads on `input`; `output` often ack-only

### Goal

Render streamed assistant messages using native UIMessage part types and v6 tool part shape (states, `input`/`output`), without relying on legacy `args`/`result` or `type === 'text'` only.

### Scope (in)

- Refactor `ChatPanel` part loop to use type guards; map known tools to existing renderers via `input`
- Show reasoning, file, and data parts; generic fallback for unknown tools with state/output/error
- Align `AIConfirmationRenderer` state keys with `handleActionConfirm` / `handleActionCancel` (`${messageId}-${partIndex}`)
- Assistant sidebars: show assistant turns that have only tool/reasoning/file/data parts (compact summary, not full rich UI)

### Scope (out)

- New tool UIs or API route changes
- Full parity with `ChatPanel` rich tool rendering inside sidebars

### Steps (ordered)

1. Update `ChatPanel.tsx` imports and `messageText` with `isTextUIPart`; add `toolUiPayload` helper
2. Replace tool branch with `getToolName` + v6 states; fix JSON-in-text confirmation keys to `${m.id}-${i * 100 + j}`
3. Update `ai-assistant.tsx` and `admin-ai-assistant.tsx` for non-text parts
4. `pnpm turbo lint --filter=client-dashboard --filter=admin-dashboard`
5. `pnpm turbo typecheck --filter=client-dashboard --filter=admin-dashboard`

### Acceptance criteria

- [x] Tool parts render from `input` where applicable; `output-available` / `output-error` handled
- [x] No assistant message dropped solely because it has zero text parts (sidebar assistants)
- [x] Confirmation actions use consistent keys with execute/log handlers
- [x] Lint and typecheck pass for touched workspaces
