# Sovereign / AIWF Factory Commands Directory

This directory is reserved for Sovereign / AIWF content-factory commands and templates.

All factory-specific commands are quarantined under [`.ai/commands/factory/`](./factory/) so they cannot collide with or override canonical GateFlow workflows (`.antigravity/workflows/`, `.agents/workflows/`).

## Canonical GateFlow Workflows

Canonical product development workflows (such as `/guide`, `/dev`, `/plan`, `/audit`, `/pilot`, `/ship`) live in:

- `.antigravity/workflows/` (tracked canonical source)
- `.agents/workflows/` (symlink / local mirror)
- `docs/workspace/COMMAND_GUIDE.md` (human documentation)
