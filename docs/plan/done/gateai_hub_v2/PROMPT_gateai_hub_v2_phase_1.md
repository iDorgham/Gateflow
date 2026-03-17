# Phase 1: Foundation & Secure Shell (GateAI Operations Hub v2.0)

### Primary role
FULLSTACK

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool
- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Multi-CLI — high-risk phases only (compare 2 models before acting)

### Context

**Context to Load:**
1. `.antigravity/skills/gf-security/SKILL.md` — Security model, multi-tenancy, RBAC
2. `.antigravity/rules/00-gateflow-core.mdc` — pnpm, soft deletes, QR signing, auth
3. `.antigravity/contracts/CONTRACTS.md` — Authoritative invariants
4. `docs/product/PRD_v8.0_COMPREHENSIVE.md` — Product requirements (Section 2.1 GateAI)
5. `docs/architecture/ARCHITECTURE.md` — System architecture, data flows
6. `packages/db/prisma/schema.prisma` — Current data model

### Goal

Establish the core 3-column responsive layout and design tokens (Navy/Orange) for the GateAI Workbench, ensuring strong tenant isolation routes and security baselines without breaking existing GateAI v1.

### Scope (in)
- Create new page shell layout for `apps/client-dashboard/src/app/[locale]/dashboard/gateai/`
- Introduce Navy (`#020035`) / Orange (`#ED4B00`) design tokens via Tailwind CSS vars.
- Build initial empty states and Glassmorphism + Dot-grid aesthetic patterns.
- Implement strict org-scoped verification and soft delete middleware logic for new routes.

### Scope (out)
- DB tag schema implementation.
- NLP routing / AI SDK configuration.
- Interactive charting and Infinite Canvas Tiptap implementation.

### Steps (ordered)
1. Add custom Token colors (`#020035` Base, `#ED4B00` Accent) to `packages/ui/tailwind.config.ts`.
2. Construct the 3-column `GateAIHubLayout` component in `apps/client-dashboard`. Ensure responsiveness (collapse to drawer on mobile).
3. Validate session validation logic to securely verify `organizationId` and enforce `deletedAt: null` across any fetched user states inside the layout.
4. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, and `pnpm turbo test --filter=client-dashboard`.
5. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push.

### SuperDesign (optional — for UI phases)
Run *before* implementation:
`superdesign create-design-draft` with design intent targeting a Glassmorphism 3-column enterprise AI layout using Atlassian logic.

### Acceptance criteria
- [ ] `pnpm preflight` passes (lint + typecheck + test)
- [ ] Security checks: org scoping enforced at layout data load.
- [ ] Visual: New tokens rendered and correct 3-column layout structures present.
- [ ] Git commit with conventional message.
- [ ] No breaking changes to existing GateAI v1.0 features.
