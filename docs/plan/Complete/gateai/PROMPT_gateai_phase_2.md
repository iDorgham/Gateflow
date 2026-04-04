# Pro Prompt — Phase 2: Scoped Context Injection + Simple Real Q&A

**Primary role:** BACKEND-API
**Preferred tool:** Cursor

### Context

- **Project**: GateFlow
- **Stack**: Gemini 1.5 Flash
- **Security**: requireAuth, orgId scoping
- **Rules**: deletedAt: null filter on ALL queries

### Goal

Inject real-time organization and project context into Gemini prompts to enable factual Q&A.

### Scope (in)

- Context extraction helpers (e.g., `getOrgContext`).
- Logic to pull summary data (count of gates, projects, latest scans) for Gemini.
- Evaluation of "factual" answers vs "hallucinations".

### Scope (out)

- No chart rendering.
- No mutations.

### Steps

1. Create `apps/client-dashboard/src/lib/ai/context-providers.ts`. Implement functions like `fetchCurrentProjectContext(orgId)`.
2. Update the Gemini system prompt in `api/ai/chat` to include a "Context Section" that is dynamically populated.
3. Pass the summary of Gates, Visitors, and Projects relevant to the current user into the prompt.
4. Test with questions like "What is the name of my most active project?" or "How many gates do I have?".
5. Run `pnpm turbo test`.
6. `/github` — feat(gateai): phase 2 — data-aware Q&A.

### Acceptance Criteria

- [ ] AI answers questions about the specific organization's data.
- [ ] AI correctly identifies the current user's role and project scope.
- [ ] No data leak (AI doesn't see other orgs).
