## Learned User Preferences

- Organize CHANGELOG and top-level README so Workspace, AI tools, and Apps are clearly separated; track workspace version separately from app versions where relevant.
- Treat `docs/workspace` as the home for workspace-facing documentation (including mirrors of agents, rules, subagents, commands, and skills), with its own README and CHANGELOG; use names without the `gf_` prefix under that folder.
- When executing an attached Cursor plan, do not edit the plan file; update todo status as work progresses and complete listed items unless blocked.
- Enforce changelog structure in CI with `pnpm docs:changelog:check`; use `pnpm docs:changelog:format` to normalize tag casing and spacing.
- Keep `ai:sync` and `ai:check` only in `docs/workspace/template-project/package.json`; do not add or retain those scripts on the repository root `package.json`.
- Unless intentionally versioning them, revert transient Cursor hook state under `.cursor/hooks/state/` (e.g. `continual-learning.json`) before commits, and do not mix accidental hook/sync-driven `.gitignore` edits with feature or UI commits—revert or use a separate commit.
- Prefer development guidance and docs to cover a multi-tool stack (Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, and Kilo CLI) instead of Cursor-only instructions.
- Prefer phased execution workflows: plan/tasks first, then apply prompts phase-by-phase with testing and incremental enhancements after each phase.
- Prefer comprehensive per-app and cross-cutting references under `docs/reference/apps/` when packing context for other AI tools or planning.

## Learned Workspace Facts

- GateFlow AI config is canonical under **`.agents/`** (symlink to `.antigravity/`, gitignored). Run **`pnpm sync`** (`scripts/ai-sync/sync-ai-tools.sh`) locally to copy workflows, skills, agents, and rules to Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, and Kilo CLI. Optional watch: **`pnpm sync:watch`**. CI `sync-ai-tools` soft-skips when `.agents/` is absent from the checkout. Onboarding: [docs/workspace/COMMAND_GUIDE.md](docs/workspace/COMMAND_GUIDE.md) and [docs/workspace/WORKSPACE_GUIDE.md](docs/workspace/WORKSPACE_GUIDE.md).
- `packages/db/prisma/schema.prisma` sets `directUrl = env("DIRECT_DATABASE_URL")`. Prisma CLI operations that need a direct Postgres connection (for example `migrate deploy`, `migrate resolve`) use that variable; values in `packages/db/.env` can override a one-off shell `DATABASE_URL`. Runtime app code often uses Accelerate (`prisma+postgres://…`) while migrations need the direct URL—keep both aligned per environment.
- Use `pnpm preflight` as defined in root `package.json` without extra flags; unsupported args can break the underlying `turbo` chain. Root preflight/typecheck intentionally exclude `admin-dashboard` and `client-dashboard`—run those typechecks separately when validating dashboard work.
- After moving a plan between `docs/plan/Draft/`, `Ready/`, `Active/`, and `Complete/`, update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` (paths and status) so automation and `/guide` match filesystem layout.
- `token()` from `@atlaskit/tokens` yields CSS variable references (e.g. `var(--ds-...)`), not guaranteed hex; React Native `StyleSheet` colors should use resolved values such as `nativeTokens` from `@gate-access/ui/tokens` rather than raw `token()` output.
- Not every Prisma model has `deletedAt`; only add `deletedAt: null` filters when the model defines that field (many models such as `ScanLog`, `BlogPost`, and `AuditLog` do not).
- Lighthouse CI defaults to `https://www.gateflow.site` and `https://app.gateflow.site` (not `gateflow.app`); URL probes soft-skip unreachable hosts, and individual Lighthouse jobs are not required to merge—**Lighthouse Gate** soft-passes.
- Production deploys use GitHub Environments (`Production` / `Preview` and per-app `Production – gateflow-*` / `Preview – gateflow-*`) via `.github/workflows/deploy.yml`; bootstrap with `scripts/setup-github-environments.sh` and per-app `VERCEL_PROJECT_ID_*` secrets; run the Vercel CLI from the repo root (not an `apps/` subdirectory).
