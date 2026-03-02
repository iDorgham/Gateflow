#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

FLAG_OPENCODE="false"
FLAG_ANTIGRAVITY="false"

usage() {
  cat <<'EOF'
Usage:
  scripts/sync-cursor-to-claude.sh [--opencode] [--antigravity]

Copies Cursor workspace context from .cursor/ into docs/cli-context/.

Options:
  --opencode     Also copy skills into .opencode/skills/ for Opencode CLI discovery.
  --antigravity  Also write .antigravity/rules.md stub pointing to docs/cli-context/.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --opencode)
      FLAG_OPENCODE="true"
      shift
      ;;
    --antigravity)
      FLAG_ANTIGRAVITY="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

SRC_CURSOR_DIR="$ROOT_DIR/.cursor"
DEST_DIR="$ROOT_DIR/docs/cli-context"

if [[ ! -d "$SRC_CURSOR_DIR" ]]; then
  echo "Missing $SRC_CURSOR_DIR" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

rsync_dir() {
  local src="$1"
  local dest="$2"

  if [[ ! -d "$src" ]]; then
    return 0
  fi

  mkdir -p "$dest"
  rsync -a \
    --exclude ".DS_Store" \
    --exclude "**/.DS_Store" \
    "$src/" "$dest/"
}

rsync_dir "$SRC_CURSOR_DIR/skills" "$DEST_DIR/skills"
rsync_dir "$SRC_CURSOR_DIR/agents" "$DEST_DIR/agents"
rsync_dir "$SRC_CURSOR_DIR/subagents" "$DEST_DIR/subagents"
rsync_dir "$SRC_CURSOR_DIR/rules" "$DEST_DIR/rules"
rsync_dir "$SRC_CURSOR_DIR/templates" "$DEST_DIR/templates"
rsync_dir "$SRC_CURSOR_DIR/contracts" "$DEST_DIR/contracts"
rsync_dir "$SRC_CURSOR_DIR/commands" "$DEST_DIR/commands"

# Optional: make Cursor commands available to Claude CLI conventions if present.
# This enables running commands like /guide from Claude tooling that supports .claude/commands.
if [[ -d "$ROOT_DIR/.claude" ]]; then
  mkdir -p "$ROOT_DIR/.claude/commands"
  rsync -a --exclude ".DS_Store" "$SRC_CURSOR_DIR/commands/" "$ROOT_DIR/.claude/commands/" || true
fi

if [[ "$FLAG_OPENCODE" == "true" ]]; then
  mkdir -p "$ROOT_DIR/.opencode/skills"
  rsync_dir "$DEST_DIR/skills" "$ROOT_DIR/.opencode/skills"
fi

if [[ "$FLAG_ANTIGRAVITY" == "true" ]]; then
  mkdir -p "$ROOT_DIR/.antigravity"
  cat >"$ROOT_DIR/.antigravity/rules.md" <<'EOF'
# GateFlow workspace rules (Antigravity)

This repo’s canonical AI context lives in `docs/cli-context/` (mirrored from `.cursor/`).

## Guide

When the user says "guide" or "what should I do now", behave like Cursor’s `/guide`:

- Load and follow `docs/cli-context/skills/gf-guide/SKILL.md`
- Load `GATEFLOW_CONFIG.md`, `CLAUDE.md`, and `docs/plan/`
- Assess repo state (git status, preflight, active plan/phase)
- Output: Must do / Recommended / Critical / Improvements (per gf-guide output format)

## UI/UX + animation work

When the user asks for premium SaaS UI/UX or animation, load:

- `docs/cli-context/skills/gf-uiux-animator/SKILL.md`
- `docs/cli-context/skills/ui-ux/SKILL.md`
- `docs/cli-context/skills/tailwind/SKILL.md`
- `docs/cli-context/skills/tokens-design/SKILL.md`
EOF
fi

echo "Synced .cursor → docs/cli-context."
echo "For usage in Claude / Antigravity / Opencode, see docs/cli-context/README.md (when created)."

