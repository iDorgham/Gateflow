# Phase 5: `@gateflow/ai` — AI UI kit (chat, streaming, tools)

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Depends on:** Phases 1, 2, 3 (`tokens`, `theme`, `ui`)

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                   |
| ------------- | ---------- | --------------------- |
| **Preferred** | **Cursor** | AI UX patterns + a11y |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **5** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.agents/skills/ai-ux-patterns/SKILL.md`, `.agents/skills/safety-interaction/SKILL.md` — confirmations, destructive actions in AI flows
2. `.agents/skills/design-guide/SKILL.md`, `.agents/skills/ads-accessibility-rtl/SKILL.md` — chat layout, live regions, RTL bubbles
3. `.agents/skills/creative-animation/SKILL.md`, `.agents/skills/motion-primitives/SKILL.md`, `.agents/skills/ui-ux-pro-max/SKILL.md` or `.agents/skills/uiux-animator/SKILL.md` — streaming/streaming-indicator motion; **`prefers-reduced-motion`**
4. `.agents/skills/responsive-design/SKILL.md`, `.agents/skills/tailwind/SKILL.md`
5. Vercel `ai-sdk` skill (Context7) if wiring optional adapter types

### Context

- **Purpose:** Reusable **AI-facing presentation** for GateFlow (e.g. GateAI, admin copilots): transcript layout, assistant/user bubbles, **streaming** placeholder states, **tool invocation** / result panels, reasoning collapse, empty and error states.
- **Not in package:** LLM keys, server routes, or mandatory coupling to a single vendor—use **optional peer deps** (`ai`, `@ai-sdk/react`) for examples; core components accept **render props** or children so apps can plug `useChat` / custom streams.
- **Styling:** Only `@gateflow/tokens` + `@gateflow/ui` primitives; RTL-safe layout (`ms-`/`me-`, logical alignment for bubbles).
- **Docs:** Design-system **`/components/ai`** section with live demos (Phase 8; mock streaming).

### Goal

New workspace package `packages/ai` with `name: @gateflow/ai`, depends on `@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`; **optional** workspace dep on `@gateflow/components` only if a demo truly needs it (prefer not).

### Scope (in)

- `packages/ai/package.json`, peers, `exports`.
- Initial kit: e.g. `Conversation`, `Message`, `MessageAvatar`, `StreamingIndicator`, `ToolCallCard`, `ChatInputShell` (names flexible).
- README: install, CSS imports, optional Vercel AI SDK example snippet (**no secrets**).

### Scope (out)

- Implementing backend chat API in this phase.
- Full feature parity with a specific production chat screen (iterate later).

### Steps (ordered)

1. Scaffold `packages/ai`; deps on `tokens`, `theme`, `ui`.
2. Add optional peers `ai`, `@ai-sdk/react` with version range aligned to monorepo.
3. Build components with a11y (landmarks, live region for streaming if appropriate).
4. `pnpm turbo lint typecheck --filter=@gateflow/ai`.
5. Commit: `feat(ai): add @gateflow/ai UI kit package`

### Acceptance criteria

- [ ] **Quality:** Lint + typecheck pass.
- [ ] **Tokens:** No raw brand hex; uses semantic variables.
- [ ] **RTL:** At least one documented pattern for mirrored chat layout.
- [ ] **Docs-ready:** Phase 8 can import demos without private app code.
- [ ] **Motion deps:** AI kit motion (streaming indicators, etc.) uses **CSS / Tailwind** (`creative-animation`). **No** **`framer-motion`** / **`animejs`** on `@gateflow/ai` **unless** a **new acceptance bullet** authorizes it here first.

### Files likely touched

- `packages/ai/**`
