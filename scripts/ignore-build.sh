#!/bin/bash

# =============================================================================
# ignore-build.sh — Vercel Ignored Build Step
#
# Stops Vercel from deploying preview/production builds for:
#   - dependabot[bot]
#
# Usage (in Vercel Dashboard or vercel.json):
#   bash ../../scripts/ignore-build.sh
# =============================================================================

if [[ "$PWD" == *"apps/design-system"* ]]; then
  echo "✅ Proceeding with build for Design System"
  exit 1
fi

echo "🛑 Deployment disabled for all other apps (Global Skip)"
exit 0
