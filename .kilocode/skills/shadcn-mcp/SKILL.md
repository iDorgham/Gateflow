---
name: gf-shadcn-mcp-workflow
description: Using Model Context Protocol (MCP) tools to scaffold and customize Shadcn components in the GateFlow monorepo.
---

# Shadcn MCP Workflow

## Purpose
Standardize how new UI components are added to the codebase. This skill ensures that when an AI agent adds a component, it uses the correct MCP tools and immediately applies ADS theming (Skill 4).

## Core Principles
1. **Automation over Manual Copy**: Use the `shadcn` CLI or MCP equivalent to inject components.
2. **Monorepo Localization**: Components should land in `packages/ui/src/components` or `apps/*/src/components/ui`.
3. **Immediate Refactor**: No "vanilla" Shadcn component should exist for more than one commit. Refactor to ADS tokens immediately.

## Implementation Rules
- **Inquiry**: Always check if a component exists in `packages/ui` before adding a new one to an app.
- **Scaffolding**: Use `npx shadcn-ui@latest add [component]` via `run_command`.
- **Theming**: After adding, edit the file to import `cn` from the local `utils` package and swap Tailwind colors for ADS variables.
- **Exporting**: If the component is generic, export it from `packages/ui/index.ts`.

## Anti-Patterns
- Manually creating `ui/` files by copying code from the web.
- Duplicating common components like `Button` across multiple apps.
- Forgetting to update `tailwind.config.ts` path patterns after adding a new directory.

## Code Example
```bash
# Correct workflow command
pnpm --filter @gate-access/ui exec npx shadcn-ui@latest add table

# Post-generation task for AI:
# 1. Open packages/ui/src/components/ui/table.tsx
# 2. Replace bg-muted with bg-ds-surface-sunken
# 3. Replace border-border with border-ds-border
# 4. Export from packages/ui/src/index.ts
```
