# Phase 5: Polish, Motion & RTL Audit (GateAI Operations Hub v2.0)

### Primary role

UIUX/ANIMATOR

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

Apply premium micro-interactions, enforce `prefers-reduced-motion` accessibility, and perform a full RTL layout audit for Arabic compliance.

### Scope (in)

- Framer Motion linear-spring animations applied to Canvas blocks, Sidebar toggles, and Tag drag-n-drop endpoints.
- Accessibility audit ensuring WCAG AA compliance and keyboard navigation for the Canvas.
- RTL layout flip validation (padding, margins, chart axes alignment) for `ar-EG` locale.

### Scope (out)

- New backend features.
- Modifications to core database schema.

### Steps (ordered)

1. Wrap Canvas, Sidebar, and Live Blocks in Framer Motion `<motion.div>` with unified spring configurations. Ensure `useReducedMotion` hooks are utilized.
2. Conduct an explicit keyboard-navigation test suite run on `CanvasEditor`.
3. Switch locale to `ar-EG` and fix any mirroring CSS bugs (e.g., `ml-` instead of `ms-`, chart alignments).
4. Profile page load performance using React Profiler to maintain <1.2s metric.
5. Run `pnpm turbo lint`, `pnpm turbo typecheck`, and `pnpm turbo test`.
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push.

### Subagents (optional)

- **browser-use**: Login as `ar-EG` user, take screenshots of the Canvas to verify RTL layout rendering.

### Acceptance criteria

- [ ] `pnpm preflight` passes (lint + typecheck + test)
- [ ] Visual: Animations adhere to SaaS premium feel without CLS (Cumulative Layout Shift).
- [ ] A11y: `<motion.div>` respects reduced motion system preferences.
- [ ] RTL: The entire GateAI Hub maintains perfect structural layout when switched to Arabic.
- [ ] Git commit with conventional message.
- [ ] No breaking changes to existing GateAI v1.0 features.
