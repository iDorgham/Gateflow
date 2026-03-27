# PLAN: Ai Sdk V6 Migration

**Slug:** `ai_sdk_v6_migration`
**Status:** planning
**Created:** 2026-03-27
**Target:** Q4 2026

## Overview

> Describe the feature goal here.

## Phases

| # | Phase | Tool | Status |
|---|-------|------|--------|
| 1 | Phase 1: Title | claude | [x] |
| 2 | Phase 2: Title | claude | [x] |
| 3 | Phase 3: Title | gemini | [ ] |
| 4 | Phase 4: Title | claude | [ ] |
| 5 | Phase 5: Title | claude | [ ] |

## Technical Constraints

- Stack: Next.js 14, Prisma 5, pnpm workspaces (Turborepo)
- Tenant isolation: every query scoped to `organizationId`
- Tests: `pnpm turbo test --filter=<workspace>` must pass per phase
- Commit: run `pnpm preflight` before each commit

## Tools Reference

| Tool | Best for | Auto-accept flag |
|------|----------|-----------------|
| claude | Security, architecture, complex reasoning | `--dangerously-skip-permissions` |
| gemini | DB/schema, fast structural analysis | `--yolo` |
| opencode | Code generation, scaffolds, refactors | `run` mode |
| kilo | Free agentic, large context | `run` mode |
| qwen | Free agentic, 480B reasoning | `-p` |
| cursor | UI/visual iteration | IDE (manual) |
| kiro | IDE review, specs | IDE (manual) |
