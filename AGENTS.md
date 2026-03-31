## Learned User Preferences

- Organize CHANGELOG and top-level README so Workspace, AI tools, and Apps are clearly separated; track workspace version separately from app versions where relevant.
- Treat `docs/workspace` as the home for workspace-facing documentation (including mirrors of agents, rules, subagents, commands, and skills), with its own README and CHANGELOG; use names without the `gf_` prefix under that folder.
- When executing an attached Cursor plan, do not edit the plan file; update todo status as work progresses and complete listed items unless blocked.
- Enforce changelog structure in CI with `pnpm docs:changelog:check`; use `pnpm docs:changelog:format` to normalize tag casing and spacing.
- Keep `ai:sync` and `ai:check` only in `docs/workspace/template-project/package.json`; do not add or retain those scripts on the repository root `package.json`.
- Unless intentionally versioning them, revert transient Cursor hook state under `.cursor/hooks/state/` (e.g. `continual-learning.json`) before commits, and do not mix accidental hook/sync-driven `.gitignore` edits with feature or UI commits—revert or use a separate commit.
- Prefer development guidance and docs to cover a multi-tool stack (Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, and Kilo CLI) instead of Cursor-only instructions.
- Prefer phased execution workflows: plan/tasks first, then apply prompts phase-by-phase with testing and incremental enhancements after each phase.

## Learned Workspace Facts

- `docs/workspace/template-project` does not commit those dot folders; `config/enabled-ai-tools.json` (from `pnpm workspace:install`) lists which tools to sync. `scripts/sync-ai-folders.js` copies `ops-core/` into only the enabled paths; with `CI=true` or an empty `tools` array in CI, `config/enabled-ai-tools.ci.json` is used for a full sync. `scripts/check-ai-drift.js` compares the same set. Canonical skills live under `context/skills/`; `pnpm skills:materialize` copies into enabled tools only. Onboarding: `START_HERE.md` and `docs/workspace/COMMAND_GUIDE.md`.
- `packages/db/prisma/schema.prisma` sets `directUrl = env("DIRECT_DATABASE_URL")`. Prisma CLI operations that need a direct Postgres connection (for example `migrate deploy`, `migrate resolve`) use that variable; values in `packages/db/.env` can override a one-off shell `DATABASE_URL`. Runtime app code often uses Accelerate (`prisma+postgres://…`) while migrations need the direct URL—keep both aligned per environment.
- Use `pnpm preflight` as defined in root `package.json` without extra flags; unsupported args can break the underlying `turbo` chain.
- After moving a plan between `docs/plan/planned/`, `in-progress/`, and `done/`, update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` (paths and status) so automation and `/guide` match filesystem layout.
- `token()` from `@atlaskit/tokens` yields CSS variable references (e.g. `var(--ds-...)`), not guaranteed hex; React Native `StyleSheet` colors should use resolved values such as `nativeTokens` from `@gate-access/ui/tokens` rather than raw `token()` output.
