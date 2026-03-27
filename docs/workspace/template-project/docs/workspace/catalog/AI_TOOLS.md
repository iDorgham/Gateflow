# AI Tools Sync (Workspace Inventory)

This document tracks synced AI tool assets in the repository-level tool folders.

## Synced Tools

| Tool                          | Root Folder     |   Skills | Role Agents | Command Refs | Native Commands/Workflows | Subagents |
| :---------------------------- | :-------------- | -------: | ----------: | -----------: | ------------------------: | --------: |
| Cursor                        | `.cursor/`      |       79 |          12 |           18 |               11 commands |         4 |
| Claude                        | `.claude/`      |       79 |          12 |           18 |                         0 |         4 |
| Qwen                          | `.qwen/`        |       79 |          12 |           18 |              11 workflows |         0 |
| KiloCode                      | `.kilocode/`    |       79 |          12 |           18 |                         0 |         0 |
| OpenCode                      | `.opencode/`    |       79 |          12 |            0 |               21 commands |         0 |
| Antigravity (source baseline) | `.antigravity/` | mirrored |    mirrored |     mirrored |                 workflows |         3 |

## Notes

- Counts reflect current repository scan of first-party tool assets.
- For OpenCode and KiloCode, `node_modules/` content is intentionally excluded from this workspace inventory.
- `gf_` naming is not introduced in `docs/workspace`; source naming remains unchanged in tool roots.

## What "sync all AI tools" means here

- Keep core role agents aligned across tools (`architecture`, `backend-api`, `backend-database`, `business-strategist`, `devops`, `explore`, `frontend`, `i18n`, `mobile`, `planning`, `qa`, `security`).
- Keep shared skill packs aligned by folder + `SKILL.md`.
- Keep command docs aligned (`commands-ref`) where that format exists.
- Keep tool-native command/workflow folders documented (`.cursor/commands`, `.qwen/workflows`, `.opencode/commands`).
