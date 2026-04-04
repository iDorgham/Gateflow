# PLAN: AI SDK v6 Migration

**Slug:** `ai_sdk_v6_migration`
**Status:** done
**Created:** 2026-03-27
**Completed:** 2026-03-27

## Overview

Full migration of GateFlow AI features from Vercel AI SDK v4/v5 to AI SDK v6 + `@ai-sdk/react` v3 + `@ai-sdk/google` v3. Covers compile fixes, UI hook migration, API route stream format, Google provider upgrade, and server-side UIMessage→ModelMessage conversion.

## Phases

| #   | Phase                                                  | Tool   | Status |
| --- | ------------------------------------------------------ | ------ | ------ |
| 1   | Phase 1: AI SDK v6 compile + UI migration              | claude | [x]    |
| 2   | Phase 2: API route stream fixes + @ai-sdk/google v3    | claude | [x]    |
| 3   | Phase 3: Native UIMessage parts rendering              | cursor | [x]    |
| 4   | Phase 4: Server-side UIMessage→ModelMessage conversion | claude | [x]    |
| 5   | Phase 5: E2E verification + plan closure               | claude | [x]    |

## What Was Done

- **Phase 1:** `useChat` v3 API — `DefaultChatTransport`, `sendMessage({ text })`, `status !== 'ready'`; `ModelMessage` type on server; `UIMessage.parts` in welcome messages
- **Phase 2:** `toUIMessageStreamResponse()` on all 3 routes; `@ai-sdk/google` upgraded `^1.2` → `^3.0.53`; removed `LanguageModel` casts; `google()` single-arg fix
- **Phase 3:** `ChatPanel` uses `isTextUIPart` / `isToolUIPart` / `getToolName` and v6 tool states (`input` / `output`, `output-error`); reasoning/file/data parts; fixed confirmation action keys vs `handleActionConfirm`. Compact non-text rendering in `ai-assistant` and `admin-ai-assistant`.
- **Phase 4:** `convertToModelMessages()` on all 3 routes; `UIMessage[]` request body type; `isTextUIPart` for text extraction
- **Phase 5:** Final audit — all patterns clean, lint/typecheck/tests green

## Technical Constraints

- Stack: Next.js 14, Prisma 5, pnpm workspaces (Turborepo)
- Tenant isolation: every query scoped to `organizationId`
- Tests: `pnpm turbo test --filter=<workspace>` must pass per phase
- Commit: run `pnpm preflight` before each commit
