# Phase 2: Intelligent Tagging + Analytics Indexing (GateAI Operations Hub v2.0)

### Primary role

FULLSTACK

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [x] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

**Context to Load:**

1. `.antigravity/skills/gf-security/SKILL.md` — Security model, multi-tenancy, RBAC
2. `.antigravity/rules/00-gateflow-core.mdc` — pnpm, soft deletes, QR signing, auth
3. `.antigravity/contracts/CONTRACTS.md` — Authoritative invariants
4. `docs/reference/product/PRD_v8.0_COMPREHENSIVE.md` — Product requirements (Section 2.1 GateAI)
5. `docs/architecture/ARCHITECTURE.md` — System architecture, data flows
6. `packages/db/prisma/schema.prisma` — Current data model

### Goal

Provide first-class tagging models for AI history and documents, alongside a robust Sidebar component, storing attributes safely scoped per-tenant.

### Scope (in)

- Extend `packages/db/prisma/schema.prisma` to include a scalable `Tag` / `AiContentTag` associative model.
- Set up Prisma Migration utilizing `organizationId` scoping strings.
- Construct the `TagSidebar` component for managing active filters within the Shell.
- Build internal API routes under `apps/client-dashboard/src/app/api/gateai/tags` to fetch, create, and delete tags.

### Scope (out)

- Canvas dragging and dropping of tags.
- The NLP engine matching texts to tags automatically.

### Steps (ordered)

1. Modify `schema.prisma` to add `Tag` and relations to AI logs/tasks. Ensure `organizationId` and `deletedAt` are present. Add `AiActionLog` audit relation.
2. Run database migration (`pnpm --filter=db prisma migrate dev --name add_ai_tags`).
3. Implement `apps/client-dashboard/src/app/api/gateai/tags` adhering rigorously to multi-tenancy restrictions.
4. Build `TagSidebar` in `apps/client-dashboard/src/components/gateai/`.
5. Run `pnpm turbo lint`, `pnpm turbo typecheck`, and `pnpm turbo test`.
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push.

### Acceptance criteria

- [ ] `pnpm preflight` passes (lint + typecheck + test)
- [ ] Security checks: Only MANAGER/ADMIN can bulk-purge tags. Soft deletes function accurately. Cross-tenant isolation blocks leaking.
- [ ] DB: Tag count accuracy validated and query performance indexed.
- [ ] Git commit with conventional message.
- [ ] No breaking changes to existing GateAI v1.0 features.
