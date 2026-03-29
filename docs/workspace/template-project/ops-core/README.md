# Ops Core

Canonical source for all AI operating folder content.

## Sync Map

| Source                  | Target          | IDE / CLI       |
| ----------------------- | --------------- | --------------- |
| `ops-core/cursor/`      | `.cursor/`      | Cursor IDE      |
| `ops-core/claude/`      | `.claude/`      | Claude CLI      |
| `ops-core/antigravity/` | `.antigravity/` | Antigravity IDE |
| `ops-core/gemini/`      | `.gemini/`      | Gemini CLI      |
| `ops-core/opencode/`    | `.opencode/`    | OpenCode CLI    |

## Commands

```bash
pnpm ai:sync    # Copy ops-core/ → AI folders (merge, no destructive wipe)
pnpm ai:check   # Verify no drift between ops-core/ and AI folders
```

## Editing Rules

1. **Edit only in `ops-core/`** — never directly in `.cursor/`, `.claude/`, etc.
2. After editing, run `pnpm ai:sync` to propagate.
3. CI runs `pnpm ai:check` to prevent drift.

## Structure

```
ops-core/
├── cursor/
│   ├── agents/          # Orchestrator + role agents
│   └── rules/           # Core, workflow, security rules
├── claude/
│   ├── agents/
│   └── rules/
├── antigravity/
│   └── workflows/       # Master slash command workflows
├── gemini/
│   └── commands/        # TOML command definitions
└── opencode/
    ├── agents/
    └── commands/
```
