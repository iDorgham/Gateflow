# Session Memory — projects_crm

> Auto-updated by `/dev` after each phase. Survives context resets.
> **Load this FIRST** at the start of every new session — before reading any other plan file.

Save as: `docs/plan/in-progress/projects_crm/SESSION_MEMORY.md`

---

## Active State

- **Phase:** Phase 1 — Communication Gateway & Notification Schema | **complete**
- **Branch:** `master`
- **Last commit:** `06f784a` — fix(ai): migrate AI SDK v4 → v5 type incompatibilities
- **Next action:** Start Phase 2 — WhatsApp & SMS Invitation Flow (`/dev projects_crm 2`)

---

## Cross-Session Decisions

| Phase | Decision                                                                   | Why                                                                                                                                                                    | Still valid? |
| ----- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1     | Use `prisma db push --accept-data-loss` instead of `migrate dev`           | Non-interactive TTY in dev environment; `migrate dev` hangs waiting for input                                                                                          | Yes          |
| 1     | `CommunicationLog.provider` stores runtime string (not enum)               | Allows flexible provider extension without schema migration                                                                                                            | Yes          |
| 1     | Phase 1 code was pre-committed in `f581ff7` before session started         | Schema + communication-provider.ts + AuditLog were already in place                                                                                                    | N/A          |
| 1     | Fixed AI SDK v4 → v5 breaking changes as side effect of Phase 1 build gate | `parameters:` → `inputSchema:`, `maxSteps` → `stopWhen: stepCountIs(N)`, `toDataStreamResponse` → `toTextStreamResponse`, usage field renames, LanguageModel type cast | Yes          |

---

## Discovered Gotchas

- **`prisma migrate dev` hangs in non-interactive TTY** — use `pnpm --filter @gate-access/db exec prisma db push --accept-data-loss` for development schema sync
- **`VISITOR_QR_CREATED` EventType enum removal** — `db push` warns about data loss; this is intentional. Accept with `--accept-data-loss`
- **AI SDK v5 breaking changes** — `LanguageModelV1` is removed; cast via `as unknown as LanguageModel`. All tool defs use `inputSchema:` not `parameters:`. `stopWhen: stepCountIs(N)` replaces `maxSteps`. Usage fields: `inputTokens`/`outputTokens` (not `promptTokens`/`completionTokens`). `toTextStreamResponse()` replaces `toDataStreamResponse()`
- **UIMessage vs Message type mismatch** — `useChat` from `@ai-sdk/react` v5 returns `UIMessage[]`. Cast with `as unknown as Parameters<typeof ChatPanel>[0]['messages']` in page.tsx
- **`claims.email` may be undefined** — `automation-tools.ts` references `claims.email` as fallback recipient; `getSessionClaims()` may not include it depending on JWT structure

---

## State Handoff

- **Files modified this session (Phase 1):**
  - `packages/db/prisma/schema.prisma` — Added `OrganizationCommunicationConfig` and `CommunicationLog` models
  - `apps/client-dashboard/src/lib/crm/communication-provider.ts` — New provider abstraction (stubbed dispatch for Phase 1)
  - `apps/client-dashboard/src/app/api/contacts/route.ts` — AuditLog on CSV export
  - `apps/client-dashboard/src/app/api/units/route.ts` — AuditLog on CSV export
  - `apps/client-dashboard/src/app/api/ai/assistant/route.ts` — AI SDK v5 migration (type fixes)
  - `apps/client-dashboard/src/app/api/ai/chat/route.ts` — AI SDK v5 migration
  - `apps/client-dashboard/src/lib/ai/tools/automation-tools.ts` — `parameters:` → `inputSchema:`
  - `apps/client-dashboard/src/components/dashboard/ai/ChatPanel.tsx` — Local `Message` type alias
  - `apps/client-dashboard/src/app/[locale]/dashboard/ai/page.tsx` — Type cast for messages prop
- **Tests:** typecheck ✅ build ✅ (verified with `pnpm turbo typecheck --filter=client-dashboard` and `pnpm turbo build --filter=client-dashboard`)
- **Blockers:** none
- **Resume from:** Phase 2 Step 1 — implement `POST /api/contacts/[id]/invite` route

---

## Context Budget (this session)

| Layer | File                                | Est. Tokens | Loaded |
| ----- | ----------------------------------- | ----------- | ------ |
| L0    | `git log --oneline -3` + phase name | ~50         | ✓      |
| L1    | `TASKS_projects_crm.md`             | ~150        | [ ]    |
| L2    | `PLAN_projects_crm.md`              | ~600        | ✓      |
| L3    | `PROMPT_projects_crm_phase_1.md`    | ~1,200      | ✓      |
| L4    | `CONTEXT_projects_crm.md`           | ~1,800      | [ ]    |
| L5    | `SESSION_MEMORY.md` (this file)     | ~400        | ✓      |

**Baseline (always load):** L0 + L1 + L2 + L5 ≈ 1,200 tokens
**Phase execution (add):** + L3 ≈ 2,400 tokens total
