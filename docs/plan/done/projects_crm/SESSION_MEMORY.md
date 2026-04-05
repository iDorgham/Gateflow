# Session Memory — projects_crm

> Auto-updated by `/dev` after each phase. Survives context resets.
> **Load this FIRST** at the start of every new session — before reading any other plan file.

Save as: `docs/plan/Active/projects_crm/SESSION_MEMORY.md`

---

## Active State

- **Phase:** Phase 2 — WhatsApp & SMS Invitation Flow | **complete**
- **Branch:** `master`
- **Last commit:** `[pending]` — feat(crm): phase 2 - WhatsApp & SMS invitation flow
- **Next action:** Start Phase 5 — Operations Polish & Final Audit (`/dev projects_crm 5`)

---

## Cross-Session Decisions

| Phase | Decision                                                                   | Why                                                                                                                                                                    | Still valid? |
| ----- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1     | Use `prisma db push --accept-data-loss` instead of `migrate dev`           | Non-interactive TTY in dev environment; `migrate dev` hangs waiting for input                                                                                          | Yes          |
| 1     | `CommunicationLog.provider` stores runtime string (not enum)               | Allows flexible provider extension without schema migration                                                                                                            | Yes          |
| 1     | Phase 1 code was pre-committed in `f581ff7` before session started         | Schema + communication-provider.ts + AuditLog were already in place                                                                                                    | N/A          |
| 1     | Fixed AI SDK v4 → v5 breaking changes as side effect of Phase 1 build gate | `parameters:` → `inputSchema:`, `maxSteps` → `stopWhen: stepCountIs(N)`, `toDataStreamResponse` → `toTextStreamResponse`, usage field renames, LanguageModel type cast | Yes          |
| 3     | Use window CustomEvent bridge for SSE → toast (not a second EventSource)   | Keeps one SSE connection per tab; SecurityNotifier listens via `window.addEventListener('gf:watchlist_alert')` dispatched from `useRealtimeEvents`                     | Yes          |
| 3     | ESCORT scans are accepted (not rejected); scanner shows haptic Warning     | ESCORT means "watch closely" not "deny" — guards need to escort, not block                                                                                             | Yes          |
| 3     | `sonner` `toast.error` `important` flag doesn't exist in v1.7 types        | Removed `important: true` — use `duration: 10_000` for high-priority alerts instead                                                                                    | Yes          |
| 4     | Controlled density in AdvancedTable via props                              | Density state persists via user preferences API; supports compact/comfortable modes                                                                                    | Yes          |
| 4     | Saved views stored in User.preferences JSON field                          | Reuses existing `/api/users/me/preferences` endpoint; no schema changes needed                                                                                         | Yes          |
| 2     | WhatsApp deep-link uses wa.me format with encoded message                  | Standard Meta WhatsApp API format for direct messaging without saved contacts                                                                                          | Yes          |
| 2     | CommunicationLog captures all invitation attempts (PENDING→SENT/FAILED)    | Provides audit trail; status updates reflect actual dispatch outcome                                                                                                   | Yes          |

---

## Discovered Gotchas

- **`prisma migrate dev` hangs in non-interactive TTY** — use `pnpm --filter @gate-access/db exec prisma db push --accept-data-loss` for development schema sync
- **`VISITOR_QR_CREATED` EventType enum removal** — `db push` warns about data loss; this is intentional. Accept with `--accept-data-loss`
- **AI SDK v5 breaking changes** — `LanguageModelV1` is removed; cast via `as unknown as LanguageModel`. All tool defs use `inputSchema:` not `parameters:`. `stopWhen: stepCountIs(N)` replaces `maxSteps`. Usage fields: `inputTokens`/`outputTokens` (not `promptTokens`/`completionTokens`). `toTextStreamResponse()` replaces `toDataStreamResponse()`
- **UIMessage vs Message type mismatch** — `useChat` from `@ai-sdk/react` v5 returns `UIMessage[]`. Cast with `as unknown as Parameters<typeof ChatPanel>[0]['messages']` in page.tsx
- **`claims.email` may be undefined** — `automation-tools.ts` references `claims.email` as fallback recipient; `getSessionClaims()` may not include it depending on JWT structure

---

## State Handoff

- **Files modified this session (Phase 2):**
  - `apps/client-dashboard/src/app/api/contacts/[id]/invite/route.ts` — Already existed, verified implementation
  - `apps/client-dashboard/src/lib/crm/invite-service.ts` — Already existed, verified implementation
  - `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx` — Already had Send Invite UI
  - Removed unused `QRCodeType` import from invite-service.ts
- **Tests:** typecheck ✅ lint ✅ (preflight checks)
- **Blockers:** none
- **Note:** Phase 2 was already fully implemented before this session. Verification completed.

- **Files modified (Phase 4):**
  - `packages/ui/src/components/tables/AdvancedTable.tsx` — Added controlled density props (density, onDensityChange, activeView)
  - `apps/client-dashboard/src/components/crm/ContactTable.tsx` — Integrated useUserPreferences, density toggle, SavedViewManager
  - `apps/client-dashboard/src/components/crm/UnitTable.tsx` — Integrated useUserPreferences, density toggle, SavedViewManager
  - `apps/client-dashboard/src/components/crm/SavedViewManager.tsx` — New component for saved views dropdown + modal
- **Tests:** typecheck ✅ lint ✅ (preflight checks)
- **Blockers:** none
- **Resume from:** Phase 5 — Operations Polish & Final Audit

---

## Context Budget (this session)

| Layer | File                                | Est. Tokens | Loaded |
| ----- | ----------------------------------- | ----------- | ------ |
| L0    | `git log --oneline -3` + phase name | ~50         | ✓      |
| L1    | `TASKS_projects_crm.md`             | ~150        | [ ]    |
| L2    | `PLAN_projects_crm.md`              | ~600        | ✓      |
| L3    | `PROMPT_projects_crm_phase_2.md`    | ~1,200      | ✓      |
| L4    | `CONTEXT_projects_crm.md`           | ~1,800      | [ ]    |
| L5    | `SESSION_MEMORY.md` (this file)     | ~400        | ✓      |

**Baseline (always load):** L0 + L1 + L2 + L5 ≈ 1,200 tokens
**Phase execution (add):** + L3 ≈ 2,400 tokens total

**Note:** Phase 2 was already fully implemented. This session performed verification of existing code.
