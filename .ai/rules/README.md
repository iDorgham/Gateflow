# Antigravity Workspace Commands

These files power Antigravity chat slash suggestions and command routing.

- Location: `.antigravity/commands/`
- Source of truth: `.ai/cli-layer/command-routing.json` (mirrored from `.cursor/commands/`)
- Naming: file name = slash command ID in kebab-case

When routing schema changes or new Cursor commands are added, update matching command files here.

## Command IDs

- `brand`
- `research`
- `scrape`
- `sync`
- `voice`
- `create`
- `compare`
- `intel`
- `polish`
- `optimize`
- `review`
- `approve`
- `revise`
- `export`
- `archive`
- `memory`
- `budget`

## Grouping Rules

- Use `<group>-<target>-<scope>-<action>` for multi-part commands.
- Use `<group>-<action>` for compact commands.
- Keep families lexically aligned by prefix (`scrape-*`, `create-*`, `intel-*`, `memory-*`, `brand-*`).
- Parent commands (`scrape`, `create`, `intel`, `memory`, `brand`, `voice`) use menu-style subcommand selection inside one file.
