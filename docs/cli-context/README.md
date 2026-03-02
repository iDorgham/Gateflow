# GateFlow CLI Context (docs/cli-context)

This directory is a **tool-agnostic mirror** of GateFlow’s Cursor configuration under `.cursor/`.

It exists so you can get the **same quality and consistency** when working from:

- **Claude CLI / Codex** (in Cursor terminal or elsewhere)
- **Antigravity IDE**
- **Opencode CLI**

## How this directory is generated

Run:

```bash
./scripts/sync-cursor-to-claude.sh
```

Optional:

```bash
./scripts/sync-cursor-to-claude.sh --opencode --antigravity
```

## What’s inside

- `skills/` — mirror of `.cursor/skills/`
- `agents/` — mirror of `.cursor/agents/` (roles + scenarios)
- `subagents/` — mirror of `.cursor/subagents/` (explore/shell/browser-use prompt text)
- `rules/` — mirror of `.cursor/rules/` (global invariants and workflow rules)
- `templates/` — mirror of `.cursor/templates/` (phase prompts, API route/test scaffolds, PR/commit templates)
- `contracts/` — mirror of `.cursor/contracts/` (invariants: org scope, soft deletes, QR signing, auth, secrets)
- `commands/` — mirror of `.cursor/commands/` (Cursor slash commands, useful as reference in terminal tools)

## “/guide” equivalent (Claude + Antigravity)

Cursor’s `/guide` is powered by the `gf-guide` skill. In non-Cursor tools, run the same flow by starting your message with:

- Load and follow `docs/cli-context/skills/gf-guide/SKILL.md`
- Read `GATEFLOW_CONFIG.md`, `CLAUDE.md`, and `docs/plan/`
- Assess repo state (git status, preflight, active plan/phase)
- Output: **Must do / Recommended / Critical / Improvements** (per the skill’s output format)

## UI/UX + animation (recommended skills to load)

For premium SaaS UI/UX + motion:

- `skills/gf-uiux-animator/SKILL.md`
- `skills/ui-ux/SKILL.md`
- `skills/tailwind/SKILL.md`
- `skills/tokens-design/SKILL.md`
- (Optional design draft) `skills/superdesign/SKILL.md`

## Opencode CLI

If you ran sync with `--opencode`, skills are also copied to `.opencode/skills/` so Opencode can discover them natively.

In Opencode, you can then ask it to load `gf-uiux-animator` (and any other mirrored skill) via its `skill` tool.

## Antigravity IDE

If you ran sync with `--antigravity`, a stub file is written to `.antigravity/rules.md` to point Antigravity at this directory and to define “guide” behavior.

