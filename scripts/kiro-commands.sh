#!/bin/bash
# GateFlow Commands for Kiro CLI
# Usage: ./scripts/kiro-commands.sh <command>

COMMANDS_DIR=".cursor/commands"
WORKFLOWS_DIR=".agent/workflows"

case "$1" in
  guide)
    echo "📋 Running /guide workflow..."
    cat "$COMMANDS_DIR/guide.md"
    echo ""
    echo "💡 Copy the above instructions and paste into Kiro CLI"
    ;;
  dev)
    echo "🔨 Running /dev workflow..."
    cat "$COMMANDS_DIR/dev.md"
    echo ""
    echo "💡 Copy the above instructions and paste into Kiro CLI"
    ;;
  plan)
    echo "📝 Running /plan workflow..."
    cat "$COMMANDS_DIR/plan.md"
    echo ""
    echo "💡 Copy the above instructions and paste into Kiro CLI"
    ;;
  idea)
    echo "💡 Running /idea workflow..."
    cat "$COMMANDS_DIR/idea.md"
    echo ""
    echo "💡 Copy the above instructions and paste into Kiro CLI"
    ;;
  ship)
    echo "🚀 Running /ship workflow..."
    cat "$COMMANDS_DIR/ship.md"
    echo ""
    echo "💡 Copy the above instructions and paste into Kiro CLI"
    ;;
  man)
    echo "🎯 Running /man workflow..."
    cat "$COMMANDS_DIR/man.md"
    echo ""
    echo "💡 Copy the above instructions and paste into Kiro CLI"
    ;;
  list)
    echo "Available GateFlow commands:"
    echo "  guide - Workspace status and recommendations"
    echo "  dev   - Execute plan phase"
    echo "  plan  - Create implementation plan"
    echo "  idea  - Capture feature ideas"
    echo "  ship  - Prepare for deployment"
    echo "  man   - One-command orchestrator"
    ;;
  *)
    echo "Usage: $0 {guide|dev|plan|idea|ship|man|list}"
    exit 1
    ;;
esac
