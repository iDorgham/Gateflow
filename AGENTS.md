## Learned User Preferences

- Organize CHANGELOG and top-level README so Workspace, AI tools, and Apps are clearly separated; track workspace version separately from app versions where relevant.
- Treat `docs/workspace` as the home for workspace-facing documentation (including mirrors of agents, rules, subagents, commands, and skills), with its own README and CHANGELOG; use names without the `gf_` prefix under that folder.
- When executing an attached Cursor plan, do not edit the plan file; update todo status as work progresses and complete listed items unless blocked.
- Enforce changelog structure in CI with `pnpm docs:changelog:check`; use `pnpm docs:changelog:format` to normalize tag casing and spacing.
- Keep `ai:sync` and `ai:check` only in `docs/workspace/template-project/package.json`; do not add or retain those scripts on the repository root `package.json`.
- Unless intentionally versioning them, revert transient Cursor hook state under `.cursor/hooks/state/` (e.g. `continual-learning.json`) before commits, and do not mix accidental hook/sync-driven `.gitignore` edits with feature or UI commits—revert or use a separate commit.

## Learned Workspace Facts

- `docs/workspace/template-project` does not commit those dot folders; `config/enabled-ai-tools.json` (from `pnpm workspace:install`) lists which tools to sync. `scripts/sync-ai-folders.js` copies `ops-core/` into only the enabled paths; with `CI=true` or an empty `tools` array in CI, `config/enabled-ai-tools.ci.json` is used for a full sync. `scripts/check-ai-drift.js` compares the same set. Canonical skills live under `context/skills/`; `pnpm skills:materialize` copies into enabled tools only. Onboarding: `START_HERE.md` and `docs/workspace/COMMAND_GUIDE.md`.
- `token()` from `@atlaskit/tokens` yields CSS variable references (e.g. `var(--ds-...)`), not guaranteed hex; React Native `StyleSheet` colors should use resolved values such as `nativeTokens` from `@gate-access/ui/tokens` rather than raw `token()` output.
