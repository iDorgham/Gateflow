# PLAN: Feature Title

**Slug:** `feature_slug`
**Status:** planning
**Created:** YYYY-MM-DD
**Target:** Q4 2026

## Overview

> One paragraph describing what this feature does, why it matters, and what success looks like.

## Phases

> Edit the tool column to: claude | gemini | opencode | kilo | qwen | cursor | kiro

| # | Phase | Tool | Status |
|---|-------|------|--------|
| 1 | Phase 1: Foundation | claude | [ ] |
| 2 | Phase 2: Core Logic | claude | [ ] |
| 3 | Phase 3: API Routes | gemini | [ ] |
| 4 | Phase 4: UI | cursor | [ ] |
| 5 | Phase 5: Polish & Audit | claude | [ ] |

## Technical Constraints

- Stack: Next.js 14, Prisma 5, pnpm workspaces (Turborepo)
- Tenant isolation: every query scoped to `organizationId`
- Tests: `pnpm turbo test --filter=<workspace>` must pass per phase
- Commit: run `pnpm preflight` before each commit
- RTL: use logical CSS properties (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`)

## Tools Reference

| Tool | Best for | Auto-accept |
|------|----------|-------------|
| claude | Security, architecture, complex reasoning | `--dangerously-skip-permissions` |
| gemini | DB/schema, fast structural analysis | `--yolo` |
| opencode | Code generation, scaffolds, refactors | `run` mode |
| kilo | Free agentic, large context | `run` mode |
| qwen | Free agentic, 480B reasoning | `-p` headless |
| cursor | UI/visual iteration | IDE (manual) |
| kiro | IDE review, specs | IDE (manual) |
