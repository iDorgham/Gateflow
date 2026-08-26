# Tasks: AI SDK v6 (Agentic) Architecture Migration

- **Initiative:** `ai_sdk_v6_migration`
- **Application:** Cross-Platform (`apps/client-dashboard`, `apps/admin-dashboard`, `packages/ai-client`)
- **Status:** ✅ Complete — all phases 1–5 complete (verified)

---

## Phase 1: Multi-Part `UIMessage` Data Transformers & Adapter

- [x] Build universal multi-part stream parser and type-safe adapter for AI SDK v6 `UIMessage`
- [x] Implement zero-deprecation legacy fallback transformer
- [x] Write unit tests for stream chunk transformations and part extraction
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Agentic Tool Invocation & Confirmation State Machine

- [x] Implement tool execution state machine (`requires-action` | `executing` | `completed` | `rejected`)
- [x] Enforce tenant scoping (`organizationId`) and audit logging metadata
- [x] Write unit tests for tool lifecycle transitions and execution handlers
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Client Dashboard AI Assistant Migration

- [x] Upgrade `ai-assistant.tsx` to v6 multi-part hooks and message rendering
- [x] Implement interactive mutation cards for pass creation, gate inspection, and resident search
- [x] Write unit tests for client dashboard assistant chat state
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`

## Phase 4: Admin Dashboard AI Assistant & Super-Admin Emulation Tools

- [x] Upgrade `admin-ai-assistant.tsx` to v6 agentic tools
- [x] Implement super-admin agentic tools for emulation and security diagnostics
- [x] Write unit tests for admin assistant state and tool calling cards
- [x] Write `phase_logs/PHASE_LOG_phase_04.md`

## Phase 5: Arabic RTL Polish, Latency Benchmarks & Full Certification

- [x] Audit Arabic RTL layout fidelity for all tool confirmation cards
- [x] Benchmark streaming token latency (< 150ms TTFT)
- [x] Run full automated test suite across all affected applications
- [x] Verify zero TypeScript errors and zero lint warnings
- [x] Write `phase_logs/PHASE_LOG_phase_05.md`
