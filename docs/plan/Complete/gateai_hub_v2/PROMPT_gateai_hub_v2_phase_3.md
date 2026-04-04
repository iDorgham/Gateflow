# Phase 3: Infinite Canvas + Live Analytics Blocks (GateAI Operations Hub v2.0)

### Primary role

FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
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

Develop the core Infinite Canvas workspace using Tiptap, enabling drag-to-analyze charting with Recharts and optimistic auto-save state handling.

### Scope (in)

- Integrate Tiptap editor engine tailored to Infinite Canvas layout constraints.
- Create embeddable Recharts Live Blocks extending Tiptap nodes.
- Expose "Drop-to-Analyze" logic (dragging a tag from Phase 2 into canvas generates a chart block).
- Implement optimistic UI syncing mechanism mapping to a server `POST` for saving states.

### Scope (out)

- Generating Automated PDF reports.
- Advanced Server Sent Events (SSE) data streams.

### Steps (ordered)

1. Add Tiptap to `client-dashboard` package.json.
2. Develop `CanvasEditor` wrapper with custom Node Extensions for `LiveChartNode`.
3. Construct Recharts wrapper component pulling aggregate data per mapped "tag". Ensure `organizationId` limits data requests inside the chart fetcher.
4. Hook up an auto-saving context provider. Maintain offline states handling.
5. Run `pnpm turbo lint`, `pnpm turbo typecheck`, and `pnpm turbo test`.
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push.

### Subagents (optional)

- **browser-use**: Verify drag and drop interactions and canvas load times.

### Acceptance criteria

- [ ] `pnpm preflight` passes (lint + typecheck + test)
- [ ] Perf: Interaction latency upon drag-and-drop visually feels instantaneous (<100ms response).
- [ ] Security checks: Data rendered inside charts is forcibly scoped by Active User Organization.
- [ ] Offline state handles grace failures effectively.
- [ ] Git commit with conventional message.
- [ ] No breaking changes to existing GateAI v1.0 features.
