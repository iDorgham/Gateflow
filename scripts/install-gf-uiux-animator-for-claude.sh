#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"

SRC_DIR="$ROOT_DIR/.cursor/skills/gf-uiux-animator"
DEST_DIR="$CODEX_HOME/skills/gf-uiux-animator"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "Missing source skill directory: $SRC_DIR" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST_DIR")"

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

rsync -a --exclude ".DS_Store" "$SRC_DIR/" "$DEST_DIR/"

echo "Installed gf-uiux-animator into: $DEST_DIR"
echo "If your CLI caches skills, restart it to pick up changes."

