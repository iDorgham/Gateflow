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

if [[ "$VERCEL_GIT_COMMIT_AUTHOR_LOGIN" == "dependabot[bot]" ]]; then
  echo "🛑 Skipping build for Dependabot"
  exit 0
else
  echo "✅ Proceeding with build"
  exit 1
fi
