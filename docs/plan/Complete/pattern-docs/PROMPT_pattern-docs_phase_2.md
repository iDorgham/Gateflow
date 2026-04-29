# Phase 2: AI UI Pattern Documentation

### Primary role

FRONTEND

### Tool Selection

|                            | Tool         | Why                                     |
| -------------------------- | ------------ | --------------------------------------- |
| **Tool 1** (best quality)  | Cursor       | High-fidelity UI component assembly     |
| **Tool 2** (free fallback) | OpenCode CLI | Reliable for documentation and snippets |

### Skills to load

- [x] `using-superpowers`
- [x] `ui-ux-pro-max`
- [x] `gf-uiux-animator`
- [x] `gf-ai-ux-patterns`
- [x] `verification-before-completion`

### Goal

Implement high-fidelity, interactive documentation for the "AI UI / Cortex" patterns in the design system.

### Scope (in)

- Interactive `GateAILab` in `apps/design-system/src/app/(docs)/patterns/ai-ui/page.tsx`.
- Documentation for `MessageAvatar`, `ToolCallCard`, and `StreamingText`.
- Documenting the "Cortex" design language (Glassmorphism, glow effects).
- Hardened `'use client';` implementation.

### Steps

1. Load `gf-ai-ux-patterns` and `ui-ux-pro-max` skills.
2. Create or update `apps/design-system/src/app/(docs)/patterns/ai-ui/page.tsx` with professional layout.
3. Implement `GateAILab.tsx` in the same directory using `@gateflow/ai` components.
4. Add interactive examples for different message types (User, Assistant, System, Tool).
5. Verify build stability.

### Acceptance criteria

- [ ] `GateAILab` is interactive and correctly showcases tool execution states.
- [ ] Documentation explains the "Human-in-the-Loop" patterns.
- [ ] `pnpm turbo build --filter=@gateflow/design-system` passes.
