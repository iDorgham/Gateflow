# Draft — `ai_sdk_v6_migration`

**Slug:** `ai_sdk_v6_migration`  
**Last updated:** 2026-08-24  
**Champion:** AI Architecture & Fullstack Team  
**Initiative Link:** `docs/development/initiatives/IDEA_ai_sdk_v6_migration.md`  
**Target:** Q3 / Q4 2026

> Raw planning notes for Vercel AI SDK v6 (Agentic) Architecture Migration (Multi-Part `parts` UI Messages, Enhanced Tool Execution Lifecycle, and Streaming Speed). When this feels complete, run **`/prompt ai_sdk_v6_migration`** then **`/plan ai_sdk_v6_migration`**.

---

## 1. What I Want

- **Agentic Multi-Part Message Architecture (`UIMessage`)**:
  - Replace raw `content: string` message rendering with structured multi-part message parts (`type: 'text' | 'tool-invocation' | 'reasoning'`).
  - Seamless support for structured tool calling status (`call`, `result`, `error`).
- **Interactive Tool Execution & Confirmation Lifecycle**:
  - Direct UI widgets for client-side tool execution confirmations (e.g. "Create Work Order", "Issue QR Pass", "Trigger Emergency Lockout").
  - Clear mutation safety with `state: 'requires-action' | 'executing' | 'completed'`.
- **Zero-Deprecation Chat Adapters**:
  - Abstract adapter mapping new SDK v6 `sendMessage` / `status` (`ready` | `submitted` | `streaming` | `error`) to existing `apps/client-dashboard` and `apps/admin-dashboard` assistants.
- **Enhanced Streaming & Latency Resilience**:
  - Stream data protocol parser with graceful fallback for network disconnections and token buffering.

---

## 2. Constraints & Guardrails

- **Zero Regression in GateAI Features**: Existing capabilities (guest search, gate unlock proposals, analytics charts, maintenance dispatch) must function identically or better.
- **Tenant Isolation (`organizationId`)**: All tool execution payloads must strictly enforce organization scoping.
- **Arabic RTL Compatibility**: Tool confirmation cards and assistant stream bubbles must render with 100% Arabic RTL layout fidelity.

---

## 3. Suggested 5-Phase Plan Sketch

1. **Phase 1: Multi-Part `UIMessage` Data Transformers & Adapter**:
   - Build unified parser and type-safe adapter for AI SDK v6 multi-part message structures (`text`, `tool-invocation`, `reasoning`).
2. **Phase 2: Agentic Tool Invocation & Confirmation State Machine**:
   - Implement tool confirmation lifecycle state machine supporting client actions, approval dialogs, and mutation safety.
3. **Phase 3: Client Dashboard AI Assistant Migration**:
   - Upgrade client dashboard assistant components to multi-part streaming and interactive tool calling cards.
4. **Phase 4: Admin Dashboard AI Assistant & Super-Admin Emulation Tools**:
   - Migrate admin dashboard AI assistant to v6 agentic tools with tenant emulation and system diagnostics.
5. **Phase 5: Arabic RTL Polish, Latency Benchmarks & Full Certification**:
   - Audit Arabic RTL tool cards, benchmark streaming response time, and execute full test suites.

---

## 4. Open Questions

- [ ] Should reasoning steps (Gemini Thinking / DeepSeek reasoning tokens) be rendered collapsible by default in the chat bubble?

---

## 5. Changelog

- **2026-08-24**: Drafted initiative from `IDEA_ai_sdk_v6_migration.md` focusing on multi-part UIMessage structures and interactive tool execution.
