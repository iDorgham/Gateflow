# IDEA_ai_sdk_v6_migration.md

AI SDK v6 (Agentic) Migration

**Vision:** Migrate the GateFlow AI infrastructure to the Vercel AI SDK v6 "Agentic" architecture. This move will embrace the new unified `@ai-sdk/react` v3+ patterns, replacing the current stabilized v1.2.x components. This migration aims to unlock first-class support for the new Agentic patterns, improved tool calling, and unified message structures.

## Core Features

- **Agentic Pattern Adoption:** Switch from conventional `useChat` hooks to the new `sendMessage` and `status` based interaction model.
- **Unified Message Structure:** Transition all UI rendering from simple `content` strings to the multi-part `parts` array (Text, Tool, etc.).
- **Improved Tool Calling:** Leverage the new unified tool execution and confirmation lifecycle in the SDK.
- **Enhanced Type Safety:** Fully adopt the new `UIMessage` and `AbstractChat` type definitions.

## Success Metrics

- Successful build with `@ai-sdk/react@3.0+` and `ai@6.0+`.
- Zero regression in current user-facing chat functionality.
- Faster development of new "Agentic" features (e.g., smarter bulk actions).
- Elimination of deprecation warnings across the codebase.

## Technical Stack

- Vercel AI SDK v6.
- @ai-sdk/react v3.0+.
- React 18/19 (Next.js 15).
- Existing GateAI Backend (Gemini 1.5 Flash).

## Risks & Constraints

- **Major Refactor:** Requires a complete overhaul of `ai-assistant.tsx` and `admin-ai-assistant.tsx`.
- **Breaking API:** Current `input`, `handleInputChange`, and `handleSubmit` are removed in v3+; manual state management required.
- **Stabilization Time:** The Agentic API is still evolving and may undergo further changes before full stability.
