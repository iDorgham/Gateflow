# Antigravity Command Family

This command family handles Antigravity-specific workspace operations.

## Available Actions

- `/antigravity status` -> Show current agent status and workspace health.
- `/antigravity sync` -> Synchronize commands between `.cursor/commands` and `.antigravity/commands`.
- `/antigravity learn` -> Process new transcripts for continual learning.

## Usage Rule

When a user invokes `/antigravity`, show a menu of options and ask for clarification if needed.
Always maintain the workspace command output format as defined in `.ai/cli-layer/`.
