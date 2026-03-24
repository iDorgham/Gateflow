---
name: gf-monorepo-architecture
description: Monorepo structure, tech stack, and development patterns for GateFlow.
---

# GateFlow Monorepo Architecture

## Purpose
Maintain the structural integrity of the GateFlow monorepo. This skill prevents dependency leaks between apps, ensures shared packages are used correctly, and maintains a unified build pipeline via Turborepo.

## Core Principles
1. **Strict Physical Boundaries**: Apps (`apps/*`) never import from other apps. All shared logic must live in `packages/*`.
2. **Unified Tooling**: All apps must use shared configs for ESLint, TypeScript, and Tailwind (from `packages/config`).
3. **Internal vs External**: Use `packages/api-client` for internal service-to-service communication; do not reinvent fetch logic in every app.

## Implementation Rules
- **Dependencies**: Use `pnpm workspace` syntax (`"repo": "workspace:*"`).
- **Env Vars**: Every app must have a `process.env` validation layer (using Zod) to prevent runtime crashes due to missing keys.
- **Scripts**: Always run commands via the root using `pnpm turbo [run] [command] --filter=[app]`.
- **New Packages**: If logic is shared by 2+ apps, it MUST be a package in `packages/`.

## Anti-Patterns
- Using `../../` relative imports to reach across Turborepo package boundaries.
- Duplicating large utilities like `auth-helpers` instead of moving them to a package.
- Direct `prisma` client imports in the frontend; always go through an API route.

## Code Example
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}

// package.json in apps/client-dashboard
{
  "dependencies": {
    "@gate-access/db": "workspace:*",
    "@gate-access/ui": "workspace:*",
    "@gate-access/types": "workspace:*"
  }
}
```
