# Post-Install Checklist

Complete all items before starting implementation.

## Foundation

- [ ] `docs/workspace/PRD.md` — filled in (product overview, features, MVP scope)
- [ ] `docs/README.md` — regenerated (`pnpm docs:index`)
- [ ] GitHub repo initialized with chosen default branch

## AI Folders

- [ ] `.cursor/` installed (rules, agents, skills)
- [ ] `.claude/` installed (rules, agents, skills)
- [ ] `.antigravity/` installed (workflows)
- [ ] `.gemini/` installed (commands)
- [ ] `.opencode/` installed (agents, commands)
- [ ] `ops-core/` is the single source of truth — AI folders are synced from it

## Context Layer

- [ ] `pnpm cache:build` run — `docs/system/cache/WORKSPACE_INDEX.md` populated
- [ ] `pnpm memory:init` run — `docs/system/memory/` files created and filled in
- [ ] `docs/system/memory/architecture.md` filled with real project stack and apps
- [ ] `docs/system/memory/api_patterns.md` filled with auth and org-scope patterns

## Planning

- [ ] First plan created (`/plan <slug>`)
- [ ] `plan/planned/<slug>/` has `PLAN.md`, `TASKS.md`, and phase prompts
- [ ] MVP roadmap covers at least 3 phases

## Automation

- [ ] `.github/workflows/ci.yml` — lint, typecheck, test, AI drift check wired
- [ ] Branching strategy documented

## Validation

- [ ] `pnpm template:validate` passes
- [ ] `pnpm ai:check` passes (no drift between ops-core/ and AI folders)
